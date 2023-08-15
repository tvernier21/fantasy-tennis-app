import Container from './components/Container'
import ClientOnly from './components/ClientOnly'
import getCurrentUser from './actions/getCurrentUser'
import MainPage from './components/mainpage/MainPage'

export default async function Home() {
  const currentUser = await getCurrentUser()

  return (
    <ClientOnly>
      <MainPage currentUser={currentUser} />
    </ClientOnly>
  )
}
