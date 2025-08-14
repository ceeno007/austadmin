import React, { useEffect, useMemo, useRef, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

type Props = {
  url: string;
  onOpenChange: (open: boolean) => void;
  open: boolean;
  title?: string;
};

const isImage = (url: string) => /(\.png|\.jpg|\.jpeg|\.gif|\.webp|\.bmp|\.svg)$/i.test(url);
const isPdf = (url: string) => /\.pdf($|\?)/i.test(url);
const toViewableUrl = (url: string) => {
  if (!url) return '';
  if (/^https?:\/\//i.test(url)) return url; // already absolute
  const cleaned = url.startsWith('/') ? url : `/${url}`;
  const base = (import.meta as any).env?.VITE_API_BASE_URL || (window as any)?.API_BASE_URL || '';
  return base ? `${base}${cleaned}` : cleaned;
};

const MediaPreviewDialog: React.FC<Props> = ({ url, open, onOpenChange, title }) => {
  const [displayUrl, setDisplayUrl] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const objectUrlRef = useRef<string>("");

  const absoluteUrl = useMemo(() => toViewableUrl(url), [url]);

  useEffect(() => {
    const cleanup = () => {
      if (objectUrlRef.current) {
        URL.revokeObjectURL(objectUrlRef.current);
        objectUrlRef.current = "";
      }
    };

    if (!open) {
      cleanup();
      setDisplayUrl("");
      setError("");
      setIsLoading(false);
      return;
    }

    if (!url) {
      setDisplayUrl("");
      return;
    }

    setIsLoading(true);
    setError("");

    // Images can be linked directly
    if (isImage(url)) {
      setDisplayUrl(absoluteUrl);
      setIsLoading(false);
      return;
    }

    // For PDFs or other files, try to fetch with auth and build a blob URL
    (async () => {
      try {
        const headers: Record<string, string> = {};
        const bearer = localStorage.getItem('accessToken') || localStorage.getItem('fastApiAccessToken');
        if (bearer) headers['Authorization'] = `Bearer ${bearer}`;
        const response = await fetch(absoluteUrl, { headers });
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        const blob = await response.blob();
        // If server returns HTML, don't try to preview inside iframe
        if (blob.type.startsWith('text/html')) {
          throw new Error('Unsupported content type');
        }
        const objectUrl = URL.createObjectURL(blob);
        objectUrlRef.current = objectUrl;
        setDisplayUrl(objectUrl);
      } catch (err) {
        // Fallback to absolute URL; may still work if publicly embeddable
        setDisplayUrl(absoluteUrl);
        setError('');
      } finally {
        setIsLoading(false);
      }
    })();

    return cleanup;
  }, [open, url, absoluteUrl]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-[95vw] max-w-4xl h-[85vh]" aria-label="File preview">
        <DialogHeader>
          <DialogTitle>{title || 'Preview'}</DialogTitle>
        </DialogHeader>
        <div className="w-full h-full rounded-lg overflow-hidden bg-white dark:bg-slate-900">
          {isLoading ? (
            <div className="w-full h-full flex items-center justify-center text-sm text-gray-500">Loading preview…</div>
          ) : error ? (
            <div className="p-4 text-sm">
              <p className="mb-3">Unable to preview this file. You can try downloading it instead.</p>
              <a href={absoluteUrl} download className="underline text-blue-600">Download</a>
            </div>
          ) : isImage(url) ? (
            <img src={displayUrl} alt="Preview" className="w-full h-full object-contain" />
          ) : isPdf(url) ? (
            <object data={displayUrl} type="application/pdf" className="w-full h-full">
              <iframe title="PDF Preview" src={displayUrl} className="w-full h-full" />
            </object>
          ) : (
            <div className="p-4 text-sm">
              <p className="mb-3">Preview not supported for this file type.</p>
              <a href={absoluteUrl} target="_blank" rel="noreferrer" className="underline text-blue-600">Open in new tab</a>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default MediaPreviewDialog;



