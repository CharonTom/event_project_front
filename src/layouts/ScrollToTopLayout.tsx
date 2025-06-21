// src/layouts/ScrollToTopLayout.tsx
import React, { ReactNode, useLayoutEffect } from "react";
import { useLocation, Outlet } from "react-router-dom";

const ScrollToTopLayout: React.FC<{ children?: ReactNode }> = () => {
  const { pathname } = useLocation();

  useLayoutEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
  }, [pathname]);

  // Outlet va injecter ton MainLayout et ses routes enfants
  return <Outlet />;
};

export default ScrollToTopLayout;
