import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/signup")({
  component: Signup,
  head: () => ({ meta: [{ title: "Sign up — ChildrenGoods" }] }),
});

function Signup() {
  const nav = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    const { error } = await supabase.auth.signUp({
      email, password,
      options: { data: { full_name: name }, emailRedirectTo: `${window.location.origin}/account` },
    });
    setBusy(false);
    if (error) return toast.error(error.message);
    toast.success("Check your email to confirm your account.");
    nav({ to: "/login" });
  };

  return (
    <div className="mx-auto max-w-md px-4 py-16">
      <h1 className="font-display text-3xl font-extrabold">Create account</h1>
      <form onSubmit={onSubmit} className="mt-6 space-y-3">
        <input value={name} onChange={(e) => setName(e.target.value)} required placeholder="Full name" className="w-full rounded-lg border-2 px-4 py-2.5 text-sm" />
        <input value={email} onChange={(e) => setEmail(e.target.value)} required type="email" placeholder="Email" className="w-full rounded-lg border-2 px-4 py-2.5 text-sm" />
        <input value={password} onChange={(e) => setPassword(e.target.value)} required type="password" minLength={6} placeholder="Password (6+ chars)" className="w-full rounded-lg border-2 px-4 py-2.5 text-sm" />
        <button disabled={busy} className="w-full rounded-full bg-brand-pink py-3 text-sm font-bold text-white disabled:opacity-60">{busy ? "Creating…" : "Sign up"}</button>
      </form>
      <p className="mt-4 text-center text-sm text-muted-foreground">
        Have an account? <Link to="/login" className="font-bold text-brand-pink underline">Sign in</Link>
      </p>
    </div>
  );
}
