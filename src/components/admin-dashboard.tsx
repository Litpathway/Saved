"use client";
import { useState, useEffect, useCallback } from "react";
import { signOut } from "next-auth/react";
import { Plus, ArrowUpRight, RefreshCw } from "lucide-react";
type Shipment = {
  id: string;
  trackingNumber: string;
  origin: string;
  destination: string;
  method: string;
  status: string;
  estimatedDelivery: string | null;
  updatedAt: string;
};
type Enquiry = {
  id: string;
  kind: string;
  name: string;
  email: string;
  phone: string;
  origin: string;
  destination: string;
  method: string;
  cargo: string;
  weight: string;
  dimensions: string;
  message: string;
  status: string;
  createdAt: string;
};
type Knowledge = {
  id: string;
  question: string;
  answer: string;
  published: boolean;
};
type Data = {
  shipments: Shipment[];
  enquiries: Enquiry[];
  knowledge: Knowledge[];
  statuses: string[];
  audits: {
    id: string;
    actor: string;
    action: string;
    entityId: string;
    createdAt: string;
  }[];
};
export function AdminDashboard({ role }: { role: string }) {
  const [tab, setTab] = useState("Shipments");
  const [data, setData] = useState<Data | null>(null);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("");
  const [edit, setEdit] = useState<Shipment | null>(null);
  const [kb, setKb] = useState<Knowledge | null>(null);
  const [busy, setBusy] = useState(false);
  const load = useCallback(async () => {
    try {
      const r = await fetch("/api/admin");
      const d = await r.json();
      if (!r.ok) throw new Error(d.error);
      setData(d);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Unable to load dashboard.");
    }
  }, []);
  useEffect(() => {
    load();
  }, [load]);
  async function save(body: unknown) {
    setBusy(true);
    setError("");
    setNotice("");
    try {
      const r = await fetch("/api/admin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const result = await r.json();
      if (!r.ok) throw new Error(result.error);
      setNotice(
        "Changes saved. Shipment updates are immediately available in public tracking.",
      );
      await load();
      return true;
    } catch (e) {
      setError(e instanceof Error ? e.message : "Unable to save.");
      return false;
    } finally {
      setBusy(false);
    }
  }
  return (
    <section className="admin-shell">
      <div className="admin-title">
        <div>
          <span className="tiny">SAVELANDED OPERATIONS · {role}</span>
          <h1>Your control centre.</h1>
          <p>
            Manage shipments, customer enquiries, and approved support
            information.
          </p>
        </div>
        <button
          className="pill pill-dark"
          onClick={() => signOut({ callbackUrl: "/admin/login" })}
        >
          Sign out <ArrowUpRight size={16} />
        </button>
      </div>
      {error && (
        <div role="alert" className="error">
          {error}
          <button onClick={load} className="pill">
            Retry <RefreshCw size={14} />
          </button>
        </div>
      )}
      {notice && (
        <div className="notice" role="status">
          {notice}
        </div>
      )}
      {!data ? (
        <p className="admin-empty">Loading operations…</p>
      ) : (
        <>
          <div className="admin-counts">
            <div>
              <strong>{data.shipments.length}</strong>Recent shipments
            </div>
            <div>
              <strong>
                {data.enquiries.filter((e) => e.status === "NEW").length}
              </strong>
              New enquiries
            </div>
            <div>
              <strong>
                {data.knowledge.filter((k) => k.published).length}
              </strong>
              Approved articles
            </div>
          </div>
          <div
            className="admin-tabs"
            role="tablist"
            aria-label="Administration sections"
          >
            {[
              "Shipments",
              "Enquiries",
              "Knowledge",
              "Statuses",
              "Audit log",
            ].map((t) => (
              <button
                key={t}
                role="tab"
                aria-selected={tab === t}
                className={tab === t ? "active" : ""}
                onClick={() => {
                  setTab(t);
                  setSearch("");
                  setFilter("");
                }}
              >
                {t}
              </button>
            ))}
          </div>
          {tab === "Shipments" && (
            <div className="admin-grid">
              <div className="admin-panel">
                <h2>Shipment records</h2>
                <input
                  aria-label="Search shipments"
                  placeholder="Search tracking number, origin, or destination"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
                <select
                  aria-label="Filter shipment status"
                  value={filter}
                  onChange={(e) => setFilter(e.target.value)}
                  style={{ marginTop: 10 }}
                >
                  <option value="">All statuses</option>
                  {data.statuses.map((s) => (
                    <option key={s}>{s}</option>
                  ))}
                </select>
                <div className="record-list">
                  {data.shipments
                    .filter(
                      (s) =>
                        (!filter || s.status === filter) &&
                        `${s.trackingNumber} ${s.origin} ${s.destination}`
                          .toLowerCase()
                          .includes(search.toLowerCase()),
                    )
                    .map((s) => (
                      <article key={s.id} className="record">
                        <h3>{s.trackingNumber}</h3>
                        <p>
                          {s.origin} → {s.destination}
                        </p>
                        <p>
                          {s.method} · {s.status}
                        </p>
                        <button onClick={() => setEdit(s)}>
                          Edit / add milestone
                        </button>{" "}
                        <a
                          className="text-link"
                          href={`/track?number=${s.trackingNumber}`}
                          target="_blank"
                          rel="noreferrer"
                        >
                          Public tracking ↗
                        </a>
                      </article>
                    ))}
                  {!data.shipments.length && (
                    <p className="admin-empty">
                      No shipments yet. Create the first record to generate a
                      tracking number.
                    </p>
                  )}
                </div>
              </div>
              <form
                key={edit?.id ?? "new"}
                className="admin-panel"
                onSubmit={async (e) => {
                  e.preventDefault();
                  const form = e.currentTarget;
                  const values = Object.fromEntries(new FormData(form));
                  if (
                    await save({ ...values, action: "shipment", id: edit?.id })
                  ) {
                    setEdit(null);
                    form.reset();
                  }
                }}
              >
                <h2>{edit ? "Update shipment" : "Create a shipment"}</h2>
                {edit && (
                  <p className="form-note">
                    {edit.trackingNumber}{" "}
                    <button type="button" onClick={() => setEdit(null)}>
                      Cancel editing
                    </button>
                  </p>
                )}
                <div className="form-grid">
                  <label>
                    Origin
                    <input
                      name="origin"
                      required
                      maxLength={160}
                      defaultValue={edit?.origin}
                    />
                  </label>
                  <label>
                    Destination
                    <input
                      name="destination"
                      required
                      maxLength={160}
                      defaultValue={edit?.destination}
                    />
                  </label>
                  <label>
                    Shipping method
                    <input
                      name="method"
                      required
                      maxLength={60}
                      defaultValue={edit?.method}
                      placeholder="Confirmed shipping method"
                    />
                  </label>
                  <label>
                    Status
                    <select
                      name="status"
                      defaultValue={edit?.status ?? data.statuses[0]}
                    >
                      {data.statuses.map((s) => (
                        <option key={s}>{s}</option>
                      ))}
                    </select>
                  </label>
                  <label className="full">
                    Estimated delivery date
                    <input
                      type="date"
                      name="estimatedDelivery"
                      defaultValue={edit?.estimatedDelivery?.slice(0, 10) ?? ""}
                    />
                  </label>
                  <label className="full">
                    Public milestone note
                    <textarea
                      name="note"
                      maxLength={500}
                      placeholder="Do not include customer names, addresses, or private information."
                    />
                  </label>
                </div>
                <p className="form-note">
                  Saving records a timestamped milestone and an audit entry.
                  Origin and destination should be cities/regions, never private
                  street addresses.
                </p>
                <button className="pill pill-dark" disabled={busy}>
                  {busy ? "Saving…" : edit ? "Save update" : "Create shipment"}
                  <Plus size={17} />
                </button>
              </form>
            </div>
          )}
          {tab === "Enquiries" && (
            <div className="admin-panel">
              <h2>Customer enquiries</h2>
              <select
                aria-label="Filter enquiry status"
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
              >
                <option value="">All enquiries</option>
                <option>NEW</option>
                <option>IN_PROGRESS</option>
                <option>RESOLVED</option>
              </select>
              <div className="record-list">
                {data.enquiries
                  .filter((e) => !filter || e.status === filter)
                  .map((e) => (
                    <article className="record" key={e.id}>
                      <h3>
                        {e.kind} · {e.name}
                      </h3>
                      <p>
                        Reference: {e.id} ·{" "}
                        {new Date(e.createdAt).toLocaleString()}
                      </p>
                      <p>
                        <a href={`mailto:${e.email}`}>{e.email}</a>{" "}
                        {e.phone && (
                          <>
                            {" "}
                            · <a href={`tel:${e.phone}`}>{e.phone}</a>
                          </>
                        )}
                      </p>
                      {e.kind === "QUOTE" && (
                        <>
                          <p>
                            {e.origin} → {e.destination} · {e.method}
                          </p>
                          <p>Cargo: {e.cargo}</p>
                          <p>
                            Weight: {e.weight || "Not specified"} · Dimensions:{" "}
                            {e.dimensions || "Not specified"}
                          </p>
                        </>
                      )}
                      <p style={{ whiteSpace: "pre-wrap" }}>{e.message}</p>
                      <select
                        aria-label={`Status for enquiry ${e.id}`}
                        value={e.status}
                        disabled={busy}
                        onChange={(event) =>
                          save({
                            action: "enquiry",
                            id: e.id,
                            status: event.target.value,
                          })
                        }
                      >
                        <option>NEW</option>
                        <option>IN_PROGRESS</option>
                        <option>RESOLVED</option>
                      </select>{" "}
                      <a
                        className="text-link"
                        href={`mailto:${e.email}?subject=${encodeURIComponent("Your Savelanded enquiry " + e.id)}`}
                      >
                        Reply by email ↗
                      </a>
                    </article>
                  ))}
                {!data.enquiries.length && (
                  <p className="admin-empty">No customer enquiries yet.</p>
                )}
              </div>
            </div>
          )}
          {tab === "Knowledge" && (
            <>
              <div className="notice">
                Only approved articles are supplied to the AI assistant.
                Conversations are not retained by this application. Do not add
                personal data, unverified policies, or instructions to articles.
              </div>
              <div className="admin-grid">
                <div className="admin-panel">
                  <h2>Company knowledge</h2>
                  {data.knowledge.map((k) => (
                    <article className="record" key={k.id}>
                      <h3>{k.question}</h3>
                      <p>{k.answer}</p>
                      <p>{k.published ? "Approved and published" : "Draft"}</p>
                      {role === "OWNER" && (
                        <button onClick={() => setKb(k)}>Edit article</button>
                      )}
                    </article>
                  ))}
                  {!data.knowledge.length && (
                    <p className="admin-empty">
                      No company articles yet. The assistant uses the built-in
                      website FAQ.
                    </p>
                  )}
                </div>
                {role === "OWNER" && (
                  <form
                    key={kb?.id ?? "new-article"}
                    className="admin-panel"
                    onSubmit={async (e) => {
                      e.preventDefault();
                      const form = e.currentTarget;
                      const values = Object.fromEntries(new FormData(form));
                      if (
                        await save({
                          ...values,
                          published: values.published === "on",
                          id: kb?.id,
                          action: "knowledge",
                        })
                      ) {
                        setKb(null);
                        form.reset();
                      }
                    }}
                  >
                    <h2>{kb ? "Edit article" : "Add verified information"}</h2>
                    <label>
                      Question
                      <input
                        name="question"
                        minLength={3}
                        maxLength={300}
                        required
                        defaultValue={kb?.question}
                      />
                    </label>
                    <label>
                      Approved answer
                      <textarea
                        name="answer"
                        required
                        minLength={3}
                        maxLength={3000}
                        rows={6}
                        defaultValue={kb?.answer}
                      />
                    </label>
                    <label
                      style={{ display: "flex", gap: 12, alignItems: "center" }}
                    >
                      <input
                        name="published"
                        type="checkbox"
                        defaultChecked={kb?.published}
                        style={{ width: 18, margin: 0 }}
                      />
                      I have verified this information
                    </label>
                    <button className="pill pill-dark" disabled={busy}>
                      Save article <Plus size={16} />
                    </button>
                    {kb && (
                      <button
                        type="button"
                        className="pill"
                        onClick={() => setKb(null)}
                      >
                        Cancel
                      </button>
                    )}
                  </form>
                )}
              </div>
            </>
          )}
          {tab === "Statuses" && (
            <div className="admin-panel">
              <h2>Shipping statuses</h2>
              <p className="form-note">
                Existing status names remain in historical milestones. Add new
                statuses when required.
              </p>
              {data.statuses.map((s, i) => (
                <div className="audit-line" key={s}>
                  {String(i + 1).padStart(2, "0")} — {s}
                </div>
              ))}
              {role === "OWNER" && (
                <form
                  onSubmit={async (e) => {
                    e.preventDefault();
                    const form = e.currentTarget;
                    if (
                      await save({
                        action: "status",
                        name: new FormData(form).get("name"),
                      })
                    )
                      form.reset();
                  }}
                >
                  <label>
                    New status name
                    <input name="name" minLength={2} maxLength={80} required />
                  </label>
                  <button className="pill pill-dark" disabled={busy}>
                    Add status <Plus size={16} />
                  </button>
                </form>
              )}
            </div>
          )}
          {tab === "Audit log" && (
            <div className="admin-panel">
              <h2>Recent audit entries</h2>
              <p className="form-note">
                Latest 50 changes. Audit entries are created atomically with
                each modification.
              </p>
              {data.audits.map((a) => (
                <div className="audit-line" key={a.id}>
                  <strong>{a.action}</strong> · {a.actor}
                  <br />
                  {a.entityId}
                  <time>{new Date(a.createdAt).toLocaleString()}</time>
                </div>
              ))}
              {!data.audits.length && <p>No changes recorded yet.</p>}
            </div>
          )}
        </>
      )}
    </section>
  );
}
