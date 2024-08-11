import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const EditMovie = () => {
  const { id } = useParams(); // Get the movie ID from the URL
  const navigate = useNavigate(); // For redirecting after successful edit

  const [movie, setMovie] = useState({
    name: '',
    genre: '',
    actors: '',
    releaseDate: '',
    details: '',
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Fetch the existing movie details using the movie ID
    axios.get(`/api/movies/${id}`)
      .then((response) => {
        const { name, genre, actors, releaseDate, details } = response.data;
        setMovie({
          name,
          genre,
          actors: actors.join(', '), // Convert array to comma-separated string
          releaseDate,
          details,
        });
        setLoading(false);
      })
      .catch((error) => {
        setError('Failed to load movie details');
        setLoading(false);
      });
  }, [id]);

  const handleChange = (e) => {
    setMovie({
      ...movie,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Update the movie in the database
    axios.put(`/api/movies/${id}`, {
      ...movie,
      actors: movie.actors.split(',').map(actor => actor.trim()), // Convert back to array
    })
      .then(() => {
        navigate('/'); // Redirect to the homepage after successful update
      })
      .catch((error) => {
        setError('Failed to update movie');
      });
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div>
      <h2>Edit Movie</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Movie Name:</label>
          <input
            type="text"
            name="name"
            value={movie.name}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Genre:</label>
          <input
            type="text"
            name="genre"
            value={movie.genre}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Actors (comma separated):</label>
          <input
            type="text"
            name="actors"
            value={movie.actors}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Release Date:</label>
          <input
            type="date"
            name="releaseDate"
            value={movie.releaseDate}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Details:</label>
          <textarea
            name="details"
            value={movie.details}
            onChange={handleChange}
            required
          />
        </div>
        <button type="submit">Save Changes</button>
      </form>
    </div>
  );
};

export default EditMovie;
