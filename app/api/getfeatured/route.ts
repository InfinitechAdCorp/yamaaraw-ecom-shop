import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  try {
    const apiUrl = process.env.NEXT_PUBLIC_LARAVEL_API_URL
    console.log("API URL:", apiUrl)
    
    if (!apiUrl) {
      console.error("NEXT_PUBLIC_LARAVEL_API_URL is not set")
      return NextResponse.json(
        {
          success: false,
          message: "API URL not configured",
          data: [],
        },
        { status: 500 },
      )
    }

    const fullUrl = `${apiUrl}/products/featured`
    console.log("Fetching from:", fullUrl)

    // Get featured products from Laravel backend
    const response = await fetch(fullUrl, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      cache: "no-store", // Ensure fresh data
    })

    console.log("Response status:", response.status)
    console.log("Response headers:", Object.fromEntries(response.headers.entries()))

    if (!response.ok) {
      const errorText = await response.text()
      console.error("API Error Response:", errorText)
      throw new Error(`HTTP error! status: ${response.status}, body: ${errorText}`)
    }

    const data = await response.json()
    console.log("API Response data:", data)

    return NextResponse.json(data)
  } catch (error) {
    console.error("Error fetching featured products:", error)
    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch featured products",
        data: [],
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
