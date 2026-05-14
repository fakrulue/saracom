import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/account")({
  component: Account,
  head: () => ({ meta: [{ title: "My account — ChildrenGoods" }] }),
});

function Account() {
  const nav = useNavigate();
  const [user, setUser] = useState<{ email?: string; id: string } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const { data: sub } = supabase.auth.onAuthStateChange((_e, session) => {
      setUser(session?.user ?? null); setLoading(false);
    });
    supabase.auth.getSession().then(({ data }) => { setUser(data.session?.user ?? null); setLoading(false); });
    return () => sub.subscription.unsubscribe();
  }, []);

  if (loading) return <div className="p-10 text-center">Loading…</div>;
  if (!user) {
    return (
      <div className="mx-auto max-w-md px-4 py-16 text-center">
        <h1 className="font-display text-3xl font-extrabold">My account</h1>
        <p className="mt-2 text-muted-foreground">Sign in to view your orders and details.</p>
        <Link to="/login" className="mt-6 inline-block rounded-full bg-brand-pink px-6 py-3 text-sm font-bold text-white">Sign in</Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <h1 className="font-display text-3xl font-extrabold">My account</h1>
      <div className="mt-6 rounded-2xl border p-6">
        <p className="text-sm text-muted-foreground">Signed in as</p>
        <p className="font-semibold">{user.email}</p>
        <button
          onClick={async () => { await supabase.auth.signOut(); toast.success("Signed out"); nav({ to: "/" }); }}
          className="mt-4 rounded-full border-2 px-4 py-2 text-sm font-bold hover:bg-muted"
        >
          Sign out
        </button>
      </div>
      <div className="mt-6 rounded-2xl border p-6">
        <h2 className="font-bold">Orders</h2>
        <p className="mt-2 text-sm text-muted-foreground">You haven't placed any orders yet.</p>
      </div>
    </div>
  );
}
