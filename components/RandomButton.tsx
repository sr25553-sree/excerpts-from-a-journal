"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";

export function RandomButton() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleClick = useCallback(async () => {
    if (loading) return;
    setLoading(true);

    try {
      const response = await fetch("/api/entries/random");
      if (!response.ok) throw new Error();
      const data = await response.json();
      router.push(`/read/${data.id}`);
    } catch {
      setLoading(false);
    }
  }, [loading, router]);

  return (
    <button
      onClick={handleClick}
      disabled={loading}
      className="font-sans text-sm text-ink-faint underline underline-offset-4 transition-colors duration-300 hover:text-ink disabled:opacity-50"
    >
      {loading ? "finding something..." : "read something random"}
    </button>
  );
}
