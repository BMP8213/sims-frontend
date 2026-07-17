export default function SearchBar({ value, onChange, placeholder = 'Search...' }) {
  return (
    <div className="relative">
      <span className="pointer-events-none absolute inset-y-0 left-4 flex items-center text-slate-400">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-4 w-4">
          <circle cx="11" cy="11" r="6" />
          <path d="m20 20-4.2-4.2" />
        </svg>
      </span>
      <input
        value={value}
        onChange={(event) => onChange(event.target.value)}
        type="search"
        placeholder={placeholder}
        className="w-full rounded-2xl border border-slate-300 bg-white py-3 pl-11 pr-4 text-sm shadow-sm outline-none transition focus:border-brand-500 focus:ring-2 focus:ring-brand-100"
      />
    </div>
  );
}
