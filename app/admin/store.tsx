import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { registerMedia } from "~/components/ui/Picture";
import type { Overrides } from "~/content/overrides";
import { api, errorText } from "./api";

/**
 * The admin's working copy of the site content. Edits change local state
 * (dirty) → "Save draft" stores it on R2 → "Publish" makes it live and asks
 * Vercel to rebuild. Loaded once when the admin opens; nothing polls.
 */
type Phase = "loading" | "ready" | "error";
type Ctx = {
  phase: Phase;
  error: string | null;
  content: Overrides;
  dirty: boolean;
  unpublished: boolean;
  publishedAt: string | null;
  busy: "save" | "publish" | "discard" | null;
  update: (fn: (c: Overrides) => Overrides) => void;
  save: () => Promise<boolean>;
  publish: () => Promise<{ deploying: boolean } | null>;
  discard: () => Promise<void>;
  reload: () => Promise<void>;
  notice: { kind: "ok" | "error"; text: string } | null;
  notify: (kind: "ok" | "error", text: string) => void;
};

const C = createContext<Ctx | null>(null);

export function ContentProvider({ children }: { children: ReactNode }) {
  const [phase, setPhase] = useState<Phase>("loading");
  const [error, setError] = useState<string | null>(null);
  const [content, setContent] = useState<Overrides>({});
  const [dirty, setDirty] = useState(false);
  const [unpublished, setUnpublished] = useState(false);
  const [publishedAt, setPublishedAt] = useState<string | null>(null);
  const [busy, setBusy] = useState<Ctx["busy"]>(null);
  const [notice, setNotice] = useState<Ctx["notice"]>(null);
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined);

  const notify = useCallback((kind: "ok" | "error", text: string) => {
    setNotice({ kind, text });
    clearTimeout(timer.current);
    timer.current = setTimeout(() => setNotice(null), kind === "ok" ? 4000 : 8000);
  }, []);

  const reload = useCallback(async () => {
    setPhase("loading");
    try {
      const r = await api.content();
      for (const [n, e] of Object.entries(r.content.media ?? {})) registerMedia(n, e);
      setContent(r.content);
      setUnpublished(r.unpublished);
      setPublishedAt(r.publishedAt);
      setDirty(false);
      setPhase("ready");
    } catch (e) {
      setError(errorText(e));
      setPhase("error");
    }
  }, []);

  useEffect(() => {
    void reload();
  }, [reload]);

  // Warn before closing the tab with unsaved edits.
  useEffect(() => {
    if (!dirty) return;
    const h = (e: BeforeUnloadEvent) => e.preventDefault();
    window.addEventListener("beforeunload", h);
    return () => window.removeEventListener("beforeunload", h);
  }, [dirty]);

  const update = useCallback((fn: (c: Overrides) => Overrides) => {
    setContent((c) => fn(structuredClone(c)));
    setDirty(true);
  }, []);

  const save = useCallback(async () => {
    setBusy("save");
    try {
      await api.save(content);
      setDirty(false);
      setUnpublished(true);
      notify("ok", "Draft saved. Publish when you're ready to put it live.");
      return true;
    } catch (e) {
      notify("error", errorText(e));
      return false;
    } finally {
      setBusy(null);
    }
  }, [content, notify]);

  const publish = useCallback(async () => {
    if (dirty && !(await save())) return null;
    setBusy("publish");
    try {
      const r = await api.publish();
      setUnpublished(false);
      setPublishedAt(r.publishedAt);
      notify(
        "ok",
        r.deploying ? "Published. The live site updates in about 2 minutes." : "Published. (No deploy hook is set, so the site updates on the next deploy.)",
      );
      return { deploying: r.deploying };
    } catch (e) {
      notify("error", errorText(e));
      return null;
    } finally {
      setBusy(null);
    }
  }, [dirty, save, notify]);

  const discard = useCallback(async () => {
    setBusy("discard");
    try {
      await api.discard();
      await reload();
      notify("ok", "Unpublished changes discarded.");
    } catch (e) {
      notify("error", errorText(e));
    } finally {
      setBusy(null);
    }
  }, [reload, notify]);

  const value = useMemo(
    () => ({ phase, error, content, dirty, unpublished, publishedAt, busy, update, save, publish, discard, reload, notice, notify }),
    [phase, error, content, dirty, unpublished, publishedAt, busy, update, save, publish, discard, reload, notice, notify],
  );
  return <C.Provider value={value}>{children}</C.Provider>;
}

export function useContent() {
  const v = useContext(C);
  if (!v) throw new Error("useContent outside ContentProvider");
  return v;
}
