import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

type Props = {
  url: string;
  onOpenChange: (open: boolean) => void;
  open: boolean;
  title?: string;
};

const isImage = (url: string) => /(\.png|\.jpg|\.jpeg|\.gif|\.webp)$/i.test(url);

const MediaPreviewDialog: React.FC<Props> = ({ url, open, onOpenChange, title }) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-[95vw] max-w-4xl h-[85vh]" aria-label="File preview">
        <DialogHeader>
          <DialogTitle>{title || 'Preview'}</DialogTitle>
        </DialogHeader>
        <div className="w-full h-full rounded-lg overflow-hidden bg-white dark:bg-slate-900">
          {isImage(url) ? (
            <img src={url} alt="Preview" className="w-full h-full object-contain" />
          ) : (
            <iframe title="Preview" src={url} className="w-full h-full" />
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default MediaPreviewDialog;


