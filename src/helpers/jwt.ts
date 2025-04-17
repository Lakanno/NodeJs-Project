import { Buffer } from "node:buffer"; // Base64url
import { createHmac } from "crypto"; // HMAC SHA256 ალგორითმის შესაქმნელად
import dotenv from "dotenv";
dotenv.config();

const SECRET_KEY = process.env.JWT_SECRET || "default-secret-key";

function encodeBase64(str: string): string {
  return Buffer.from(str, "utf-8").toString("base64url");
}
function decodeBase64(str: string): string {
  return Buffer.from(str, "base64url").toString("utf-8");
}
function generateSignature(header: string, body: string, secretKey: string): string {
  const data = `${header}.${body}`; // ჰედერი და body გაერთიანება
  // HMAC SHA256-ის გამოყენება signature  შესაქმნელად
  return createHmac("sha256", secretKey)
    .update(data) // მონაცემების განახლება
    .digest("base64url"); // Base64url ფორმატში დაბრუნება
}

export function generateToken(payload: object): string {
  // console.log("✅ generateToken - Received Payload:", payload);
  const validPayload = payload && Object.keys(payload).length > 0 ? payload : { error: "Invalid Payload" };
  const header = encodeBase64(JSON.stringify({ alg: "HS256", typ: "JWT" }));
  const body = encodeBase64(JSON.stringify(payload));

  console.log("📝 JSON Payload Before Encoding:", JSON.stringify(validPayload));
  // console.log("🔍 Encoded Body:", body);

  const signature = generateSignature(header, body, SECRET_KEY);
  // console.log("generateToken - Signature", signature);
  // console.log("generateToken - header", header);
  // console.log("generateToken - body", body);
  // ტოკენის დაბრუნება: [header].[body].[signature]
  return `${header}.${body}.${signature}`;
}

// JWT ტოკენის ვალიდაციის ფუნქცია
export function verifyToken(token: string): object | null {
  const parts = token.split("."); // ტოკენის დაშლა header.body.signature-ზე
  console.log("🔎 Received Token:", token);
  console.log("🛠 Token Parts:", parts);

  if (parts.length !== 3) return null; // ტოკენის ფორმატის შემოწმება
  const [header, body, signature] = parts;
  const decodedHeader = JSON.parse(decodeBase64(header));

  // ვამოწმებთ, რომ ჰედერში მითითებული ალგორითმი იყოს "HS256"
  if (decodedHeader.alg !== "HS256") {
    console.error("Invalid algorithm:", decodedHeader.alg);
    return null;
  }

  const expectedSignature = generateSignature(header, body, SECRET_KEY);
  console.log("✅ Expected Signature:", expectedSignature);
  console.log("🚨 Provided Signature:", signature);

  if (signature !== expectedSignature) {
    console.error("❌ Signature Mismatch");
    return null;
  }
  return JSON.parse(decodeBase64(body));
}
