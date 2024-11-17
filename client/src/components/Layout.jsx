import React from 'react'
import Header from './Header'
import { Outlet } from 'react-router-dom'

function Layout() {
  return (
    <div className='py-4 px-8 flex flex-col min-h-screen'>
      <Header />
      <div className='lg:px-44'>
        <Outlet />
      </div>
    </div>
  )
}

export default Layout
