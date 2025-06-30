import { type NextRequest, NextResponse } from "next/server"

const API_URL = process.env.NEXT_PUBLIC_LARAVEL_API_URL

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params // Fix: Await params in Next.js 15

    const apiUrl = process.env.NEXT_PUBLIC_LARAVEL_API_URL
    if (!apiUrl) {
      return NextResponse.json({ success: false, message: "API URL not configured" }, { status: 500 })
    }

    const response = await fetch(`${apiUrl}/products/${id}`, {
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
    console.error("Error fetching product:", error)
    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch product",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}

// POST HANDLER FOR UPDATES (Frontend sends POST requests)
export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params // Fix: Await params in Next.js 15

    console.log("=== POST /api/products/[id] called for UPDATE ===")
    console.log("Product ID:", id)

    // Get auth token from request headers
    const authHeader = request.headers.get("Authorization")
    if (!authHeader) {
      return NextResponse.json({ success: false, message: "Authorization required" }, { status: 401 })
    }

    if (!API_URL) {
      console.error("NEXT_PUBLIC_LARAVEL_API_URL is not configured")
      return NextResponse.json({ success: false, message: "API URL not configured" }, { status: 500 })
    }

    // Handle FormData from frontend
    const body = await request.formData()

    // Fix: Convert boolean strings to Laravel-expected format
    const inStock = body.get("in_stock")
    const featured = body.get("featured")

    if (inStock !== null) {
      // Convert "true"/"false" strings to "1"/"0" for Laravel
      const boolValue = inStock === "true" || inStock === "1"
      body.set("in_stock", boolValue ? "1" : "0")
      console.log(`Fixed in_stock: ${inStock} -> ${boolValue ? "1" : "0"}`)
    }

    if (featured !== null) {
      // Convert "true"/"false" strings to "1"/"0" for Laravel
      const boolValue = featured === "true" || featured === "1"
      body.set("featured", boolValue ? "1" : "0")
      console.log(`Fixed featured: ${featured} -> ${boolValue ? "1" : "0"}`)
    }

    // Add method override for Laravel (Laravel expects POST with _method=PUT)
    body.append("_method", "PUT")

    // Log FormData for debugging
    console.log("FormData entries being sent to Laravel:")
    for (const [key, value] of body.entries()) {
      if (value instanceof File) {
        console.log(`${key}: File(${value.name}, ${value.size} bytes)`)
      } else {
        console.log(`${key}: ${value}`)
      }
    }

    const response = await fetch(`${API_URL}/products/${id}`, {
      method: "POST", // Laravel expects POST with _method override
      body: body,
      headers: {
        Authorization: authHeader,
        Accept: "application/json",
        // Don't set Content-Type - let browser set it for FormData
      },
    })

    console.log("Laravel update response status:", response.status)
    console.log("Laravel update response headers:", Object.fromEntries(response.headers.entries()))

    // Check if response has content
    const responseText = await response.text()
    console.log("Laravel update response text:", responseText)

    if (!response.ok) {
      console.log("Laravel update error response:", responseText)

      let errorData
      try {
        errorData = responseText ? JSON.parse(responseText) : { message: `HTTP error! status: ${response.status}` }
      } catch (parseError) {
        console.error("Failed to parse error response:", parseError)
        errorData = { message: responseText || `HTTP error! status: ${response.status}` }
      }

      return NextResponse.json(errorData, { status: response.status })
    }

    // Handle empty response
    if (!responseText) {
      console.log("Empty response from Laravel, returning success")
      return NextResponse.json({
        success: true,
        message: "Product updated successfully",
        data: null,
      })
    }

    // Try to parse JSON response
    let data
    try {
      data = JSON.parse(responseText)
    } catch (parseError) {
      console.error("Failed to parse success response as JSON:", parseError)
      console.log("Response text:", responseText)

      // Return success even if JSON parsing fails
      return NextResponse.json({
        success: true,
        message: "Product updated successfully",
        data: null,
      })
    }

    return NextResponse.json(data)
  } catch (error) {
    console.error("Error updating product:", error)
    return NextResponse.json(
      {
        success: false,
        message: "Failed to update product",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}

// PUT HANDLER FOR DIRECT API CALLS
export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params // Fix: Await params in Next.js 15

    console.log("=== PUT /api/products/[id] called ===")
    console.log("Product ID:", id)

    // Get auth token from request headers
    const authHeader = request.headers.get("Authorization")
    if (!authHeader) {
      return NextResponse.json({ success: false, message: "Authorization required" }, { status: 401 })
    }

    if (!API_URL) {
      console.error("NEXT_PUBLIC_LARAVEL_API_URL is not configured")
      return NextResponse.json({ success: false, message: "API URL not configured" }, { status: 500 })
    }

    const contentType = request.headers.get("content-type")
    let body: FormData

    if (contentType?.includes("multipart/form-data")) {
      body = await request.formData()
    } else {
      // Handle JSON data - convert to FormData for Laravel
      const jsonBody = await request.json()
      console.log("Original JSON body for update:", JSON.stringify(jsonBody, null, 2))

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

    // Add method override for Laravel
    body.append("_method", "PUT")

    // Log final FormData for debugging
    console.log("Final FormData entries for update:")
    for (const [key, value] of body.entries()) {
      if (value instanceof File) {
        console.log(`${key}: File(${value.name}, ${value.size} bytes)`)
      } else {
        console.log(`${key}: ${value}`)
      }
    }

    const response = await fetch(`${API_URL}/products/${id}`, {
      method: "POST", // Laravel expects POST with _method override
      body: body,
      headers: {
        Authorization: authHeader,
        Accept: "application/json",
      },
    })

    console.log("Laravel update response status:", response.status)
    console.log("Laravel update response headers:", Object.fromEntries(response.headers.entries()))

    // Check if response has content
    const responseText = await response.text()
    console.log("Laravel update response text:", responseText)

    if (!response.ok) {
      console.log("Laravel update error response:", responseText)

      let errorData
      try {
        errorData = responseText ? JSON.parse(responseText) : { message: `HTTP error! status: ${response.status}` }
      } catch (parseError) {
        console.error("Failed to parse error response:", parseError)
        errorData = { message: responseText || `HTTP error! status: ${response.status}` }
      }

      return NextResponse.json(errorData, { status: response.status })
    }

    // Handle empty response
    if (!responseText) {
      console.log("Empty response from Laravel, returning success")
      return NextResponse.json({
        success: true,
        message: "Product updated successfully",
        data: null,
      })
    }

    // Try to parse JSON response
    let data
    try {
      data = JSON.parse(responseText)
    } catch (parseError) {
      console.error("Failed to parse success response as JSON:", parseError)
      console.log("Response text:", responseText)

      // Return success even if JSON parsing fails
      return NextResponse.json({
        success: true,
        message: "Product updated successfully",
        data: null,
      })
    }

    return NextResponse.json(data)
  } catch (error) {
    console.error("Error updating product:", error)
    return NextResponse.json(
      {
        success: false,
        message: "Failed to update product",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params // Fix: Await params in Next.js 15

    console.log("=== DELETE /api/products/[id] called ===")
    console.log("Product ID:", id)

    // Get auth token from request headers
    const authHeader = request.headers.get("Authorization")
    if (!authHeader) {
      return NextResponse.json({ success: false, message: "Authorization required" }, { status: 401 })
    }

    const response = await fetch(`${API_URL}/products/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: authHeader,
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    })

    console.log("Laravel delete response status:", response.status)

    if (!response.ok) {
      const responseText = await response.text()
      console.log("Laravel delete error response:", responseText)

      let errorData
      try {
        errorData = JSON.parse(responseText)
      } catch (parseError) {
        errorData = { message: responseText || `HTTP error! status: ${response.status}` }
      }

      return NextResponse.json(errorData, { status: response.status })
    }

    const data = await response.json()
    return NextResponse.json({ success: true, message: data.message || "Product deleted successfully" })
  } catch (error) {
    console.error("Error deleting product:", error)
    return NextResponse.json({ error: "Failed to delete product" }, { status: 500 })
  }
}
