import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const { message } = await request.json()

    // Simple AI responses for demo - replace with actual OpenAI integration
    const responses = {
      greeting: "Hello! I'm Darlene, your YAMAARAW assistant. How can I help you today?",
      products: "We offer a wide range of electric trikes. Would you like to see our current models and prices?",
      location: "We're located at DRT Highway, Brgy. Cutcot, Pulilan, Bulacan. Would you like directions?",
      hours: "We're open Monday-Saturday 8AM-6PM, Sunday 9AM-5PM. How can I assist you?",
      financing:
        "We offer flexible financing options with 0% interest for qualified buyers. Would you like more details?",
      warranty:
        "All our E-Trikes come with a 2-year comprehensive warranty. What specific warranty information do you need?",
      default:
        "I'd be happy to help! I can assist with product information, store location, financing options, or any other questions about YAMAARAW E-Trikes.",
    }

    let response = responses.default

    const lowerMessage = message.toLowerCase()

    if (lowerMessage.includes("hello") || lowerMessage.includes("hi") || lowerMessage.includes("hey")) {
      response = responses.greeting
    } else if (lowerMessage.includes("product") || lowerMessage.includes("trike") || lowerMessage.includes("price")) {
      response = responses.products
    } else if (
      lowerMessage.includes("location") ||
      lowerMessage.includes("address") ||
      lowerMessage.includes("where")
    ) {
      response = responses.location
    } else if (lowerMessage.includes("hours") || lowerMessage.includes("time") || lowerMessage.includes("open")) {
      response = responses.hours
    } else if (
      lowerMessage.includes("financing") ||
      lowerMessage.includes("payment") ||
      lowerMessage.includes("loan")
    ) {
      response = responses.financing
    } else if (lowerMessage.includes("warranty") || lowerMessage.includes("guarantee")) {
      response = responses.warranty
    }

    return NextResponse.json({
      success: true,
      content: response,
    })
  } catch (error) {
    console.error("OpenAI API Error:", error)
    return NextResponse.json(
      {
        success: false,
        message: "Failed to process message",
      },
      { status: 500 },
    )
  }
}
