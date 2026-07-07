import type { ReactNode } from "react";

import { cn } from "~/lib/utils";
import { Eyebrow } from "~/components/shared/eyebrow";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "~/components/ui/accordion";

export interface FaqItem {
  question: string;
  answer: ReactNode;
}

interface FaqProps {
  eyebrow?: string;
  title: string;
  items: FaqItem[];
  className?: string;
}

/** Accordion FAQ — one open panel at a time (shadcn Accordion underneath). */
export function Faq({ eyebrow, title, items, className }: FaqProps) {
  return (
    <section className={cn("section-prose", className)}>
      <header className="mb-6 text-center">
        {eyebrow && (
          <Eyebrow margin="sm" className="flex justify-center">
            {eyebrow}
          </Eyebrow>
        )}
        <h2 className="text-2xl font-bold text-fg-1 sm:text-3xl">{title}</h2>
      </header>
      <Accordion type="single" collapsible className="w-full">
        {items.map((item, i) => (
          <AccordionItem key={i} value={`item-${i}`}>
            <AccordionTrigger className="text-left text-sm font-semibold text-fg-1 sm:text-base">
              {item.question}
            </AccordionTrigger>
            <AccordionContent className="text-sm text-fg-2">{item.answer}</AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </section>
  );
}
