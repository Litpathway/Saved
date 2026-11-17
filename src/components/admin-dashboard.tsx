"use client";
import { useState, useEffect, useCallback, useRef } from "react";
import Link from "next/link";
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
  loadedAt: string | null;
  automaticTracking: boolean;
  manualOverride: boolean;
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
const previewData: Data = {
  shipments: [
    {
      id: "sample-sea",
      trackingNumber: "SL-DE00000000000001",
      origin: "Yiwu",
      destination: "Lagos",
      method: "Sea",
      status: "In Transit",
      estimatedDelivery: null,
      loadedAt: null,
      automaticTracking: false,
      manualOverride: false,
      updatedAt: "2026-11-15T09:00:00Z",
    },
    {
      id: "sample-air",
      trackingNumber: "SL-DE00000000000002",
      origin: "Guangzhou",
      destination: "Lagos",
      method: "Air",
      status: "Processing at Warehouse",
      estimatedDelivery: null,
      loadedAt: null,
      automaticTracking: false,
      manualOverride: false,
      updatedAt: "2026-11-15T08:00:00Z",
    },
  ],
  statuses: [
    "Shipment Registered",
    "Processing at Warehouse",
    "In Transit",
    "Customs Clearance",
    "Delivered",
  ],
  enquiries: [],
  knowledge: [],
  audits: [],
};
export function AdminDashboard({
  role,
  trackingOnly = false,
  preview = false,
  localAccess = false,
}: {
  role: string;
  trackingOnly?: boolean;
  preview?: boolean;
  localAccess?: boolean;
}) {
  const editorForm = useRef<HTMLFormElement>(null);
  const [tab, setTab] = useState("Shipments");
  const [data, setData] = useState<Data | null>(preview ? previewData : null);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [savedTracking, setSavedTracking] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("");
  const [edit, setEdit] = useState<Shipment | null>(null);
  const [automatic, setAutomatic] = useState(false);
  const [override, setOverride] = useState(false);
  const [kb, setKb] = useState<Knowledge | null>(null);
  const [busy, setBusy] = useState(false);
  const load = useCallback(async () => {
    if (preview) return;
    try {
      const r = await fetch("/api/admin");
      const d = await r.json();
      if (!r.ok) throw new Error(d.error);
      setData(d);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Unable to load dashboard.");
    }
  }, [preview]);
  useEffect(() => {
    load();
  }, [load]);
  async function save(body: unknown) {
    if (preview) {
      const values = body as Record<string, string>;
      const item: Shipment = {
        id: values.id || crypto.randomUUID(),
        trackingNumber:
          data?.shipments.find((s) => s.id === values.id)?.trackingNumber ||
          "SL-" +
            crypto.randomUUID().replaceAll("-", "").slice(0, 16).toUpperCase(),
        origin: values.origin,
        destination: values.destination,
        method: values.method,
        status: values.status,
        estimatedDelivery: values.estimatedDelivery || null,
        loadedAt: values.loadedAt || null,
        automaticTracking: values.automaticTracking === "true",
        manualOverride: values.manualOverride === "true",
        updatedAt: new Date().toISOString(),
      };
      setData(
        (current) =>
          current && {
            ...current,
            shipments: [
              item,
              ...current.shipments.filter((s) => s.id !== item.id),
            ],
          },
      );
      setNotice(
        "Preview changes only. No live tracking records have been saved. Refresh to reset the sample data.",
      );
      return true;
    }
    setBusy(true);
    setError("");
    setNotice("");
    setSavedTracking(null);
    try {
      const r = await fetch("/api/admin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const result = await r.json();
      if (!r.ok) throw new Error(result.error);
      if (result.trackingNumber) setSavedTracking(result.trackingNumber);
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
    <section className={`admin-shell ${trackingOnly ? "tracking-cms" : ""}`}>
      <div className="admin-title">
        <div>
          <span className="tiny">SAVELANDED OPERATIONS · {role}</span>
          <h1>{trackingOnly ? "Edit tracking." : "Your control centre."}</h1>
          <p>
            {trackingOnly
              ? "Create tracking records, update shipment statuses, and publish journey milestones."
              : "Manage shipments, customer enquiries, and approved support information."}
          </p>
        </div>
        {!preview && !localAccess && (
          <button
            className="pill pill-dark"
            onClick={() => signOut({ callbackUrl: "/admin/login" })}
          >
            Sign out <ArrowUpRight size={16} />
          </button>
        )}
      </div>
      {localAccess && (
        <div className="notice" role="note">
          Local development. Changes are saved to this computer?s database and
          appear in public tracking.
        </div>
      )}
      {preview && (
        <div className="notice" role="note">
          <strong>Preview with sample data.</strong> Explore the editor now.
          Changes stay in this browser session and reset on refresh. Live
          tracking access will be enabled after administrator setup.
        </div>
      )}
      <div className="cms-navigation">
        <Link href={preview ? "/" : trackingOnly ? "/admin" : "/edit-tracking"}>
          {preview
            ? "Back to website"
            : trackingOnly
              ? "All administration"
              : "Open tracking CMS"}{" "}
          <ArrowUpRight size={16} />
        </Link>
        <Link href="/track">
          Public tracking <ArrowUpRight size={16} />
        </Link>
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
          {savedTracking && (
            <p style={{ margin: "12px 0 0" }}>
              <strong>{savedTracking}</strong>
              {" ? "}
              <Link
                className="text-link"
                href={`/track?number=${encodeURIComponent(savedTracking)}`}
              >
                View shipment tracking <ArrowUpRight size={16} />
              </Link>
            </p>
          )}
        </div>
      )}
      {!data ? (
        <p className="admin-empty">Loading operations…</p>
      ) : (
        <>
          {!trackingOnly && (
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
          )}
          {!trackingOnly && (
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
          )}
          {tab === "Shipments" && (
            <div className="admin-grid">
              <div className="admin-panel">
                <div className="cms-record-heading">
                  <h2>Tracking records</h2>
                  <button
                    type="button"
                    onClick={() => {
                      setEdit(null);
                      setAutomatic(false);
                      setOverride(false);
                      editorForm.current?.reset();
                    }}
                    disabled={busy}
                  >
                    New record <Plus size={16} />
                  </button>
                </div>
                <p className="form-note">
                  Search the latest 200 shipment records.
                </p>
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
                {data.shipments.length > 0 &&
                  !data.shipments.some(
                    (s) =>
                      (!filter || s.status === filter) &&
                      `${s.trackingNumber} ${s.origin} ${s.destination}`
                        .toLowerCase()
                        .includes(search.toLowerCase()),
                  ) && (
                    <p className="admin-empty">
                      No tracking records match your search.
                    </p>
                  )}
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
                      <article
                        key={s.id}
                        className={`record ${edit?.id === s.id ? "record-selected" : ""}`}
                      >
                        <h3>{s.trackingNumber}</h3>
                        <p>
                          {s.origin} → {s.destination}
                        </p>
                        <p>
                          {s.method} · {s.status}
                        </p>
                        <button disabled={busy} onClick={() => { setEdit(s); setAutomatic(s.automaticTracking); setOverride(s.manualOverride); }}>
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
                ref={editorForm}
                aria-label="Tracking record editor"
                aria-busy={busy}
                key={edit?.id ?? "new"}
                className="admin-panel"
                onSubmit={async (e) => {
                  e.preventDefault();
                  const form = e.currentTarget;
                  const values = Object.fromEntries(new FormData(form));
                  const manifest = String(values.trackingNumber ?? "").trim().toUpperCase();
                  if (manifest && !/^(?:SL-[A-F0-9]{16}|(?:SL|GZ)\d{6,7})$/.test(manifest)) {
                    setError("Enter a complete manifest number: SL or GZ followed by 6 or 7 digits.");
                    form.elements.namedItem("trackingNumber") instanceof HTMLElement &&
                      (form.elements.namedItem("trackingNumber") as HTMLElement).focus();
                    return;
                  }
                  if (
                    await save({ ...values, action: "shipment", id: edit?.id })
                  ) {
                    setEdit(null);
                    setAutomatic(false);
                    setOverride(false);
                    form.reset();
                  }
                }}
              >
                <h2>{edit ? "Update tracking" : "Create a tracking record"}</h2>
                {!edit && (
                  <p className="form-note">
                    Enter a Yiwu or Guangzhou manifest number (SL or GZ plus 6 or 7 digits), or leave it blank to generate a tracking number.
                  </p>
                )}
                {edit && (
                  <p className="form-note">
                    {edit.trackingNumber}{" "}
                    <button type="button" onClick={() => { setEdit(null); setAutomatic(false); setOverride(false); }}>
                      Cancel editing
                    </button>
                  </p>
                )}
                <div className="form-grid">
                  <label className="full">
                    Manifest or tracking number
                    <input
                      name="trackingNumber"
                      defaultValue={edit?.trackingNumber ?? ""}
                      placeholder="SL001198 or GZ0000405"
                      maxLength={19}
                      required={automatic}
                      autoCapitalize="characters"
                      spellCheck={false}
                    />
                  </label>
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
                    <select
                      name="method"
                      aria-label="Shipping method"
                      defaultValue={edit?.method ?? "Sea"}
                      required
                    >
                      <option value="Sea">Sea</option>
                      <option value="Air">Air</option>
                    </select>
                  </label>
                  <label>
                    Tracking updates
                    <select name="automaticTracking" value={String(automatic)} onChange={(event) => { setAutomatic(event.target.value === "true"); setOverride(false); }}>
                      <option value="false">Manual milestones</option>
                      <option value="true">Automatic container stages</option>
                    </select>
                  </label>
                  {automatic && (
                    <>
                      <label>
                        Container loading date
                        <input type="date" name="loadedAt" required defaultValue={edit?.loadedAt?.slice(0, 10) ?? ""} />
                      </label>
                      <label>
                        Estimated arrival date
                        <input type="date" name="estimatedDelivery" required defaultValue={edit?.estimatedDelivery?.slice(0, 10) ?? ""} />
                      </label>
                      <label className="full manual-override">
                        <input type="checkbox" name="manualOverride" value="true" checked={override} onChange={(event) => setOverride(event.target.checked)} />
                        Pause automatic stages for a delay or correction
                      </label>
                    </>
                  )}
                  <label>
                    {automatic ? "Correction status (used only when paused)" : "Status"}
                    <select
                      name="status"
                      defaultValue={edit && (!edit.automaticTracking || edit.manualOverride) ? edit.status : data.statuses[0]}
                    >
                      {data.statuses.map((s) => (
                        <option key={s}>{s}</option>
                      ))}
                      {automatic && <option value="Delayed">Delayed</option>}
                    </select>
                  </label>
                  {!automatic && <label className="full">
                    Estimated delivery date
                    <input type="date" name="estimatedDelivery" defaultValue={edit?.estimatedDelivery?.slice(0, 10) ?? ""} />
                  </label>}
                  <label className="full">
                    {override ? "Public correction note" : "Public milestone note"}
                    <textarea
                      name="note"
                      maxLength={500}
                      required={override}
                      placeholder="Do not include customer names, addresses, or private information."
                    />
                  </label>
                </div>
                <p className="form-note">
                  {automatic ? "Automatic stages are estimates: loaded for 3 days, at sea for 30 days, clearing until arrival, then offloading. Pause them to post a delay or correction; resume when ready." : "Saving records a timestamped milestone."} An audit entry is saved.
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
