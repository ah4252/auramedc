"use client";

import { useEffect } from "react";
import { pingPresence } from "@/app/actions/presence";

export default function ActivePresencePing({ userId }: { userId: string | null }) {
  useEffect(() => {
    if (!userId) return;

    // Ping immediately
    pingPresence();

    // Ping every 2 minutes
    const interval = setInterval(() => {
      pingPresence();
    }, 120000);

    return () => clearInterval(interval);
  }, [userId]);

  return null;
}
