import { useState } from "react";
import { Heart, X, Trash2, ShoppingBag, Share2, Check, Copy, MessageCircle, FileDown } from "lucide-react";
import { useWishlist } from "@/lib/wishlist";
import { useCart } from "@/lib/cart";
import jsPDF from "jspdf";

export function WishlistTrigger({ className = "" }: { className?: string }) {
  const { totalItems, openWishlist } = useWishlist();
  return (
    <button
      type="button"
      onClick={openWishlist}
      aria-label={`Open wishlist (${totalItems} items)`}
      className={`relative inline-flex h-10 w-10 items-center justify-center rounded-full text-foreground transition-colors hover:bg-secondary ${className}`}
    >
      <Heart className="h-5 w-5" />
      {totalItems > 0 && (
        <span
          className="absolute -right-0.5 -top-0.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-accent px-1 text-[10px] font-semibold text-accent-foreground"
          aria-hidden="true"
        >
          {totalItems}
        </span>
      )}
    </button>
  );
}

export function WishlistHeartButton({
  item,
  className = "",
}: {
  item: { id: string; name: string; price: number; img?: string };
  className?: string;
}) {
  const { has, toggleItem } = useWishlist();
  const active = has(item.id);
  return (
    <button
      type="button"
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        toggleItem(item);
      }}
      aria-label={active ? `Remove ${item.name} from wishlist` : `Save ${item.name} to wishlist`}
      aria-pressed={active}
      className={`inline-flex h-9 w-9 items-center justify-center rounded-full bg-background/80 text-foreground shadow-sm backdrop-blur-sm transition-colors hover:bg-background ${className}`}
    >
      <Heart
        className={`h-4 w-4 transition-colors ${active ? "fill-accent text-accent" : ""}`}
      />
    </button>
  );
}

