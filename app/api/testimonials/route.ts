import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const featured = searchParams.get("featured")
    
    const apiUrl = process.env.NEXT_PUBLIC_LARAVEL_API_URL
    console.log("Laravel API URL:", apiUrl)

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

    // Build query parameters
    const params = new URLSearchParams()
    if (featured) {
      params.append("featured", featured)
    }

    const fullUrl = `${apiUrl}/testimonials${params.toString() ? `?${params.toString()}` : ""}`
    console.log("Fetching testimonials from:", fullUrl)

    const response = await fetch(fullUrl, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      cache: "no-store",
    })

    console.log("Testimonials response status:", response.status)

    if (!response.ok) {
      const errorText = await response.text()
      console.error("Testimonials API Error Response:", errorText)
      throw new Error(`HTTP error! status: ${response.status}, body: ${errorText}`)
    }

    const data = await response.json()
    console.log("Testimonials API Response:", data)

    return NextResponse.json(data)
  } catch (error) {
    console.error("Error fetching testimonials:", error)
    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch testimonials",
        data: [],
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    const apiUrl = process.env.NEXT_PUBLIC_LARAVEL_API_URL
    console.log("Laravel API URL:", apiUrl)

    if (!apiUrl) {
      console.error("NEXT_PUBLIC_LARAVEL_API_URL is not set")
      return NextResponse.json(
        {
          success: false,
          message: "API URL not configured",
        },
        { status: 500 },
      )
    }

    const fullUrl = `${apiUrl}/testimonials`
    console.log("Submitting testimonial to:", fullUrl)
    console.log("Testimonial data:", body)

    const response = await fetch(fullUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify(body),
    })

    console.log("Testimonial submission response status:", response.status)

    if (!response.ok) {
      const errorText = await response.text()
      console.error("Testimonial submission API Error Response:", errorText)
      throw new Error(`HTTP error! status: ${response.status}, body: ${errorText}`)
    }

    const data = await response.json()
    console.log("Testimonial submission API Response:", data)

    return NextResponse.json(data)
  } catch (error) {
    console.error("Error submitting testimonial:", error)
    return NextResponse.json(
      {
        success: false,
        message: "Failed to submit testimonial",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
