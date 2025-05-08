import MovieCard from "./MovieCard";
import { useEffect, useState } from "react";
import "./App.css";

/**
 * This was used to test the MovieCard component with static data.
 */
// import data from "./data/data.js";

export default function MovieList() {
  /**
   * This was used to test the MovieCard component with static data.
   */
  // const movies = data.results;
  const [movies, setMovies] = useState([]);

  useEffect(() => {
    const url =
      "https://api.themoviedb.org/3/movie/now_playing?language=en-US&page=1";
    const options = {
      method: "GET",
      headers: {
        accept: "application/json",
        Authorization: `Bearer ${import.meta.env.REACT_APP_TMDB_TOKEN}`,
      },
    };

    fetch(url, options)
      .then((res) => res.json())
      .then((data) => {
        setMovies(data.results);
      })
      .catch((err) => console.error(err));
  }, []);

  return (
    <div className="movie-list">
      {movies.map((movie) => (
        <MovieCard key={movie.id} movie={movie} />
      ))}
    </div>
  );
}
