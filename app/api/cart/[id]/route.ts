import { NextRequest, NextResponse } from 'next/server'

const NEXT_PUBLIC_LARAVEL_API_URL = process.env.NEXT_PUBLIC_LARAVEL_API_URL

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const authHeader = request.headers.get('authorization')
    const sessionId = request.headers.get('x-session-id')
    
    // For updating cart items, we need either auth or session ID
    if (!authHeader && !sessionId) {
      return NextResponse.json(
        { success: false, message: 'Authentication or session required' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const { id } = params
    
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

    const response = await fetch(`${NEXT_PUBLIC_LARAVEL_API_URL}/cart/${id}`, {
      method: 'PUT',
      headers,
      body: JSON.stringify(body),
    })

    const data = await response.json()
    
    return NextResponse.json(data, { status: response.status })
  } catch (error) {
    console.error('Cart item PUT error:', error)
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const authHeader = request.headers.get('authorization')
    const sessionId = request.headers.get('x-session-id')
    
    // For deleting cart items, we need either auth or session ID
    if (!authHeader && !sessionId) {
      return NextResponse.json(
        { success: false, message: 'Authentication or session required' },
        { status: 401 }
      )
    }

    const body = await request.json().catch(() => ({})) // Body might be empty for DELETE
    const { id } = params
    
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

    const response = await fetch(`${NEXT_PUBLIC_LARAVEL_API_URL}/cart/${id}`, {
      method: 'DELETE',
      headers,
      body: JSON.stringify(body),
    })

    const data = await response.json()
    
    return NextResponse.json(data, { status: response.status })
  } catch (error) {
    console.error('Cart item DELETE error:', error)
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    )
  }
}
