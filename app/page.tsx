import React, { useState } from "react"

import getPlayers from "./actions/getPlayers"
import getTournaments from "./actions/getTournaments"

import ClientOnly from "./components/ClientOnly"
import Container from "./components/Container"
import HomePage from "./components/pages/HomePage"
import Contents from "./components/pages/Contents"

export default async function Main() {
  const players = await getPlayers()
  const tournaments = await getTournaments()

  return (
    <ClientOnly>
      <Container>
        <Contents 
          players={players}
        />
      </Container>
    </ClientOnly>
  )
}