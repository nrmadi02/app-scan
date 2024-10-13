/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { type NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import jwt from "jsonwebtoken";
import { eq, and, gt } from "drizzle-orm";
import { db } from "~/server/db";
import { codes } from "~/server/db/schema";

const JWT_SECRET = process.env.JWT_SECRET ?? "super-secret";

const SigninSchema = z.object({
  generatedCode: z.string().min(1, "Generated code is required"),
  userId: z.string().uuid("Invalid user ID format"),
});

const createJWT = (userId: string, clientId: string): string | null => {
  try {
    return (
      (
        jwt.sign as (payload: object, secret: string, options: object) => string
      )({ userId, clientId }, JWT_SECRET, { expiresIn: "1h" })
    );
  } catch (error) {
    console.error("Failed to create JWT:", error);
    return null;
  }
};

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as Record<string, string>;
    const parsedBody = SigninSchema.parse(body);

    const { generatedCode, userId } = parsedBody;

    const validCode = await db
      .select()
      .from(codes)
      .where(
        and(
          eq(codes.code, generatedCode),
          eq(codes.isUsed, false),
          gt(codes.expiresAt, new Date()),
        ),
      );

    if (!validCode[0]) {
      return NextResponse.json(
        {
          code: 400,
          message: "Invalid code",
          status: false,
        },
        { status: 400 },
      );
    }

    const codeEntry = validCode[0];
    const token = createJWT(userId, codeEntry.clientId ?? "");

    if (!token) {
      return NextResponse.json(
        {
          code: 500,
          message: "Failed to create JWT",
          status: false,
        },
        { status: 500 },
      );
    }

    return NextResponse.json(
      {
        code: 200,
        message: "Signin successful",
        status: true,
        data: { token },
      },
      { status: 200 },
    );
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { code: 400, message: error.issues, status: false },
        { status: 400 },
      );
    }

    console.error("Error during signin:", error);
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
