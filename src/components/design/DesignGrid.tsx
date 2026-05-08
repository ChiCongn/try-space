import type { SavedDesign } from "../../types";
import { DesignCard } from "./DesignCard";

interface DesignGridProps {
  designs: SavedDesign[];
}

export function DesignGrid({ designs }: DesignGridProps) {
  return (
    <div className="design-grid">
      {designs.map((design) => (
        <DesignCard design={design} key={design.id} />
      ))}
    </div>
  );
}
