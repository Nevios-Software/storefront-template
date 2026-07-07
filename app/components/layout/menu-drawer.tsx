import { Link } from "react-router";
import { ArrowRight, LayoutGrid, Package, Truck, User } from "lucide-react";

import { shop } from "../../../nevios.config";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "~/components/ui/sheet";

/**
 * Mobile navigation drawer — slides in from the left (Sheet's built-in
 * animation). Controlled by the Header; every link closes it on navigate.
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
          <Link to="/collections" onClick={onClose} className={item}>
            <span className="flex items-center gap-3">
              <LayoutGrid className="size-5 text-fg-3" /> Kolekce
            </span>
            <ArrowRight className="size-4 text-fg-4" />
          </Link>
          {shop.nav.map((n) => (
            <Link key={n.handle} to={`/collections/${n.handle}`} onClick={onClose} className={item}>
              <span className="flex items-center gap-3">
                <Package className="size-5 text-fg-3" /> {n.label}
              </span>
              <ArrowRight className="size-4 text-fg-4" />
            </Link>
          ))}
          <Link to="/account" onClick={onClose} className={item}>
            <span className="flex items-center gap-3">
              <User className="size-5 text-fg-3" /> Můj účet
            </span>
            <ArrowRight className="size-4 text-fg-4" />
          </Link>
          <div className="mx-3 my-2 h-px bg-[var(--hairline-soft)]" aria-hidden />
          {[
            { to: "/o-nas", label: "O nás" },
            { to: "/doprava", label: "Doprava a platba", icon: Truck },
            { to: "/kontakt", label: "Kontakt" },
          ].map((l) => (
            <Link
              key={l.to}
              to={l.to}
              onClick={onClose}
              className="rounded-xl px-3 py-2.5 text-sm font-medium text-fg-2 transition-colors duration-base hover:bg-paper-cream-soft hover:text-fg-1"
            >
              {l.label}
            </Link>
          ))}
        </nav>
      </SheetContent>
    </Sheet>
  );
}
