import React, { useEffect, useState } from "react";
import axios from 'axios'

function IndexPage() {

  const [places, setPlaces] = useState([])
  useEffect(() => {
    axios.get('/post/places').then(response => {
      setPlaces(response.data)
    })
  }, [])

  return (
    <div>
      {console.log(places.length)}
      {places.length > 0 && places.map(place => {
        <div>
          {place.title}
        </div>
      })}
    </div>
  );
}

export default IndexPage;
