"use client";
import { useEffect, useRef, useState } from "react";

import { Navigation } from "./Navigation";

interface HeaderProps {
  readonly isTransparentOnTop: boolean;
}

const Header = ({ isTransparentOnTop }: HeaderProps) => {
  const headerRef = useRef<HTMLElement>(null);
  const [isPinned, setIsPinned] = useState(false);

  useEffect(() => {
    if (!isTransparentOnTop || !headerRef.current) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsPinned(entry.intersectionRatio < 1);
      },
      { threshold: [1] },
    );

    observer.observe(headerRef.current);

    return () => observer.disconnect();
  }, [isTransparentOnTop]);

  const getHeaderClasses = () => {
    if (!isTransparentOnTop) return "header-site header-light";
    return `header-site ${isPinned ? "header-light" : ""}`;
  };

  return (
    <header
      ref={headerRef}
      className={getHeaderClasses()}
      style={{ position: "sticky", top: "-1px", zIndex: 50 }}
    >
      <Navigation />
    </header>
  );
};

export default Header;
