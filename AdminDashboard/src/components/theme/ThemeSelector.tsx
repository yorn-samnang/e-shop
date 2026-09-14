"use client";

import { MonitorIcon, MoonIcon, SunIcon } from "lucide-react";
import { useTheme, type ThemeMode } from "./ThemeProvider";

const options: Array<{ value: ThemeMode; label: string; icon: typeof SunIcon }> = [
  { value: "light", label: "Light", icon: SunIcon },
  { value: "dark", label: "Dark", icon: MoonIcon },
  { value: "system", label: "System", icon: MonitorIcon },
];

export default function ThemeSelector() {
  const { theme, setTheme } = useTheme();

  return (
    <div className="grid grid-cols-3 gap-1" role="radiogroup" aria-label="Color theme">
      {options.map(({ value, label, icon: Icon }) => (
        <button
          key={value}
          type="button"
          role="radio"
          aria-checked={theme === value}
          onClick={() => setTheme(value)}
          className={`flex flex-col items-center gap-1 rounded-md px-2 py-2 text-xs transition-colors ${
            theme === value
              ? "bg-primary text-white"
              : "text-gray-600 hover:bg-brand-surface hover:text-primary"
          }`}
        >
          <Icon size={16} />
          {label}
        </button>
      ))}
    </div>
  );
}
