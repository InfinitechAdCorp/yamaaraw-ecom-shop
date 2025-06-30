import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get("authorization")
    if (!authHeader) {
      return NextResponse.json({ success: false, message: "No authorization header" }, { status: 401 })
    }

    const apiUrl = process.env.NEXT_PUBLIC_LARAVEL_API_URL 

    const response = await fetch(`${apiUrl}/notifications`, {
      method: "GET",
      headers: {
        Authorization: authHeader,
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    })

    const data = await response.json()
    return NextResponse.json(data)
  } catch (error) {
    console.error("Notifications API error:", error)
    return NextResponse.json({ success: false, message: "Failed to fetch notifications" }, { status: 500 })
  }
}
