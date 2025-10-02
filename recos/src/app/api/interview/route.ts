import { NextRequest, NextResponse } from "next/server";

const baseUrl= process.env.BASE_URL!;

export async function GET(req: NextRequest) {
  const authHeader = req.headers.get("authorization");
  const token = authHeader ? authHeader.replace("Token ", "") : "";
  try {
    const response = await fetch(`${baseUrl}/interview/`, {
      headers: {
        Authorization: `Token ${token}`,
        "Content-Type": "application/json",
      },
    });
    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ message: (error as Error).message  }, { status: 500 });
  }
}
