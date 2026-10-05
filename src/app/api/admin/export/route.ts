import { db } from "@/lib/ticketing/db";
import { failure, requireAdmin } from "@/lib/ticketing/http";
export const runtime = "nodejs";
export function csvCell(value: unknown) {
  let text = String(value ?? "");
  if (/^[\s]*[=+@-]/.test(text) || /^[\t\r\n]/.test(text)) text = `'${text}`;
  return `"${text.replace(/"/g, '""')}"`;
}
export async function GET() {
  try {
    await requireAdmin();
    const rows = await db()
      .prepare(
        "SELECT reference,name,email,quantity,amount,currency,status,answers,created_at FROM orders ORDER BY created_at DESC",
      )
      .all();
    const csv = [
      "Reference,Name,Email,Quantity,Amount (kobo),Currency,Status,Form answers,Created at",
      ...rows.map((r) => Object.values(r).map(csvCell).join(",")),
    ].join("\r\n");
    return new Response(csv, {
      headers: {
        "Content-Type": "text/csv; charset=utf-8",
        "Content-Disposition": 'attachment; filename="cavic-orders.csv"',
        "Cache-Control": "no-store",
      },
    });
  } catch (error) {
    return failure(error);
  }
}
