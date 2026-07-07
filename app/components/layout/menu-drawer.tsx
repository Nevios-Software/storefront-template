import { Link } from "react-router";
import {
  ArrowRight,
  FileText,
  Info,
  LayoutGrid,
  Mail,
  Search,
  Truck,
  User,
  type LucideIcon,
} from "lucide-react";

import { shop } from "../../../nevios.config";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "~/components/ui/sheet";

/** Icon per menu href — falls back to a generic page icon for custom routes. */
function iconFor(href: string): LucideIcon {
  if (href.startsWith("/collections")) return LayoutGrid;
  if (href.startsWith("/doprava")) return Truck;
  if (href.startsWith("/kontakt")) return Mail;
  if (href.startsWith("/o-nas")) return Info;
  if (href.startsWith("/search")) return Search;
  return FileText;
}

/**
 * Mobile navigation drawer — slides in from the left (Sheet's built-in
 * animation). Items come from `shop.menu` in nevios.config.ts (the same list
 * the desktop header renders) + the account link. Every link closes it.
 */
export function MenuDrawer({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const item =
    "flex items-center justify-between gap-3 rounded-xl px-3 py-3 text-base font-semibold text-fg-1 transition-colors duration-base hover:bg-paper-cream-soft";
  return (
    <Sheet open={open} onOpenChange={(o) => !o && onClose()}>
      <SheetContent side="left" className="w-[86vw] border-r-0 bg-card sm:max-w-xs">
        <SheetHeader className="pb-0">
          <SheetTitle className="font-display text-xl font-bold text-fg-1">
            {shop.logo.full}
          </SheetTitle>
        </SheetHeader>
        <nav aria-label="Hlavní menu" className="flex flex-col gap-1 px-2">
          {shop.menu.map((n) => {
            const Icon = iconFor(n.href);
            return (
              <Link key={n.href + n.label} to={n.href} onClick={onClose} className={item}>
                <span className="flex items-center gap-3">
                  <Icon className="size-5 text-fg-3" /> {n.label}
                </span>
                <ArrowRight className="size-4 text-fg-4" />
              </Link>
            );
          })}
          <div className="mx-3 my-2 h-px bg-[var(--hairline-soft)]" aria-hidden />
          <Link to="/account" onClick={onClose} className={item}>
            <span className="flex items-center gap-3">
              <User className="size-5 text-fg-3" /> Můj účet
            </span>
            <ArrowRight className="size-4 text-fg-4" />
          </Link>
        </nav>
      </SheetContent>
    </Sheet>
  );
}
