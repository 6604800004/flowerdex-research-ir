import { useState, useEffect, useRef } from "react";
import { Loader2, Sparkles } from "lucide-react";
import { searchSpecies, type PerenualSpecies, isApiKeySet } from "@/lib/perenual";

interface AutofillInputProps {
  value: string;
  onChange: (val: string) => void;
  onSelect: (species: PerenualSpecies) => void;
  className?: string;
  placeholder?: string;
  label: string;
}

export default function AutofillInput({
  value,
  onChange,
  onSelect,
  className = "",
  placeholder,
  label,
}: AutofillInputProps) {
  const [suggestions, setSuggestions] = useState<PerenualSpecies[]>([]);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const wrapRef = useRef<HTMLDivElement>(null);

  // Close on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  useEffect(() => () => { if (debounceRef.current) clearTimeout(debounceRef.current); }, []);

  const handleChange = (val: string) => {
    onChange(val);
    if (debounceRef.current) clearTimeout(debounceRef.current);

    if (val.length < 2 || !isApiKeySet()) {
      setSuggestions([]);
      setOpen(false);
      return;
    }

    setLoading(true);
    debounceRef.current = setTimeout(async () => {
      try {
        const results = await searchSpecies(val);
        setSuggestions(results);
        setOpen(results.length > 0);
      } catch {
        // ignore
      } finally {
        setLoading(false);
      }
    }, 500);
  };

  const handleSelect = (s: PerenualSpecies) => {
    onChange(s.common_name);
    setSuggestions([]);
    setOpen(false);
    onSelect(s);
  };

  return (
    <div ref={wrapRef} className="relative">
      <label className="font-sarabun text-sm text-foreground block mb-1">
        {label}{" "}
        {isApiKeySet() && (
          <span className="text-xs text-muted-foreground">
            <Sparkles className="inline w-3 h-3 mr-0.5" />
            พิมพ์ไทยหรืออังกฤษเพื่อ Autofill
          </span>
        )}
      </label>

      <div className="relative">
        <input
          type="text"
          value={value}
          onChange={(e) => handleChange(e.target.value)}
          onFocus={() => suggestions.length > 0 && setOpen(true)}
          className={className}
          placeholder={placeholder}
          autoComplete="off"
        />
        {loading && (
          <div className="absolute right-2 top-1/2 -translate-y-1/2">
            <Loader2 size={14} className="animate-spin text-muted-foreground" />
          </div>
        )}
      </div>

      {open && suggestions.length > 0 && (
        <div className="absolute z-50 w-full mt-1 bg-popover border border-border rounded-lg shadow-lg max-h-60 overflow-auto">
          {suggestions.map((s) => (
            <button
              key={s.id}
              type="button"
              onClick={() => handleSelect(s)}
              className="flex items-center gap-3 w-full px-3 py-2 text-left hover:bg-muted transition-colors"
            >
              {s.default_image?.thumbnail ? (
                <img
                  src={s.default_image.thumbnail}
                  alt={s.common_name}
                  className="w-8 h-8 rounded object-cover flex-shrink-0"
                />
              ) : (
                <div className="w-8 h-8 rounded bg-muted flex items-center justify-center text-xs flex-shrink-0">
                  🌸
                </div>
              )}
              <div className="min-w-0">
                <p className="font-sarabun text-sm text-foreground truncate">{s.common_name}</p>
                <p className="font-sarabun text-xs text-muted-foreground truncate">
                  {s.scientific_name?.[0]}
                </p>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
