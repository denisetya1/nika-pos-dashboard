import { type CustomFlowbiteTheme } from "flowbite-react";

export const flowbiteTheme: CustomFlowbiteTheme = {
  footer: {
    root: {
      base: "flex flex-col",
    },
    brand: {
      base: "m-6 flex items-center",
    },
    groupLink: {
      base: "flex flex-col flex-wrap text-slate-500 dark:text-white",
      link: {
        base: "mb-4 last:mr-0 md:mr-6",
      },
    },
    icon: {
      base: "text-slate-400 hover:text-slate-900 dark:hover:text-white",
    },
  },
  modal: {
    body: {
      base: "space-y-6 px-6 pb-4 sm:pb-6 lg:px-8 xl:pb-8",
    },
  },
  sidebar: {
    root: {
      base: "h-full bg-slate-50 text-sm",
      inner:
        "h-full overflow-y-auto overflow-x-hidden text-sm bg-white py-4 px-3 dark:bg-slate-800",
    },
    collapse: {
      button: "group flex w-full items-center rounded-lg p-2 text-base font-normal text-slate-900 transition duration-75 hover:bg-primary-100 dark:text-white dark:hover:bg-slate-700",
      label: {
        base: "text-sm pl-3 text-slate-500 dark:text-white group-hover:text-primary-600 dark:group-hover:text-white",
        icon: {
          base: "text-slate-300 ml-2",
          open: {
            "off": "text-slate-400 rotate-180",
            "on": "text-primary-600"
          }
        }
      },
      list: "space-y-2 py-2 list-none text-sm",
      icon: {
        "base": "h-6 w-6 text-slate-500 transition duration-75 group-hover:text-primary-600 text-slate-400 dark:text-slate-400 dark:group-hover:text-white",
        "open": {
          "off": "",
          "on": "text-primary-600"
        }
      },
    },
    item: {
      base: "no-underline flex items-center rounded-lg p-2 text-sm font-normal text-slate-400 hover:bg-primary-100 hover:text-primary-600 dark:text-white dark:hover:bg-slate-700",
      active: "text-primary-600",
      icon: {
        "base": "h-6 w-6 transition duration-75 dark:group-hover:text-white",
        "active": "text-primary-600"
      },
    },
    itemGroup: {
      base: "list-none border-t border-slate-200 pt-3 text-sm first:mt-0 first:border-t-0 first:pt-0 dark:border-slate-700",
    },
  },
  pagination: {
    pages: {
      selector: {
        "base": "w-12 border border-slate-300 bg-white py-2 leading-tight text-slate-500 enabled:hover:bg-primary-100 enabled:hover:text-primary-700 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-400 enabled:dark:hover:bg-slate-700 enabled:dark:hover:text-white",
        "active": "bg-primary-50 text-primary-600 hover:bg-cyan-100 hover:text-cyan-700 dark:border-slate-700 dark:bg-slate-700 dark:text-white",
        "disabled": "opacity-50 cursor-normal"
      },
      next: {
        "base": "rounded-r-lg border border-slate-300 bg-white py-2 px-3 leading-tight text-slate-500 enabled:hover:bg-primary-100 enabled:hover:text-primary-700 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-400 enabled:dark:hover:bg-slate-700 enabled:dark:hover:text-white",
        "icon": "h-5 w-5"
      },
      previous: {
        "base": "ml-0 rounded-l-lg border border-slate-300 bg-white py-2 px-3 leading-tight text-slate-500 enabled:hover:bg-primary-100 enabled:hover:text-primary-700 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-400 enabled:dark:hover:bg-slate-700 enabled:dark:hover:text-white",
      "icon": "h-5 w-5"
      }
    } 
  },
  select: {
    field: {
      select: {
        base: "block w-full border disabled:cursor-not-allowed disabled:opacity-50",
        colors: {
          "gray": "bg-slate-50 border-slate-300 text-slate-900 focus:border-primary-500 focus:ring-primary-500 dark:border-slate-600 dark:bg-slate-700 dark:text-white dark:placeholder-slate-400 dark:focus:border-primary-500 dark:focus:ring-primary-500",
          "info": "border-violet-500 bg-violet-50 text-violet-900 placeholder-violet-700 focus:border-violet-500 focus:ring-violet-500 dark:border-violet-400 dark:bg-violet-100 dark:focus:border-violet-500 dark:focus:ring-violet-500",
          "failure": "border-red-500 bg-red-50 text-red-900 placeholder-red-700 focus:border-red-500 focus:ring-red-500 dark:border-red-400 dark:bg-red-100 dark:focus:border-red-500 dark:focus:ring-red-500",
          "warning": "border-yellow-500 bg-yellow-50 text-yellow-900 placeholder-yellow-700 focus:border-yellow-500 focus:ring-yellow-500 dark:border-yellow-400 dark:bg-yellow-100 dark:focus:border-yellow-500 dark:focus:ring-yellow-500",
          "success": "border-green-500 bg-green-50 text-green-900 placeholder-green-700 focus:border-green-500 focus:ring-green-500 dark:border-green-400 dark:bg-green-100 dark:focus:border-green-500 dark:focus:ring-green-500"
        }
      }
    }
  },
  textInput: {
    field: {
      input: {
        base: "block w-full border disabled:cursor-not-allowed disabled:opacity-50",
        colors: {
          "gray": "bg-slate-50 border-slate-300 text-slate-900 focus:border-primary-500 focus:ring-primary-500 dark:border-slate-600 dark:bg-slate-700 dark:text-white dark:placeholder-slate-400 dark:focus:border-primary-500 dark:focus:ring-primary-500",
          "info": "border-violet-500 bg-violet-50 text-violet-900 placeholder-violet-700 focus:border-violet-500 focus:ring-violet-500 dark:border-violet-400 dark:bg-violet-100 dark:focus:border-violet-500 dark:focus:ring-violet-500",
          "failure": "border-red-500 bg-red-50 text-red-900 placeholder-red-700 focus:border-red-500 focus:ring-red-500 dark:border-red-400 dark:bg-red-100 dark:focus:border-red-500 dark:focus:ring-red-500",
          "warning": "border-yellow-500 bg-yellow-50 text-yellow-900 placeholder-yellow-700 focus:border-yellow-500 focus:ring-yellow-500 dark:border-yellow-400 dark:bg-yellow-100 dark:focus:border-yellow-500 dark:focus:ring-yellow-500",
          "success": "border-green-500 bg-green-50 text-green-900 placeholder-green-700 focus:border-green-500 focus:ring-green-500 dark:border-green-400 dark:bg-green-100 dark:focus:border-green-500 dark:focus:ring-green-500"
        }
      }
    }
  },
  tooltip: {
    style: {
      dark: "bg-primary-700 text-white dark:bg-gray-700"
    },
    "arrow": {
      style: {
        dark: "bg-primary-700 dark:bg-gray-700"
      }
    }
  }
};
