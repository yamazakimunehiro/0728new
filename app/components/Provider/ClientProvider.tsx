'use client';
import { createContext, ReactNode } from 'react';
import { ManagedUIContext } from './context';
import { createClient, OAuthStrategy } from '@wix/sdk';
import { collections, products } from '@wix/stores';
import { currentCart, backInStockNotifications } from '@wix/ecom';
import { wixEventsV2 as wixEvents, orders as checkout } from '@wix/events';
import { redirects } from '@wix/redirects';
import Cookies from 'js-cookie';
import { WIX_REFRESH_TOKEN } from '@app/constants';
import dynamic from 'next/dynamic';

const refreshToken = JSON.parse(Cookies.get(WIX_REFRESH_TOKEN) || '{}');

const wixClient = createClient({
  modules: {
    products,
    collections,
    currentCart,
    backInStockNotifications,
    wixEvents,
    checkout,
    redirects,
  },
  auth: OAuthStrategy({
    clientId: process.env.NEXT_PUBLIC_WIX_CLIENT_ID!,
    tokens: { refreshToken, accessToken: { value: '', expiresAt: 0 } },
  }),
});

export type WixClient = typeof wixClient;
export const WixClientContext = createContext<WixClient>(wixClient);

// ✅ dynamic importでApp Routerの型制約をすり抜ける
const ClientOnlyProvider = dynamic(() => import('./ClientOnlyProvider'), {
  ssr: false,
});

export function ClientProvider({ children }: { children: ReactNode }) {
  return (
    <WixClientContext.Provider value={wixClient}>
      <ManagedUIContext>
        <ClientOnlyProvider>{children}</ClientOnlyProvider>
      </ManagedUIContext>
    </WixClientContext.Provider>
  );
}
