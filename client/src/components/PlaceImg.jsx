import React from 'react'

function PlaceImg({place, index = 0, className = null}) {
    if(!place.photos?.length) return ''
    if(!className) className = 'object-cover aspect-square'
  return (
      <img className={className} src={'http://localhost:4000/post/uploads/'+place.photos[index].url} alt="" />
  )
}

export default PlaceImg
