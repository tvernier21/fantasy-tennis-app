import { Nunito } from 'next/font/google'
import React from 'react'

import Navbar from './components/navbar/Navbar'
import ClientOnly from './components/ClientOnly'
import RegisterModal from './components/modals/RegisterModal'
import LoginModal from './components/modals/LoginModal'
import ToasterProvider from './providers/ToasterProvider'
import getCurrentUser from './actions/getCurrentUser'

import './globals.css'

const font = Nunito({
  subsets: ['latin']
})

export const metadata = {
  title: 'Fantasy Tennis',
  description: 'SmashIt Fantasy Tennis Clone',
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const currentUser = await getCurrentUser()

  return (
    <html lang="en">
      <body className={font.className}>
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
      </body>
    </html>
  )
}
