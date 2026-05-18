import { createHmac, timingSafeEqual } from "node:crypto";
import type { ReadonlyRequestCookies } from "next/dist/server/web/spec-extension/adapters/request-cookies";
import { NextResponse } from "next/server";

export interface SessionUser {
  userId: string;
  name: string;
  email: string;
}

interface SessionPayload extends SessionUser {
  exp: number;
}

export const SESSION_COOKIE_NAME = "nomly_session";
const SESSION_DURATION_MS = 1000 * 60 * 60 * 24 * 7;

const getAuthSecret = () => {
  const secret = process.env.AUTH_SECRET;

  if (!secret) {
    throw new Error("AUTH_SECRET is not set");
  }

  return secret;
};

const toBase64Url = (value: string) => Buffer.from(value).toString("base64url");

const fromBase64Url = (value: string) =>
  Buffer.from(value, "base64url").toString("utf8");

const sign = (value: string) =>
  createHmac("sha256", getAuthSecret()).update(value).digest("base64url");

export const createSessionValue = (user: SessionUser) => {
  const payload: SessionPayload = {
    ...user,
    exp: Date.now() + SESSION_DURATION_MS,
  };

  const encodedPayload = toBase64Url(JSON.stringify(payload));
  const signature = sign(encodedPayload);
  return `${encodedPayload}.${signature}`;
};

export const parseSessionValue = (
  value?: string | null,
): SessionUser | null => {
  if (!value) {
    return null;
  }

  const [encodedPayload, signature] = value.split(".");

  if (!encodedPayload || !signature) {
    return null;
  }

  const expectedSignature = sign(encodedPayload);
  const provided = Buffer.from(signature);
  const expected = Buffer.from(expectedSignature);

  if (
    provided.length !== expected.length ||
    !timingSafeEqual(provided, expected)
  ) {
    return null;
  }

  try {
    const payload = JSON.parse(fromBase64Url(encodedPayload)) as SessionPayload;

    if (payload.exp < Date.now()) {
      return null;
    }

    return {
      userId: payload.userId,
      name: payload.name,
      email: payload.email,
    };
  } catch {
    return null;
  }
};

export const getSessionFromCookies = (cookieStore: ReadonlyRequestCookies) =>
  parseSessionValue(cookieStore.get(SESSION_COOKIE_NAME)?.value);

export const setSessionCookie = (response: NextResponse, user: SessionUser) => {
  response.cookies.set({
    name: SESSION_COOKIE_NAME,
    value: createSessionValue(user),
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: SESSION_DURATION_MS / 1000,
  });

  return response;
};

export const clearSessionCookie = (response: NextResponse) => {
  response.cookies.set({
    name: SESSION_COOKIE_NAME,
    value: "",
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 0,
  });

  return response;
};
