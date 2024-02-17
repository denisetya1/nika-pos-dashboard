"use client";

import { SidebarProvider, useSidebarContext } from "@/context/SidebarContext";
import type { FC, PropsWithChildren } from "react";
import { twMerge } from "tailwind-merge";
import { DashboardNavbar } from "./components/navbar";
import { DashboardSidebar } from "./components/sidebar";
import {
  QueryClient,
  QueryClientProvider,
} from '@tanstack/react-query'
import ToastContextProvider from "../context/toast/ToastContextProvider";
import ToastMsg from "./components/ToastMsg";

const queryClient = new QueryClient()

const DashboardLayout: FC<PropsWithChildren> = function ({ children }) {
  return (
    <SidebarProvider>
      <DashboardLayoutContent>{children}</DashboardLayoutContent>
    </SidebarProvider>
  );
};

const DashboardLayoutContent: FC<PropsWithChildren> = function ({ children }) {
  const { isCollapsed } = useSidebarContext();

  return (
    <QueryClientProvider client={queryClient}>
      <ToastContextProvider>
        <DashboardNavbar />
        <div className="mt-16 flex items-start">
          <DashboardSidebar />
          <div
            id="main-content"
            className={twMerge(
              "relative h-full w-full overflow-y-auto bg-white dark:bg-gray-900 dark:text-gray-100",
              isCollapsed ? "lg:ml-[4.5rem]" : "lg:ml-64",
            )}
          >
            {children}
          </div>
        </div>
        
        <ToastMsg />
        
      </ToastContextProvider>
    </QueryClientProvider>
  );
};

export default DashboardLayout;
