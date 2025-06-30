import { type NextRequest, NextResponse } from "next/server"

const LARAVEL_API_URL = process.env.NEXT_PUBLIC_LARAVEL_API_URL

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const { orderId, payment_status } = body

    if (!orderId || !payment_status) {
      return NextResponse.json(
        {
          success: false,
          message: "Order ID and payment status are required",
        },
        { status: 400 },
      )
    }

    // Get the authorization header from the request
    const authHeader = request.headers.get("authorization")

    if (!authHeader) {
      return NextResponse.json(
        {
          success: false,
          message: "Authorization header is required",
        },
        { status: 401 },
      )
    }

    // Make request to Laravel API
    const response = await fetch(`${LARAVEL_API_URL}/orders/${orderId}/payment-status`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: authHeader,
        Accept: "application/json",
      },
      body: JSON.stringify({ payment_status }),
    })

    const data = await response.json()

    if (!response.ok) {
      return NextResponse.json(
        {
          success: false,
          message: data.message || "Failed to update payment status",
        },
        { status: response.status },
      )
    }

    return NextResponse.json(data)
  } catch (error) {
    console.error("Payment status update error:", error)
    return NextResponse.json(
      {
        success: false,
        message: "Internal server error",
      },
      { status: 500 },
    )
  }
}

// GET method to fetch payment status
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const orderId = searchParams.get("orderId")

    if (!orderId) {
      return NextResponse.json(
        {
          success: false,
          message: "Order ID is required",
        },
        { status: 400 },
      )
    }

    // Get the authorization header from the request
    const authHeader = request.headers.get("authorization")

    if (!authHeader) {
      return NextResponse.json(
        {
          success: false,
          message: "Authorization header is required",
        },
        { status: 401 },
      )
    }

    // Make request to Laravel API to get order details
    const response = await fetch(`${LARAVEL_API_URL}/admin/orders/${orderId}`, {
      method: "GET",
      headers: {
        Authorization: authHeader,
        Accept: "application/json",
      },
    })

    const data = await response.json()

    if (!response.ok) {
      return NextResponse.json(
        {
          success: false,
          message: data.message || "Failed to fetch order details",
        },
        { status: response.status },
      )
    }

    return NextResponse.json({
      success: true,
      payment_status: data.data.payment_status || "pending",
    })
  } catch (error) {
    console.error("Payment status fetch error:", error)
    return NextResponse.json(
      {
        success: false,
        message: "Internal server error",
      },
      { status: 500 },
    )
  }
}
