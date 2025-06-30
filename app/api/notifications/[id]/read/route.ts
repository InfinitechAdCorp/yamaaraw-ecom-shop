import { type NextRequest, NextResponse } from "next/server"

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const authHeader = request.headers.get("authorization")
    if (!authHeader) {
      return NextResponse.json({ success: false, message: "No authorization header" }, { status: 401 })
    }

    // Await the params since they're now async in Next.js 15
    const { id } = await params

    const apiUrl = process.env.NEXT_PUBLIC_LARAVEL_API_URL

    const response = await fetch(`${apiUrl}/notifications/${id}/read`, {
      method: "PUT",
      headers: {
        Authorization: authHeader,
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    })

    const data = await response.json()
    return NextResponse.json(data)
  } catch (error) {
    console.error("Mark as read API error:", error)
    return NextResponse.json({ success: false, message: "Failed to mark as read" }, { status: 500 })
  }
}