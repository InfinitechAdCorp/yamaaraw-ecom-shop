import { NextRequest, NextResponse } from 'next/server'

const NEXT_PUBLIC_LARAVEL_API_URL = process.env.NEXT_PUBLIC_LARAVEL_API_URL

export async function DELETE(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization')
    const sessionId = request.headers.get('x-session-id')
    
    // For clearing cart, we need either auth or session ID
    if (!authHeader && !sessionId) {
      return NextResponse.json(
        { success: false, message: 'Authentication or session required' },
        { status: 401 }
      )
    }

    const body = await request.json().catch(() => ({})) // Body might be empty for DELETE
    
    const headers: HeadersInit = {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    }

    // Add authorization header if present
    if (authHeader) {
      headers['Authorization'] = authHeader
    }

    // Add session ID header if present
    if (sessionId) {
      headers['X-Session-ID'] = sessionId
    }

    console.log('Clearing cart with headers:', {
      hasAuth: !!authHeader,
      hasSession: !!sessionId
    })

    const response = await fetch(`${NEXT_PUBLIC_LARAVEL_API_URL}/cart/clear`, {
      method: 'DELETE',
      headers,
      body: JSON.stringify(body),
    })

    const data = await response.json()
    
    console.log('Clear cart response:', {
      status: response.status,
      data: data
    })
    
    return NextResponse.json(data, { status: response.status })
  } catch (error) {
    console.error('Cart clear error:', error)
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    )
  }
}
