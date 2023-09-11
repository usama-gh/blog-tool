import { NextResponse } from "next/server";

export async function POST(req: Request): Promise<Response> {
  console.log(req.body)
  // addVisitor()
  
  return NextResponse.json({message: 'visitor recorded'});
}
