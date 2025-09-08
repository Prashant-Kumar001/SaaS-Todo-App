import { Webhook } from "svix";
import { headers } from "next/headers";
import { WebhookEvent } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function POST(req: Request) {
  const secret = process.env.WEBHOOK_SECRET;
  if (!secret) {
    console.error("Missing CLERK_WEBHOOK_SECRET");
    return NextResponse.json(
      { error: "Server misconfigured" },
      { status: 500 }
    );
  }
  const headerPayload = headers();
  const svix_id = (await headerPayload).get("svix-id");
  const svix_timestamp = (await headerPayload).get("svix-timestamp");
  const svix_signature = (await headerPayload).get("svix-signature");

  if (!svix_id || !svix_timestamp || !svix_signature) {
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  const payload = await req.json();
  const body = JSON.stringify(payload);

  const wh = new Webhook(secret);
  let evt: WebhookEvent;

  try {
    evt = wh.verify(body, {
      "svix-id": svix_id,
      "svix-timestamp": svix_timestamp,
      "svix-signature": svix_signature,
    }) as WebhookEvent;
  } catch (err) {
    console.error("❌ Webhook verification failed:", err);
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  const eventType = evt.type;
  const userId = evt.data.id;

  try {
    if (eventType === "user.created") {
      const { email_addresses, first_name, last_name } = evt.data;
      const email = email_addresses[0]?.email_address ?? "";

      if (!email) {
        return NextResponse.json(
          { error: "Missing email address" },
          { status: 400 }
        );
      }

      await prisma.user.create({
        data: {
          id: userId,
          email,
          name: `${first_name ?? ""} ${last_name ?? ""}`.trim(),
        },
      });
    }
  } catch (dbErr) {
    console.error("DB error:", dbErr);
    return NextResponse.json(
      { error: "Database operation failed" },
      { status: 500 }
    );
  }

  return NextResponse.json({ success: true });
}
