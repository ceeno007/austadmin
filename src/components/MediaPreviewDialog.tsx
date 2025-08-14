import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

type Props = {
  url: string;
  onOpenChange: (open: boolean) => void;
  open: boolean;
  title?: string;
};

const isImage = (url: string) => /(\.png|\.jpg|\.jpeg|\.gif|\.webp|\.bmp|\.svg)$/i.test(url);
const toViewableUrl = (url: string) => {
  if (!url) return '';
  if (/^https?:\/\//i.test(url)) return url; // already absolute
  const cleaned = url.startsWith('/') ? url : `/${url}`;
  const base = (import.meta as any).env?.VITE_API_BASE_URL || (window as any)?.API_BASE_URL || '';
  return base ? `${base}${cleaned}` : cleaned;
};

const MediaPreviewDialog: React.FC<Props> = ({ url, open, onOpenChange, title }) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-[95vw] max-w-4xl h-[85vh]" aria-label="File preview">
        <DialogHeader>
          <DialogTitle>{title || 'Preview'}</DialogTitle>
        </DialogHeader>
        <div className="w-full h-full rounded-lg overflow-hidden bg-white dark:bg-slate-900">
          {isImage(url) ? (
            <img src={toViewableUrl(url)} alt="Preview" className="w-full h-full object-contain" />
          ) : (
            <iframe title="Preview" src={toViewableUrl(url)} className="w-full h-full" />
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default MediaPreviewDialog;



