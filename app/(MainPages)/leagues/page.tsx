import React from "react"

import getPlayers from "../../actions/getPlayers"

import ClientOnly from "../../components/ClientOnly"
import Container from "../../components/Container"
import MainPage from "../../components/main/MainPage"

export default async function Main() {
  const players = await getPlayers()

  return (
    <ClientOnly>
      <Container>
        <MainPage 
          data={players}
        />
      </Container>
    </ClientOnly>
  )
}