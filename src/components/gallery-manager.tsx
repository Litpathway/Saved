"use client";
import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { upload } from "@vercel/blob/client";
import { ArrowUpRight, Trash2 } from "lucide-react";

type GalleryItem = {
  id: string;
  title: string;
  description: string;
  kind: string;
  url: string;
};

export function GalleryManager() {
  const [items, setItems] = useState<GalleryItem[]>([]);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const load = useCallback(async () => {
    const response = await fetch("/api/admin/gallery", { cache: "no-store" });
    const result = await response.json();
    if (!response.ok) throw new Error(result.error || "Could not load gallery.");
    setItems(result);
  }, []);
  useEffect(() => { load().catch((reason) => setError(reason.message)); }, [load]);

  async function publish(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const file = (form.elements.namedItem("media") as HTMLInputElement).files?.[0];
    const title = (form.elements.namedItem("title") as HTMLInputElement).value.trim();
    const description = (form.elements.namedItem("description") as HTMLTextAreaElement).value.trim();
    if (!file || !title) return;
    if (file.size > 100 * 1024 * 1024) { setError("Choose a file under 100 MB."); return; }
    if (!/^(image\/(jpeg|png|webp|avif)|video\/(mp4|webm))$/.test(file.type)) {
      setError("Choose a JPG, PNG, WebP, AVIF, MP4, or WebM file."); return;
    }
    setBusy(true); setError(""); setNotice("");
    try {
      const blob = await upload(`gallery/${file.name}`, file, {
        access: "public",
        handleUploadUrl: "/api/admin/gallery/upload",
        multipart: true,
      });
      const response = await fetch("/api/admin/gallery", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, description, url: blob.url }),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || "Could not publish upload.");
      form.reset();
      setNotice("Published to the public gallery.");
      await load();
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "Upload failed. Please try again.");
    } finally { setBusy(false); }
  }

  async function remove(item: GalleryItem) {
    if (!window.confirm(`Remove “${item.title}” from the gallery?`)) return;
    setBusy(true); setError(""); setNotice("");
    try {
      const response = await fetch("/api/admin/gallery", {
        method: "DELETE", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: item.id }),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || "Could not remove item.");
      setNotice("Item removed.");
      await load();
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "Could not remove item.");
    } finally { setBusy(false); }
  }

  return (
    <section className="content gallery-manager">
      <div className="gallery-manager-heading">
        <div><h1>Manage gallery.</h1><p>Publish photos and videos for visitors to see.</p></div>
        <Link href="/gallery" className="text-link">View public gallery <ArrowUpRight size={16} /></Link>
      </div>
      {error && <p role="alert" className="error">{error}</p>}
      {notice && <p role="status" className="notice">{notice}</p>}
      <form className="gallery-upload" onSubmit={publish}>
        <h2>Add a photo or video</h2>
        <label>Choose a file <input name="media" type="file" accept="image/jpeg,image/png,image/webp,image/avif,video/mp4,video/webm" required /></label>
        <p>JPG, PNG, WebP, AVIF, MP4 or WebM. Maximum 100 MB.</p>
        <label>Title <input name="title" maxLength={120} required placeholder="Describe what visitors will see" /></label>
        <label>Description <textarea name="description" maxLength={500} rows={3} placeholder="Optional context for this photo or video" /></label>
        <button className="pill pill-dark" disabled={busy}>{busy ? "Uploading…" : "Publish to gallery"} <ArrowUpRight size={16} /></button>
      </form>
      <div className="gallery-manager-list">
        <h2>Published media</h2>
        {items.length ? items.map((item) => (
          <div className="gallery-manager-row" key={item.id}>
            <div className="gallery-manager-thumb">
              {item.kind === "video" ? <video src={item.url} preload="metadata" aria-label={item.title} /> : (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={item.url} alt="" loading="lazy" />
              )}
            </div>
            <div><strong>{item.title}</strong><small>{item.kind === "video" ? "Video" : "Photo"}</small></div>
            <button type="button" disabled={busy} onClick={() => remove(item)} aria-label={`Remove ${item.title}`}><Trash2 size={18} /> Remove</button>
          </div>
        )) : <p>No media has been published yet.</p>}
      </div>
    </section>
  );
}
