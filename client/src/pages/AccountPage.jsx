import React, { useContext, useState } from 'react'
import { UserContext } from '../UserContext'
import { Link, Navigate, useParams } from 'react-router-dom'
import axios from 'axios'
import PlacesPage from './PlacesPage'

function AccountPage() {
  const [redirect, setRedirect] = useState(null)
  const {ready, user, setUser} = useContext(UserContext)
  let {subpage} = useParams()
  if(subpage === undefined) {subpage = 'profile'}
  
  async function logout() {
    await axios.post('/auth/logout')
    setRedirect('/')
    setUser(null)
  }

  if(!ready) return 'Loading...'

  if(ready && !user && !redirect) {
    return <Navigate to={'/login'}/>
  }

  function linkClasses (type = null) {
    let classes = 'inline-flex gap-1 py-2 px-6 rounded-full'
    if (type === subpage)
      classes += ' bg-primary text-white' // phải có dấu cách ở đầu nha:))
    else {
      classes += ' bg-gray-200'
    }
    return classes
  }

  if(redirect) return <Navigate to={redirect}/>

  return (
    <div>
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

      {subpage === 'profile' && (
        <div className='text-center max-w-lg mx-auto'>
          Logged in as {user.name}
          <button onClick={logout} className='primary max-w-sm mt-2'>Logout</button>
        </div>
      )}

      {subpage === 'places' && (
        <div>
          <PlacesPage />
        </div>
      )}
    </div>
  )
}

export default AccountPage
