import { type NextRequest, NextResponse } from "next/server"
import { emailService } from "@/lib/email-service"

export async function POST(request: NextRequest) {
  try {
    const inquiry = await request.json()

    const result = await emailService.sendCustomerConfirmation(inquiry)

    if (result.success) {
      return NextResponse.json({
        success: true,
        message: "Customer confirmation sent successfully",
        messageId: result.messageId,
      })
    } else {
      return NextResponse.json(
        { success: false, message: "Failed to send customer confirmation", error: result.error },
        { status: 500 },
      )
    }
  } catch (error) {
    console.error("Customer confirmation API error:", error)
    return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 })
  }
}
