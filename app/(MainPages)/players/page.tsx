import React from "react"

import getPlayers, { PlayersParams } from "../../actions/getPlayers"

import ClientOnly from "../../components/ClientOnly"
import Container from "../../components/Container"
import MainPage from "../../components/main/MainPage"

interface PlayersPageProps {
  searchParams: PlayersParams
}

const PlayersPage = async ({ searchParams }: PlayersPageProps) => {
  let players: any[] = [];
  if (Object.keys(searchParams).length !== 0) {
      // searchParams is empty
      players = await getPlayers(searchParams);
  } else {
      players = await getPlayers({eloMin: 1200, eloMax: 2500, ageMin: 15, ageMax: 40});
  }
  
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