"use client";

import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

export default function NotFound() {
  const router = useRouter();

  return (
    <div className="flex min-h-screen items-center justify-center py-5 sm:py-10">
      <div className="p-6 text-center">
        <Label className="mb-2 block text-2xl font-bold">Not Found</Label>
        <Label className="text-md my-4 block">Could not find requested resource</Label>
        <div className="mt-4 flex flex-col space-y-2">
          <Button onClick={() => router.push("/")} className="w-full border px-4 py-2">
            Return Home
          </Button>
        </div>
      </div>
    </div>
  );
}
