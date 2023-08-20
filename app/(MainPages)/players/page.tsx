import React from "react"

import getPlayers, { PlayersParams } from "../../actions/getPlayers"

import ClientOnly from "../../components/ClientOnly"
import Container from "../../components/Container"
import Contents from "../../components/pages/Contents"

interface PlayersPageProps {
  searchParams: PlayersParams
}

const PlayersPage = async ({ searchParams }: PlayersPageProps) => {
  const players = await getPlayers(searchParams)
  
  return (
    <ClientOnly>
      <Container>
        <Contents 
          data={players}
        />
      </Container>
    </ClientOnly>
  )
};

export default PlayersPage;