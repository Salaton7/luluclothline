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

  // Maasai palette
  const MAASAI = {
    red: "#C8102E",
    black: "#0B0B0B",
    blue: "#1F4FA8",
    white: "#F7F1E6",
    cream: "#FBF6EB",
    ink: "#1A1612",
  };

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

  // Draw a Maasai shuka-style stripe band
  const drawShukaBand = (
    doc: jsPDF,
    x: number,
    y: number,
    w: number,
    h: number,
  ) => {
    // Base red
    doc.setFillColor(MAASAI.red);
    doc.rect(x, y, w, h, "F");
    // Thick black stripes
    doc.setFillColor(MAASAI.black);
    doc.rect(x, y + h * 0.15, w, h * 0.08, "F");
    doc.rect(x, y + h * 0.62, w, h * 0.08, "F");
    // Blue accent
    doc.setFillColor(MAASAI.blue);
    doc.rect(x, y + h * 0.4, w, h * 0.06, "F");
    // Cream pinstripe checks
    doc.setFillColor(MAASAI.cream);
    const checkH = h * 0.04;
    doc.rect(x, y + h * 0.27, w, checkH, "F");
    doc.rect(x, y + h * 0.78, w, checkH, "F");
    // Tiny check pattern in the cream pinstripes
    doc.setFillColor(MAASAI.black);
    const step = 18;
    for (let cx = x; cx < x + w; cx += step * 2) {
      doc.rect(cx, y + h * 0.27, step, checkH, "F");
      doc.rect(cx + step, y + h * 0.78, step, checkH, "F");
    }
  };

  // Beaded dot border around a rect
  const drawBeadedFrame = (
    doc: jsPDF,
    x: number,
    y: number,
    w: number,
    h: number,
  ) => {
    const palette = [MAASAI.red, MAASAI.white, MAASAI.blue, MAASAI.black];
    const r = 3;
    const step = 12;
    let i = 0;
    const dot = (cx: number, cy: number) => {
      doc.setFillColor(palette[i % palette.length]);
      doc.circle(cx, cy, r, "F");
      i++;
    };
    for (let cx = x; cx <= x + w; cx += step) dot(cx, y);
    for (let cy = y; cy <= y + h; cy += step) dot(x + w, cy);
    for (let cx = x + w; cx >= x; cx -= step) dot(cx, y + h);
    for (let cy = y + h; cy >= y; cy -= step) dot(x, cy);
  };

  const buildPdf = async () => {
    const W = 1080;
    const H = 1350;
    const doc = new jsPDF({ unit: "pt", format: [W, H], orientation: "portrait" });

    // Pre-load images in parallel
    const imageData = await Promise.all(
      items.map((it) => (it.img ? loadImageAsDataUrl(it.img) : Promise.resolve(null))),
    );

    const drawPageChrome = (pageLabel: string) => {
      // Cream background
      doc.setFillColor(MAASAI.cream);
      doc.rect(0, 0, W, H, "F");
      // Top shuka band
      drawShukaBand(doc, 0, 0, W, 70);
      // Bottom shuka band
      drawShukaBand(doc, 0, H - 70, W, 70);
      // Footer text strip
      doc.setFont("helvetica", "bold");
      doc.setFontSize(11);
      doc.setTextColor(MAASAI.cream);
      doc.text("LULUCLOTHLINE.COM", 60, H - 30);
      const handle = "@LULU_CLOTHLINE  ·  WHATSAPP 0714 844 809";
      const hw = doc.getTextWidth(handle);
      doc.text(handle, W - 60 - hw, H - 30);
      // Page label
      doc.setFont("helvetica", "normal");
      doc.setFontSize(9);
      doc.setTextColor(MAASAI.cream);
      const plw = doc.getTextWidth(pageLabel);
      doc.text(pageLabel, (W - plw) / 2, 42);
    };

    const drawHeader = () => {
      // Title block
      doc.setTextColor(MAASAI.ink);
      doc.setFont("helvetica", "bold");
      doc.setFontSize(72);
      doc.text("MY WISHLIST", 60, 200);
      // Red underline
      doc.setFillColor(MAASAI.red);
      doc.rect(60, 215, 220, 8, "F");
      doc.setFillColor(MAASAI.blue);
      doc.rect(285, 215, 80, 8, "F");
      doc.setFillColor(MAASAI.black);
      doc.rect(370, 215, 40, 8, "F");

      // Subtitle
      doc.setFont("helvetica", "normal");
      doc.setFontSize(18);
      doc.setTextColor(MAASAI.ink);
      doc.text("Lulu Clothline  ·  Maasai-inspired couture", 60, 260);

      // Right-side stamp
      doc.setDrawColor(MAASAI.red);
      doc.setLineWidth(2);
      doc.circle(W - 140, 200, 70, "S");
      doc.setFont("helvetica", "bold");
      doc.setFontSize(12);
      doc.setTextColor(MAASAI.red);
      const stamp1 = `${items.length}`;
      doc.setFontSize(56);
      const sw = doc.getTextWidth(stamp1);
      doc.text(stamp1, W - 140 - sw / 2, 210);
      doc.setFontSize(10);
      const stamp2 = items.length === 1 ? "PIECE" : "PIECES";
      const sw2 = doc.getTextWidth(stamp2);
      doc.text(stamp2, W - 140 - sw2 / 2, 235);
    };

    // Layout: 2 columns of cards
    const startY = 310;
    const gridLeft = 60;
    const gridRight = W - 60;
    const colGap = 40;
    const cols = 2;
    const cardW = (gridRight - gridLeft - colGap * (cols - 1)) / cols;
    const imgH = cardW; // square
    const cardH = imgH + 90; // image + caption
    const rowGap = 50;

    let pageNum = 1;
    const totalPagesEst = Math.max(
      1,
      Math.ceil(items.length / 4), // first page fits 4 (after header)
    );
    drawPageChrome(`PAGE 01 / ${String(totalPagesEst).padStart(2, "0")}`);
    drawHeader();

    let cursorY = startY;
    let col = 0;
    let total = 0;

    const startNewPage = () => {
      doc.addPage();
      pageNum += 1;
      drawPageChrome(`PAGE ${String(pageNum).padStart(2, "0")} / ${String(totalPagesEst).padStart(2, "0")}`);
      cursorY = 130;
      col = 0;
    };

    items.forEach((it, idx) => {
      // Page break check (need cardH + bottom band space)
      if (cursorY + cardH > H - 110) {
        startNewPage();
      }

      const x = gridLeft + col * (cardW + colGap);
      const y = cursorY;

      // Image area background
      doc.setFillColor(MAASAI.white);
      doc.rect(x, y, cardW, imgH, "F");
      const img = imageData[idx];
      if (img) {
        // Cover-fit: keep aspect, center-crop into the square
        const ratio = img.w / img.h;
        let drawW = cardW;
        let drawH = cardW / ratio;
        if (drawH < imgH) {
          drawH = imgH;
          drawW = imgH * ratio;
        }
        const dx = x + (cardW - drawW) / 2;
        const dy = y + (imgH - drawH) / 2;
        // clip to square
        const ctx = (doc as unknown as { internal: { pageSize: { getWidth: () => number } } });
        void ctx;
        // jsPDF doesn't easily clip, so draw image then cover edges with cream rectangles
        doc.addImage(img.data, "JPEG", dx, dy, drawW, drawH, undefined, "FAST");
        // Mask overflow on top/bottom/sides with cream
        doc.setFillColor(MAASAI.cream);
        if (dy < y) doc.rect(x - 2, y - 2, cardW + 4, y - dy + 2, "F");
        if (dy + drawH > y + imgH)
          doc.rect(x - 2, y + imgH, cardW + 4, dy + drawH - (y + imgH) + 4, "F");
        if (dx < x) doc.rect(x - (x - dx) - 2, y, x - dx + 2, imgH, "F");
        if (dx + drawW > x + cardW)
          doc.rect(x + cardW, y, dx + drawW - (x + cardW) + 4, imgH, "F");
      } else {
        doc.setTextColor(MAASAI.ink);
        doc.setFontSize(14);
        doc.text("(image)", x + cardW / 2 - 20, y + imgH / 2);
      }

      // Beaded frame around image
      drawBeadedFrame(doc, x, y, cardW, imgH);

      // Index badge
      const badgeR = 22;
      doc.setFillColor(MAASAI.red);
      doc.circle(x + badgeR, y + badgeR, badgeR, "F");
      doc.setTextColor(MAASAI.cream);
      doc.setFont("helvetica", "bold");
      doc.setFontSize(16);
      const numStr = String(idx + 1).padStart(2, "0");
      const numW = doc.getTextWidth(numStr);
      doc.text(numStr, x + badgeR - numW / 2, y + badgeR + 5);

      // Caption
      doc.setTextColor(MAASAI.ink);
      doc.setFont("helvetica", "bold");
      doc.setFontSize(20);
      const name = it.name.length > 32 ? it.name.slice(0, 30) + "…" : it.name;
      doc.text(name, x, y + imgH + 36);

      // Price
      if (it.price > 0) {
        doc.setFont("helvetica", "normal");
        doc.setFontSize(14);
        doc.setTextColor(MAASAI.red);
        doc.text(`KSh ${it.price.toLocaleString()}`, x, y + imgH + 60);
        total += it.price;
      }

      // Tiny chevron divider
      doc.setFillColor(MAASAI.black);
      doc.rect(x, y + imgH + 76, 36, 3, "F");
      doc.setFillColor(MAASAI.blue);
      doc.rect(x + 40, y + imgH + 76, 18, 3, "F");

      col += 1;
      if (col >= cols) {
        col = 0;
        cursorY += cardH + rowGap;
      }
    });

    // Total summary card on last page (if room, else new page)
    if (total > 0) {
      const summaryH = 110;
      if (cursorY + summaryH > H - 110) startNewPage();
      const sy = cursorY + (col === 0 ? 0 : cardH + rowGap);
      const sx = gridLeft;
      const sw = gridRight - gridLeft;
      doc.setFillColor(MAASAI.ink);
      doc.rect(sx, sy, sw, summaryH, "F");
      // Shuka accent strip on left edge
      doc.setFillColor(MAASAI.red);
      doc.rect(sx, sy, 14, summaryH, "F");
      doc.setFillColor(MAASAI.blue);
      doc.rect(sx + 14, sy, 6, summaryH, "F");
      // Text
      doc.setTextColor(MAASAI.cream);
      doc.setFont("helvetica", "normal");
      doc.setFontSize(12);
      doc.text("ESTIMATED TOTAL", sx + 40, sy + 38);
      doc.setFont("helvetica", "bold");
      doc.setFontSize(36);
      doc.text(`KSh ${total.toLocaleString()}`, sx + 40, sy + 80);
      // CTA
      doc.setFont("helvetica", "normal");
      doc.setFontSize(11);
      const cta = "DM @LULU_CLOTHLINE TO ORDER →";
      const cw = doc.getTextWidth(cta);
      doc.setTextColor(MAASAI.red);
      doc.text(cta, sx + sw - 30 - cw, sy + 70);
    }

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