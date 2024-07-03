import { NextResponse } from "next/server";
import { Resend } from "resend";

const resend = new Resend("re_9azfEBnj_KhcY5KMeefT8jyqrMWAYoen1");

export async function POST(request: Request) {
  const { email, firstName, lastName } = await request.json();

  try {
    const { data, error } = await resend.contacts.create({
      email,
      firstName,
      lastName,
      unsubscribed: false,
      audienceId: "558b0793-a0fc-49d0-a097-e4659260d6d8",
    });
    console.log(data, error);

    return Response.json(
      {
        success: true,
        message: "Successfully added to contact list on Resent",
      },
      { status: 200 },
    );
  } catch (error: any) {
    return new NextResponse(error.message, { status: 500 });
  }
}
