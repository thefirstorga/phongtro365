import React, { useEffect, useState } from 'react'
import PhotoUploader from '../components/PhotoUploader'
import Perks from '../components/Perks'
import axios from 'axios'
import AccountNav from '../components/AccountNav'
import LocationPicker from '../components/LocationPicker'
import { Navigate, useParams } from 'react-router-dom'

function PlacesFormPage() {
    const {id} = useParams()
    const [title, setTitle] = useState('')
    const [address, setAddress] = useState('')
    const [latitude, setLatitude] = useState(null)
    const [longitude, setLongitude] = useState(null)
    const [description, setDescription] = useState('')
    const [addedPhotos, setAddedPhotos] = useState([])
    const [perks, setPerks] = useState([])
    const [extraInfo, setExtraInfo] = useState('')
    const [area, setArea] = useState(30)
    const [duration, setDuration] = useState(6)
    const [price, setPrice] = useState(100)
    const [redirect, setRedirect] = useState(false)

    useEffect(() => {
        if(!id) return
        axios.get('/post/place/' + id).then(response => {
            let {data} = response
            data = data.place
            setTitle(data.title)
            setAddress(data.address)
            setLatitude(data.latitude);
            setLongitude(data.longitude);
            // console.log(data)
            const photos = data.photos.map(photoGet => photoGet.url);
            setAddedPhotos(photos);
            setDescription(data.description)
            const perks = data.perks.map(perkGet => perkGet.perk)
            setPerks(perks)
            setExtraInfo(data.extraInfo)
            setArea(data.area)
            setDuration(data.duration)
            setPrice(data.price)
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
            title, address, latitude, longitude, 
            addedPhotos, 
            description, perks, extraInfo, 
            area, duration, price
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
            <h2 className="text-2xl mt-4">Map location</h2>
            {latitude && (
                <p>(Bạn đã chọn địa chỉ, tuy nhiên vẫn có thể đổi)</p>
            )}
            <LocationPicker
                latitude={latitude}
                longitude={longitude}
                onChange={({ latitude, longitude }) => {
                    setLatitude(latitude);
                    setLongitude(longitude);
                }}
            />
            
            {preInput('Photos', 'Fill your photos')}
            <PhotoUploader addedPhotos={addedPhotos} setAddedPhotos={setAddedPhotos}/>
            {/* {console.log(addedPhotos[0])} */}
            {preInput('Description', 'Fill your description')}
            <textarea value={description} onChange={ev => setDescription(ev.target.value)}/>

            {preInput('Perks', 'Fill your perks')}
            <div className='grid gap-2 grid-cols-2 md:grid-cols-3 lg:grid-cols-6'>
                <Perks selected={perks} onChange={setPerks}/>
            </div>

            {preInput('Extra info', 'Fill your extra info')}
            <textarea value={extraInfo} onChange={ev => setExtraInfo(ev.target.value)} />

            {preInput('Area - Duration - Price', 'Fill the blank')}
            <div className='grid gap-2 sm:grid-cols-3 lg:grid-cols-3'>
                <div>
                    <h3 className='mt-2 -mb-1'>Area - mét vuông</h3>
                    <input type="number" value={area}
                        onChange={ev => setArea(Number(ev.target.value))}
                    />
                </div>
                <div>
                    <h3 className='mt-2 -mb-1'>Duration - tháng</h3>
                    <input type="number" value={duration}
                        onChange={ev => setDuration(Number(ev.target.value))}
                    />
                </div>
                <div>
                    <h3 className='mt-2 -mb-1'>Price per month</h3>
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
