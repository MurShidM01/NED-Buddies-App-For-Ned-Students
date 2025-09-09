import { MessageCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

type LogoProps = {
  className?: string;
};

export function Logo({ className }: LogoProps) {
  return (
    <div className={cn("flex items-center gap-2", className)}>
      <MessageCircle className="h-8 w-8 text-primary" />
      <h1 className="text-2xl font-bold text-primary font-headline">
        NED Buddies
      </h1>
    </div>
  );
}
