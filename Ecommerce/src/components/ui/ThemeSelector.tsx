'use client';

import { Monitor, Moon, Sun } from 'lucide-react';
import { useTheme, type ThemeMode } from '@/context/ThemeContext';

const options: Array<{ value: ThemeMode; label: string; icon: typeof Sun }> = [
  { value: 'light', label: 'Light', icon: Sun },
  { value: 'dark', label: 'Dark', icon: Moon },
  { value: 'system', label: 'System', icon: Monitor },
];

export default function ThemeSelector({ compact = false }: { compact?: boolean }) {
  const { theme, setTheme } = useTheme();

  return (
    <div
      className="flex items-center gap-1 rounded-lg border border-divider bg-white p-1 dark:bg-slate-900"
      role="radiogroup"
      aria-label="Color theme"
    >
      {options.map(({ value, label, icon: Icon }) => (
        <button
          key={value}
          type="button"
          role="radio"
          aria-checked={theme === value}
          title={label}
          onClick={() => setTheme(value)}
          className={`flex items-center justify-center gap-1.5 rounded-md px-2 py-1.5 text-xs font-medium transition-colors ${
            theme === value
              ? 'bg-primary text-white'
              : 'text-text-secondary hover:bg-bg-secondary hover:text-primary'
          }`}
        >
          <Icon className="h-4 w-4" />
          {!compact && <span>{label}</span>}
        </button>
      ))}
    </div>
  );
}
