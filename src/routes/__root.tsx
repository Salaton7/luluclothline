import { Outlet, Link, createRootRoute, HeadContent, Scripts } from "@tanstack/react-router";

import appCss from "../styles.css?url";
import luluLogo from "@/assets/lulu-logo.jpg";

const WHATSAPP_NUMBER = "254714844809";
const WHATSAPP_URL = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
  "Hi Lulu Clothline! I'd like to place an order.",
)}`;
const WHATSAPP_FLOAT_URL =
  "https://wa.me/254714844809?text=Hi%20I%20saw%20this%20on%20Lulu%20Clothline%20and%20I%20want%20to%20order:%0A-Product:%0A-Size:%0A-Location:";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-7xl font-bold text-foreground">404</h1>
        <h2 className="mt-4 text-xl font-semibold text-foreground">Page not found</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <div className="mt-6">
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Go home
          </Link>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "Lulu Clothline — A Modern Kenyan Fashion Ecosystem" },
      {
        name: "description",
        content:
          "Lulu Clothline — Sidai fashion, premium textiles, and the creative collective. Made in Kenya.",
      },
      { name: "author", content: "Lulu Clothline" },
      { property: "og:title", content: "Lulu Clothline" },
      {
        property: "og:description",
        content: "Shop fashion. Source textiles. Join the collective.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
      { property: "og:image", content: luluLogo },
      { name: "twitter:image", content: luluLogo },
    ],
    links: [
      {
        rel: "stylesheet",
        href: appCss,
      },
      { rel: "icon", href: luluLogo },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@300;400;500&family=Inter:wght@300;400;500;600&display=swap",
      },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
});

function RootShell({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      <SiteHeader />
      <main className="flex-1">
        <Outlet />
      </main>
      <SiteFooter />
      <StickyWhatsApp />
    </div>
  );
}

function SiteHeader() {
  const linkClass =
    "tracking-luxury text-[11px] text-foreground/70 transition-colors hover:text-foreground";
  return (
    <header className="sticky top-0 z-40 border-b border-border/60 bg-background/85 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-5 md:px-10">
        <Link to="/" className="font-display text-xl tracking-tight">
          <span className="flex items-center gap-2">
            <img
              src={luluLogo}
              alt="Lulu Clothline"
              width={36}
              height={36}
              className="h-9 w-9 rounded-full object-cover"
            />
            <span>Lulu<span className="text-accent">.</span>Clothline</span>
          </span>
        </Link>
        <nav className="hidden gap-8 md:flex">
          <Link to="/sidai" className={linkClass} activeProps={{ className: "tracking-luxury text-[11px] text-foreground" }}>
            Sidai
          </Link>
          <Link to="/textile" className={linkClass} activeProps={{ className: "tracking-luxury text-[11px] text-foreground" }}>
            Textile
          </Link>
          <Link to="/collective" className={linkClass} activeProps={{ className: "tracking-luxury text-[11px] text-foreground" }}>
            Collective
          </Link>
        </nav>
        <a
          href={WHATSAPP_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="tracking-luxury hidden rounded-full bg-foreground px-5 py-2.5 text-[10px] text-background transition-opacity hover:opacity-90 md:inline-block"
        >
          Order on WhatsApp
        </a>
      </div>
    </header>
  );
}

function SiteFooter() {
  return (
    <footer className="border-t border-border/60 bg-background">
      <div className="mx-auto grid max-w-7xl gap-10 px-5 py-16 md:grid-cols-4 md:px-10">
        <div className="md:col-span-2">
          <div className="flex items-center gap-3">
            <img
              src={luluLogo}
              alt="Lulu Clothline"
              width={48}
              height={48}
              className="h-12 w-12 rounded-full object-cover"
            />
            <div className="font-display text-2xl">Lulu Clothline</div>
          </div>
          <p className="mt-3 max-w-sm text-sm text-muted-foreground">
            A modern Kenyan fashion ecosystem of style, fabric, and creative culture.
          </p>
        </div>
        <div>
          <div className="tracking-luxury mb-4 text-[10px] text-muted-foreground">Explore</div>
          <ul className="space-y-2 text-sm">
            <li><Link to="/sidai" className="hover:text-accent">Sidai</Link></li>
            <li><Link to="/textile" className="hover:text-accent">Textile</Link></li>
            <li><Link to="/collective" className="hover:text-accent">Collective</Link></li>
          </ul>
        </div>
        <div>
          <div className="tracking-luxury mb-4 text-[10px] text-muted-foreground">Connect</div>
          <ul className="space-y-2 text-sm">
            <li>
              <a href="https://www.instagram.com/lulu_clothline/" target="_blank" rel="noopener noreferrer" className="hover:text-accent">
                Instagram
              </a>
            </li>
            <li>
              <a href="https://www.tiktok.com/@luluclothline" target="_blank" rel="noopener noreferrer" className="hover:text-accent">
                TikTok
              </a>
            </li>
            <li>
              <a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer" className="hover:text-accent">
                WhatsApp · 0714 844 809
              </a>
            </li>
          </ul>
        </div>
      </div>
      <div className="border-t border-border/60">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-2 px-5 py-6 text-xs text-muted-foreground md:flex-row md:px-10">
          <span>© {new Date().getFullYear()} Lulu Clothline</span>
          <span>Made in Kenya 🇰🇪</span>
        </div>
      </div>
    </footer>
  );
}

function StickyWhatsApp() {
  return (
    <div className="group fixed bottom-5 right-5 z-50">
      {/* Tooltip */}
      <span
        role="tooltip"
        className="pointer-events-none absolute right-[72px] top-1/2 -translate-y-1/2 whitespace-nowrap rounded-md bg-foreground px-3 py-1.5 text-xs font-medium text-background opacity-0 shadow-md transition-opacity duration-200 group-hover:opacity-100"
      >
        Chat with us on WhatsApp
      </span>
      <a
        href={WHATSAPP_FLOAT_URL}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Chat with us on WhatsApp"
        className="relative flex h-[60px] w-[60px] items-center justify-center rounded-full text-white shadow-[0_8px_24px_rgba(0,0,0,0.2)] transition-transform duration-200 hover:scale-110"
        style={{ backgroundColor: "#25D366" }}
      >
        {/* Pulse ring */}
        <span
          aria-hidden="true"
          className="absolute inset-0 rounded-full animate-wa-pulse"
          style={{ backgroundColor: "#25D366" }}
        />
        <svg
          width="32"
          height="32"
          viewBox="0 0 24 24"
          fill="currentColor"
          aria-hidden="true"
          className="relative z-10"
        >
          <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448L.057 24zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z" />
        </svg>
      </a>
    </div>
  );
}
