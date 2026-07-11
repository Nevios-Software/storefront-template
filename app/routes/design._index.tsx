import * as React from "react";
import {
  ArrowRight,
  Heart,
  Search,
  ShoppingBag,
  Star,
  Truck,
  ShieldCheck,
  Sparkles,
  Gift,
  Tag,
  Check,
  Plus,
  Minus,
  User,
  Menu,
  ChevronRight,
} from "lucide-react";

import { cn } from "~/lib/utils";
import { Eyebrow } from "~/components/shared/eyebrow";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { Checkbox } from "~/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import { VerticalCard } from "~/components/product/vertical-card";
import { MediaImage } from "~/components/shared/media-image";
import { Pagination } from "~/components/shared/pagination";
import { ProductGallery } from "~/components/product/product-gallery";
import { registryByGroup } from "~/design/registry";
import { SECTION_DEMOS } from "~/design/section-demos";

export function meta() {
  return [{ title: "/design — design system" }];
}

/**
 * The /design landing — single-page component registry showcase.
 * Floating scroll-spy sidebar (Foundation + Sections) on a soft canvas.
 * Foundation shows tokens/primitives in cards; Sections renders the whole
 * section library LIVE inline, each on a white "storefront page" card.
 */
const FOUNDATION = [
  { id: "colors", label: "Colors" },
  { id: "typography", label: "Typography" },
  { id: "buttons", label: "Buttons" },
  { id: "icons", label: "Icons" },
  { id: "cards", label: "Cards" },
  { id: "forms", label: "Forms" },
  { id: "images", label: "Images" },
  { id: "pagination", label: "Pagination" },
  { id: "gallery", label: "Product gallery" },
];

const SECTIONS = registryByGroup("sections")
  .filter((e) => SECTION_DEMOS[e.slug])
  .map((e) => ({ id: `sec-${e.slug}`, label: e.title, slug: e.slug }));

const ALL_IDS = [...FOUNDATION.map((f) => f.id), ...SECTIONS.map((s) => s.id)];

const CANVAS_STYLE: React.CSSProperties = {
  backgroundColor: "var(--paper-cream)",
  backgroundImage:
    "linear-gradient(var(--hairline-soft) 1px, transparent 1px), linear-gradient(90deg, var(--hairline-soft) 1px, transparent 1px)",
  backgroundSize: "22px 22px",
};

