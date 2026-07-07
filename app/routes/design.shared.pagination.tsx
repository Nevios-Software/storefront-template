import { DesignShell, Specimen, PropsTable, RuleBox } from "~/design/design-shell";
import { Pagination } from "~/components/shared/pagination";

export function meta() {
  return [{ title: "Pagination — /design" }];
}

export default function PaginationSpecimen() {
  return (
    <DesignShell
      activeGroup="shared"
      activeSlug="pagination"
      title="Pagination"
      description="URL-driven ?page=N links — SSR'd, shareable, back-button friendly. Windows long ranges as 1 … around-current … last."
    >
      <Specimen className="flex flex-col gap-6">
        <Pagination total={36} pageSize={12} page={2} />
        <Pagination total={240} pageSize={12} page={9} />
      </Specimen>
      <PropsTable
        rows={[
          { name: "total", type: "number", description: "Total item count (SDK list total_count)." },
          { name: "pageSize", type: "number", description: "Items per page — must match the loader's limit." },
          { name: "page", type: "number", description: "Current 1-based page (from the URL)." },
        ]}
      />
      <RuleBox>
        Pair with a loader that reads <code>?page</code> and passes{" "}
        <code>offset/limit</code> to the SDK — see <code>collections.$handle.tsx</code>.
      </RuleBox>
    </DesignShell>
  );
}
