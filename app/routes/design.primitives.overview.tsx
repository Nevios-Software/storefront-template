import { DesignShell, Specimen, RuleBox } from "~/design/design-shell";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { Badge } from "~/components/ui/badge";
import { Checkbox } from "~/components/ui/checkbox";
import { Skeleton } from "~/components/ui/skeleton";
import { Separator } from "~/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/components/ui/dialog";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "~/components/ui/sheet";

export function meta() {
  return [{ title: "Primitives — /design" }];
}

/**
 * shadcn/ui base — installed via `pnpm dlx shadcn@latest add <name>`, then
 * de-skinned to this store's tokens (see components.json + app/app.css).
 * These files are otherwise generated: prefer adding a new primitive via the
 * CLI over hand-writing one, so upstream fixes stay easy to pull.
 */
export default function PrimitivesSpecimen() {
  return (
    <DesignShell
      activeGroup="primitives"
      activeSlug="overview"
      title="Primitives"
      description="shadcn/ui, de-skinned to this store's tokens. One button, one shape — variants, not per-call overrides."
    >
      <div className="flex flex-col gap-10">
        <Block title="Button">
          <Specimen className="flex flex-wrap items-center gap-3">
            <Button>Default</Button>
            <Button variant="secondary">Secondary</Button>
            <Button variant="outline">Outline</Button>
            <Button variant="ghost">Ghost</Button>
            <Button variant="destructive">Destructive</Button>
            <Button variant="link">Link</Button>
            <Button size="sm">Small</Button>
            <Button size="lg">Large</Button>
            <Button disabled>Disabled</Button>
          </Specimen>
        </Block>

        <Block title="Input + Label">
          <Specimen className="max-w-sm space-y-2">
            <Label htmlFor="demo-email">E-mailová adresa</Label>
            <Input id="demo-email" type="email" placeholder="vas@email.cz" />
          </Specimen>
        </Block>

        <Block title="Badge">
          <Specimen className="flex flex-wrap items-center gap-3">
            <Badge>Default</Badge>
            <Badge variant="secondary">Secondary</Badge>
            <Badge variant="outline">Outline</Badge>
            <Badge variant="destructive">Destructive</Badge>
          </Specimen>
        </Block>

        <Block title="Checkbox">
          <Specimen className="flex items-center gap-2">
            <Checkbox id="demo-check" defaultChecked />
            <Label htmlFor="demo-check">Souhlasím s obchodními podmínkami</Label>
          </Specimen>
        </Block>

        <Block title="Select">
          <Specimen className="max-w-xs">
            <Select defaultValue="cz">
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="cz">Česko</SelectItem>
                <SelectItem value="en">International</SelectItem>
              </SelectContent>
            </Select>
          </Specimen>
        </Block>

        <Block title="Tabs">
          <Specimen>
            <Tabs defaultValue="popis">
              <TabsList>
                <TabsTrigger value="popis">Popis</TabsTrigger>
                <TabsTrigger value="doprava">Doprava</TabsTrigger>
              </TabsList>
              <TabsContent value="popis" className="pt-3 text-sm text-fg-2">
                Popis produktu se vykresluje zde.
              </TabsContent>
              <TabsContent value="doprava" className="pt-3 text-sm text-fg-2">
                Informace o dopravě se vykreslují zde.
              </TabsContent>
            </Tabs>
          </Specimen>
        </Block>

        <Block title="Dialog + Sheet">
          <Specimen className="flex flex-wrap items-center gap-3">
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="outline">Otevřít dialog</Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Potvrzení</DialogTitle>
                  <DialogDescription>Toto je ukázkový dialog primitivum.</DialogDescription>
                </DialogHeader>
              </DialogContent>
            </Dialog>
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline">Otevřít panel</Button>
              </SheetTrigger>
              <SheetContent>
                <SheetHeader>
                  <SheetTitle>Košík</SheetTitle>
                  <SheetDescription>Slide-out panel primitivum (základ pro CartDrawer).</SheetDescription>
                </SheetHeader>
              </SheetContent>
            </Sheet>
          </Specimen>
        </Block>

        <Block title="Skeleton">
          <Specimen className="max-w-sm space-y-2">
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
            <Skeleton className="h-24 w-full" />
          </Specimen>
        </Block>

        <Block title="Separator">
          <Specimen>
            <p className="text-sm text-fg-2">Nad čárou</p>
            <Separator className="my-3" />
            <p className="text-sm text-fg-2">Pod čárou</p>
          </Specimen>
        </Block>
      </div>
      <RuleBox>
        Adding a new shadcn primitive: <code>pnpm dlx shadcn@latest add &lt;name&gt;</code>, then
        register it here. Don't hand-roll a Radix wrapper that already exists upstream.
      </RuleBox>
    </DesignShell>
  );
}

function Block({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section>
      <h2 className="mb-3 text-sm font-bold uppercase tracking-wide text-fg-3">{title}</h2>
      {children}
    </section>
  );
}
