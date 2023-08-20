import React from "react"

import getTournaments from "../../actions/getTournaments"

import ClientOnly from "../../components/ClientOnly"
import Container from "../../components/Container"
import Contents from "../../components/pages/Contents"

export default async function Main() {
  const tournaments = await getTournaments()

  return (
    <ClientOnly>
      <Container>
        <Contents 
          data={tournaments}
        />
      </Container>
    </ClientOnly>
  )
}