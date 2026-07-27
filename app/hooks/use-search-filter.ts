"use client";

import { useState, useEffect, useDeferredValue, useRef, useCallback } from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";

export function useSearchFilter() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const searchParamsRef = useRef(searchParams);

  useEffect(() => {
    searchParamsRef.current = searchParams;
  }, [searchParams]);

  const [searchInput, setSearchInput] = useState(searchParams.get("find") ?? "");
  const filterValue = useDeferredValue(searchInput);

  const syncUrl = useCallback(() => {
    const params = new URLSearchParams(searchParamsRef.current.toString());
    if (filterValue) {
      params.set("find", filterValue);
    } else {
      params.delete("find");
    }
    router.replace(`${pathname}?${params.toString()}`);
  }, [filterValue, pathname, router]);

  useEffect(() => {
    const timer = setTimeout(syncUrl, 300);
    return () => clearTimeout(timer);
  }, [syncUrl]);

  return { searchInput, setSearchInput, filterValue };
}
