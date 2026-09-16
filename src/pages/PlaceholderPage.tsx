import { Construction } from 'lucide-react';

export function PlaceholderPage({ title }: { title: string }) {
  return (
    <div className="flex flex-col items-center justify-center h-[60vh] space-y-4 text-muted">
      <Construction className="w-16 h-16 opacity-50 text-primary" />
      <h1 className="text-2xl font-medium text-foreground">{title}</h1>
      <p>This module is currently being built in the new frontend mock architecture.</p>
    </div>
  );
}
