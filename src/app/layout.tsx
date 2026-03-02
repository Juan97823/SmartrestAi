
"use client"

import './globals.css';
import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar';
import { AppSidebar } from '@/components/app-sidebar';
import { Toaster } from '@/components/ui/toaster';
import AuthWrapper from '@/components/auth-wrapper';
import { usePathname } from 'next/navigation';

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = usePathname();
  const isLoginPage = pathname === '/login';

  return (
    <html lang="es">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet" />
      </head>
      <body className="font-body antialiased">
        <AuthWrapper>
          {isLoginPage ? (
            <main className="min-h-screen bg-background">
              {children}
            </main>
          ) : (
            <SidebarProvider>
              <AppSidebar />
              <SidebarInset>
                <main className="p-4 md:p-8 min-h-screen bg-background">
                  {children}
                </main>
              </SidebarInset>
            </SidebarProvider>
          )}
        </AuthWrapper>
        <Toaster />
      </body>
    </html>
  );
}
