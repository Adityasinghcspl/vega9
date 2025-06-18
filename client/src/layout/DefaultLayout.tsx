import React, { type ReactNode  } from "react";
import { useLocation } from "react-router-dom";
import Header from "../components/Header";

const DefaultLayout: React.FC<{ children: ReactNode }> = ({ children }) => {
  const location = useLocation();

  // Check if the current route is an authentication page
  const isAuthPage = location.pathname.startsWith("/auth");

  return (
    <div className="dark:bg-boxdark-2 dark:text-bodydark">
      {/* ===== Page Wrapper Start ===== */}
      <div className="flex h-screen overflow-hidden">

        {/* ===== Content Area Start ===== */}
        <div className="relative flex flex-1 flex-col overflow-y-auto overflow-x-hidden">
          {/* Show Header only if not on an auth page */}
         <Header  />

          {/* ===== Main Content Start ===== */}
          <main>
            <div className={`${!isAuthPage && `mx-auto max-w-screen-2xl p-4 md:p-6 2xl:p-10`}`}>{children}</div>
          </main>
          {/* ===== Main Content End ===== */}
        </div>
        {/* ===== Content Area End ===== */}
      </div>
      {/* ===== Page Wrapper End ===== */}
    </div>
  );
};

export default DefaultLayout;
