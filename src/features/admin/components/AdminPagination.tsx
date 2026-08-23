export function AdminPagination({
  total,
  itemCount,
  offset,
  pageSize,
  itemLabel,
  onOffsetChange,
}: {
  total: number;
  itemCount: number;
  offset: number;
  pageSize: number;
  itemLabel: string;
  onOffsetChange: (offset: number) => void;
}) {
  return (
    <div className="mt-4 flex items-center justify-between text-sm text-muted">
      <span>
        {total === 0
          ? `0 ${itemLabel}`
          : `${offset + 1}–${Math.min(offset + itemCount, total)} of ${total}`}
      </span>
      <div className="flex gap-2">
        <button
          type="button"
          onClick={() => onOffsetChange(Math.max(0, offset - pageSize))}
          disabled={offset === 0}
          className="incar-focus min-h-9 rounded-md border border-border px-3 text-xs font-semibold text-metallic-silver hover:text-white disabled:cursor-not-allowed disabled:opacity-40"
        >
          Previous
        </button>
        <button
          type="button"
          onClick={() => onOffsetChange(offset + pageSize)}
          disabled={offset + pageSize >= total}
          className="incar-focus min-h-9 rounded-md border border-border px-3 text-xs font-semibold text-metallic-silver hover:text-white disabled:cursor-not-allowed disabled:opacity-40"
        >
          Next
        </button>
      </div>
    </div>
  );
}
