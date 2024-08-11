import React, { useState } from 'react';
import axios from 'axios';

const AddMovie = () => {
  const [movie, setMovie] = useState({
    name: '',
    genre: '',
    actors: '',
    releaseDate: '',
    details: ''
  });

  const handleChange = e => {
    setMovie({
      ...movie,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = e => {
    e.preventDefault();
    axios.post('/api/movies', {
      ...movie,
      actors: movie.actors.split(',')
    })
      .then(response => console.log('Movie added:', response))
      .catch(error => console.error('Error adding movie:', error));
  };

  return (
    <form onSubmit={handleSubmit}>
      <input name="name" placeholder="Name" onChange={handleChange} />
      <input name="genre" placeholder="Genre" onChange={handleChange} />
      <input name="actors" placeholder="Actors (comma separated)" onChange={handleChange} />
      <input name="releaseDate" placeholder="Release Date" onChange={handleChange} />
      <textarea name="details" placeholder="Details" onChange={handleChange}></textarea>
      <button type="submit">Add Movie</button>
    </form>
  );
};

export default AddMovie;
