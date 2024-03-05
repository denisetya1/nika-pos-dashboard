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
import ToastContextProvider from "@/context/toast/ToastContextProvider";
import ToastMsg from "./components/ToastMsg";
import AuthSessionProvider from "@/context/session/AuthSessionProvider";

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
    <AuthSessionProvider>
      <QueryClientProvider client={queryClient}>
        <ToastContextProvider>
          <DashboardNavbar />
          <div className="flex w-full h-full mt-16 items-start bg-slate-100">
            <DashboardSidebar />
            <div
              id="main-content"
              className={twMerge(
                "flex grow h-full w-full overflow-y-auto dark:bg-slate-900 text-slate-600 dark:text-slate-100 p-5 sm:p-6 md:p-8 lg:p-10",
                isCollapsed ? "lg:ml-[4.5rem]" : "lg:ml-64",
              )}
            >
              {children}
            </div>
          </div>
          
          <ToastMsg />
          
        </ToastContextProvider>
      </QueryClientProvider>
    </AuthSessionProvider>
  );
};

export default DashboardLayout;
