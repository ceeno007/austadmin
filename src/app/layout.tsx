import { Toaster } from '@/components/ui/sonner';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        {children}
        <Toaster 
          position="top-right"
          expand={true}
          richColors
          closeButton
          duration={4000}
          theme="light"
        />
      </body>
    </html>
  );
} 