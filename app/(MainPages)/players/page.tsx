import React from "react"

import getPlayers, { PlayersParams } from "../../actions/getPlayers"

import ClientOnly from "../../components/ClientOnly"
import Container from "../../components/Container"
import MainPage from "../../components/main/MainPage"

interface PlayersPageProps {
  searchParams: PlayersParams
}

const PlayersPage = async ({ searchParams }: PlayersPageProps) => {
  const players = await getPlayers(searchParams)
  
  return (
    <ClientOnly>
      <Container>
        <MainPage 
          data={players}
        />
      </Container>
    </ClientOnly>
  )
};

export default PlayersPage;