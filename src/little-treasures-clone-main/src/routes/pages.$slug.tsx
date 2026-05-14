import { createFileRoute } from "@tanstack/react-router";

const PAGES: Record<string, { title: string; body: string }> = {
  about: {
    title: "About ChildrenGoods",
    body: "ChildrenGoods is a Dhaka-based kids fashion brand making joyful, comfortable clothing for newborns through ten-year-olds. We design pieces that hold up to real-world play and big imaginations.",
  },
  contact: {
    title: "Contact us",
    body: "Email: hello@childrengoods.com\nPhone: +880 1700 000000\nHours: Sat–Thu, 10am–7pm",
  },
  "how-to-place-an-order": {
    title: "How to place an order",
    body: "1. Browse the shop and add items to your cart.\n2. Open the cart and tap Checkout.\n3. Enter your shipping address and contact details.\n4. Choose Cash on Delivery and place the order.\n5. We'll confirm by phone and ship within 24 hours.",
  },
  "shipping-returns": {
    title: "Shipping & returns",
    body: "Standard delivery is 3–5 business days nationwide. Free shipping on orders over ৳2000. Easy 14-day exchange on unworn items with tags.",
  },
  "terms-conditions": {
    title: "Terms & conditions",
    body: "By using this site you agree to our terms of use. All orders are subject to product availability and pricing accuracy.",
  },
  "privacy-policy": {
    title: "Privacy policy",
    body: "We collect only the information needed to fulfill your order and improve your experience. We never sell your data.",
  },
};

export const Route = createFileRoute("/pages/$slug")({
  component: PagesView,
  head: ({ params }) => {
    const p = PAGES[params.slug] ?? { title: "ChildrenGoods", body: "" };
    return { meta: [{ title: `${p.title} — ChildrenGoods` }, { name: "description", content: p.body.slice(0, 150) }] };
  },
});

function PagesView() {
  const { slug } = Route.useParams();
  const page = PAGES[slug];
  if (!page) return <div className="mx-auto max-w-3xl p-10 text-center">Page not found.</div>;
  return (
    <article className="mx-auto max-w-3xl px-4 py-12">
      <h1 className="font-display text-4xl font-extrabold">{page.title}</h1>
      <div className="mt-6 whitespace-pre-line text-muted-foreground leading-relaxed">{page.body}</div>
    </article>
  );
}
