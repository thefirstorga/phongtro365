import React from 'react'
import { Link, useLocation } from 'react-router-dom'


function AccountNav() {
    const {pathname} = useLocation()
    let subpage = pathname.split('/')?.[2]
    if(subpage === undefined) subpage = 'profile'
    function linkClasses (type = null) {
        let classes = 'inline-flex gap-1 py-2 px-6 rounded-full'
        if (type === subpage)
          classes += ' bg-primary text-white' // phải có dấu cách ở đầu nha:))
        else {
          classes += ' bg-gray-200'
        }
        return classes
      }
  return (
    <nav className='w-full flex justify-center mt-8 gap-2'>
        <Link className={linkClasses('profile')} to={'/account'}>
          My profile
        </Link>
        <Link className={linkClasses('bookings')} to={'/account/bookings'}>
          My bookings
        </Link>
        <Link className={linkClasses('places')} to={'/account/places'}>
          My accommodations
        </Link>
    </nav>
  )
}

export default AccountNav
