"use client";

import { useRouter } from "next/navigation";

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

const ErrorComponent: React.FC<ErrorProps> = ({ error, reset }) => {
  const router = useRouter();

  return (
    <div className="flex min-h-[60vh] items-center justify-center px-4">
      <div className="max-w-sm text-center space-y-4">
        <h1 className="font-display italic font-light text-3xl">Something went wrong</h1>
        <p className="text-sm text-muted-foreground">{error.message}</p>
        <div className="flex flex-col gap-2 pt-2">
          <button
            onClick={() => router.push("/")}
            className="font-mono-label text-[10px] uppercase tracking-[0.2em] text-muted-foreground hover:text-foreground transition-colors py-2"
          >
            Go Home
          </button>
          <button
            onClick={reset}
            className="font-mono-label text-[10px] uppercase tracking-[0.2em] text-muted-foreground hover:text-foreground transition-colors py-2"
          >
            Try Again
          </button>
        </div>
      </div>
    </div>
  );
};

export default ErrorComponent;
