export function InfoRow({
  icon,
  label,
  value,
}: {
  icon?: React.ReactNode;
  label: string;
  value?: React.ReactNode;
}) {
  return (
    <div className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white px-4 py-3">
      {icon ? <div className="text-slate-600">{icon}</div> : null}
      <div className="flex flex-col">
        <span className="text-xs font-medium text-slate-500">{label}</span>
        <span className="text-sm font-semibold text-slate-800">
          {value ?? "—"}
        </span>
      </div>
    </div>
  );
}
