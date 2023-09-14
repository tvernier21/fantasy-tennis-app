import React from "react"

import ClientOnly from "./components/ClientOnly"
import Container from "./components/Container"
import HomePage from "./components/main/HomePage"
import getCurrentUser from "./actions/getCurrentUser"

export default async function Page() {
  const currentUser = await getCurrentUser();

  return (
    <ClientOnly>
      <Container>
        <HomePage currentUser={currentUser} />
      </Container>
    </ClientOnly>
  )
}