import { createFileRoute } from "@tanstack/react-router";
import collectiveImg from "@/assets/collective.jpg";
import bts1 from "@/assets/bts-1.jpg";
import bts2 from "@/assets/bts-2.jpg";
import look1 from "@/assets/look-1.jpg";
import look3 from "@/assets/look-3.jpg";

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
            <img src={look1} alt="Campaign one" loading="lazy" width={900} height={1200} className="aspect-[4/5] w-full object-cover" />
          </div>
          <div className="space-y-6 md:col-span-5">
            <div className="overflow-hidden bg-muted">
              <img src={bts1} alt="Behind the scenes" loading="lazy" width={1200} height={900} className="aspect-[4/3] w-full object-cover" />
            </div>
            <div className="overflow-hidden bg-muted">
              <img src={look3} alt="Campaign two" loading="lazy" width={900} height={1200} className="aspect-[4/3] w-full object-cover" />
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
              <img src={bts1} alt="On set" loading="lazy" width={1200} height={900} className="aspect-[4/3] w-full object-cover" />
            </div>
            <div className="overflow-hidden bg-muted">
              <img src={bts2} alt="Creative roundtable" loading="lazy" width={1200} height={900} className="aspect-[4/3] w-full object-cover" />
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
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