export default function DesignHub() {
  const [active, setActive] = React.useState("colors");

  // Scroll-spy — mark the anchor nearest the top of the viewport as active.
  React.useEffect(() => {
    const els = ALL_IDS.map((id) => document.getElementById(id)).filter(Boolean) as HTMLElement[];
    const obs = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible[0]) setActive(visible[0].target.id);
      },
      { rootMargin: "-15% 0px -75% 0px", threshold: 0 },
    );
    els.forEach((el) => obs.observe(el));
    return () => obs.disconnect();
  }, []);

  const go = (id: string) => (e: React.MouseEvent) => {
    e.preventDefault();
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
    setActive(id);
  };

  return (
    <div className="min-h-dvh w-full" style={CANVAS_STYLE}>
      {/* Floating sidebar — two groups, scrollable when tall. */}
      <aside className="fixed top-1/2 left-4 z-30 hidden max-h-[92vh] w-56 -translate-y-1/2 flex-col gap-4 overflow-y-auto rounded-2xl bg-card p-3 shadow-[0_2px_16px_rgba(40,38,35,0.08)] lg:flex">
        <NavGroup label="Foundation" items={FOUNDATION} active={active} onGo={go} />
        <NavGroup label="Sections" items={SECTIONS} active={active} onGo={go} />
      </aside>

      {/* Content */}
      <main className="mx-auto max-w-[1180px] px-6 py-14 lg:pl-64">
        <header className="mb-12 max-w-2xl">
          <Eyebrow tone="coral" margin="sm">
            Design system
          </Eyebrow>
          <h1 className="font-display text-4xl font-bold text-fg-1 sm:text-5xl">/design</h1>
          <p className="mt-3 text-base text-fg-2">
            Component & foundation registry — live specimens, not screenshots.
          </p>
        </header>

        {/* ── FOUNDATION ─────────────────────────────────────────────── */}
        <div className="flex flex-col gap-16">
          <Section id="colors" title="Colors">
            <div className="grid gap-4 sm:grid-cols-2">
              <ShowcaseCard label="brand ramp · tokens">
                <div className="flex flex-wrap gap-3">
                  {[
                    { name: "brand", token: "--brand" },
                    { name: "brand soft", token: "--brand-soft" },
                    { name: "brand accent", token: "--brand-accent" },
                    { name: "paper cream", token: "--paper-cream" },
                    { name: "paper peach", token: "--paper-peach" },
                    { name: "ink", token: "--fg-1" },
                  ].map((c) => (
                    <div key={c.token} className="flex flex-col gap-1.5">
                      <span
                        className="size-12 rounded-lg ring-1 ring-inset ring-[var(--hairline-soft)]"
                        style={{ backgroundColor: `var(${c.token})` }}
                      />
                      <span className="text-xs font-medium text-fg-1">{c.name}</span>
                      <span className="num text-[11px] text-fg-3">{c.token}</span>
                    </div>
                  ))}
                </div>
              </ShowcaseCard>
              <ShowcaseCard label="gradient · brand → accent">
                <div className="flex flex-col gap-3">
                  <div
                    className="h-16 rounded-xl"
                    style={{ background: "linear-gradient(90deg, var(--brand), var(--brand-accent))" }}
                  />
                  <span className="num text-xs text-fg-3">90° · --brand → --brand-accent</span>
                </div>
              </ShowcaseCard>
            </div>
          </Section>

          <Section id="typography" title="Typography">
            <div className="grid gap-4 sm:grid-cols-2">
              <ShowcaseCard label="display · font-display">
                <p className="font-display text-5xl leading-none font-bold text-fg-1">
                  Big and bold.
                </p>
                <p className="mt-3 font-display text-2xl font-bold text-brand">Brand moment.</p>
              </ShowcaseCard>
              <ShowcaseCard label="Satoshi · headings & body">
                <div className="flex flex-col gap-2">
                  <p className="text-2xl font-bold text-fg-1">Heading 24 / Bold</p>
                  <p className="text-lg font-medium text-fg-1">Subheading 18 / Medium</p>
                  <p className="text-sm leading-relaxed text-fg-2">
                    Body text 14 / Regular — calm and readable. One sans carries the whole UI.
                  </p>
                  <span className="eyebrow text-fg-3">Eyebrow · 11 / 500 / caps</span>
                </div>
              </ShowcaseCard>
            </div>
          </Section>

          <Section id="buttons" title="Buttons">
            <div className="grid gap-4 sm:grid-cols-2">
              <ShowcaseCard label="variants">
                <div className="flex flex-wrap items-center gap-3">
                  <Button>Primary</Button>
                  <Button variant="outline">Secondary</Button>
                  <Button variant="ghost">Ghost</Button>
                  <Button variant="link">Link</Button>
                </div>
              </ShowcaseCard>
              <ShowcaseCard label="icons + sizes">
                <div className="flex flex-wrap items-center gap-3">
                  <Button size="sm">
                    <ShoppingBag className="size-4" /> Add to cart
                  </Button>
                  <Button size="icon-sm" variant="outline" aria-label="Wishlist">
                    <Heart className="size-4" />
                  </Button>
                  <Button size="icon-lg" aria-label="Add">
                    <Plus className="size-5" />
                  </Button>
                </div>
              </ShowcaseCard>
            </div>
          </Section>

          <Section id="icons" title="Icons">
            <ShowcaseCard label="lucide-react · 1.75 stroke">
              <div className="flex flex-wrap gap-5 text-fg-2">
                {[
                  ShoppingBag,
                  Heart,
                  Search,
                  Star,
                  Truck,
                  ShieldCheck,
                  Sparkles,
                  Gift,
                  Tag,
                  Check,
                  Plus,
                  Minus,
                  User,
                  Menu,
                  ArrowRight,
                  ChevronRight,
                ].map((Icon, i) => (
                  <Icon key={i} className="size-6" strokeWidth={1.75} />
                ))}
              </div>
            </ShowcaseCard>
          </Section>

          <Section id="cards" title="Cards">
            {/* Card-components render directly — no wrapper card. */}
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              <VerticalCard
                href="#"
                name="Compass Trail Cap"
                image=""
                price={590}
                badge={{ label: "New", tone: "new" }}
                rating={{ value: 4.8, count: 214 }}
              />
              <VerticalCard
                href="#"
                name="Piston Engineer Boots"
                image=""
                price={2490}
                originalPrice={2990}
                badge={{ label: "Sale", tone: "sale" }}
                rating={{ value: 4.5, count: 128 }}
              />
              <VerticalCard href="#" name="Dune Linen Shorts" image="" price={890} variant="plain" />
            </div>
          </Section>

          <Section id="forms" title="Forms">
            <ShowcaseCard label="Input · Select · Checkbox">
              <div className="flex max-w-md flex-col gap-4">
                <div className="flex flex-col gap-1.5">
                  <Label htmlFor="ds-email">Email</Label>
                  <Input id="ds-email" type="email" placeholder="you@example.com" />
                </div>
                <div className="flex flex-col gap-1.5">
                  <Label>Category</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Choose…" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="apparel">Apparel</SelectItem>
                      <SelectItem value="footwear">Footwear</SelectItem>
                      <SelectItem value="home">Home</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <label className="flex items-center gap-2.5 text-sm text-fg-2">
                  <Checkbox defaultChecked /> I agree to the terms
                </label>
              </div>
            </ShowcaseCard>
          </Section>

          <Section id="images" title="Images">
            <ShowcaseCard label="MediaImage · CDN resize + placeholder">
              <div className="flex flex-wrap items-end gap-6">
                <figure className="flex flex-col gap-1.5">
                  <MediaImage
                    src="https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=320&q=80"
                    alt="Sample"
                    width={160}
                    className="size-40 rounded-xl object-cover"
                  />
                  <figcaption className="text-xs text-fg-3">with image</figcaption>
                </figure>
                <figure className="flex flex-col gap-1.5">
                  <MediaImage src="" alt="No image" className="size-40 rounded-xl" />
                  <figcaption className="text-xs text-fg-3">empty src → placeholder</figcaption>
                </figure>
              </div>
            </ShowcaseCard>
          </Section>

          <Section id="pagination" title="Pagination">
            <ShowcaseCard label="Pagination · ?page=N">
              <Pagination total={120} pageSize={12} page={2} />
            </ShowcaseCard>
          </Section>

          <Section id="gallery" title="Product gallery">
            <ShowcaseCard label="ProductGallery · empty state">
              <div className="max-w-sm">
                <ProductGallery media={[]} alt="Demo product" />
              </div>
            </ShowcaseCard>
          </Section>
        </div>

        {/* ── SECTIONS (live library) ────────────────────────────────── */}
        <div className="mt-16">
          <h2 className="mb-2 font-display text-2xl font-bold text-fg-1">Sections</h2>
          <p className="mb-8 max-w-2xl text-sm text-fg-2">
            The full section library — live, each on a white card the color of a normal store page.
          </p>
          <div className="flex flex-col gap-8">
            {SECTIONS.map((s) => (
              <SectionCard key={s.id} id={s.id} title={s.label}>
                <PreviewFrame>{SECTION_DEMOS[s.slug]}</PreviewFrame>
              </SectionCard>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}

/** One labelled group of scroll-spy links in the sidebar. */
function NavGroup({
  label,
  items,
  active,
  onGo,
}: {
  label: string;
  items: { id: string; label: string }[];
  active: string;
  onGo: (id: string) => (e: React.MouseEvent) => void;
}) {
  return (
    <div className="flex flex-col gap-0.5">
      <p className="px-3 pb-1 text-[10px] font-semibold tracking-wider text-fg-4 uppercase">
        {label}
      </p>
      {items.map((n) => (
        <a
          key={n.id}
          href={`#${n.id}`}
          onClick={onGo(n.id)}
          aria-current={active === n.id ? "true" : undefined}
          className={cn(
            "truncate rounded-pill px-3 py-1.5 text-sm font-medium transition-colors duration-base",
            active === n.id ? "bg-brand text-white" : "text-fg-2 hover:text-brand",
          )}
        >
          {n.label}
        </a>
      ))}
    </div>
  );
}

/**
 * Renders a full-width section at a real desktop width and proportionally
 * scales it down to fit the card — a faithful shrunk-page preview. Nothing
 * about the section's own layout/logic changes; only the visual scale.
 */
function PreviewFrame({
  width = 1280,
  children,
}: {
  width?: number;
  children: React.ReactNode;
}) {
  const outerRef = React.useRef<HTMLDivElement>(null);
  const innerRef = React.useRef<HTMLDivElement>(null);
  const [scale, setScale] = React.useState(1);
  const [height, setHeight] = React.useState<number | undefined>(undefined);

  React.useEffect(() => {
    const outer = outerRef.current;
    const inner = innerRef.current;
    if (!outer || !inner) return;
    const update = () => {
      const s = Math.min(1, outer.clientWidth / width);
      setScale(s);
      setHeight(inner.offsetHeight * s); // offsetHeight ignores transform → no loop
    };
    const ro = new ResizeObserver(update);
    ro.observe(outer);
    ro.observe(inner);
    update();
    return () => ro.disconnect();
  }, [width]);

  return (
    <div ref={outerRef} className="overflow-hidden" style={{ height }}>
      <div
        ref={innerRef}
        style={{ width, transform: `scale(${scale})`, transformOrigin: "top left" }}
      >
        {children}
      </div>
    </div>
  );
}

function Section({
  id,
  title,
  children,
}: {
  id: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section id={id} className="scroll-mt-10">
      <h2 className="mb-4 font-display text-2xl font-bold text-fg-1">{title}</h2>
      {children}
    </section>
  );
}

/** A live section demo on a white "storefront page" card — no ring. */
function SectionCard({
  id,
  title,
  children,
}: {
  id: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section
      id={id}
      className="scroll-mt-10 rounded-3xl bg-page p-5 shadow-[0_2px_10px_rgba(0,0,0,0.03)] sm:p-7"
    >
      <div className="mb-4">
        <h3 className="text-sm font-semibold text-fg-1">{title}</h3>
      </div>
      {children}
    </section>
  );
}

/** White card wrapper for foundation components that aren't cards themselves. */
function ShowcaseCard({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="rounded-2xl bg-page p-6 shadow-[0_2px_10px_rgba(0,0,0,0.03)]">
      <p className="mb-4 text-xs text-fg-3">{label}</p>
      {children}
    </div>
  );
}
