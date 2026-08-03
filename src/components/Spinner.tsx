export default function Spinner({ label }: { label?: string }) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-24 text-slate-400">
      <div className="h-9 w-9 rounded-full border-2 border-sky-500 border-t-transparent animate-spin" />
      {label && <p className="text-sm">{label}</p>}
    </div>
  );
}
