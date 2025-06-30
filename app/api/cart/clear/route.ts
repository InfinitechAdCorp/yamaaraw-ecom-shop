import { NextRequest, NextResponse } from 'next/server'

const NEXT_PUBLIC_LARAVEL_API_URL = process.env.NEXT_PUBLIC_LARAVEL_API_URL
export async function DELETE(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization')
    
    if (!authHeader) {
      return NextResponse.json(
        { success: false, message: 'Authentication required' },
        { status: 401 }
      )
    }

    const response = await fetch(`${NEXT_PUBLIC_LARAVEL_API_URL}/cart/clear`, {
      method: 'DELETE',
      headers: {
        'Authorization': authHeader,
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
    })

    const data = await response.json()
    
    return NextResponse.json(data, { status: response.status })
  } catch (error) {
    console.error('Cart clear error:', error)
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    )
  }
}
