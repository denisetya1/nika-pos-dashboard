"use client";
import type { FC, PropsWithChildren } from "react";
import ToastContextProvider from "@/context/toast/ToastContextProvider";

const POSLayoutContent: FC<PropsWithChildren> = function ({ children }) {

  return (
    <>
      <ToastContextProvider>
        <div className="mt-16 flex items-start">
            {children}
        </div>
      </ToastContextProvider>
    </>
  );
};

export default POSLayoutContent;
