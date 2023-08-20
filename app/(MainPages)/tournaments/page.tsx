import React from "react"

import getTournaments, { TournamentsParams }  from "../../actions/getTournaments"

import ClientOnly from "../../components/ClientOnly"
import Container from "../../components/Container"
import Contents from "../../components/pages/Contents"

interface TournamentsPageProps {
  searchParams: TournamentsParams
}

const TournamentsPage = async ({searchParams} : TournamentsPageProps) => {
  const tournaments = await getTournaments(searchParams)

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

export default TournamentsPage;