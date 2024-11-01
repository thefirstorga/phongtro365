import React, { useState } from 'react'
import { Link, Navigate, useParams } from 'react-router-dom'
import PlacesFormPage from './PlacesFormPage'
import AccountNav from '../AccountNav'

function PlacesPage() {

  return (
    <div>
        <AccountNav />
        <div className='text-center'>
            <Link className='inline-flex gap-1 bg-primary text-white py-2 px-4 rounded-full' to={'/account/places/new'}>
                Add new place
            </Link>
        </div>
    </div>
  )
}

export default PlacesPage
