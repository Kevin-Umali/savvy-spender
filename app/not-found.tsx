"use client";

import { useRouter } from "next/navigation";

export default function NotFound() {
  const router = useRouter();

  return (
    <div className="flex min-h-[60vh] items-center justify-center px-4">
      <div className="max-w-sm text-center space-y-4">
        <h1 className="font-display font-light text-3xl">Not Found</h1>
        <p className="text-sm text-muted-foreground">Could not find the requested page.</p>
        <button
          onClick={() => router.push("/")}
          className="font-mono-label text-[10px] uppercase tracking-[0.2em] text-muted-foreground hover:text-foreground transition-colors py-2"
        >
          Go Home
        </button>
      </div>
    </div>
  );
}
