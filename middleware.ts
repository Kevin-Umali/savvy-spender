import { NextResponse, type NextRequest } from "next/server";

const developmentMode = process.env.NODE_ENV === "development";
const allowedOrigins = developmentMode ? ["*"] : (process.env.ALLOWED_ORIGIN ?? "").split(",");

const getCorsHeaders = (requestOrigin: string | null) => {
  let allowOrigin = "false";

  if (developmentMode) {
    allowOrigin = "*";
  } else if (allowedOrigins.includes(requestOrigin ?? "")) {
    allowOrigin = requestOrigin ?? "false";
  }

  return {
    "Access-Control-Allow-Origin": allowOrigin,
    "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
  };
};

export async function middleware(request: NextRequest) {
  const requestOrigin = request.headers.get("origin");
  const corsHeaders = getCorsHeaders(requestOrigin);

  if (request.method === "OPTIONS") {
    return new NextResponse(null, { headers: corsHeaders });
  }

  const response = NextResponse.next();
  Object.entries(corsHeaders).forEach(([key, value]) => {
    if (value !== "false") {
      response.headers.set(key, value);
    }
  });

  return response;
}

export const config = {
  matcher: "/api/:path*",
};
