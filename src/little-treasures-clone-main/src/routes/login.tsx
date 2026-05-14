import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/login")({
  component: Login,
  head: () => ({ meta: [{ title: "Sign in — ChildrenGoods" }] }),
});

function Login() {
  const nav = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => { if (data.session) nav({ to: "/account" }); });
  }, [nav]);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setBusy(false);
    if (error) return toast.error(error.message);
    nav({ to: "/account" });
  };

  return (
    <div className="mx-auto max-w-md px-4 py-16">
      <h1 className="font-display text-3xl font-extrabold">Welcome back</h1>
      <form onSubmit={onSubmit} className="mt-6 space-y-3">
        <input value={email} onChange={(e) => setEmail(e.target.value)} required type="email" placeholder="Email" className="w-full rounded-lg border-2 px-4 py-2.5 text-sm" />
        <input value={password} onChange={(e) => setPassword(e.target.value)} required type="password" placeholder="Password" className="w-full rounded-lg border-2 px-4 py-2.5 text-sm" />
        <button disabled={busy} className="w-full rounded-full bg-brand-pink py-3 text-sm font-bold text-white disabled:opacity-60">{busy ? "Signing in…" : "Sign in"}</button>
      </form>
      <p className="mt-4 text-center text-sm text-muted-foreground">
        New here? <Link to="/signup" className="font-bold text-brand-pink underline">Create an account</Link>
      </p>
    </div>
  );
}
