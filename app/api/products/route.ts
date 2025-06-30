import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)

    const apiUrl = process.env.NEXT_PUBLIC_LARAVEL_API_URL
    if (!apiUrl) {
      return NextResponse.json({ success: false, message: "API URL not configured" }, { status: 500 })
    }

    // Forward all query parameters to Laravel
    const params = new URLSearchParams()
    searchParams.forEach((value, key) => {
      params.append(key, value)
    })

    const fullUrl = `${apiUrl}/products${params.toString() ? `?${params.toString()}` : ""}`

    const response = await fetch(fullUrl, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      cache: "no-store",
    })

    if (!response.ok) {
      const errorText = await response.text()
      throw new Error(`HTTP error! status: ${response.status}, body: ${errorText}`)
    }

    const data = await response.json()
    return NextResponse.json(data)
  } catch (error) {
    console.error("Error fetching products:", error)
    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch products",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    console.log("=== POST /api/products called ===")

    // Get auth token from request headers
    const authHeader = request.headers.get("Authorization")
    if (!authHeader) {
      return NextResponse.json({ success: false, message: "Authorization required" }, { status: 401 })
    }

    const contentType = request.headers.get("content-type")
    let body: FormData

    if (contentType?.includes("multipart/form-data")) {
      // Handle FormData (with file uploads)
      body = await request.formData()
    } else {
      // Handle JSON data - convert to FormData for Laravel
      const jsonBody = await request.json()
      console.log("Original JSON body:", JSON.stringify(jsonBody, null, 2))

      body = new FormData()

      Object.entries(jsonBody).forEach(([key, value]) => {
        if (value === null || value === undefined) {
          return // Skip null/undefined values
        }

        if (key === "specifications" || key === "colors" || key === "ideal_for") {
          // Ensure these are properly JSON stringified
          if (typeof value === "object") {
            body.append(key, JSON.stringify(value))
          } else if (typeof value === "string") {
            // If it's already a string, validate it's valid JSON
            try {
              JSON.parse(value)
              body.append(key, value)
            } catch {
              // If not valid JSON, stringify it
              body.append(key, JSON.stringify(value))
            }
          } else {
            body.append(key, JSON.stringify(value))
          }
        } else if (key === "in_stock" || key === "featured") {
          // Convert boolean to string that Laravel can understand
          body.append(key, value ? "1" : "0")
        } else if (Array.isArray(value)) {
          // Handle arrays properly
          body.append(key, JSON.stringify(value))
        } else {
          body.append(key, String(value))
        }
      })
    }

    // Ensure boolean fields are properly formatted for Laravel
    const inStock = body.get("in_stock")
    const featured = body.get("featured")

    if (inStock !== null) {
      // Fix TypeScript error by properly checking string values
      const boolValue = inStock === "true" || inStock === "1"
      body.set("in_stock", boolValue ? "1" : "0")
    }

    if (featured !== null) {
      // Fix TypeScript error by properly checking string values
      const boolValue = featured === "true" || featured === "1"
      body.set("featured", boolValue ? "1" : "0")
    }

    // Log final FormData for debugging
    console.log("Final FormData entries:")
    for (const [key, value] of body.entries()) {
      if (value instanceof File) {
        console.log(`${key}: File(${value.name}, ${value.size} bytes)`)
      } else {
        console.log(`${key}: ${value}`)
      }
    }

    const API_URL = process.env.NEXT_PUBLIC_LARAVEL_API_URL
    if (!API_URL) {
      return NextResponse.json({ success: false, message: "API URL not configured" }, { status: 500 })
    }

    const response = await fetch(`${API_URL}/products`, {
      method: "POST",
      body: body,
      headers: {
        Authorization: authHeader,
        Accept: "application/json",
        // Don't set Content-Type for FormData, let fetch set it with boundary
      },
    })

    console.log("Laravel response status:", response.status)

    if (!response.ok) {
      const responseText = await response.text()
      console.log("Laravel error response:", responseText)

      let errorData
      try {
        errorData = JSON.parse(responseText)
      } catch (parseError) {
        errorData = { message: responseText || `HTTP error! status: ${response.status}` }
      }

      return NextResponse.json(errorData, { status: response.status })
    }

    const data = await response.json()
    return NextResponse.json(data)
  } catch (error) {
    console.error("Error creating product:", error)
    return NextResponse.json({ error: "Failed to create product" }, { status: 500 })
  }
}
