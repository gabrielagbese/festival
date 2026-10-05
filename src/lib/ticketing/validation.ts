import { z } from "zod";
export const fieldSchema = z
  .object({
    id: z
      .string()
      .min(1)
      .max(60)
      .regex(/^[a-zA-Z0-9_-]+$/)
      .refine(
        (id) => !["name", "email", "consent", "ticket"].includes(id),
        "This field identifier is reserved.",
      ),
    label: z.string().trim().min(1).max(100),
    type: z.enum(["text", "select", "checkbox"]),
    required: z.boolean(),
    options: z.array(z.string().trim().min(1).max(100)).max(30),
  })
  .refine(
    (f) => f.type !== "select" || f.options.length > 0,
    "Dropdown fields need options.",
  );
export const eventSchema = z
  .object({
    id: z.string().optional(),
    slug: z
      .string()
      .trim()
      .min(2)
      .max(80)
      .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
    name: z.string().trim().min(3).max(120),
    description: z.string().trim().min(10).max(5000),
    venue: z.string().trim().max(160),
    city: z.string().trim().min(2).max(100),
    starts_at: z
      .string()
      .refine(
        (v) => v === "" || Number.isFinite(Date.parse(v)),
        "Choose a valid date.",
      ),
    ends_at: z
      .string()
      .default("")
      .refine(
        (v) => v === "" || Number.isFinite(Date.parse(v)),
        "Choose a valid end date.",
      ),
    status: z.enum(["draft", "published", "archived"]),
    is_sample: z.boolean(),
    capacity: z.number().int().min(1).max(100000).default(200),
    category: z.string().trim().min(1).max(60),
    fields: z
      .array(fieldSchema)
      .max(12)
      .refine(
        (f) => new Set(f.map((x) => x.id)).size === f.length,
        "Field identifiers must be unique.",
      ),
    tickets: z
      .array(
        z.object({
          id: z.string().optional(),
          name: z.string().trim().min(1).max(80),
          description: z.string().trim().max(300),
          price: z.number().int().min(0).max(1000000000),
          capacity: z.number().int().min(1).max(100000),
          active: z.boolean(),
        }),
      )
      .max(10),
  })
  .refine(
    (e) => !e.ends_at || Date.parse(e.ends_at) > Date.parse(e.starts_at),
    "The end date must be after the start date.",
  )
  .refine(
    (e) =>
      e.status !== "published" ||
      (e.venue.length >= 2 &&
        Number.isFinite(Date.parse(e.starts_at)) &&
        e.tickets.some((t) => t.active) &&
        e.tickets.filter((t) => t.active).every((t) => t.price >= 10000)),
    "Set a venue, exact date, and ticket prices of at least ₦100 before publishing.",
  )
  .refine(
    (e) => !(e.status === "published" && e.is_sample),
    "Replace the sample content and untick Sample event before publishing.",
  );
export const checkoutSchema = z.object({
  eventId: z.string().max(100),
  ticketTypeId: z.string().max(100),
  quantity: z.number().int().min(1).max(10),
  name: z.string().trim().min(2).max(100),
  email: z
    .string()
    .email()
    .max(200)
    .transform((s) => s.toLowerCase()),
  answers: z.record(
    z.string().max(60),
    z.union([z.string().trim().max(1000), z.boolean()]),
  ),
  consent: z.literal(true),
});
