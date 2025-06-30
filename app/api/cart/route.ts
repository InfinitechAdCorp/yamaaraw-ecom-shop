import { type NextRequest, NextResponse } from "next/server"

const NEXT_PUBLIC_LARAVEL_API_URL = process.env.NEXT_PUBLIC_LARAVEL_API_URL

export async function GET(request: NextRequest) {
  try {
    console.log("Cart GET request received")
    console.log("Laravel API URL:", NEXT_PUBLIC_LARAVEL_API_URL)

    const authHeader = request.headers.get("authorization")
    const sessionId = request.headers.get("x-session-id")

    console.log("Headers:", { hasAuth: !!authHeader, sessionId })

    // Allow both authenticated users and guest users with session ID
    if (!authHeader && !sessionId) {
      console.log("No auth or session, returning empty cart")
      return NextResponse.json(
        { success: true, data: [] }, // Return empty cart for users with no auth or session
        { status: 200 },
      )
    }

    const headers: HeadersInit = {
      Accept: "application/json",
      "Content-Type": "application/json",
    }

    // Add authorization header if present
    if (authHeader) {
      headers["Authorization"] = authHeader
    }

    // Add session ID header if present
    if (sessionId) {
      headers["X-Session-ID"] = sessionId
    }

    console.log("Forwarding to Laravel with headers:", headers)

    const response = await fetch(`${NEXT_PUBLIC_LARAVEL_API_URL}/cart`, {
      method: "GET",
      headers,
    })

    console.log("Laravel response status:", response.status)
    const data = await response.json()
    console.log("Laravel response data:", data)

    return NextResponse.json(data, { status: response.status })
  } catch (error) {
    console.error("Cart GET error:", error)
    return NextResponse.json(
      {
        success: false,
        message: "Internal server error",
        error: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    console.log("=== Cart POST request received ===")
    console.log("Laravel API URL:", NEXT_PUBLIC_LARAVEL_API_URL)

    if (!NEXT_PUBLIC_LARAVEL_API_URL) {
      console.error("NEXT_PUBLIC_LARAVEL_API_URL is not set!")
      return NextResponse.json(
        {
          success: false,
          message: "API configuration error - Laravel URL not set",
        },
        { status: 500 },
      )
    }

    const authHeader = request.headers.get("authorization")
    const sessionId = request.headers.get("x-session-id")

    console.log("Request headers:", {
      hasAuth: !!authHeader,
      sessionId,
      userAgent: request.headers.get("user-agent"),
    })

    const body = await request.json()
    console.log("Request body:", body)

    const headers: HeadersInit = {
      Accept: "application/json",
      "Content-Type": "application/json",
    }

    // Add authorization header if present
    if (authHeader) {
      headers["Authorization"] = authHeader
      console.log("Added auth header")
    }

    // Add session ID header if present
    if (sessionId) {
      headers["X-Session-ID"] = sessionId
      console.log("Added session ID header:", sessionId)
    }

    console.log("Forwarding to Laravel:", `${NEXT_PUBLIC_LARAVEL_API_URL}/cart`)
    console.log("With headers:", headers)
    console.log("With body:", JSON.stringify(body))

    const response = await fetch(`${NEXT_PUBLIC_LARAVEL_API_URL}/cart`, {
      method: "POST",
      headers,
      body: JSON.stringify(body),
    })

    console.log("Laravel response status:", response.status)
    console.log("Laravel response headers:", Object.fromEntries(response.headers.entries()))

    let data
    const responseText = await response.text()
    console.log("Laravel raw response:", responseText)

    try {
      data = JSON.parse(responseText)
      console.log("Laravel parsed response:", data)
    } catch (parseError) {
      console.error("Failed to parse Laravel response as JSON:", parseError)
      return NextResponse.json(
        {
          success: false,
          message: "Invalid response from server",
          rawResponse: responseText.substring(0, 500), // First 500 chars for debugging
        },
        { status: 500 },
      )
    }

    return NextResponse.json(data, { status: response.status })
  } catch (error) {
    console.error("Cart POST error:", error)
    console.error("Error stack:", error instanceof Error ? error.stack : "No stack trace")

    return NextResponse.json(
      {
        success: false,
        message: "Internal server error",
        error: error instanceof Error ? error.message : String(error),
        details: "Check server logs for more information",
      },
      { status: 500 },
    )
  }
}

export async function PUT(request: NextRequest) {
  try {
    console.log("Cart PUT request received")

    const authHeader = request.headers.get("authorization")
    const sessionId = request.headers.get("x-session-id")

    // For PUT (updating items), we need either auth or session ID
    if (!authHeader && !sessionId) {
      return NextResponse.json({ success: false, message: "Authentication or session required" }, { status: 401 })
    }

    const body = await request.json()

    const headers: HeadersInit = {
      Accept: "application/json",
      "Content-Type": "application/json",
    }

    // Add authorization header if present
    if (authHeader) {
      headers["Authorization"] = authHeader
    }

    // Add session ID header if present
    if (sessionId) {
      headers["X-Session-ID"] = sessionId
    }

    const response = await fetch(`${NEXT_PUBLIC_LARAVEL_API_URL}/cart`, {
      method: "PUT",
      headers,
      body: JSON.stringify(body),
    })

    const data = await response.json()

    return NextResponse.json(data, { status: response.status })
  } catch (error) {
    console.error("Cart PUT error:", error)
    return NextResponse.json(
      {
        success: false,
        message: "Internal server error",
        error: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    )
  }
}

export async function DELETE(request: NextRequest) {
  try {
    console.log("Cart DELETE request received")

    const authHeader = request.headers.get("authorization")
    const sessionId = request.headers.get("x-session-id")

    // For DELETE, we need either auth or session ID
    if (!authHeader && !sessionId) {
      return NextResponse.json({ success: false, message: "Authentication or session required" }, { status: 401 })
    }

    const body = await request.json()

    const headers: HeadersInit = {
      Accept: "application/json",
      "Content-Type": "application/json",
    }

    // Add authorization header if present
    if (authHeader) {
      headers["Authorization"] = authHeader
    }

    // Add session ID header if present
    if (sessionId) {
      headers["X-Session-ID"] = sessionId
    }

    const response = await fetch(`${NEXT_PUBLIC_LARAVEL_API_URL}/cart`, {
      method: "DELETE",
      headers,
      body: JSON.stringify(body),
    })

    const data = await response.json()

    return NextResponse.json(data, { status: response.status })
  } catch (error) {
    console.error("Cart DELETE error:", error)
    return NextResponse.json(
      {
        success: false,
        message: "Internal server error",
        error: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    )
  }
}
