import { NextRequest, NextResponse } from "next/server";

const baseUrl = process.env.BASE_URL;

export async function POST(request: NextRequest) {
  try {
  
    const token = request.cookies.get('auth_token')?.value;
    const body = await request.json();
    const response = await fetch(`${baseUrl}/interviews/create/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Token ${token}`,
      },
      body: JSON.stringify(body),
    });
    const responseText = await response.text();

    let data;
    try {
      data = JSON.parse(responseText);
    } catch (error) {
      return NextResponse.json(
        { message: "Invalid response from server." },
        { status: 500 }
      );
    }  
    return NextResponse.json(data, { status: 201 });

  } catch (error) {
    return NextResponse.json(
      { message: (error as Error).message },
      { status: 500 }
    );
  }
}