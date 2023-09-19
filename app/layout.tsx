import React from 'react'

import { Nunito } from 'next/font/google'
import { Providers } from "./providers";

import getCurrentUser from './actions/getCurrentUser'

import './globals.css'

const font = Nunito({
  subsets: ['latin']
})

export const metadata = {
  title: 'Fantasy Tennis',
  description: 'Bgak Corp. Fantasy Tennis',
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const currentUser = await getCurrentUser()

  return (
    <html lang="en" className='dark'>
      <body className={`${font.className}`}>
        <Providers currentUser={currentUser}>
          {children}
        </Providers>
      </body>
    </html>
  )
}
