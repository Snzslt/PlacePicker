import { useRef, useState, useEffect, useCallback } from 'react';

import Places from './components/Places.jsx';
import { AVAILABLE_PLACES } from './data.js';
import Modal from './components/Modal.jsx';
import DeleteConfirmation from './components/DeleteConfirmation.jsx';
import logoImg from './assets/logo.png';
import { sortPlacesByDistance } from './loc.js';

function App() {
  const [mpdalIsOpen, setModalIsOpen] = useState(false);
  const selectedPlace = useRef();
  const [availablePlaces, setAvailablrPlaces] = useState([]);
  const [pickedPlaces, setPickedPlaces] = useState([]);

// this is side effect
useEffect(()=> {
  navigator.geolocation.getCurrentPosition((position)=> {
    const soretedPlaces = sortPlacesByDistance(
      AVAILABLE_PLACES,
       position.coords.latitude,
       position.coords.longitude
       );
       setAvailablrPlaces(soretedPlaces);

  });
}, []);
 

  function handleStartRemovePlace(id) {
    setModalIsOpen(true);
    selectedPlace.current = id;
  }

  function handleStopRemovePlace() {
    setModalIsOpen(false);
  }

  function handleSelectPlace(id) {
    setPickedPlaces((prevPickedPlaces) => {
      if (prevPickedPlaces.some((place) => place.id === id)) {
        return prevPickedPlaces;
      }
      const place = AVAILABLE_PLACES.find((place) => place.id === id);
      return [place, ...prevPickedPlaces];
    });
  }

  const handleRemovePlace = useCallback(function handleRemovePlace() {
    setPickedPlaces((prevPickedPlaces) =>
      prevPickedPlaces.filter((place) => place.id !== selectedPlace.current)
    );
   setModalIsOpen(false);
    const storedId = JSON.parse(localStorage.getItem('selectedPlaces')) || [];
    localStorage.setItem(
      'selectedPlaces' ,
      JSON.stringify(storedId.filter((id) => id !== selectedPlace.current))
    );
  },[]);

  return (
    <>
      <Modal open={mpdalIsOpen}>
        
        <DeleteConfirmation
          onCancel={handleStopRemovePlace}
          onConfirm={handleRemovePlace}
        />
       
      </Modal>

      <header>
        <img src={logoImg} alt="Stylized globe" />
        <h1>PlacePicker</h1>
        <p>
          Create your personal collection of places you would like to visit or
          you have visited.
        </p>
      </header>
      <main>
        <Places
          title="I'd like to visit ..."
          fallbackText={'Select the places you would like to visit below.'}
          places={pickedPlaces}
          onSelectPlace={handleStartRemovePlace}
        />
        <Places
          title="Available Places"
          places={availablePlaces}
          onSelectPlace={handleSelectPlace}
        />
      </main>
    </>
  );
}

export default App;
