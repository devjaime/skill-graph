import { NextResponse } from "next/server";

import { certifications } from "@/lib/mock-data";

export function GET() {
  return NextResponse.json({
    data: certifications,
    meta: {
      source: "mock",
      count: certifications.length,
    },
  });
}