export function WishlistDrawer() {
  const { items, isOpen, closeWishlist, removeItem, totalItems } = useWishlist();
  const { addItem } = useCart();
  const [copied, setCopied] = useState(false);
  const [sharing, setSharing] = useState(false);

  const buildShareText = () => {
    const lines = ["My Lulu Clothline wishlist:", ""];
    items.forEach((it) => {
      lines.push(
        `• ${it.name}${it.price > 0 ? ` — KSh ${it.price.toLocaleString()}` : ""}`,
      );
    });
    lines.push("");
    lines.push("Browse: https://luluclothline.com");
    return lines.join("\n");
  };

  const whatsappShareUrl = () =>
    `https://wa.me/?text=${encodeURIComponent(buildShareText())}`;

  const loadImageAsDataUrl = (
    url: string,
  ): Promise<{ data: string; w: number; h: number } | null> =>
    new Promise((resolve) => {
      const img = new Image();
      img.crossOrigin = "anonymous";
      img.onload = () => {
        try {
          const max = 900;
          const scale = Math.min(1, max / Math.max(img.width, img.height));
          const w = Math.round(img.width * scale);
          const h = Math.round(img.height * scale);
          const canvas = document.createElement("canvas");
          canvas.width = w;
          canvas.height = h;
          const ctx = canvas.getContext("2d");
          if (!ctx) return resolve(null);
          ctx.drawImage(img, 0, 0, w, h);
          resolve({ data: canvas.toDataURL("image/jpeg", 0.85), w, h });
        } catch {
          resolve(null);
        }
      };
      img.onerror = () => resolve(null);
      img.src = url;
    });

  const buildPdf = async () => {
    // Single page, social-share friendly portrait. Mirrors the wishlist
    // drawer: thumbnail (4:5) on the left, name + price on the right,
    // hairline dividers between rows.
    const W = 1080;
    const H = 1350;
    const doc = new jsPDF({ unit: "pt", format: [W, H], orientation: "portrait" });

    const C = {
      bg: "#F7F2E8",      // soft cream (matches site background)
      ink: "#1A1612",     // foreground
      muted: "#7A6F5E",   // muted text
      hair: "#D9CFBF",    // divider
      accent: "#9B2D20",  // single understated accent
    };

    // Background
    doc.setFillColor(C.bg);
    doc.rect(0, 0, W, H, "F");

    // Pre-load images
    const imageData = await Promise.all(
      items.map((it) => (it.img ? loadImageAsDataUrl(it.img) : Promise.resolve(null))),
    );

    // ── Header ─────────────────────────────────────────────
    const padX = 80;
    const headerY = 110;

    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    doc.setTextColor(C.muted);
    doc.text("LULU  ·  CLOTHLINE", padX, headerY);

    const count = items.length;
    const countLabel = `${count} ${count === 1 ? "ITEM" : "ITEMS"}`;
    const cw = doc.getTextWidth(countLabel);
    doc.text(countLabel, W - padX - cw, headerY);

    doc.setFont("helvetica", "bold");
    doc.setFontSize(56);
    doc.setTextColor(C.ink);
    doc.text("Your Bag", padX, headerY + 70);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(14);
    doc.setTextColor(C.muted);
    doc.text("Saved pieces from luluclothline.com", padX, headerY + 100);

    // Divider under header
    doc.setDrawColor(C.hair);
    doc.setLineWidth(0.6);
    doc.line(padX, headerY + 130, W - padX, headerY + 130);

    // ── Items list ─────────────────────────────────────────
    const listTop = headerY + 160;
    const listBottom = H - 200; // leaves room for total + footer
    const availH = listBottom - listTop;

    // Row height tuned to fit on one page; thumbnail is 4:5 like the drawer
    const minRow = 70;
    const maxRow = 170;
    const rowH = Math.max(minRow, Math.min(maxRow, availH / Math.max(count, 1)));
    const thumbH = rowH - 16;
    const thumbW = thumbH * (20 / 24); // matches w-20/h-24 in drawer

    let total = 0;
    items.forEach((it, idx) => {
      const y = listTop + idx * rowH;
      if (y + thumbH > listBottom + 4) return; // safety

      // Thumbnail
      doc.setFillColor("#EDE6D6");
      doc.rect(padX, y, thumbW, thumbH, "F");
      const img = imageData[idx];
      if (img) {
        const ratio = img.w / img.h;
        let drawW = thumbW;
        let drawH = thumbW / ratio;
        if (drawH < thumbH) {
          drawH = thumbH;
          drawW = thumbH * ratio;
        }
        const dx = padX + (thumbW - drawW) / 2;
        const dy = y + (thumbH - drawH) / 2;
        doc.addImage(img.data, "JPEG", dx, dy, drawW, drawH, undefined, "FAST");
        // Mask any overflow with bg color so the image looks clipped to the box
        doc.setFillColor(C.bg);
        if (dy < y) doc.rect(padX - 2, y - rowH, thumbW + 4, y - dy + 2, "F");
        if (dy + drawH > y + thumbH)
          doc.rect(padX - 2, y + thumbH, thumbW + 4, dy + drawH - (y + thumbH) + 4, "F");
        if (dx < padX) doc.rect(dx - 2, y, padX - dx + 2, thumbH, "F");
        if (dx + drawW > padX + thumbW)
          doc.rect(padX + thumbW, y, dx + drawW - (padX + thumbW) + 4, thumbH, "F");
      }

      // Text block
      const textX = padX + thumbW + 28;
      doc.setFont("helvetica", "bold");
      doc.setFontSize(Math.min(22, Math.max(15, rowH * 0.18)));
      doc.setTextColor(C.ink);
      const maxNameW = W - textX - padX - 160;
      let name = it.name;
      while (doc.getTextWidth(name) > maxNameW && name.length > 4) {
        name = name.slice(0, -1);
      }
      if (name !== it.name) name = name.slice(0, -1) + "…";
      doc.text(name, textX, y + thumbH * 0.45);

      doc.setFont("helvetica", "normal");
      doc.setFontSize(11);
      doc.setTextColor(C.muted);
      doc.text(`Item ${String(idx + 1).padStart(2, "0")}`, textX, y + thumbH * 0.7);

      // Price (right aligned)
      if (it.price > 0) {
        doc.setFont("helvetica", "bold");
        doc.setFontSize(14);
        doc.setTextColor(C.ink);
        const priceStr = `KSh ${it.price.toLocaleString()}`;
        const pw = doc.getTextWidth(priceStr);
        doc.text(priceStr, W - padX - pw, y + thumbH * 0.45);
        total += it.price;
      }

      // Hairline divider between rows
      if (idx < count - 1) {
        doc.setDrawColor(C.hair);
        doc.setLineWidth(0.4);
        doc.line(padX, y + rowH - 4, W - padX, y + rowH - 4);
      }
    });

    // ── Total ──────────────────────────────────────────────
    if (total > 0) {
      const ty = listBottom + 30;
      doc.setDrawColor(C.hair);
      doc.setLineWidth(0.6);
      doc.line(padX, ty - 20, W - padX, ty - 20);

      doc.setFont("helvetica", "normal");
      doc.setFontSize(11);
      doc.setTextColor(C.muted);
      doc.text("TOTAL", padX, ty + 10);

      doc.setFont("helvetica", "bold");
      doc.setFontSize(34);
      doc.setTextColor(C.ink);
      const tStr = `KSh ${total.toLocaleString()}`;
      const tw = doc.getTextWidth(tStr);
      doc.text(tStr, W - padX - tw, ty + 14);
    }

    // ── Footer ─────────────────────────────────────────────
    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    doc.setTextColor(C.muted);
    doc.text("luluclothline.com", padX, H - 70);
    const handle = "@lulu_clothline  ·  WhatsApp 0714 844 809";
    const hw = doc.getTextWidth(handle);
    doc.text(handle, W - padX - hw, H - 70);

    // Tiny accent mark
    doc.setFillColor(C.accent);
    doc.rect(padX, H - 60, 24, 3, "F");

    return doc;
  };

  const handleExportPdf = async () => {
    if (items.length === 0) return;
    setSharing(true);
    try {
      const doc = await buildPdf();
      const blob = doc.output("blob");
      const filename = "lulu-wishlist.pdf";
      const file = new File([blob], filename, { type: "application/pdf" });
      const nav = navigator as Navigator & {
        canShare?: (data: { files: File[] }) => boolean;
      };
      if (nav.canShare && nav.canShare({ files: [file] }) && nav.share) {
        try {
          await nav.share({
            files: [file],
            title: "My Lulu Clothline wishlist",
            text: buildShareText(),
          });
          return;
        } catch {
          /* fall through to download */
        }
      }
      doc.save(filename);
    } finally {
      setSharing(false);
    }
  };

  const handleNativeShare = async () => {
    const text = buildShareText();
    if (typeof navigator !== "undefined" && navigator.share) {
      try {
        await navigator.share({ title: "My Lulu Clothline wishlist", text });
        return;
      } catch {
        /* user cancelled — fall through */
      }
    }
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      /* ignore */
    }
  };

  return (
    <>
      <div
        onClick={closeWishlist}
        aria-hidden={!isOpen}
        className={`fixed inset-0 z-50 bg-foreground/40 backdrop-blur-sm transition-opacity duration-300 ${
          isOpen ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
      />
      <aside
        role="dialog"
        aria-label="Wishlist"
        aria-hidden={!isOpen}
        className={`fixed right-0 top-0 z-50 flex h-dvh w-full max-w-md flex-col bg-background shadow-2xl transition-transform duration-300 ease-out ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between border-b border-border/60 px-5 py-4">
          <div>
            <p className="tracking-luxury text-[10px] text-muted-foreground">Saved</p>
            <h2 className="font-display text-2xl">
              {totalItems} {totalItems === 1 ? "item" : "items"}
            </h2>
          </div>
          <button
            type="button"
            onClick={closeWishlist}
            aria-label="Close wishlist"
            className="inline-flex h-9 w-9 items-center justify-center rounded-full hover:bg-secondary"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-5 py-4">
          {items.length === 0 ? (
            <div className="flex h-full flex-col items-center justify-center text-center">
              <Heart className="h-10 w-10 text-muted-foreground" />
              <p className="font-display mt-4 text-2xl">No saved items yet</p>
              <p className="mt-2 max-w-xs text-sm text-muted-foreground">
                Tap the heart on any piece to save it here for later.
              </p>
              <button
                type="button"
                onClick={closeWishlist}
                className="tracking-luxury mt-6 rounded-full border border-foreground/30 px-6 py-3 text-[10px] hover:bg-foreground hover:text-background"
              >
                Continue browsing
              </button>
            </div>
          ) : (
            <ul className="divide-y divide-border/60">
              {items.map((it) => (
                <li key={it.id} className="flex gap-4 py-4">
                  {it.img && (
                    <div className="h-24 w-20 shrink-0 overflow-hidden bg-muted">
                      <img src={it.img} alt={it.name} className="h-full w-full object-cover" />
                    </div>
                  )}
                  <div className="flex flex-1 flex-col">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <h3 className="font-display text-lg leading-tight">{it.name}</h3>
                        {it.price > 0 && (
                          <p className="mt-0.5 text-xs text-muted-foreground">
                            KSh {it.price.toLocaleString()}
                          </p>
                        )}
                      </div>
                      <button
                        type="button"
                        onClick={() => removeItem(it.id)}
                        aria-label={`Remove ${it.name}`}
                        className="text-muted-foreground transition-colors hover:text-destructive"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                    <div className="mt-auto pt-3">
                      <button
                        type="button"
                        onClick={() => {
                          addItem({
                            name: it.name,
                            price: it.price,
                            size: "One size",
                            color: "Default",
                            img: it.img,
                          });
                          removeItem(it.id);
                          closeWishlist();
                        }}
                        className="tracking-luxury inline-flex items-center gap-2 rounded-full bg-foreground px-4 py-2 text-[10px] text-background hover:opacity-90"
                      >
                        <ShoppingBag className="h-3.5 w-3.5" />
                        Move to cart
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        {items.length > 0 && (
          <div className="border-t border-border/60 bg-secondary/30 px-5 py-4">
            <p className="tracking-luxury mb-3 text-[10px] text-muted-foreground">
              Share your wishlist
            </p>
            <div className="flex flex-wrap gap-2">
              <a
                href={whatsappShareUrl()}
                target="_blank"
                rel="noopener noreferrer"
                className="tracking-luxury inline-flex flex-1 items-center justify-center gap-2 rounded-full bg-whatsapp px-4 py-3 text-[10px] text-whatsapp-foreground hover:opacity-90"
              >
                <MessageCircle className="h-3.5 w-3.5" />
                WhatsApp
              </a>
              <button
                type="button"
                onClick={handleNativeShare}
                className="tracking-luxury inline-flex flex-1 items-center justify-center gap-2 rounded-full border border-foreground/30 px-4 py-3 text-[10px] hover:bg-foreground hover:text-background"
              >
                {copied ? (
                  <>
                    <Check className="h-3.5 w-3.5" />
                    Copied
                  </>
                ) : (
                  <>
                    {typeof navigator !== "undefined" && (navigator as Navigator).share ? (
                      <Share2 className="h-3.5 w-3.5" />
                    ) : (
                      <Copy className="h-3.5 w-3.5" />
                    )}
                    Share
                  </>
                )}
              </button>
            </div>
            <button
              type="button"
              onClick={handleExportPdf}
              disabled={sharing}
              className="tracking-luxury mt-2 inline-flex w-full items-center justify-center gap-2 rounded-full bg-foreground px-4 py-3 text-[10px] text-background hover:opacity-90 disabled:opacity-60"
            >
              <FileDown className="h-3.5 w-3.5" />
              {sharing ? "Preparing PDF..." : "Export & share as PDF"}
            </button>
          </div>
        )}
      </aside>
    </>
  );
}