import { randomUUID } from "crypto";
import { eq } from "drizzle-orm";
import { NextResponse, type NextRequest } from "next/server";
import { db } from "~/server/db";
import { clients, codes } from "~/server/db/schema";

async function generateCodeForClient(
  clientId: string,
  clientCode: string,
): Promise<string> {
  const uniqueCode = randomUUID();
  const generatedCode = `${clientCode}-${uniqueCode}`;

  await db.insert(codes).values({
    code: generatedCode,
    expiresAt: new Date(Date.now() + 15 * 60 * 1000),
    isUsed: false,
    isLoggedIn: false,
    clientId: clientId,
    userId: null,
  });

  return generatedCode;
}

async function getClientIdByCode(clientCode: string): Promise<string | null> {
  const client = await db
    .select()
    .from(clients)
    .where(eq(clients.code, clientCode))
    .limit(1);

  if (client[0]?.id === undefined) {
    return null;
  }

  return client.length > 0 ? client[0]?.id : null;
}

export async function GET(
  _request: NextRequest,
  { params }: { params: { "client-code": string } },
) {
  try {
    const clientCode = params["client-code"];
    if (!clientCode) {
      return NextResponse.json(
        {
          code: 400,
          message: "Client code is required",
          status: false,
        },
        { status: 400 },
      );
    }
    const clientId = await getClientIdByCode(clientCode);

    if (!clientId) {
      return NextResponse.json(
        {
          code: 404,
          message: "Client not found",
          status: false,
        },
        { status: 404 },
      );
    }

    const generatedCode = await generateCodeForClient(clientId, clientCode);
    if (!generatedCode) {
      return NextResponse.json(
        {
          code: 404,
          message: "Client not found",
          status: false,
        },
        { status: 404 },
      );
    }

    return NextResponse.json(
      {
        code: 200,
        message: "Code generated successfully",
        status: true,
        data: generatedCode,
      },
      { status: 200 },
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      {
        code: 500,
        message: "Internal server error",
        status: false,
      },
      { status: 500 },
    );
  }
}
