import { useState } from "react";
import { Heart, X, Trash2, ShoppingBag, Share2, Check, Copy, MessageCircle, Download } from "lucide-react";
import { useWishlist } from "@/lib/wishlist";
import { useCart } from "@/lib/cart";

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
  const [downloading, setDownloading] = useState(false);

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

  const loadImage = (url: string): Promise<HTMLImageElement | null> =>
    new Promise((resolve) => {
      const img = new Image();
      img.crossOrigin = "anonymous";
      img.onload = () => resolve(img);
      img.onerror = () => resolve(null);
      img.src = url;
    });

  const buildImage = async (): Promise<Blob | null> => {
    // Single portrait canvas mirroring the wishlist drawer layout.
    const W = 1080;
    const H = 1350;
    const canvas = document.createElement("canvas");
    canvas.width = W;
    canvas.height = H;
    const ctx = canvas.getContext("2d");
    if (!ctx) return null;

    const C = {
      bg: "#F7F2E8",
      ink: "#1A1612",
      muted: "#7A6F5E",
      hair: "#D9CFBF",
      accent: "#9B2D20",
      thumb: "#EDE6D6",
    };

    ctx.fillStyle = C.bg;
    ctx.fillRect(0, 0, W, H);

    const images = await Promise.all(
      items.map((it) => (it.img ? loadImage(it.img) : Promise.resolve(null))),
    );

    const padX = 80;
    const headerY = 110;

    // Header eyebrow
    ctx.textBaseline = "alphabetic";
    ctx.fillStyle = C.muted;
    ctx.font = "500 16px Helvetica, Arial, sans-serif";
    ctx.textAlign = "left";
    ctx.fillText("LULU  ·  CLOTHLINE", padX, headerY);

    const count = items.length;
    const countLabel = `${count} ${count === 1 ? "ITEM" : "ITEMS"}`;
    ctx.textAlign = "right";
    ctx.fillText(countLabel, W - padX, headerY);

    // Title
    ctx.fillStyle = C.ink;
    ctx.font = "700 76px Georgia, 'Times New Roman', serif";
    ctx.textAlign = "left";
    ctx.fillText("My Lulu Wishlist", padX, headerY + 80);

    ctx.fillStyle = C.muted;
    ctx.font = "400 20px Helvetica, Arial, sans-serif";
    ctx.fillText("Saved pieces from luluclothline.com", padX, headerY + 115);

    // Divider
    ctx.strokeStyle = C.hair;
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(padX, headerY + 145);
    ctx.lineTo(W - padX, headerY + 145);
    ctx.stroke();

    const listTop = headerY + 175;
    const listBottom = H - 200;
    const availH = listBottom - listTop;

    const minRow = 90;
    const maxRow = 200;
    const rowH = Math.max(minRow, Math.min(maxRow, availH / Math.max(count, 1)));
    const thumbH = rowH - 20;
    const thumbW = thumbH * (20 / 24);

    let total = 0;
    items.forEach((it, idx) => {
      const y = listTop + idx * rowH;
      if (y + thumbH > listBottom + 4) return;

      // Thumbnail with object-cover clipping
      ctx.fillStyle = C.thumb;
      ctx.fillRect(padX, y, thumbW, thumbH);
      const img = images[idx];
      if (img && img.width && img.height) {
        ctx.save();
        ctx.beginPath();
        ctx.rect(padX, y, thumbW, thumbH);
        ctx.clip();
        const ratio = img.width / img.height;
        let drawW = thumbW;
        let drawH = thumbW / ratio;
        if (drawH < thumbH) {
          drawH = thumbH;
          drawW = thumbH * ratio;
        }
        const dx = padX + (thumbW - drawW) / 2;
        const dy = y + (thumbH - drawH) / 2;
        ctx.drawImage(img, dx, dy, drawW, drawH);
        ctx.restore();
      }

      // Text block
      const textX = padX + thumbW + 28;
      ctx.fillStyle = C.ink;
      ctx.font = `700 ${Math.round(Math.min(28, Math.max(20, rowH * 0.18)))}px Georgia, 'Times New Roman', serif`;
      ctx.textAlign = "left";
      const maxNameW = W - textX - padX - 200;
      let name = it.name;
      while (ctx.measureText(name).width > maxNameW && name.length > 4) {
        name = name.slice(0, -1);
      }
      if (name !== it.name) name = name.slice(0, -1) + "…";
      ctx.fillText(name, textX, y + thumbH * 0.45);

      ctx.fillStyle = C.muted;
      ctx.font = "400 15px Helvetica, Arial, sans-serif";
      ctx.fillText(`Item ${String(idx + 1).padStart(2, "0")}`, textX, y + thumbH * 0.7);

      if (it.price > 0) {
        ctx.fillStyle = C.ink;
        ctx.font = "700 20px Helvetica, Arial, sans-serif";
        ctx.textAlign = "right";
        ctx.fillText(`KSh ${it.price.toLocaleString()}`, W - padX, y + thumbH * 0.45);
        total += it.price;
      }

      if (idx < count - 1) {
        ctx.strokeStyle = C.hair;
        ctx.lineWidth = 0.8;
        ctx.beginPath();
        ctx.moveTo(padX, y + rowH - 6);
        ctx.lineTo(W - padX, y + rowH - 6);
        ctx.stroke();
      }
    });

    // Total
    if (total > 0) {
      const ty = listBottom + 30;
      ctx.strokeStyle = C.hair;
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(padX, ty - 20);
      ctx.lineTo(W - padX, ty - 20);
      ctx.stroke();

      ctx.fillStyle = C.muted;
      ctx.font = "500 15px Helvetica, Arial, sans-serif";
      ctx.textAlign = "left";
      ctx.fillText("TOTAL", padX, ty + 14);

      ctx.fillStyle = C.ink;
      ctx.font = "700 46px Georgia, 'Times New Roman', serif";
      ctx.textAlign = "right";
      ctx.fillText(`KSh ${total.toLocaleString()}`, W - padX, ty + 18);
    }

    // Footer
    ctx.fillStyle = C.muted;
    ctx.font = "400 15px Helvetica, Arial, sans-serif";
    ctx.textAlign = "left";
    ctx.fillText("luluclothline.com", padX, H - 70);
    ctx.textAlign = "right";
    ctx.fillText("@lulu_clothline  ·  WhatsApp 0714 844 809", W - padX, H - 70);

    ctx.fillStyle = C.accent;
    ctx.fillRect(padX, H - 60, 28, 4);

    return await new Promise<Blob | null>((resolve) =>
      canvas.toBlob((b) => resolve(b), "image/png"),
    );
  };

  const handleDownloadImage = async () => {
    if (items.length === 0) return;
    setDownloading(true);
    try {
      const blob = await buildImage();
      if (!blob) return;
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "lulu-wishlist.png";
      document.body.appendChild(a);
      a.click();
      a.remove();
      setTimeout(() => URL.revokeObjectURL(url), 1000);
    } finally {
      setDownloading(false);
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
              onClick={handleDownloadImage}
              disabled={downloading}
              className="tracking-luxury mt-2 inline-flex w-full items-center justify-center gap-2 rounded-full bg-red-900 px-4 py-3 text-[10px] text-background hover:opacity-90 disabled:opacity-60"
            >
              <Download className="h-3.5 w-3.5" />
              {downloading ? "Preparing PNG..." : "Download as PNG"}
            </button>
          </div>
        )}
      </aside>
    </>
  );
}