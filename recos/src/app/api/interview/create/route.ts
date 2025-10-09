import { NextRequest, NextResponse } from "next/server";

const baseUrl = process.env.BASE_URL;
export async function POST(request: NextRequest) {
  try {
    const authHeader = request.headers.get("Authorization");
    if (!authHeader) {
      return NextResponse.json(
        { message: "Authentication credentials were not provided." },
        { status: 401 }
      );
    }
    const body = await request.json();
    const response = await fetch(`${baseUrl}/interviews/create/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: authHeader, 
      },
      body: JSON.stringify(body),
    });
  } catch (error) {
    return NextResponse.json(
      { message: (error as Error).message},
      { status: 500 }
    );
  }
}
