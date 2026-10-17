"use client";

import { useEffect, useState } from "react";
import { useFormStatus } from "react-dom";

export function RequestIdInput() {
  const [id, setId] = useState("");
  const { pending } = useFormStatus();

  useEffect(() => {
    if (!pending) setId(crypto.randomUUID());
  }, [pending]);

  return <input type="hidden" name="requestId" value={id} />;
}