import React from "react"

import ClientOnly from "./components/ClientOnly"
import Container from "./components/Container"
import HomePage from "./components/main/HomePage"

export default function Page() {

  return (
    <ClientOnly>
      <Container>
        <HomePage />
      </Container>
    </ClientOnly>
  )
}