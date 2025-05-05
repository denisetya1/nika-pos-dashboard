import { useSidebarContext } from "@/context/SidebarContext";
import { Sidebar } from "flowbite-react";
import { usePathname } from "next/navigation";
import type { FC } from "react";
import { BiSolidCategory } from "react-icons/bi";
import {
  HiHome,
  HiShoppingBag,
  HiBuildingStorefront
} from "react-icons/hi2";
import { TbFileReport } from "react-icons/tb";
import { twMerge } from "tailwind-merge";
import { HiUser } from "react-icons/hi";

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
    // {
    //     name: 'online-sales',
    //     title: "Penjualan Online",
    //     url: "/online-sales",
    //     icon: HiShoppingBag,
    //     childs: [
    //       {
    //         name: 'online-sales-pos',
    //         title: "Input Penjualan Online",
    //         url: "/online-sales/transaction",
    //       },
    //       {
    //         name: 'online-sales-report',
    //         title: "Laporan Penjualan Online",
    //         url: "/online-sales-report/reports",
    //       }
    //     ]
    //   },
    // {
    //   name: 'stock-management',
    //   title: "Pengelolaan Stok",
    //   url: "/stock-management",
    //   icon: HiShoppingBag,
    //   childs: [
    //     {
    //       name: 'stock-management-out',
    //       title: "Penjualan Online",
    //       url: "/stock-management/online-sales",
    //     },
    //     {
    //       name: 'stock-management-in',
    //       title: "Barang Masuk",
    //       url: "/stock-management/restock",
    //     }
    //   ]
    // },
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
          url: "/products/prints",
        }
      ]
    },
    {
      name: 'reports',
      title: "Laporan",
      url: "/reports",
      icon: TbFileReport,
      childs: [
        {
          name: 'report-sales',
          title: "Penjualan",
          url: "/reports/sales",
        },
        {
          name: 'report-online-sales',
          title: "Penjualan Online",
          url: "/reports/online-sales",
        },
        {
          name: 'report-product-sold',
          title: "Barang Terjual",
          url: "/reports/product-sold",
        },
        {
          name: 'report-stock',
          title: "Perpindahan Stok",
          url: "/reports/stocks",
        },
        {
          name: 'report-stock-by-products',
          title: "Keluar/Masuk Stok",
          url: "/reports/stocks/by-products",
        }
      ]
    },
    {
      name: 'outlets',
      title: "Outlet",
      url: "/outlets",
      icon: HiBuildingStorefront,
      childs: [
        {
          name: 'list-outlet',
          title: "Daftar Outlet",
          url: "/outlets",
        },
        {
          name: 'outlet-payment-methods',
          title: "Metode Pembayaran",
          url: "/outlets/payment-methods",
        },
        {
          name: 'outlet-shifts',
          title: "Daftar Shift Kasir",
          url: "/outlets/shifts",
        },
        {
          name: 'outlet-users',
          title: "Daftar Pengguna Outlet",
          url: "/outlets/users",
        }
      ]
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
    {
      name: 'sub-accounts',
      title: "Manajemen Pengguna",
      url: "/users/",
      icon: HiUser,
      childs: [
        {
          name: 'user-sub-accounts',
          title: "Daftar Pengguna",
          url: "/users/sub-accounts",
        },
        {
          name: 'user-roles',
          title: "Daftar Hak Akses",
          url: "/users/roles",
        },
      ]
    }
    // {
    //   name: 'sub-accounts',
    //   title: "Daftar Pengguna",
    //   url: "/sub-accounts",
    //   icon: HiUser
    // }
  ]

  return (
    <Sidebar
      aria-label="Sidebar with multi-level dropdown example"
      collapsed={isCollapsed}
      id="sidebar"
      className={twMerge(
        "fixed inset-y-0 left-0 z-20 mt-16 flex h-full shrink-0 flex-col border-r border-slate-200 duration-75 dark:border-gray-700 lg:flex",
        isCollapsed && "hidden w-16",
      )}
    >
      <Sidebar.Items>
        <Sidebar.ItemGroup>

          {menus.map((menu, idx) => {
            if (menu?.childs && menu?.childs?.length > 0) {
              const findActiveMenu = menu.childs.filter((c) => c.url === pathname)

              return (
                <Sidebar.Collapse key={idx} icon={menu.icon} href={menu.url} label={menu.title} open={findActiveMenu.length > 0 ? true : false}>
                  {menu?.childs?.map((sub, i) => <Sidebar.Item key={i} href={sub.url} active={sub.url === pathname}>{sub.title}</Sidebar.Item>)}
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
