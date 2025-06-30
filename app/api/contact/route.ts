import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, email, phone, subject, message } = body

    // Validate required fields
    if (!name || !email || !subject || !message) {
      return NextResponse.json({ success: false, message: "Missing required fields" }, { status: 400 })
    }

    // Send to Laravel API
    const laravelApiUrl = process.env.NEXT_PUBLIC_LARAVEL_API_URL

    const response = await fetch(`${laravelApiUrl}/contact`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        name,
        email,
        phone,
        subject,
        message,
      }),
    })

    const data = await response.json()

    if (response.ok && data.success) {
      // Send emails asynchronously
      const inquiry = data.data

      // Send admin notification
      fetch(`${process.env.NEXT_PUBLIC_LARAVEL_API_URL}/email/admin-notification`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(inquiry),
      }).catch((error) => console.error("Failed to send admin notification:", error))

      // Send customer confirmation
      fetch(`${process.env.NEXT_PUBLIC_LARAVEL_API_URL}/api/email/customer-confirmation`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(inquiry),
      }).catch((error) => console.error("Failed to send customer confirmation:", error))

      return NextResponse.json({
        success: true,
        message: "Message sent successfully",
        data: data.data,
      })
    } else {
      return NextResponse.json(
        { success: false, message: data.message || "Failed to send message" },
        { status: response.status },
      )
    }
  } catch (error) {
    console.error("Contact API error:", error)
    return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 })
  }
}
