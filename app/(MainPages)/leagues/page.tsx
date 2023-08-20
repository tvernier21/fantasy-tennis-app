import React from "react"

import getPlayers from "../../actions/getPlayers"

import ClientOnly from "../../components/ClientOnly"
import Container from "../../components/Container"
import Contents from "../../components/pages/Contents"

export default async function Main() {
  const players = await getPlayers()

  return (
    <ClientOnly>
      <Container>
        <Contents 
          data={players}
        />
      </Container>
    </ClientOnly>
  )
}