import React, { useState, useEffect } from 'react';
import axios from 'axios';
import MovieCard from './MovieCard';

const MovieList = () => {
  const [movies, setMovies] = useState([]);
  const [search, setSearch] = useState('');

  useEffect(() => {
    axios.get('/api/movies')
      .then(response => setMovies(response.data))
      .catch(error => console.error('Error fetching movies:', error));
  }, []);

  const filteredMovies = movies.filter(movie =>
    movie.name.toLowerCase().includes(search.toLowerCase()) ||
    movie.genre.toLowerCase().includes(search.toLowerCase())
  );

  const handleDelete = id => {
    axios.delete(`/api/movies/${id}`)
      .then(() => setMovies(movies.filter(movie => movie.id !== id)))
      .catch(error => console.error('Error deleting movie:', error));
  };

  return (
    <div>
      <input
        type="text"
        placeholder="Search movies..."
        value={search}
        onChange={e => setSearch(e.target.value)}
      />
      <div className="movie-list">
        {filteredMovies.map(movie => (
          <MovieCard
            key={movie.id}
            movie={movie}
            onDelete={handleDelete}
            onEdit={(id) => console.log(`Edit movie with id: ${id}`)}
          />
        ))}
      </div>
    </div>
  );
};

export default MovieList;
