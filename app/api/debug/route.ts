import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  try {
    const NEXT_PUBLIC_LARAVEL_API_URL = process.env.NEXT_PUBLIC_LARAVEL_API_URL

    console.log("Debug endpoint called")
    console.log("Environment variables:")
    console.log("NEXT_PUBLIC_LARAVEL_API_URL:", NEXT_PUBLIC_LARAVEL_API_URL)
    console.log("NODE_ENV:", process.env.NODE_ENV)

    // Test Laravel connection
    let laravelStatus = "unknown"
    let laravelError = null

    if (NEXT_PUBLIC_LARAVEL_API_URL) {
      try {
        console.log("Testing Laravel connection...")
        const response = await fetch(`${NEXT_PUBLIC_LARAVEL_API_URL}/test`, {
          method: "GET",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
        })

        console.log("Laravel test response status:", response.status)
        const data = await response.text()
        console.log("Laravel test response:", data)

        if (response.ok) {
          laravelStatus = "connected"
        } else {
          laravelStatus = "error"
          laravelError = `HTTP ${response.status}: ${data}`
        }
      } catch (error) {
        console.error("Laravel connection error:", error)
        laravelStatus = "connection_failed"
        laravelError = error instanceof Error ? error.message : String(error)
      }
    } else {
      laravelStatus = "not_configured"
      laravelError = "NEXT_PUBLIC_LARAVEL_API_URL environment variable is not set"
    }

    return NextResponse.json({
      success: true,
      environment: {
        NODE_ENV: process.env.NODE_ENV,
        NEXT_PUBLIC_LARAVEL_API_URL: NEXT_PUBLIC_LARAVEL_API_URL,
      },
      laravel: {
        status: laravelStatus,
        error: laravelError,
        url: NEXT_PUBLIC_LARAVEL_API_URL,
      },
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error("Debug endpoint error:", error)
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : String(error),
        stack: error instanceof Error ? error.stack : undefined,
      },
      { status: 500 },
    )
  }
}
