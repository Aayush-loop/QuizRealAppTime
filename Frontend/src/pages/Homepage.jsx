import React from 'react'

import Navbar from '../components/Navbar'

const Homepage = () => {
    return (
        <>
            <Navbar />
            <img src="/images/hero.jpg" alt="Background" className="absolute inset-0 object-cover w-full h-full -z-10" />
        </>
    )
}

export default Homepage