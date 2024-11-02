import React, { useEffect, useState } from 'react'
import PhotoUploader from '../PhotoUploader'
import Perks from '../Perks'
import axios from 'axios'
import AccountNav from '../AccountNav'
import { Navigate, useParams } from 'react-router-dom'

function PlacesFormPage() {
    const {id} = useParams()
    const [title, setTitle] = useState('')
    const [address, setAddress] = useState('')
    const [description, setDescription] = useState('')
    const [addedPhotos, setAddedPhotos] = useState([])
    const [perks, setPerks] = useState([])
    const [extraInfo, setExtraInfo] = useState('')
    const [checkIn, setCheckIn] = useState('')
    const [checkOut, setCheckOut] = useState('')
    const [maxGuests, setMaxGuests] = useState(1)
    const [price, setPrice] = useState(100)
    const [redirect, setRedirect] = useState(false)

    useEffect(() => {
        if(!id) return
        axios.get('/post/places/' + id).then(response => {
            const {data} = response
            setTitle(data.title)
            setAddress(data.address)
            setAddedPhotos(data.photoUrls)
            setDescription(data.description)
            setPerks(data.perkNames)
            setExtraInfo(data.extraInfo)
            setCheckIn(data.checkIn)
            setCheckOut(data.checkOut)
            setMaxGuests(data.maxGuests)
            setPrice(data.response)
         })
    }, [id])


    function inputHeader(text) {
        return(
            <h2 className='text-2xl mt-4'>{text}</h2>
        )
    }
    function inputDescription(text) {
        return(
            <p className='text-gray-500 text-sm'>{text}</p>
        )
    }
    function preInput(header, description) {
        return (
            <>
                {inputHeader(header)}
                {inputDescription(description)}
            </>
        )
    }

    async function savePlace(ev) {
        ev.preventDefault()
        const placeData = {
            title, address, addedPhotos, 
            description, perks, extraInfo, 
            checkIn, checkOut, maxGuests, price
        }
        if(id) {
            await axios.put('/post/places/' + id, {id, ...placeData})
        } else {
            await axios.post('/post/places', placeData)
        }
        setRedirect(true)
    }

    if(redirect) return <Navigate to={'/account/places'}/>

  return (
    <div>
        <AccountNav />
        <form onSubmit={savePlace}>
            {preInput('Title', 'Fill your title')}
            <input type='text' value={title}
                onChange={ev => setTitle(ev.target.value)}
                placeholder='Title'
            />
            
            {preInput('Address', 'Fill your address')}
            <input type='text' value={address}
                onChange={ev => setAddress(ev.target.value)}
                placeholder='Address'
            />
            
            {preInput('Photos', 'Fill your photos')}
            <PhotoUploader addedPhotos={addedPhotos} setAddedPhotos={setAddedPhotos}/>

            {preInput('Description', 'Fill your description')}
            <textarea value={description} onChange={ev => setDescription(ev.target.value)}/>

            {preInput('Perks', 'Fill your perks')}
            <div className='grid gap-2 grid-cols-2 md:grid-cols-3 lg:grid-cols-6'>
                <Perks selected={perks} onChange={setPerks}/>
            </div>

            {preInput('Extra info', 'Fill your extra info')}
            <textarea value={extraInfo} onChange={ev => setExtraInfo(ev.target.value)} />

            {preInput('Checkin, Checkout, Max guests', 'Fill the blank')}
            <div className='grid gap-2 sm:grid-cols-2 lg:grid-cols-4'>
                <div>
                    <h3 className='mt-2 -mb-1'>Checkin time</h3>
                    <input type="text" value={checkIn}
                        onChange={ev => setCheckIn(ev.target.value)}
                        placeholder='14:00'
                    />
                </div>
                <div>
                    <h3 className='mt-2 -mb-1'>Checkout time</h3>
                    <input type="text" value={checkOut}
                        onChange={ev => setCheckOut(ev.target.value)}
                        placeholder='11:00'
                    />
                </div>
                <div>
                    <h3 className='mt-2 -mb-1'>Max guests</h3>
                    <input type="number" value={maxGuests}
                        onChange={ev => setMaxGuests(Number(ev.target.value))}
                    />
                </div>
                <div>
                    <h3 className='mt-2 -mb-1'>Price</h3>
                    <input type="number" value={price}
                        onChange={ev => setPrice(Number(ev.target.value))}
                    />
                </div>
            </div>

            <button className='primary my-4'>Save</button>
        </form>
    </div>
  )
}

export default PlacesFormPage
