import ClientOnly from './components/ClientOnly'
import getCurrentUser from './actions/getCurrentUser'
import MainPage from './components/mainpage/MainPage'
import getPlayers from './actions/getPlayers'
import getTournaments from './actions/getTournaments'

export default async function Home() {
  const currentUser = await getCurrentUser()
  const players = await getPlayers()
  const tournaments = await getTournaments()

  return (
    // <ClientOnly>
    //   <MainPage 
    //     currentUser={currentUser} 
    //     players={players}
    //     tournaments={tournaments}
    //   />
    // </ClientOnly>
    <div>
    </div>
  )
}
