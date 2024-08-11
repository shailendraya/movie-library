import React from 'react';

const MovieCard = ({ movie, onDelete, onEdit }) => {
  return (
    <div className="movie-card">
      <h2>{movie.name}</h2>
      <p><strong>Genre:</strong> {movie.genre}</p>
      <p><strong>Actors:</strong> {movie.actors.join(', ')}</p>
      <p><strong>Release Date:</strong> {movie.releaseDate}</p>
      <p>{movie.details}</p>
      <button onClick={() => onEdit(movie.id)}>Edit</button>
      <button onClick={() => onDelete(movie.id)}>Delete</button>
    </div>
  );
};

export default MovieCard;
