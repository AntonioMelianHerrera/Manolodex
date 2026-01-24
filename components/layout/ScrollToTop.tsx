"use client";

import { useEffect, useState } from "react";
import { ArrowUpIcon } from "@/components/icons";

export default function ScrollToTop() {
  const [isVisible, setIsVisible] = useState(false);

  const toggleVisibility = () => {
    setIsVisible(window.scrollY > 300);
  };

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  useEffect(() => {
    window.addEventListener("scroll", toggleVisibility);
    return () => window.removeEventListener("scroll", toggleVisibility);
  }, []);

  return (
    <>
      {isVisible && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-6 left-6 z-20 w-12 h-12 rounded-full bg-red-600 text-white shadow-lg shadow-red-600/50 flex items-center justify-center hover:bg-red-700 transition-all transform hover:scale-110 active:scale-95"
          title="Volver arriba"
          aria-label="Volver arriba"
        >
          <ArrowUpIcon />
        </button>
      )}
    </>
  );
}
