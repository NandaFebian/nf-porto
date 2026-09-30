/** Visible marker for content that is still a TODO in `content/`, so placeholders never pass as real data. */
export function Pending({ what }: { what: string }) {
  return <span className="font-mono text-xs text-fd-muted-foreground">[pending: {what}]</span>;
}
