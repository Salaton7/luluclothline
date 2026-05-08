import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import collectiveImg from "@/assets/collective.jpg";
import cNew1 from "@/assets/collective-new-1.jpeg";
import cNew2 from "@/assets/collective-new-2.jpg";
import cNew3 from "@/assets/collective-new-3.jpg";
import cNew4 from "@/assets/collective-new-4.webp";
import cNew5 from "@/assets/collective-new-5.webp";
import cNew6 from "@/assets/collective-new-6.webp";
import cNew7 from "@/assets/collective-new-7.jpg";
import cNew8 from "@/assets/collective-new-8.webp";

export const Route = createFileRoute("/collective")({
  head: () => ({
    meta: [
      { title: "Lulu Collective — Fashion Storytelling · Lulu Clothline" },
      {
        name: "description",
        content:
          "A creative space for fashion storytelling, collaborations, and cultural expression.",
      },
      { property: "og:title", content: "Lulu Collective" },
      {
        property: "og:description",
        content: "Fashion storytelling, collaborations, and cultural expression — from Kenya.",
      },
    ],
  }),
  component: CollectivePage,
});

const collab = `https://wa.me/254714844809?text=${encodeURIComponent(
  "Hi Lulu Collective! I'd love to collaborate.",
)}`;

function CollectivePage() {
  const [items, setItems] = useState<
    Array<{
      id: string;
      name: string;
      tag: string | null;
      price: number;
      description: string | null;
      image_url: string | null;
    }>
  >([]);

  useEffect(() => {
    let active = true;
    supabase
      .from("sidai_products")
      .select("id, name, tag, price, description, image_url")
      .eq("is_published", true)
      .eq("category", "collective")
      .order("sort_order", { ascending: true })
      .order("created_at", { ascending: false })
      .then(({ data }) => {
        if (active && data) setItems(data);
      });
    return () => {
      active = false;
    };
  }, []);

  const inquire = (name: string) =>
    `https://wa.me/254714844809?text=${encodeURIComponent(
      `Hi Lulu Collective, I'd like to inquire about ${name}.`,
    )}`;

  return (
    <>
      <section className="relative h-[70vh] overflow-hidden border-b border-border/60">
        <img
          src={collectiveImg}
          alt="Lulu Collective"
          width={1024}
          height={1280}
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-foreground/40" />
        <div className="relative mx-auto flex h-full max-w-7xl items-end px-5 pb-16 md:px-10 md:pb-24">
          <div className="text-background">
            <p className="tracking-luxury mb-4 text-[10px] text-background/80">
              The Creative Arm
            </p>
            <h1 className="font-display text-5xl md:text-7xl lg:text-8xl">Lulu Collective</h1>
            <p className="mt-6 max-w-xl text-background/85">
              A fashion creative space for storytelling, collaborations, and cultural expression.
            </p>
          </div>
        </div>
      </section>

      {/* LOOKBOOK */}
      <section className="mx-auto max-w-7xl px-5 py-24 md:px-10 md:py-32">
        <div className="mb-12 flex items-end justify-between">
          <div>
            <p className="tracking-luxury mb-3 text-[10px] text-muted-foreground">
              Campaigns
            </p>
            <h2 className="font-display text-4xl md:text-5xl">Featured collaborations.</h2>
          </div>
        </div>
        <div className="grid gap-6 md:grid-cols-12">
          <div className="overflow-hidden bg-muted md:col-span-7">
            <img src={cNew1} alt="Campaign one" loading="lazy" width={900} height={1200} className="aspect-[4/5] w-full object-cover" />
          </div>
          <div className="space-y-6 md:col-span-5">
            <div className="overflow-hidden bg-muted">
              <img src={cNew3} alt="Behind the scenes" loading="lazy" width={1200} height={900} className="aspect-[4/3] w-full object-cover" />
            </div>
            <div className="overflow-hidden bg-muted">
              <img src={cNew8} alt="Campaign two" loading="lazy" width={900} height={1200} className="aspect-[4/3] w-full object-cover" />
            </div>
          </div>
        </div>
      </section>

      {/* BTS */}
      <section className="border-y border-border/60 bg-secondary/30">
        <div className="mx-auto max-w-7xl px-5 py-24 md:px-10 md:py-32">
          <p className="tracking-luxury mb-3 text-[10px] text-muted-foreground">Process</p>
          <h2 className="font-display text-4xl md:text-5xl">Behind the scenes.</h2>
          <div className="mt-12 grid gap-6 md:grid-cols-2">
            <div className="overflow-hidden bg-muted">
              <img src={cNew2} alt="On set" loading="lazy" width={1200} height={900} className="aspect-[4/3] w-full object-cover" />
            </div>
            <div className="overflow-hidden bg-muted">
              <img src={cNew7} alt="Creative roundtable" loading="lazy" width={1200} height={900} className="aspect-[4/3] w-full object-cover" />
            </div>
          </div>
        </div>
      </section>

      {/* GALLERY */}
      <section className="mx-auto max-w-7xl px-5 py-24 md:px-10 md:py-32">
        <div className="mb-12">
          <p className="tracking-luxury mb-3 text-[10px] text-muted-foreground">Gallery</p>
          <h2 className="font-display text-4xl md:text-5xl">Cultural expression.</h2>
          <p className="mt-5 max-w-xl text-muted-foreground">
            Stories of heritage, craftsmanship, and modern Kenyan style.
          </p>
        </div>
        <div className="grid gap-4 md:grid-cols-3 md:gap-6">
          <div className="overflow-hidden bg-muted md:row-span-2">
            <img src={cNew1} alt="Maasai bridal regalia" loading="lazy" className="aspect-[3/4] h-full w-full object-cover md:aspect-auto" />
          </div>
          <div className="overflow-hidden bg-muted md:col-span-2">
            <img src={cNew2} alt="Cultural celebration" loading="lazy" className="aspect-[16/10] w-full object-cover" />
          </div>
          <div className="overflow-hidden bg-muted">
            <img src={cNew4} alt="Blue beaded top" loading="lazy" className="aspect-square w-full object-cover" />
          </div>
          <div className="overflow-hidden bg-muted">
            <img src={cNew5} alt="Red top with white trousers" loading="lazy" className="aspect-square w-full object-cover" />
          </div>
          <div className="overflow-hidden bg-muted">
            <img src={cNew3} alt="Sisterhood in Maasai attire" loading="lazy" className="aspect-square w-full object-cover" />
          </div>
          <div className="overflow-hidden bg-muted">
            <img src={cNew6} alt="Checkered tube top" loading="lazy" className="aspect-square w-full object-cover" />
          </div>
          <div className="overflow-hidden bg-muted">
            <img src={cNew8} alt="Beaded statement piece" loading="lazy" className="aspect-square w-full object-cover" />
          </div>
          <div className="overflow-hidden bg-muted">
            <img src={cNew7} alt="Young boys in matching attire" loading="lazy" className="aspect-square w-full object-cover" />
          </div>
        </div>
      </section>

      {/* CTA */}
      {items.length > 0 && (
        <section className="border-y border-border/60 bg-secondary/20">
          <div className="mx-auto max-w-7xl px-5 py-24 md:px-10 md:py-32">
            <div className="mb-12">
              <p className="tracking-luxury mb-3 text-[10px] text-muted-foreground">
                Available pieces
              </p>
              <h2 className="font-display text-4xl md:text-5xl">From the collective.</h2>
            </div>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {items.map((p) => (
                <a
                  key={p.id}
                  href={inquire(p.name)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group block"
                >
                  <div className="aspect-[4/5] overflow-hidden bg-muted">
                    {p.image_url && (
                      <img
                        src={p.image_url}
                        alt={p.name}
                        loading="lazy"
                        className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                    )}
                  </div>
                  <div className="mt-4 flex items-baseline justify-between gap-3">
                    <h3 className="font-display text-2xl">{p.name}</h3>
                    {p.price > 0 && (
                      <span className="text-sm text-muted-foreground">
                        KSh {p.price.toLocaleString()}
                      </span>
                    )}
                  </div>
                  {p.tag && (
                    <span className="tracking-luxury mt-1 inline-block text-[10px] text-muted-foreground">
                      {p.tag}
                    </span>
                  )}
                  {p.description && (
                    <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">
                      {p.description}
                    </p>
                  )}
                  <span className="tracking-luxury mt-3 inline-block text-[10px] text-muted-foreground transition-colors group-hover:text-accent">
                    Inquire →
                  </span>
                </a>
              ))}
            </div>
          </div>
        </section>
      )}

      <section className="mx-auto max-w-3xl px-5 py-24 text-center md:px-10 md:py-32">
        <p className="tracking-luxury mb-4 text-[10px] text-muted-foreground">Open Calls</p>
        <h2 className="font-display text-4xl md:text-6xl">Collaborate with us.</h2>
        <p className="mt-5 text-muted-foreground">
          Photographers, stylists, models, designers — let's make something honest, Kenyan,
          and beautiful together.
        </p>
        <div className="mt-10 flex flex-wrap justify-center gap-3">
          <a
            href={collab}
            target="_blank"
            rel="noopener noreferrer"
            className="tracking-luxury rounded-full bg-foreground px-7 py-4 text-[11px] text-background hover:opacity-90"
          >
            Collaborate With Us
          </a>
          <a
            href={collab}
            target="_blank"
            rel="noopener noreferrer"
            className="tracking-luxury rounded-full bg-whatsapp px-7 py-4 text-[11px] text-whatsapp-foreground hover:opacity-90"
          >
            Join the Collective (WhatsApp)
          </a>
        </div>
      </section>
    </>
  );
}