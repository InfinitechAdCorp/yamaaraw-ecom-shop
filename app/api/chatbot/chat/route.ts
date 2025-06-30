import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const action = searchParams.get("action")
  const conversationId = searchParams.get("conversation_id")
  const status = searchParams.get("status")

  try {
    const baseUrl = process.env.NEXT_PUBLIC_LARAVEL_API_URL || "http://localhost:8000/api"
    const authHeader = request.headers.get("authorization")

    if (!authHeader) {
      return NextResponse.json(
        {
          success: false,
          message: "Authorization header required",
        },
        { status: 401 },
      )
    }

    console.log(`Making request to Laravel API: ${baseUrl}`)
    console.log(`Action: ${action}`)
    console.log(`Conversation ID: ${conversationId}`)

    switch (action) {
      case "get_conversation":
        const conversationResponse = await fetch(`${baseUrl}/chat/conversation`, {
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            Authorization: authHeader,
          },
        })

        console.log(`Conversation response status: ${conversationResponse.status}`)

        if (!conversationResponse.ok) {
          const errorText = await conversationResponse.text()
          console.error(`Conversation error response: ${errorText}`)
          throw new Error(`Failed to get conversation: ${conversationResponse.status} - ${errorText}`)
        }

        const conversationData = await conversationResponse.json()
        return NextResponse.json(conversationData)

      case "get_messages":
        if (!conversationId) {
          return NextResponse.json(
            {
              success: false,
              message: "Conversation ID required",
            },
            { status: 400 },
          )
        }

        const messagesUrl = `${baseUrl}/chat/messages/${conversationId}`
        console.log(`Fetching messages from: ${messagesUrl}`)

        const messagesResponse = await fetch(messagesUrl, {
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            Authorization: authHeader,
          },
        })

        console.log(`Messages response status: ${messagesResponse.status}`)

        if (!messagesResponse.ok) {
          const errorText = await messagesResponse.text()
          console.error(`Messages error response: ${errorText}`)
          throw new Error(`Failed to get messages: ${messagesResponse.status} - ${errorText}`)
        }

        const messagesData = await messagesResponse.json()
        return NextResponse.json(messagesData)

      case "admin_conversations":
        const statusParam = status ? `?status=${status}` : ""
        const adminConversationsUrl = `${baseUrl}/admin/chat/conversations${statusParam}`
        console.log(`Fetching admin conversations from: ${adminConversationsUrl}`)

        const adminConversationsResponse = await fetch(adminConversationsUrl, {
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            Authorization: authHeader,
          },
        })

        console.log(`Admin conversations response status: ${adminConversationsResponse.status}`)

        if (!adminConversationsResponse.ok) {
          const errorText = await adminConversationsResponse.text()
          console.error(`Admin conversations error response: ${errorText}`)
          throw new Error(`Failed to get admin conversations: ${adminConversationsResponse.status} - ${errorText}`)
        }

        const adminConversationsData = await adminConversationsResponse.json()
        return NextResponse.json(adminConversationsData)

      case "admin_stats":
        const statsUrl = `${baseUrl}/admin/chat/stats`
        console.log(`Fetching admin stats from: ${statsUrl}`)

        const statsResponse = await fetch(statsUrl, {
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            Authorization: authHeader,
          },
        })

        console.log(`Stats response status: ${statsResponse.status}`)

        if (!statsResponse.ok) {
          const errorText = await statsResponse.text()
          console.error(`Stats error response: ${errorText}`)
          throw new Error(`Failed to get chat stats: ${statsResponse.status} - ${errorText}`)
        }

        const statsData = await statsResponse.json()
        return NextResponse.json(statsData)

      default:
        return NextResponse.json(
          {
            success: false,
            message: "Invalid action parameter",
          },
          { status: 400 },
        )
    }
  } catch (error) {
    console.error("Chat API Error:", error)
    return NextResponse.json(
      {
        success: false,
        message: error instanceof Error ? error.message : "Internal server error",
      },
      { status: 500 },
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { action, conversation_id, message, message_type, status } = body

    const baseUrl = process.env.NEXT_PUBLIC_LARAVEL_API_URL || "http://localhost:8000/api"
    const authHeader = request.headers.get("authorization")

    if (!authHeader) {
      return NextResponse.json(
        {
          success: false,
          message: "Authorization header required",
        },
        { status: 401 },
      )
    }

    console.log(`POST Action: ${action}`)
    console.log(`Conversation ID: ${conversation_id}`)

    switch (action) {
      case "send_message":
        const sendUrl = `${baseUrl}/chat/message`
        console.log(`Sending message to: ${sendUrl}`)

        const sendResponse = await fetch(sendUrl, {
          method: "POST",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            Authorization: authHeader,
          },
          body: JSON.stringify({
            conversation_id,
            message,
            message_type: message_type || "text",
          }),
        })

        console.log(`Send message response status: ${sendResponse.status}`)

        if (!sendResponse.ok) {
          const errorText = await sendResponse.text()
          console.error(`Send message error response: ${errorText}`)
          throw new Error(`Failed to send message: ${sendResponse.status} - ${errorText}`)
        }

        const sendData = await sendResponse.json()
        return NextResponse.json(sendData)

      case "admin_send_message":
        const adminSendUrl = `${baseUrl}/chat/message`
        console.log(`Admin sending message to: ${adminSendUrl}`)

        const adminSendResponse = await fetch(adminSendUrl, {
          method: "POST",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            Authorization: authHeader,
          },
          body: JSON.stringify({
            conversation_id,
            message,
            message_type: message_type || "text",
          }),
        })

        console.log(`Admin send message response status: ${adminSendResponse.status}`)

        if (!adminSendResponse.ok) {
          const errorText = await adminSendResponse.text()
          console.error(`Admin send message error response: ${errorText}`)
          throw new Error(`Failed to send admin message: ${adminSendResponse.status} - ${errorText}`)
        }

        const adminSendData = await adminSendResponse.json()
        return NextResponse.json(adminSendData)

      case "assign_conversation":
        const assignUrl = `${baseUrl}/admin/chat/assign/${conversation_id}`
        console.log(`Assigning conversation at: ${assignUrl}`)

        const assignResponse = await fetch(assignUrl, {
          method: "POST",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            Authorization: authHeader,
          },
        })

        console.log(`Assign conversation response status: ${assignResponse.status}`)

        if (!assignResponse.ok) {
          const errorText = await assignResponse.text()
          console.error(`Assign conversation error response: ${errorText}`)
          throw new Error(`Failed to assign conversation: ${assignResponse.status} - ${errorText}`)
        }

        const assignData = await assignResponse.json()
        return NextResponse.json(assignData)

      case "end_conversation":
        const endUrl = `${baseUrl}/admin/chat/end/${conversation_id}`
        console.log(`Ending conversation at: ${endUrl}`)

        const endResponse = await fetch(endUrl, {
          method: "POST",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            Authorization: authHeader,
          },
        })

        console.log(`End conversation response status: ${endResponse.status}`)

        if (!endResponse.ok) {
          const errorText = await endResponse.text()
          console.error(`End conversation error response: ${errorText}`)
          throw new Error(`Failed to end conversation: ${endResponse.status} - ${errorText}`)
        }

        const endData = await endResponse.json()
        return NextResponse.json(endData)

      case "update_conversation_status":
        const statusUrl = `${baseUrl}/admin/chat/status/${conversation_id}`
        console.log(`Updating conversation status at: ${statusUrl}`)

        const statusResponse = await fetch(statusUrl, {
          method: "POST",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            Authorization: authHeader,
          },
          body: JSON.stringify({
            status,
          }),
        })

        console.log(`Update status response status: ${statusResponse.status}`)

        if (!statusResponse.ok) {
          const errorText = await statusResponse.text()
          console.error(`Update status error response: ${errorText}`)
          throw new Error(`Failed to update status: ${statusResponse.status} - ${errorText}`)
        }

        const statusData = await statusResponse.json()
        return NextResponse.json(statusData)

      default:
        return NextResponse.json(
          {
            success: false,
            message: "Invalid action parameter",
          },
          { status: 400 },
        )
    }
  } catch (error) {
    console.error("Chat API POST Error:", error)
    return NextResponse.json(
      {
        success: false,
        message: error instanceof Error ? error.message : "Internal server error",
      },
      { status: 500 },
    )
  }
}
