import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    console.log("=== POST /api/upload called ===")
    const API_URL = process.env.NEXT_PUBLIC_LARAVEL_API_URL
    console.log("Laravel API URL:", API_URL)

    // Get auth token from request headers
    const authHeader = request.headers.get("Authorization")
    if (!authHeader) {
      return NextResponse.json({ success: false, message: "Authorization required" }, { status: 401 })
    }

    const formData = await request.formData()

    // Log FormData contents
    console.log("Upload FormData entries:")
    for (const [key, value] of formData.entries()) {
      if (value instanceof File) {
        console.log(`${key}: File(${value.name}, ${value.size} bytes, ${value.type})`)
      } else {
        console.log(`${key}: ${value}`)
      }
    }

    console.log("Sending upload request to Laravel:", `${API_URL}/upload`)

    const response = await fetch(`${API_URL}/upload`, {
      method: "POST",
      body: formData,
      headers: {
        Authorization: authHeader,
        Accept: "application/json",
      },
    })

    console.log("Laravel upload response status:", response.status)

    if (!response.ok) {
      const responseText = await response.text()
      console.log("Laravel upload error response:", responseText)

      let errorData
      try {
        errorData = JSON.parse(responseText)
      } catch (parseError) {
        errorData = { message: responseText || `HTTP error! status: ${response.status}` }
      }

      return NextResponse.json(
        {
          error: "Laravel Upload API Error",
          details: errorData,
          status: response.status,
        },
        { status: response.status },
      )
    }

    const responseText = await response.text()
    console.log("Laravel upload success response:", responseText)

    let data
    try {
      data = JSON.parse(responseText)
    } catch (parseError) {
      console.error("Failed to parse Laravel upload response as JSON:", parseError)
      return NextResponse.json(
        {
          error: "Invalid JSON response from Laravel upload",
          responseText: responseText,
        },
        { status: 500 },
      )
    }

    return NextResponse.json({
      success: true,
      urls: data.urls,
      images: data.urls, // For backward compatibility
    })
  } catch (error) {
    console.error("=== POST /api/upload error ===")
    console.error("Upload error details:", error)

    return NextResponse.json(
      {
        error: "Failed to upload images",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    )
  }
}
