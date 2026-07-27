"use client";

interface AdminSearchBarProps {
  value: string;
  onChange: (value: string) => void;
}

export default function AdminSearchBar({ value, onChange }: AdminSearchBarProps) {
  return (
    <input
      type="text"
      placeholder="بحث..."
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="bg-white border border-stone-200 rounded-md px-3 py-2 text-sm text-stone-900 focus:outline-none focus:border-stone-900 transition-colors w-64"
    />
  );
}
