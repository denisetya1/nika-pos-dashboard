import { useSidebarContext } from "@/context/SidebarContext";
import { isSmallScreen } from "@/lib/is-small-screen";
import { DarkThemeToggle, Navbar, Select } from "flowbite-react";
import Image from "next/image";
import { useState, type FC } from "react";
import { HiMenuAlt1, HiX } from "react-icons/hi";
import SignOutButton from "../components/SignOutButton";
import { useSession } from "next-auth/react";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { Outlet } from "@prisma/client";

export const DashboardNavbar: FC<Record<string, never>> = function () {
  const router = useRouter()
  const {
    data: session,
    update: sessionUpdate
  } = useSession()

  const [outletId, setOutletId] = useState<string|undefined>(session?.user.outletId)
  const { 
    isCollapsed: isSidebarCollapsed, 
    setCollapsed: setSidebarCollapsed 
  } = useSidebarContext();
  
  const {data: outlets} = useQuery({
    queryKey: ["userOutlets", session?.user.id],
    queryFn: () => fetch(`/api/outlets`, {
      cache: 'no-cache'
    }).then((res) => res.json())
  })

  const updateSession = (outletId : string) => {
    // if(outletId) {
    //   sessionUpdate({
    //     user: {
    //       ...session?.user,
    //       outletId
    //     }
    //   }).finally(() => {
    //     router.refresh()
    //   })
    // }
  }
  
  return (
    <header>
      <Navbar
        fluid
        className="fixed top-0 z-30 w-full border-b border-gray-200 bg-white p-0 dark:border-gray-700 dark:bg-gray-800 sm:p-0"
      >
        <div className="w-full p-3 pr-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <button
                aria-controls="sidebar"
                aria-expanded
                className="mr-2 cursor-pointer rounded p-2 text-gray-600 hover:bg-violet-100 hover:text-gray-900 focus:bg-violet-100 focus:ring-2 focus:ring-violet-100 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white dark:focus:bg-gray-700 dark:focus:ring-gray-700"
                onClick={() => setSidebarCollapsed(!isSidebarCollapsed)}
              >
                {isSidebarCollapsed || !isSmallScreen() ? (
                  <HiMenuAlt1 className="h-6 w-6 text-primary-600" />
                ) : (
                  <HiX className="h-6 w-6" />
                )}
              </button>
              <Navbar.Brand href="/">
                <Image
                  alt="NIKA POS - BEAUTYCAT"
                  height="24"
                  src="/logo-stroked.png"
                  width="150"
                  priority={true}
                />
              </Navbar.Brand>
            </div>
            <div className="flex justify-end items-center gap-4">
              { outlets && <Select 
                name="outletId" 
                value={session?.user.outletId}
                onChange={(e: React.ChangeEvent<HTMLSelectElement>) => updateSession(e.target.value)}
              >
                {outlets && outlets.map((outlet: Outlet) => <option key={outlet.id} value={String(outlet.id)}>{outlet.name}</option>)}
              </Select> }
              <DarkThemeToggle />
              <SignOutButton />
            </div>
          </div>
        </div>
      </Navbar>
    </header>
  );
};
