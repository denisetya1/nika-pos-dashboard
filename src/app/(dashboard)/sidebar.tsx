import { useSidebarContext } from "@/context/SidebarContext";
import { Sidebar } from "flowbite-react";
import { usePathname } from "next/navigation";
import type { FC } from "react";
import { BiBuoy, BiSolidCategory } from "react-icons/bi";
import {
  HiChartPie,
  HiGift,
  HiHome,
  HiShoppingBag,
  HiBuildingStorefront
} from "react-icons/hi2";
import { TbFileReport } from "react-icons/tb";
import { twMerge } from "tailwind-merge";

export const DashboardSidebar: FC = function () {
  const { isCollapsed } = useSidebarContext()
  const pathname = usePathname()

  const menus = [
    {
      name: 'home',
      title: "Home",
      url: "/",
      icon: HiHome
    },
    {
      name: 'manage-product',
      title: "Manajemen Produk",
      url: "/products",
      icon: HiShoppingBag,
      childs: [
        {
          name: 'product-list',
          title: "Daftar Produk",
          url: "/products",
        },
        {
          name: 'product-stock',
          title: "Stok & Harga",
          url: "/products/stocks",
        },
        {
          name: 'prints',
          title: "Cetak Harga",
          url: "/prints",
        }
        // {
        //   name: 'stock-transfer',
        //   title: "Trasfer Stock",
        //   url: "/products/stock-transfer",
        // },
      ]
    },
    {
      name: 'reports',
      title: "Laporan",
      url: "/reports",
      icon: TbFileReport,
      childs: [
        {
          name: 'report-stock',
          title: "Keluar/Masuk Stok",
          url: "/reports/stocks",
        }
      ]
    },
    {
      name: 'outlets',
      title: "Daftar Outlet",
      url: "/outlets",
      icon: HiBuildingStorefront
    },
    {
      name: 'master-data',
      title: "Master Data",
      url: "/master/categories",
      icon: BiSolidCategory,
      childs: [
        {
          name: 'master-category',
          title: "Kategori",
          url: "/master/categories",
        },
        {
          name: 'master-brand',
          title: "Brand",
          url: "/master/brands",
        },
        {
          name: 'master-stock-move-type',
          title: "Jenis Perpindahan Stok",
          url: "/master/movements",
        },
      ]
    },
  ]

  return (
    <Sidebar
      aria-label="Sidebar with multi-level dropdown example"
      collapsed={isCollapsed}
      id="sidebar"
      className={twMerge(
        "fixed inset-y-0 left-0 z-20 mt-16 flex h-full shrink-0 flex-col border-r border-gray-200 duration-75 dark:border-gray-700 lg:flex",
        isCollapsed && "hidden w-16",
      )}
    >
      <Sidebar.Items>
        <Sidebar.ItemGroup>

          {menus.map((menu, idx) => {
            if(menu?.childs && menu?.childs?.length > 0){
              const findActiveMenu = menu.childs.filter((c) => c.url === pathname)

              return (
                <Sidebar.Collapse key={idx} icon={menu.icon} href={menu.url} label={menu.title} open={findActiveMenu.length > 0 ? true : false}>
                  {menu?.childs?.map( (sub, i) => <Sidebar.Item key={i} href={sub.url} active={sub.url === pathname}>{sub.title}</Sidebar.Item>)}
                </Sidebar.Collapse>
              )
            } else {
              return (
                <Sidebar.Item key={idx} href={menu.url} icon={menu.icon} active={pathname === menu.url}>
                    {menu.title}
                </Sidebar.Item>
              )
            }

          })}

          
        </Sidebar.ItemGroup>
        {/* <Sidebar.ItemGroup>
          <Sidebar.Item href="#" icon={HiChartPie}>
            Upgrade to Pro
          </Sidebar.Item>
          <Sidebar.Item href="#" icon={BiBuoy}>
            Help
          </Sidebar.Item>
        </Sidebar.ItemGroup>
        <Sidebar.ItemGroup>
          <Sidebar.Item href="#" icon={HiChartPie}>
            Upgrade to Pro
          </Sidebar.Item>
          <Sidebar.Item href="#" icon={BiBuoy}>
            Help
          </Sidebar.Item>
        </Sidebar.ItemGroup> */}
      </Sidebar.Items>
    </Sidebar>
  );
};
