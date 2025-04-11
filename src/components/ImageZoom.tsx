import React, { useState } from 'react';
import { Dialog, DialogContent, IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import ZoomInIcon from '@mui/icons-material/ZoomIn';

interface ImageZoomProps {
  src: string;
  alt?: string;
  className?: string;
  style?: React.CSSProperties;
}

const ImageZoom: React.FC<ImageZoomProps> = ({ src, alt = '', className = '', style = {} }) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleOpen = () => setIsOpen(true);
  const handleClose = () => setIsOpen(false);

  return (
    <>
      <div 
        style={{ position: 'relative', display: 'inline-block', ...style }}
        className={className}
      >
        <img
          src={src}
          alt={alt}
          style={{ cursor: 'zoom-in', maxWidth: '100%', height: 'auto' }}
        />
        <IconButton
          size="small"
          onClick={handleOpen}
          style={{
            position: 'absolute',
            bottom: 8,
            right: 8,
            backgroundColor: 'rgba(255, 255, 255, 0.8)',
          }}
        >
          <ZoomInIcon />
        </IconButton>
      </div>

      <Dialog
        open={isOpen}
        onClose={handleClose}
        maxWidth="xl"
        fullWidth
        PaperProps={{
          style: {
            backgroundColor: 'transparent',
            boxShadow: 'none',
          },
        }}
      >
        <DialogContent style={{ padding: 0, position: 'relative' }}>
          <IconButton
            onClick={handleClose}
            style={{
              position: 'absolute',
              top: 8,
              right: 8,
              backgroundColor: 'rgba(255, 255, 255, 0.8)',
              zIndex: 1,
            }}
          >
            <CloseIcon />
          </IconButton>
          <img
            src={src}
            alt={alt}
            style={{
              width: '100%',
              height: 'auto',
              maxHeight: '90vh',
              objectFit: 'contain',
            }}
          />
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ImageZoom; 