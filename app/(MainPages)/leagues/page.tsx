import React from "react"

import getCurrentUser from "../../actions/getCurrentUser"

import ClientOnly from "../../components/ClientOnly"
import Container from "../../components/Container"
import MainPage from "../../components/main/MainPage"

export default async function Main() {
  const currentUser = await getCurrentUser();

  return (
    <ClientOnly>
      <Container>
        <MainPage 
          currentUser={currentUser}
        />
      </Container>
    </ClientOnly>
  )
}