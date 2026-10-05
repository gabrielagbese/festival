export type FormField = {
  id: string;
  label: string;
  type: "text" | "select" | "checkbox";
  required: boolean;
  options: string[];
};
export type TicketType = {
  id: string;
  event_id: string;
  name: string;
  description: string;
  price: number;
  capacity: number;
  sold: number;
  reserved: number;
  available: number;
  active: number;
};
export type Event = {
  id: string;
  slug: string;
  name: string;
  description: string;
  venue: string;
  city: string;
  starts_at: string;
  ends_at: string;
  status: "draft" | "published" | "archived";
  is_sample: number;
  capacity: number;
  category: string;
  fields: FormField[];
  tickets: TicketType[];
};
export type Order = {
  id: string;
  reference: string;
  event_id: string;
  ticket_type_id: string;
  name: string;
  email: string;
  quantity: number;
  amount: number;
  currency: string;
  status: "pending" | "paid" | "failed" | "review" | "reversed";
  answers: string;
  snapshot: string;
  created_at: number;
  expires_at: number;
  paid_at: number | null;
  email_status: string;
  email_error: string | null;
};
export type Ticket = {
  id: string;
  order_id: string;
  event_id: string;
  ordinal: number;
  checked_in_at: number | null;
  voided: number;
};
export const money = (amount: number) =>
  new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    maximumFractionDigits: amount % 100 === 0 ? 0 : 2,
  }).format(amount / 100);
export const eventDate = (value: string, end?: string): string =>
  !value
    ? "November 2026 · exact date to be announced"
    : new Intl.DateTimeFormat("en-NG", {
        month: "short",
        day: "numeric",
        year: "numeric",
        hour: "numeric",
        minute: "2-digit",
        timeZone: "Africa/Lagos",
      }).format(new Date(value)) + (end ? ` – ${eventDate(end)}` : "");

export const bookingOpen = (event: Pick<Event, "starts_at" | "ends_at">) =>
  Number.isFinite(Date.parse(event.starts_at)) &&
  Date.parse(event.ends_at || event.starts_at) > Date.now();
