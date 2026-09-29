import { PrismaNeon } from "@prisma/adapter-neon";
import { PrismaClient } from "../generated/prisma/client";

// One client per function instance (module scope), over Neon's POOLED URL.
// The DB is touched only when a contact form is submitted, so Neon can
// scale to zero between enquiries.
let prisma: PrismaClient | null = null;

export function db(): PrismaClient | null {
  const url = process.env.DATABASE_URL;
  if (!url) return null;
  if (!prisma) prisma = new PrismaClient({ adapter: new PrismaNeon({ connectionString: url }) });
  return prisma;
}
