// const baseUrl = process.env.API_BASE_URL;
// if (!baseUrl) throw new Error("API base URL not configured");

// export async function POST(request: Request) {
//   try {
//     const token = cookieStore.get("auth_token");
//     const credentials = await request.json();
//     const response = await fetch(`${baseUrl}/odoo-credentials`, {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//         Authorization: `Token ${token}`,
//       },
//       body: JSON.stringify(credentials),
//     });
//     const data = await response.json();
//     return new Response(JSON.stringify(data), {
//       headers: { "Content-Type": "application/json" },
//     });
//   } catch (error) {
//     return new Response(JSON.stringify({ error: "Internal Server Error"}),{ status: 500 });
//   }
// }
