import { useEffect, useState } from "react";

export function useHasHydrated() {
  const [h, setH] = useState(false);
  useEffect(() => setH(true), []);
  return h;
}
