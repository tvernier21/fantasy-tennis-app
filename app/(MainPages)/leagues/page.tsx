import React from "react"

import getCurrentUser from "../../actions/getCurrentUser"

import ClientOnly from "../../components/ClientOnly"
import Container from "../../components/Container"
import DraftPage from "../../components/main/DraftPage"
import LeagueModal from "../../components/modals/LeagueModal"
import PlayerPickerModal from "../../components/modals/PlayerPickerModal"

export default async function Main() {
  const currentUser = await getCurrentUser();

  return (
    <ClientOnly>
      <LeagueModal />
      <PlayerPickerModal />
      <Container>
        <DraftPage 
          currentUser={currentUser}
        />
      </Container>
    </ClientOnly>
  )
}