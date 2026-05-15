import { ReactNode } from 'react';
import { Sidebar } from './Sidebar';
import { cn } from '@/lib/utils';

interface MainLayoutProps {
  children: ReactNode;
  fullWidth?: boolean;
  wide?: boolean;
}

export function MainLayout({ children, fullWidth = false, wide = false }: MainLayoutProps) {
  return (
    <div className="h-screen w-screen relative overflow-hidden bg-background">
      {/* Background orbs */}
      <div className="glow-orb w-96 h-96 bg-neon-violet top-20 -left-48 fixed opacity-20" />
      <div className="glow-orb w-80 h-80 bg-neon-cyan bottom-20 right-10 fixed opacity-20" />
      
      {!fullWidth && <Sidebar />}
      
      <main className={cn(
        "flex flex-col transition-all duration-300 h-screen overflow-y-auto",
        fullWidth ? "ml-0 w-screen" : "ml-64 p-6"
      )}>
        <div className={cn(
          "flex-1 flex flex-col min-h-0",
          (!fullWidth && !wide) && "max-w-6xl mx-auto w-full animate-fade-in",
          (fullWidth || wide) && "h-full w-full"
        )}>
          {children}
        </div>
      </main>
    </div>
  );
}
