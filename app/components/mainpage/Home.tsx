'use client';

import Heading from '../Heading';

const Home = () => {
    return (
        <div className='pt-24'>
            <div className='flex flex-col justify-center'>
                <Heading 
                    center
                    title="Welcome to SmashIt"
                    subtitle="SmashIt is a fantasy tennis game where you can create your own team of tennis players and compete against other players."
                />
                {/* <div className='pt-24 justify-center'>
                    Get started by signing up or browse the list of tournaments and players.
                </div> */}
            </div>
        </div>
    )
}

export default Home;