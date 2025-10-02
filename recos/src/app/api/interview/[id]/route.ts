import { NextRequest, NextResponse } from "next/server";

const baseUrl= process.env.BASE_URL!;

export async function GET(request: NextRequest, variable: { params: Promise<{ id: string }> }) {
  try {
    const params = await variable.params; 
    const response = await fetch(`${baseUrl}/interview/${params.id}/`, {
      headers: { Authorization: request.headers.get("authorization") || "" },
    });
    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({  message: (error as Error).message }, { status: 500 });
  }
  }
