import { type NextRequest, NextResponse } from "next/server";

const NEXT_PUBLIC_LARAVEL_API_URL = process.env.NEXT_PUBLIC_LARAVEL_API_URL

// In Next.js 15, params is now a Promise that needs to be awaited
export async function GET(
  request: NextRequest, 
  context: { params: Promise<{ id: string }> }
) {
  try {
    const authHeader = request.headers.get("authorization");

    if (!authHeader) {
      return NextResponse.json({ success: false, message: "Authentication required" }, { status: 401 });
    }

    // Await the params Promise to get the actual parameters
    const { id } = await context.params;

    const response = await fetch(`${NEXT_PUBLIC_LARAVEL_API_URL}/admin/orders/${id}`, {
      method: "GET",
      headers: {
        Authorization: authHeader,
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    });

    const data = await response.json();

    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error("Admin Order Details API error:", error);
    return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 });
  }
}