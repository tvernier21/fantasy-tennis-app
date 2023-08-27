'use client';

import React from "react"

import { NextUIProvider } from '@nextui-org/react'

import Navbar from './components/navbar/Navbar'
import ClientOnly from './components/ClientOnly'
import RegisterModal from './components/modals/RegisterModal'
import LoginModal from './components/modals/LoginModal'
import ToasterProvider from './providers/ToasterProvider'
import { SafeUser } from "./types";

type ProvidersProps = {
  children: React.ReactNode;
  currentUser: SafeUser | null;
};

export function Providers({ children, currentUser }: ProvidersProps) {
  return (
    <NextUIProvider>
      <ClientOnly>
          <ToasterProvider />
          <LoginModal />
          <RegisterModal />
          <Navbar 
            currentUser={currentUser} 
          />
        </ClientOnly>
        <div className="pb-4 pt-4">
          {children}
        </div>
    </NextUIProvider>
  )
}