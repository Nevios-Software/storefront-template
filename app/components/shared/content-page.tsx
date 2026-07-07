import type { ReactNode } from "react";

/**
 * Shell for static content pages (about, shipping, terms…). Each page is one
 * route file that fills this with its own copy — "change the about page" =
 * edit app/routes/o-nas.tsx, nothing else.
 */
export function ContentPage({
  eyebrow,
  title,
  children,
}: {
  eyebrow?: string;
  title: string;
  children: ReactNode;
}) {
  return (
    <article className="section-prose py-10 lg:py-14">
      <header className="mb-8">
        {eyebrow && <p className="eyebrow mb-2">{eyebrow}</p>}
        <h1 className="text-3xl font-bold text-fg-1 sm:text-4xl">{title}</h1>
      </header>
      <div className="flex flex-col gap-4 text-sm leading-relaxed text-fg-2 sm:text-base [&_h2]:mt-4 [&_h2]:text-lg [&_h2]:font-bold [&_h2]:text-fg-1 [&_li]:mt-1 [&_ul]:list-disc [&_ul]:pl-5">
        {children}
      </div>
    </article>
  );
}
