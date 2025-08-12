import React from "react";
import { Accessibility, SunMedium, Moon, Contrast, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";

const FILTERS: Record<string, string> = {
  none: 'none',
  deuteranopia: 'grayscale(20%) contrast(1.1) saturate(0.8)',
  protanopia: 'grayscale(20%) contrast(1.15) saturate(0.75) hue-rotate(-10deg)',
  tritanopia: 'grayscale(20%) contrast(1.15) saturate(0.75) hue-rotate(35deg)',
  grayscale: 'grayscale(100%) contrast(1.1)'
};

const AccessibilityFab: React.FC = () => {
  const [open, setOpen] = React.useState(false);
  const [scale, setScale] = React.useState<number>(1);
  const [themeMode, setThemeMode] = React.useState<'light' | 'dark'>('light');
  const [highContrast, setHighContrast] = React.useState<boolean>(false);
  type FilterMode = 'none' | 'deuteranopia' | 'protanopia' | 'tritanopia' | 'grayscale';
  const [colorFilter, setColorFilter] = React.useState<FilterMode>('none');

  const applyScale = (val: number) => {
    const html = document.documentElement;
    html.style.setProperty('--a11y-scale', String(val));
    localStorage.setItem('a11y-scale', String(val));
    setScale(val);
  };
  const applyTheme = (mode: 'light' | 'dark') => {
    const html = document.documentElement;
    const isDark = mode === 'dark';
    html.classList.toggle('theme-dark', isDark);
    html.classList.toggle('dark', isDark); // Enable Tailwind dark: variants globally
    localStorage.setItem('a11y-theme', mode);
    setThemeMode(mode);
  };
  const applyContrast = (enabled: boolean) => {
    const html = document.documentElement;
    html.classList.toggle('a11y-high-contrast', enabled);
    localStorage.setItem('a11y-contrast', enabled ? 'high' : 'normal');
    setHighContrast(enabled);
  };
  const applyFilter = (mode: FilterMode) => {
    const html = document.documentElement as HTMLElement;
    html.style.setProperty('--a11y-filter', FILTERS[mode]);
    localStorage.setItem('a11y-filter', mode);
    setColorFilter(mode);
  };

  React.useEffect(() => {
    const savedScale = parseFloat(localStorage.getItem('a11y-scale') || '1');
    const theme = (localStorage.getItem('a11y-theme') as 'light' | 'dark') || 'light';
    const contrast = localStorage.getItem('a11y-contrast') === 'high';
    const filter = (localStorage.getItem('a11y-filter') as FilterMode) || 'none';
    applyScale(savedScale);
    applyTheme(theme);
    applyContrast(contrast);
    applyFilter(filter);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const resetAll = () => {
    applyScale(1);
    applyTheme('light');
    applyContrast(false);
    applyFilter('none');
  };

  return (
    <>
      <button
        type="button"
        aria-label="Accessibility settings"
        onClick={() => {
          // Defer state update to next frame for snappy click
          requestAnimationFrame(() => setOpen(true));
        }}
        className="fixed bottom-6 right-6 z-50 h-14 w-14 rounded-full bg-[var(--btn-bg)] text-[var(--btn-fg)] shadow-lg hover:bg-[var(--btn-bg-hover)] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[var(--btn-bg)] flex items-center justify-center"
      >
        <Accessibility className="h-6 w-6" />
      </button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="fixed top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] w-[90%] sm:w-full sm:max-w-lg rounded-2xl border-gray-200/50 shadow-xl will-change-transform" aria-label="Accessibility settings">
          <DialogHeader>
            <DialogTitle>Accessibility</DialogTitle>
            <DialogDescription>Adjust display settings to suit your needs.</DialogDescription>
          </DialogHeader>
          <div className="space-y-6">
            {/* Text size */}
            <div>
              <h3 className="font-medium mb-2">Text size</h3>
              <div className="flex items-center gap-2">
                <Button aria-pressed={scale === 0.875} variant={scale === 0.875 ? 'default' : 'outline'} size="sm" onClick={() => applyScale(0.875)} className="flex items-center gap-2">{scale === 0.875 && <Check className="h-4 w-4"/>} Small</Button>
                <Button aria-pressed={scale === 1} variant={scale === 1 ? 'default' : 'outline'} size="sm" onClick={() => applyScale(1)} className="flex items-center gap-2">{scale === 1 && <Check className="h-4 w-4"/>} Default</Button>
                <Button aria-pressed={scale === 1.25} variant={scale === 1.25 ? 'default' : 'outline'} size="sm" onClick={() => applyScale(1.25)} className="flex items-center gap-2">{scale === 1.25 && <Check className="h-4 w-4"/>} Large</Button>
              </div>
            </div>

            {/* Theme */}
            <div>
              <h3 className="font-medium mb-2">Theme</h3>
              <div className="flex items-center gap-2">
                <Button aria-pressed={themeMode === 'light'} variant={themeMode === 'light' ? 'default' : 'outline'} size="sm" onClick={() => applyTheme('light')} className="flex items-center gap-2">{themeMode === 'light' && <Check className="h-4 w-4"/>}<SunMedium className="h-4 w-4"/> Light</Button>
                <Button aria-pressed={themeMode === 'dark'} variant={themeMode === 'dark' ? 'default' : 'outline'} size="sm" onClick={() => applyTheme('dark')} className="flex items-center gap-2">{themeMode === 'dark' && <Check className="h-4 w-4"/>}<Moon className="h-4 w-4"/> Dark</Button>
              </div>
            </div>

            {/* Contrast */}
            <div>
              <h3 className="font-medium mb-2">Contrast</h3>
              <div className="flex items-center gap-2">
                <Button aria-pressed={!highContrast} variant={!highContrast ? 'default' : 'outline'} size="sm" onClick={() => applyContrast(false)} className="flex items-center gap-2">{!highContrast && <Check className="h-4 w-4"/>}<Contrast className="h-4 w-4"/> Normal</Button>
                <Button aria-pressed={highContrast} variant={highContrast ? 'default' : 'outline'} size="sm" onClick={() => applyContrast(true)} className="flex items-center gap-2">{highContrast && <Check className="h-4 w-4"/>}<Contrast className="h-4 w-4"/> High</Button>
              </div>
            </div>

            {/* Color vision */}
            <div>
              <h3 className="font-medium mb-2">Color vision</h3>
              <div className="flex flex-wrap items-center gap-2">
                <Button aria-pressed={colorFilter === 'none'} variant={colorFilter === 'none' ? 'default' : 'outline'} size="sm" onClick={() => applyFilter('none')} className="flex items-center gap-2">{colorFilter === 'none' && <Check className="h-4 w-4"/>} Normal</Button>
                <Button aria-pressed={colorFilter === 'deuteranopia'} variant={colorFilter === 'deuteranopia' ? 'default' : 'outline'} size="sm" onClick={() => applyFilter('deuteranopia')} className="flex items-center gap-2">{colorFilter === 'deuteranopia' && <Check className="h-4 w-4"/>} Deuteranopia</Button>
                <Button aria-pressed={colorFilter === 'protanopia'} variant={colorFilter === 'protanopia' ? 'default' : 'outline'} size="sm" onClick={() => applyFilter('protanopia')} className="flex items-center gap-2">{colorFilter === 'protanopia' && <Check className="h-4 w-4"/>} Protanopia</Button>
                <Button aria-pressed={colorFilter === 'tritanopia'} variant={colorFilter === 'tritanopia' ? 'default' : 'outline'} size="sm" onClick={() => applyFilter('tritanopia')} className="flex items-center gap-2">{colorFilter === 'tritanopia' && <Check className="h-4 w-4"/>} Tritanopia</Button>
                <Button aria-pressed={colorFilter === 'grayscale'} variant={colorFilter === 'grayscale' ? 'default' : 'outline'} size="sm" onClick={() => applyFilter('grayscale')} className="flex items-center gap-2">{colorFilter === 'grayscale' && <Check className="h-4 w-4"/>} Grayscale</Button>
              </div>
            </div>

            <div className="flex justify-end">
              <Button variant="secondary" onClick={resetAll}>Reset all</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default AccessibilityFab;


