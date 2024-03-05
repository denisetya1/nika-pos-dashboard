import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { ThemeModeScript, Flowbite } from 'flowbite-react';
import { FC, PropsWithChildren } from 'react';
import { twMerge } from 'tailwind-merge';
import { flowbiteTheme } from './theme';

import AuthSessionProvider from '@/context/session/AuthSessionProvider';


export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Beautycat POS prowered by nikaPOS',
  description: 'Beautycat POS prowered by nikaPOS',
}

const inter = Inter({ subsets: ["latin"] });

const RootLayout: FC<PropsWithChildren> = function ({ children }) {
  return (
    <html lang="en">
      <head>
        <ThemeModeScript />
      </head>
      <body className={twMerge("bg-slate-100 dark:bg-gray-900 block w-full h-full text-sm", inter.className)}>
        <AuthSessionProvider>
            <Flowbite theme={{ theme: flowbiteTheme }}>{children}</Flowbite>
        </AuthSessionProvider>
      </body>
    </html>
  );
};

export default RootLayout

