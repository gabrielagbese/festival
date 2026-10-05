"use client";
import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowDownToLine,
  ArrowLeft,
  ArrowUpRight,
  CalendarDays,
  Check,
  ChevronRight,
  CircleHelp,
  FileText,
  LayoutDashboard,
  LogOut,
  Plus,
  QrCode,
  Search,
  Settings2,
  Ticket,
  Trash2,
  Users,
  X,
} from "lucide-react";
import type { DashboardData } from "@/lib/ticketing/admin";
import type { Event, FormField } from "@/lib/ticketing/types";
import { eventDate, money } from "@/lib/ticketing/types";
import { Brand } from "./brand";

type View = "overview" | "events" | "forms" | "orders" | "checkin" | "settings";
const navigation: { id: View; label: string; icon: typeof Ticket }[] = [
  { id: "overview", label: "Overview", icon: LayoutDashboard },
  { id: "events", label: "Events & tickets", icon: CalendarDays },
  { id: "forms", label: "Registration forms", icon: FileText },
  { id: "orders", label: "Orders & attendees", icon: Users },
  { id: "checkin", label: "Check-in", icon: QrCode },
  { id: "settings", label: "Setup", icon: Settings2 },
];
async function api(body?: object): Promise<any> {
  const response = await fetch(
    "/api/admin",
    body
      ? {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        }
      : { cache: "no-store" },
  );
  const data = await response.json();
  if (!response.ok) throw new Error(data.error || "Please try again.");
  return data;
}
export function Dashboard({ initial }: { initial: DashboardData }) {
  const [data, setData] = useState(initial);
  const [view, setView] = useState<View>("overview");
  const [editor, setEditor] = useState<Event | "new" | null>(null);
  const [notice, setNotice] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();
  const refresh = async () => setData(await api());
  async function logout() {
    await fetch("/api/auth", { method: "DELETE" });
    router.push("/login");
    router.refresh();
  }
  function navigate(next: View) {
    setView(next);
    setEditor(null);
    setError("");
    setNotice("");
  }
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("all");
  const [pending, setPending] = useState("");
  async function orderAction(action: string, id: string) {
    setPending(id);
    setError("");
    try {
      await api({ action, id });
      await refresh();
      setNotice(
        action === "verify_order"
          ? "Payment status refreshed."
          : "Delivery checked. See the email status for the result.",
      );
    } catch (e) {
      setError(e instanceof Error ? e.message : "Request failed.");
    } finally {
      setPending("");
    }
  }
  const orders = data.orders.filter(
    (o) =>
      `${o.name} ${o.email} ${o.reference}`
        .toLowerCase()
        .includes(search.toLowerCase()) &&
      (status === "all" || o.status === status),
  );
  return (
    <div className="cavic-ticketing dashboard-shell">
      <aside className="sidebar">
        <Brand light />
        <div className="workspace-tag">
          <span className="workspace-avatar">C</span>
          <span>
            Cavic workspace<small>Organiser dashboard</small>
          </span>
        </div>
        <span className="sidebar-label">WORKSPACE</span>
        <nav aria-label="Dashboard">
          {navigation.map((item) => (
            <button
              key={item.id}
              className={view === item.id ? "active" : ""}
              onClick={() => navigate(item.id)}
            >
              <item.icon size={18} />
              {item.label}
              {view === item.id && <span className="nav-dot" />}
            </button>
          ))}
        </nav>
        <div className="sidebar-bottom">
          <Link href="/" target="_blank">
            <ArrowUpRight size={17} />
            View public site
          </Link>
          <button onClick={logout}>
            <LogOut size={17} />
            Sign out
          </button>
          <span className="sidebar-note">Made for moments that matter.</span>
        </div>
      </aside>
      <div className="dashboard-body">
        <header className="dashboard-topbar">
          <span>
            WORKSPACE <ChevronRight size={12} />{" "}
            {navigation.find((n) => n.id === view)?.label}
          </span>
          <div>
            <span
              className={`mode-pill ${data.setup.payments ? "" : "unconfigured"}`}
            >
              {data.setup.payments ? "LIVE PAYMENTS" : "PAYMENTS NEED SETUP"}
            </span>
            <span className="admin-avatar">CA</span>
          </div>
        </header>
        <div className="dashboard-main">
          {notice && (
            <div role="status" className="notice success">
              {notice}
              <button
                aria-label="Dismiss notification"
                onClick={() => setNotice("")}
              >
                <X size={14} />
              </button>
            </div>
          )}
          {error && (
            <p role="alert" className="notice error">
              {error}
            </p>
          )}
          {editor ? (
            <EventEditor
              event={editor === "new" ? undefined : editor}
              initialTab={view === "forms" ? "fields" : "details"}
              onClose={() => setEditor(null)}
              onSaved={async () => {
                await refresh();
                setEditor(null);
                setNotice("Your changes are saved.");
              }}
            />
          ) : (
            <>
              <div className="page-title">
                <div>
                  <span className="eyebrow">
                    {view === "overview"
                      ? "LET’S MAKE IT HAPPEN"
                      : "YOUR WORKSPACE"}
                  </span>
                  <h1>
                    {
                      {
                        overview: "Festival overview.",
                        events: "Events & tickets.",
                        forms: "Registration forms.",
                        orders: "Orders & attendees.",
                        checkin: "Festival check-in.",
                        settings: "Payment & delivery setup.",
                      }[view]
                    }
                  </h1>
                  <p>
                    {
                      {
                        overview:
                          "Your events, your people, your progress. All right here.",
                        events:
                          "Plan the experience. Set the price. Open the doors.",
                        forms:
                          "Customise the information you collect at checkout.",
                        orders:
                          "Track purchases, registration answers, and ticket delivery.",
                        checkin:
                          "Scan a ticket. Check it once. Welcome guests to the festival.",
                        settings:
                          "Connect the essentials to accept payments and deliver tickets.",
                      }[view]
                    }
                  </p>
                </div>
                {["overview", "events"].includes(view) && (
                  <button
                    className="button"
                    onClick={() => {
                      setView("events");
                      setEditor("new");
                    }}
                  >
                    <Plus size={17} />
                    Create event
                  </button>
                )}
              </div>
              {view === "overview" && (
                <>
                  <div className="stats-grid">
                    <Stat
                      label="GROSS TICKET SALES"
                      value={money(data.stats.revenue)}
                      caption="Confirmed payments before fees"
                      icon={ArrowUpRight}
                    />
                    <Stat
                      label="TICKETS SOLD"
                      value={String(data.stats.tickets)}
                      caption="A spot saved for every ticket"
                      icon={Ticket}
                    />
                    <Stat
                      label="LIVE EVENTS"
                      value={String(
                        data.events.filter((e) => e.status === "published")
                          .length,
                      )}
                      caption="Experiences ready to book"
                      icon={CalendarDays}
                    />
                    <Stat
                      label="CHECKED IN"
                      value={String(data.stats.checkedIn)}
                      caption="Guests welcomed at the door"
                      icon={QrCode}
                    />
                  </div>
                  {data.stats.reviews > 0 && (
                    <div className="notice error">
                      {data.stats.reviews} paid order(s) need your review
                      because their inventory hold expired. Open Orders &
                      attendees to arrange resolution.
                    </div>
                  )}
                  <div className="overview-grid">
                    <section className="panel">
                      <div className="panel-heading">
                        <h2>Your events</h2>
                        <button
                          className="text-button"
                          onClick={() => navigate("events")}
                        >
                          View all <ArrowUpRight size={14} />
                        </button>
                      </div>
                      {data.events.map((event) => (
                        <EventRow
                          key={event.id}
                          event={event}
                          onEdit={() => {
                            setView("events");
                            setEditor(event);
                          }}
                        />
                      ))}
                    </section>
                    <section className="getting-started">
                      <span className="eyebrow">FROM IDEA TO FULL HOUSE</span>
                      <h2>
                        Let’s get you
                        <br />
                        on the calendar.
                      </h2>
                      <p>Three small steps to your first great experience.</p>
                      <SetupStep
                        done={data.events.some(
                          (e) => !e.is_sample && e.status === "published",
                        )}
                        number="01"
                        label="Publish your event"
                        onClick={() => navigate("events")}
                      />
                      <SetupStep
                        done={data.setup.payments}
                        number="02"
                        label="Connect live payments"
                        onClick={() => navigate("settings")}
                      />
                      <SetupStep
                        done={data.setup.email}
                        number="03"
                        label="Set up ticket delivery"
                        onClick={() => navigate("settings")}
                      />
                      <span className="asterisk">✳</span>
                    </section>
                  </div>
                  <section className="panel">
                    <div className="panel-heading">
                      <h2>Recent orders</h2>
                      <button
                        className="text-button"
                        onClick={() => navigate("orders")}
                      >
                        All orders <ArrowUpRight size={14} />
                      </button>
                    </div>
                    {!data.orders.length ? (
                      <Empty
                        icon={Ticket}
                        title="Your first ticket is waiting to happen."
                        text="Once your event is published and payments are connected, purchases will appear here."
                      />
                    ) : (
                      <div className="mini-orders">
                        {data.orders.slice(0, 5).map((o) => (
                          <div key={o.id}>
                            <span>
                              <strong>{o.name}</strong>
                              <small>{o.email}</small>
                            </span>
                            <Status value={o.status} />
                            <strong>{money(o.amount)}</strong>
                          </div>
                        ))}
                      </div>
                    )}
                  </section>
                </>
              )}
              {view === "events" && (
                <section className="panel">
                  <div className="panel-heading">
                    <h2>
                      All events{" "}
                      <span className="count-badge">{data.events.length}</span>
                    </h2>
                    <span className="muted">
                      Drafts are private until published.
                    </span>
                  </div>
                  {data.events.map((event) => (
                    <EventRow
                      key={event.id}
                      event={event}
                      onEdit={() => setEditor(event)}
                    />
                  ))}
                </section>
              )}
              {view === "forms" && (
                <>
                  <div className="notice">
                    Name and email are always collected. Add text fields,
                    dropdowns, or consent checkboxes per event. Answers are
                    saved with each order.
                  </div>
                  <div className="form-cards">
                    {data.events.map((event) => (
                      <section className="panel form-card" key={event.id}>
                        <div className="panel-heading">
                          <FileText size={23} />
                          <Status value={event.status} />
                        </div>
                        <h2>{event.name}</h2>
                        <p className="muted">
                          Buyer registration form · {event.fields.length + 2}{" "}
                          fields
                        </p>
                        <div className="form-field-preview">
                          <span>
                            Full name <b>Required</b>
                          </span>
                          <span>
                            Email address <b>Required</b>
                          </span>
                          {event.fields.map((f) => (
                            <span key={f.id}>
                              {f.label}
                              <b>{f.required ? "Required" : "Optional"}</b>
                            </span>
                          ))}
                        </div>
                        <button
                          className="button secondary wide"
                          onClick={() => setEditor(event)}
                        >
                          Manage form <ArrowUpRight size={16} />
                        </button>
                      </section>
                    ))}
                  </div>
                </>
              )}
              {view === "orders" && (
                <section className="panel">
                  <div className="orders-toolbar">
                    <label className="search-field">
                      <Search size={17} />
                      <input
                        aria-label="Search orders"
                        placeholder="Search name, email, or reference…"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                      />
                    </label>
                    <select
                      aria-label="Filter orders by status"
                      value={status}
                      onChange={(e) => setStatus(e.target.value)}
                    >
                      <option value="all">All statuses</option>
                      {["paid", "pending", "failed", "review", "reversed"].map(
                        (s) => (
                          <option key={s}>{s}</option>
                        ),
                      )}
                    </select>
                    <a
                      className="button secondary small"
                      href="/api/admin/export"
                    >
                      <ArrowDownToLine size={16} />
                      Export CSV
                    </a>
                  </div>
                  {!orders.length ? (
                    <Empty
                      icon={Users}
                      title={
                        data.orders.length
                          ? "No orders match your search."
                          : "Meet your future guests."
                      }
                      text={
                        data.orders.length
                          ? "Try a different name or status."
                          : "Purchases and registration answers will appear here after checkout."
                      }
                    />
                  ) : (
                    <div className="table-wrap">
                      <table>
                        <thead>
                          <tr>
                            <th>Buyer / event</th>
                            <th>Tickets</th>
                            <th>Amount</th>
                            <th>Status</th>
                            <th>Delivery</th>
                            <th>Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {orders.map((o) => {
                            const snapshot = JSON.parse(o.snapshot);
                            return (
                              <tr key={o.id}>
                                <td>
                                  <strong>{o.name}</strong>
                                  <small>{o.email}</small>
                                  <small>{snapshot.eventName}</small>
                                  <details>
                                    <summary>Registration answers</summary>
                                    {JSON.parse(o.answers).map(
                                      (
                                        a: { label: string; value: unknown },
                                        i: number,
                                      ) => (
                                        <p key={i}>
                                          <b>{a.label}:</b> {String(a.value)}
                                        </p>
                                      ),
                                    )}
                                    <small>{o.reference}</small>
                                  </details>
                                </td>
                                <td>
                                  {o.quantity}
                                  <small>{snapshot.ticketName}</small>
                                </td>
                                <td>{money(o.amount)}</td>
                                <td>
                                  <Status value={o.status} />
                                  {o.status === "pending" &&
                                    o.expires_at <= Date.now() && (
                                      <small>Hold expired</small>
                                    )}
                                </td>
                                <td>
                                  <span
                                    className={`delivery-status ${o.email_status === "sent" ? "good" : ""}`}
                                  >
                                    {o.email_status}
                                  </span>
                                  {o.email_error && (
                                    <small>{o.email_error}</small>
                                  )}
                                </td>
                                <td>
                                  <div className="order-actions">
                                    <a href={o.url} target="_blank">
                                      View order ↗
                                    </a>
                                    <button
                                      disabled={
                                        pending === o.id || !data.setup.payments
                                      }
                                      onClick={() =>
                                        orderAction("verify_order", o.id)
                                      }
                                    >
                                      Verify payment
                                    </button>
                                    {o.status === "paid" && (
                                      <button
                                        disabled={
                                          pending === o.id ||
                                          o.email_status === "sent" ||
                                          !data.setup.email
                                        }
                                        onClick={() =>
                                          orderAction("resend_email", o.id)
                                        }
                                      >
                                        Retry email
                                      </button>
                                    )}
                                  </div>
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  )}
                  <div className="table-footer">
                    Showing {orders.length} of the latest {data.orders.length}{" "}
                    orders. CSV includes all orders.
                  </div>
                </section>
              )}
              {view === "checkin" && (
                <CheckIn events={data.events} onSuccess={refresh} />
              )}
              {view === "settings" && (
                <div className="settings-grid">
                  <section className="panel">
                    <div className="panel-heading">
                      <h2>Connections</h2>
                      <Settings2 size={19} />
                    </div>
                    <Connection
                      ready={data.setup.payments}
                      name="Paystack"
                      text="Live payments, securely collected in a popup."
                    />
                    <Connection
                      ready={data.setup.email}
                      name="Ticket email"
                      text="QR tickets and booking links delivered through Resend."
                    />
                    <div className="connection">
                      <span>
                        <strong>Data storage</strong>
                        <small>{data.setup.database}</small>
                      </span>
                      <span className="status published">Connected</span>
                    </div>
                  </section>
                  <section className="panel setup-guide">
                    <CircleHelp size={24} />
                    <h2>Before opening sales</h2>
                    <p>
                      Confirm the event date and venue, add ticket prices, then
                      publish. Cavic 2026 starts with a capacity of 200. Your
                      developer can configure Paystack, email delivery, and
                      scheduled payment checks in your server environment.
                    </p>
                    <p>
                      For the first version, check-in requires an internet
                      connection. Payments received after sold-out inventory
                      holds are flagged for organiser review.
                    </p>
                    <Link className="text-link" href="/" target="_blank">
                      Preview the buyer experience <ArrowUpRight size={15} />
                    </Link>
                  </section>
                </div>
              )}
            </>
          )}
          <footer className="dashboard-footer">
            <span>CAVIC / ORGANISER WORKSPACE</span>
            <span>Make every gathering count.</span>
          </footer>
        </div>
      </div>
    </div>
  );
}
function Status({ value }: { value: string }) {
  return <span className={`status ${value}`}>{value}</span>;
}
function Stat({
  label,
  value,
  caption,
  icon: Icon,
}: {
  label: string;
  value: string;
  caption: string;
  icon: typeof Ticket;
}) {
  return (
    <section className="stat-card">
      <div>
        <span className="eyebrow">{label}</span>
        <Icon size={17} />
      </div>
      <strong>{value}</strong>
      <small>{caption}</small>
    </section>
  );
}
function SetupStep({
  done,
  number,
  label,
  onClick,
}: {
  done: boolean;
  number: string;
  label: string;
  onClick: () => void;
}) {
  return (
    <button className="setup-step" onClick={onClick}>
      <span>{done ? <Check size={15} /> : number}</span>
      {label}
      <ChevronRight size={15} />
    </button>
  );
}
function Empty({
  icon: Icon,
  title,
  text,
}: {
  icon: typeof Ticket;
  title: string;
  text: string;
}) {
  return (
    <div className="empty-state">
      <span>
        <Icon size={23} />
      </span>
      <h3>{title}</h3>
      <p>{text}</p>
    </div>
  );
}
function Connection({
  ready,
  name,
  text,
}: {
  ready: boolean;
  name: string;
  text: string;
}) {
  return (
    <div className="connection">
      <span>
        <strong>{name}</strong>
        <small>{text}</small>
      </span>
      <span className={`status ${ready ? "published" : "draft"}`}>
        {ready ? "Connected" : "Needs setup"}
      </span>
    </div>
  );
}
function EventRow({ event, onEdit }: { event: Event; onEdit: () => void }) {
  const sold = event.tickets.reduce((a, t) => a + t.sold, 0);
  const capacity = event.tickets
    .filter((t) => t.active)
    .reduce((a, t) => a + t.capacity, 0);
  return (
    <div className="event-row">
      <div className="event-thumbnail">
        <span>✳</span>
      </div>
      <div className="event-row-info">
        <div>
          <h3>{event.name}</h3>
          {event.is_sample ? (
            <span className="sample-label">SAMPLE</span>
          ) : null}
        </div>
        <p>
          {eventDate(event.starts_at, event.ends_at)} · {event.city}
        </p>
        <div className="inventory-track">
          <span
            style={{
              width: `${Math.min(100, capacity ? (sold / capacity) * 100 : 0)}%`,
            }}
          />
        </div>
        <small>
          {sold} / {capacity} tickets sold
        </small>
      </div>
      <Status value={event.status} />
      <button className="button secondary small" onClick={onEdit}>
        Manage <ChevronRight size={14} />
      </button>
    </div>
  );
}

type EditorTicket = {
  id?: string;
  name: string;
  description: string;
  price: number;
  capacity: number;
  active: boolean;
};
function EventEditor({
  event,
  initialTab,
  onClose,
  onSaved,
}: {
  event?: Event;
  initialTab: "details" | "fields";
  onClose: () => void;
  onSaved: () => Promise<void>;
}) {
  const [tab, setTab] = useState<"details" | "tickets" | "fields">(initialTab);
  const [fields, setFields] = useState<FormField[]>(event?.fields || []);
  const [tickets, setTickets] = useState<EditorTicket[]>(
    event?.tickets
      .filter((t) => t.active)
      .map((t) => ({ ...t, active: Boolean(t.active) })) || [
      {
        name: "General admission",
        description: "",
        price: 0,
        capacity: 200,
        active: true,
      },
    ],
  );
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const form = useRef<HTMLFormElement>(null);
  function patchField(i: number, patch: Partial<FormField>) {
    setFields((old) =>
      old.map((f, index) => (index === i ? { ...f, ...patch } : f)),
    );
  }
  function patchTicket(i: number, patch: Partial<EditorTicket>) {
    setTickets((old) =>
      old.map((t, index) => (index === i ? { ...t, ...patch } : t)),
    );
  }
  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setBusy(true);
    setError("");
    const values = new FormData(e.currentTarget);
    try {
      await api({
        action: "save_event",
        event: {
          id: event?.id,
          name: values.get("name"),
          slug: values.get("slug"),
          description: values.get("description"),
          venue: values.get("venue"),
          city: values.get("city"),
          category: values.get("category"),
          starts_at: values.get("starts_at")
            ? `${values.get("starts_at")}:00+01:00`
            : "",
          ends_at: values.get("ends_at")
            ? `${values.get("ends_at")}:00+01:00`
            : "",
          capacity: Number(values.get("capacity")),
          status: values.get("status"),
          is_sample: values.get("is_sample") === "on",
          fields,
          tickets,
        },
      });
      await onSaved();
    } catch (error) {
      setError(
        error instanceof Error ? error.message : "Could not save event.",
      );
    } finally {
      setBusy(false);
    }
  }
  const localDate = event?.starts_at
    ? new Date(new Date(event.starts_at).getTime() + 3600000)
        .toISOString()
        .slice(0, 16)
    : "";
  const localEnd = event?.ends_at
    ? new Date(new Date(event.ends_at).getTime() + 3600000)
        .toISOString()
        .slice(0, 16)
    : "";
  return (
    <>
      <button className="back-button" onClick={onClose}>
        <ArrowLeft size={16} />
        Back to workspace
      </button>
      <div className="page-title">
        <div>
          <span className="eyebrow">THE DETAILS MAKE THE DIFFERENCE</span>
          <h1>{event ? "Make it yours." : "A new experience."}</h1>
          <p>Event details, ticket options, and your registration form.</p>
        </div>
        {event && (
          <a
            className="button secondary"
            target="_blank"
            href={
              event.id === "cavic-2026"
                ? "/2026#tickets"
                : `/events/${event.slug}`
            }
          >
            Preview event <ArrowUpRight size={16} />
          </a>
        )}
      </div>
      <form ref={form} onSubmit={submit} className="event-editor">
        <div
          className="editor-tabs"
          role="tablist"
          aria-label="Event editor sections"
        >
          {(["details", "tickets", "fields"] as const).map((t) => (
            <button
              key={t}
              type="button"
              role="tab"
              aria-selected={tab === t}
              className={tab === t ? "active" : ""}
              onClick={() => setTab(t)}
            >
              {t === "details"
                ? "01 / Event details"
                : t === "tickets"
                  ? "02 / Ticket types"
                  : "03 / Registration form"}
            </button>
          ))}
        </div>
        <div className="editor-section" hidden={tab !== "details"}>
          <section className="panel editor-panel">
            <h2>The essentials</h2>
            <div className="editor-grid">
              <label className="field full">
                Event name
                <input
                  name="name"
                  defaultValue={event?.name || ""}
                  required
                  minLength={3}
                  maxLength={120}
                />
              </label>
              <label className="field full">
                Event URL
                <input
                  name="slug"
                  defaultValue={event?.slug || ""}
                  required
                  pattern="[a-z0-9]+(-[a-z0-9]+)*"
                  maxLength={80}
                  placeholder="your-event-name"
                />
                <small>Lowercase letters, numbers, and hyphens.</small>
              </label>
              <label className="field full">
                Description
                <textarea
                  name="description"
                  defaultValue={event?.description || ""}
                  rows={5}
                  required
                  minLength={10}
                  maxLength={5000}
                />
              </label>
              <label className="field">
                Venue
                <input
                  name="venue"
                  defaultValue={event?.venue || ""}
                  placeholder="Confirm the festival venue"
                />
              </label>
              <label className="field">
                City
                <input
                  name="city"
                  defaultValue={event?.city || ""}
                  required
                  minLength={2}
                />
              </label>
              <label className="field">
                Start date & time (WAT)
                <input
                  type="datetime-local"
                  name="starts_at"
                  defaultValue={localDate}
                />
              </label>
              <label className="field">
                End date & time (WAT)
                <input
                  type="datetime-local"
                  name="ends_at"
                  defaultValue={localEnd}
                />
                <small>
                  Ticket sales stay open until this time. Leave blank to close
                  at the start.
                </small>
              </label>
              <label className="field">
                Total event capacity
                <input
                  type="number"
                  name="capacity"
                  min={1}
                  max={100000}
                  defaultValue={event?.capacity || 200}
                  required
                />
                <small>Shared across all ticket types.</small>
              </label>
              <label className="field">
                Category
                <input
                  name="category"
                  defaultValue={event?.category || "Creativity & technology"}
                  required
                />
              </label>
            </div>
          </section>
          <section className="panel editor-panel">
            <h2>Publishing</h2>
            <label className="field">
              Visibility
              <select name="status" defaultValue={event?.status || "draft"}>
                <option value="draft">Draft — private</option>
                <option value="published">Published — tickets on sale</option>
                <option value="archived">Archived — sales closed</option>
              </select>
            </label>
            <label className="check-field">
              <input
                name="is_sample"
                type="checkbox"
                defaultChecked={Boolean(event?.is_sample)}
              />
              Sample event (cannot accept payment)
            </label>
            <p className="muted">
              Drafts can be saved while details are pending. Publishing requires
              a future date, venue and priced tickets.
            </p>
          </section>
        </div>
        <section className="panel editor-panel" hidden={tab !== "tickets"}>
          <div className="panel-heading">
            <div>
              <h2>A ticket for every experience.</h2>
              <p className="muted">
                Prices are in NGN. The checkout uses prices saved here.
              </p>
            </div>
            <button
              className="button secondary small"
              type="button"
              disabled={tickets.length >= 10}
              onClick={() =>
                setTickets((old) => [
                  ...old,
                  {
                    name: "",
                    description: "",
                    price: 0,
                    capacity: 200,
                    active: true,
                  },
                ])
              }
            >
              <Plus size={15} />
              Add ticket type
            </button>
          </div>
          {tickets.map((ticket, i) => (
            <div className="ticket-editor-row" key={ticket.id || i}>
              <span className="row-number">
                {String(i + 1).padStart(2, "0")}
              </span>
              <div className="editor-grid">
                <label className="field">
                  Ticket name
                  <input
                    value={ticket.name}
                    onChange={(e) => patchTicket(i, { name: e.target.value })}
                  />
                </label>
                <label className="field">
                  Ticket description
                  <input
                    value={ticket.description}
                    onChange={(e) =>
                      patchTicket(i, { description: e.target.value })
                    }
                  />
                </label>
                <label className="field">
                  Price (₦)
                  <input
                    type="number"
                    min={0}
                    step="0.01"
                    value={ticket.price / 100}
                    onChange={(e) =>
                      patchTicket(i, {
                        price: Math.round(Number(e.target.value) * 100),
                      })
                    }
                  />
                </label>
                <label className="field">
                  Capacity
                  <input
                    type="number"
                    min={1}
                    value={ticket.capacity}
                    onChange={(e) =>
                      patchTicket(i, { capacity: Number(e.target.value) })
                    }
                  />
                </label>
              </div>
              <button
                className="icon-button"
                type="button"
                aria-label={`Remove ticket type ${i + 1}`}
                disabled={tickets.length <= 1}
                onClick={() =>
                  setTickets((old) => old.filter((_, index) => i !== index))
                }
              >
                <Trash2 size={17} />
              </button>
            </div>
          ))}
          <p className="muted">
            Removing a ticket type closes new sales. Existing orders and issued
            tickets are retained.
          </p>
        </section>
        <section className="panel editor-panel" hidden={tab !== "fields"}>
          <div className="panel-heading">
            <div>
              <h2>Your buyer registration form.</h2>
              <p className="muted">
                These fields appear at checkout. One response is collected per
                order.
              </p>
            </div>
            <button
              className="button secondary small"
              type="button"
              disabled={fields.length >= 12}
              onClick={() =>
                setFields((old) => [
                  ...old,
                  {
                    id: crypto.randomUUID(),
                    label: "",
                    type: "text",
                    required: false,
                    options: [],
                  },
                ])
              }
            >
              <Plus size={15} />
              Add field
            </button>
          </div>
          <div className="locked-fields">
            <span>
              Full name <b>Always required</b>
            </span>
            <span>
              Email address <b>Always required</b>
            </span>
          </div>
          {fields.map((field, i) => (
            <div className="custom-field-row" key={field.id}>
              <span className="row-number">
                {String(i + 3).padStart(2, "0")}
              </span>
              <div className="custom-field-inputs">
                <div className="editor-grid">
                  <label className="field">
                    Field label
                    <input
                      value={field.label}
                      onChange={(e) => patchField(i, { label: e.target.value })}
                    />
                  </label>
                  <label className="field">
                    Field type
                    <select
                      value={field.type}
                      onChange={(e) =>
                        patchField(i, {
                          type: e.target.value as FormField["type"],
                        })
                      }
                    >
                      <option value="text">Text answer</option>
                      <option value="select">Dropdown</option>
                      <option value="checkbox">Checkbox</option>
                    </select>
                  </label>
                </div>
                {field.type === "select" && (
                  <label className="field">
                    Options (one per line)
                    <textarea
                      value={field.options.join("\n")}
                      rows={3}
                      onChange={(e) =>
                        patchField(i, { options: e.target.value.split("\n") })
                      }
                    />
                  </label>
                )}
                <label className="check-field">
                  <input
                    type="checkbox"
                    checked={field.required}
                    onChange={(e) =>
                      patchField(i, { required: e.target.checked })
                    }
                  />
                  Required field
                </label>
              </div>
              <button
                className="icon-button"
                type="button"
                aria-label={`Remove field ${i + 1}`}
                onClick={() =>
                  setFields((old) => old.filter((_, index) => i !== index))
                }
              >
                <Trash2 size={17} />
              </button>
            </div>
          ))}
          {!fields.length && (
            <p className="notice">
              A simple start: just name and email. Add fields when you need more
              information.
            </p>
          )}
        </section>
        {error && (
          <p role="alert" className="notice error">
            {error}
          </p>
        )}
        <div className="editor-save">
          <span>All sections save together.</span>
          <button className="button secondary" type="button" onClick={onClose}>
            Cancel
          </button>
          <button
            className="button"
            type="submit"
            disabled={busy}
            onClick={() => {
              if (form.current && !form.current.checkValidity())
                setTab("details");
            }}
          >
            {busy ? "Saving…" : "Save changes"}
            <Check size={17} />
          </button>
        </div>
      </form>
    </>
  );
}

function CheckIn({
  events,
  onSuccess,
}: {
  events: Event[];
  onSuccess: () => Promise<void>;
}) {
  const [eventId, setEventId] = useState(events[0]?.id || "");
  const [token, setToken] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const [camera, setCamera] = useState(false);
  const video = useRef<HTMLVideoElement>(null);
  const stream = useRef<MediaStream | null>(null);
  const frame = useRef<number>(0);
  function stop() {
    stream.current?.getTracks().forEach((t) => t.stop());
    stream.current = null;
    cancelAnimationFrame(frame.current);
    setCamera(false);
  }
  useEffect(
    () => () => {
      stream.current?.getTracks().forEach((t) => t.stop());
      cancelAnimationFrame(frame.current);
    },
    [],
  );
  async function admit(value: string) {
    stop();
    setBusy(true);
    setError("");
    setMessage("");
    try {
      const data = await api({
        action: "checkin",
        eventId,
        token: value.trim(),
      });
      setMessage(
        `Welcome, ${data.name}. ${data.ticketName} — checked in successfully.`,
      );
      setToken("");
      await onSuccess();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not validate ticket.");
    } finally {
      setBusy(false);
    }
  }
  async function start() {
    setError("");
    setMessage("");
    setCamera(true);
    try {
      const jsQR = (await import("jsqr")).default;
      stream.current = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment", width: { ideal: 640 } },
      });
      if (!video.current) {
        stop();
        return;
      }
      video.current.srcObject = stream.current;
      await video.current.play();
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d", { willReadFrequently: true })!;
      function scan() {
        if (!video.current || !stream.current) return;
        if (video.current.readyState >= 2) {
          canvas.width = video.current.videoWidth;
          canvas.height = video.current.videoHeight;
          ctx.drawImage(video.current, 0, 0, canvas.width, canvas.height);
          const pixels = ctx.getImageData(0, 0, canvas.width, canvas.height);
          const code = jsQR(pixels.data, pixels.width, pixels.height);
          if (code) {
            void admit(code.data);
            return;
          }
        }
        frame.current = requestAnimationFrame(scan);
      }
      scan();
    } catch {
      stop();
      setError(
        "Camera access was unavailable. Allow camera access on HTTPS, or paste the ticket token below.",
      );
    }
  }
  return (
    <div className="checkin-layout">
      <section className="panel scanner-panel">
        <label className="field">
          Event
          <select
            value={eventId}
            onChange={(e) => {
              stop();
              setEventId(e.target.value);
            }}
          >
            {events.map((e) => (
              <option key={e.id} value={e.id}>
                {e.name}
              </option>
            ))}
          </select>
        </label>
        <div className="scanner-frame">
          {camera ? (
            <video
              ref={video}
              muted
              playsInline
              aria-label="Ticket scanner camera"
            />
          ) : (
            <>
              <QrCode size={78} strokeWidth={1} />
              <h2>Ready to welcome guests.</h2>
              <p>Point your camera at the guest’s QR code.</p>
            </>
          )}
          <span className="scan-corner tl" />
          <span className="scan-corner tr" />
          <span className="scan-corner bl" />
          <span className="scan-corner br" />
        </div>
        <button
          className="button wide"
          disabled={busy || !eventId}
          onClick={camera ? stop : start}
        >
          <QrCode size={18} />
          {camera ? "Stop camera" : "Open camera scanner"}
        </button>
        {message && (
          <p role="status" className="notice success">
            {message}
          </p>
        )}
        {error && (
          <p role="alert" className="notice error">
            {error}
          </p>
        )}
      </section>
      <section className="panel manual-checkin">
        <span className="eyebrow">ANOTHER WAY IN</span>
        <h2>Using a handheld scanner?</h2>
        <p className="muted">
          Scan into this field, or paste the QR token. Each successful check-in
          admits one guest immediately.
        </p>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            void admit(token);
          }}
        >
          <label className="field">
            Ticket token
            <textarea
              value={token}
              onChange={(e) => setToken(e.target.value)}
              required
              rows={4}
              placeholder="Paste or scan the ticket token…"
            />
          </label>
          <button className="button secondary wide" disabled={busy || !eventId}>
            Validate & check in <Check size={17} />
          </button>
        </form>
        <div className="notice">
          Check-in requires internet. Tickets from other events, altered codes,
          and previously used tickets are rejected.
        </div>
      </section>
    </div>
  );
}
