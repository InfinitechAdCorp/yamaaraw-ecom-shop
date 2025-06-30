import { type NextRequest, NextResponse } from "next/server"
import { emailService } from "@/lib/email-service"

export async function POST(request: NextRequest) {
  try {
    const { inquiry, replyMessage, replyFrom } = await request.json()

    const result = await emailService.sendReplyEmail(inquiry, replyMessage, replyFrom)

    if (result.success) {
      return NextResponse.json({
        success: true,
        message: "Reply email sent successfully",
        messageId: result.messageId,
      })
    } else {
      return NextResponse.json(
        { success: false, message: "Failed to send reply email", error: result.error },
        { status: 500 },
      )
    }
  } catch (error) {
    console.error("Reply email API error:", error)
    return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 })
  }
}
