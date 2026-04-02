import { useEffect } from "react";

export function useDocumentTitle(title: string) {
  useEffect(() => {
    const prev = typeof document !== "undefined" ? document.title : "";
    document.title = title;
    return () => {
      document.title = prev;
    };
  }, [title]);
}
