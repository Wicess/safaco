/**
 * `pnpm admin:user <email> [name]`: create an admin account, or reset its
 * password. The password comes from ADMIN_PASSWORD, or a strong random one is
 * generated and printed once. Change it after signing in (Account page).
 */
import "dotenv/config";
import { randomBytes } from "node:crypto";
import { hashPassword } from "../server/lib/auth";
import { db } from "../server/lib/db";

const [email, ...nameParts] = process.argv.slice(2);
if (!email || !email.includes("@")) {
  console.error("Usage: pnpm admin:user <email> [name]");
  process.exit(1);
}
const prisma = db();
if (!prisma) {
  console.error("DATABASE_URL is not set");
  process.exit(1);
}
const password = process.env.ADMIN_PASSWORD || randomBytes(9).toString("base64url");
const passwordHash = await hashPassword(password);
const name = nameParts.join(" ") || email.split("@")[0]!;
const user = await prisma.adminUser.upsert({
  where: { email: email.toLowerCase() },
  create: { email: email.toLowerCase(), name, passwordHash },
  update: { passwordHash },
});
console.log(`✓ admin ${user.email}`);
if (!process.env.ADMIN_PASSWORD) console.log(`  temporary password: ${password}`);
await prisma.$disconnect();
