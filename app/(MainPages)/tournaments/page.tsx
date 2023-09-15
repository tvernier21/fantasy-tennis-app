import React from "react"

import getTournaments, { TournamentsParams }  from "../../actions/getTournaments"

import ClientOnly from "../../components/ClientOnly"
import Container from "../../components/Container"
import MainPage from "../../components/main/MainPage"

interface TournamentsPageProps {
  searchParams: TournamentsParams
}

const TournamentsPage = async ({searchParams} : TournamentsPageProps) => {
  let tournaments: any[] = [];
  if (Object.keys(searchParams).length !== 0) {
      // searchParams is empty
      tournaments = await getTournaments(searchParams);
  } else {
      tournaments = await getTournaments({lvlMax: 5, lvlMin: 0});
  }

  return (
    <ClientOnly>
      <Container>
        <MainPage 
          data={tournaments}
        />
      </Container>
    </ClientOnly>
  )
}

export default TournamentsPage;