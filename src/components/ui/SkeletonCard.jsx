import React from "react";
import { Card } from "./card";

export default function SkeletonCard({ rows = 2 }) {
  return (
    <Card className="p-4 space-y-3 animate-pulse border-border bg-card">
      <div className="h-4 bg-muted rounded w-1/3" />
      <div className="space-y-2">
        {Array.from({ length: rows }).map((_, idx) => (
          <div key={idx} className="h-3 bg-muted rounded w-full" />
        ))}
      </div>
    </Card>
  );
}
