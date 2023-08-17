import React from "react"

import getPlayers from "./actions/getPlayers"
import getTournaments from "./actions/getTournaments"

import ClientOnly from "./components/ClientOnly"
import Container from "./components/Container"
import HomePage from "./components/pages/HomePage"

export default async function Home() {
  const players = await getPlayers()
  const tournaments = await getTournaments()

  const isHome = true
  
  if (isHome) {
    return (
      <ClientOnly>
        <HomePage />
      </ClientOnly>
    )
  }

  return (
    <ClientOnly>
      <Container>
        <div className="flex flex-col md:flex-row">
          <div className="md:w-1/4 w-full">
            Left Side Content
          </div>
          <div className="md:w-3/4 w-full">
            Right Side Content
          </div>
        </div>
      </Container>
    </ClientOnly>
  )
}