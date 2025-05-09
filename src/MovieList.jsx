import MovieCard from "./MovieCard";
import { useEffect, useRef, useState } from "react";
import "./App.css";
/**
 * This was used to test the MovieCard component with static data.
 */
// import data from "./data/data.js";

const MODES = {
  NOW_PLAYING: "nowPlaying",
  SEARCH: "search",
};

export default function MovieList() {
  /**
   * This was used to test the MovieCard component with static data.
   */
  // const movies = data.results;
  const [movies, setMovies] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMoreMovies, setHasMoreMovies] = useState(true);
  const fetchedPages = useRef(new Set());
  const [searchTerm, setSearchTerm] = useState("");
  const [mode, setMode] = useState(MODES.NOW_PLAYING);
  const [hasSearched, setHasSearched] = useState(false);

  function fetchMovies(page) {
    const url = `https://api.themoviedb.org/3/movie/now_playing?api_key=${
      import.meta.env.VITE_API_KEY
    }&language=en-US&page=${page}`;
    const options = {
      method: "GET",
      headers: {
        accept: "application/json",
        Authorization: `Bearer ${import.meta.env.VITE_TMDB_TOKEN}`,
      },
    };

    fetch(url, options)
      .then((res) => res.json())
      .then((data) => {
        const existingIds = new Set(movies.map((movie) => movie.id));
        const newMovies = data.results.filter(
          (movie) => !existingIds.has(movie.id)
        );

        if (newMovies.length === 0 || data.results.length === 0) {
          setHasMoreMovies(false);
        }

        setMovies((prev) => [...prev, ...newMovies]);
      })
      .catch((err) => console.error(err));
  }

  useEffect(() => {
    if (mode !== MODES.NOW_PLAYING) return;
    if (fetchedPages.current.has(page)) return; // skip if already fetched
    fetchedPages.current.add(page); // mark this page as fetched
    fetchMovies(page);
  }, [page, mode]);

  function handleLoadMore() {
    const nextPage = page + 1;
    setPage(nextPage);

    if (mode === MODES.SEARCH) {
      searchMovies(searchTerm, nextPage);
    }
  }

  function searchMovies(searchTerm, page = 1) {
    const url = `https://api.themoviedb.org/3/search/movie?query=${encodeURIComponent(
      searchTerm
    )}&include_adult=false&language=en-US&page=${page}&api_key=${
      import.meta.env.VITE_API_KEY
    }`;

    const options = {
      method: "GET",
      headers: {
        accept: "application/json",
        Authorization: `Bearer ${import.meta.env.VITE_TMDB_TOKEN}`,
      },
    };

    fetch(url, options)
      .then((res) => res.json())
      .then((data) => {
        if (data.results.length === 0) {
          setHasMoreMovies(false);
        } else {
          if (page === 1) {
            setMovies(data.results);
          } else {
            const existingIds = new Set(movies.map((movie) => movie.id));
            const newMovies = data.results.filter(
              (movie) => !existingIds.has(movie.id)
            );
            setMovies((prev) => [...prev, ...newMovies]);
          }
          setHasMoreMovies(true);
        }
      })
      .catch((err) => console.error(err));
  }

  return (
    <div className="movie-list-container">
      <div className="view-toggle-container">
        <button
          className={mode === MODES.NOW_PLAYING ? "active" : ""}
          onClick={() => {
            setMode(MODES.NOW_PLAYING);
            setMovies([]);
            setPage(1);
            setHasMoreMovies(true);
            fetchedPages.current = new Set();
            fetchMovies(1);
          }}
        >
          Now Playing
        </button>

        <button
          className={mode === MODES.SEARCH ? "active" : ""}
          onClick={() => {
            setMode(MODES.SEARCH);
            setMovies([]);
            setHasMoreMovies(false);
            setPage(1);
            setHasSearched(false);
          }}
        >
          Search
        </button>
      </div>

      {mode === MODES.SEARCH && (
        <div className="search-bar-container">
          <input
            type="text"
            placeholder="Search for movies"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                setPage(1);
                if (searchTerm.trim() !== "") {
                  setHasSearched(true);
                }
                searchMovies(searchTerm);
              }
            }}
          />

          <button
            onClick={() => {
              setPage(1);
              if (searchTerm.trim() !== "") {
                setHasSearched(true);
              }
              searchMovies(searchTerm);
            }}
          >
            Search
          </button>
          <button
            onClick={() => {
              setSearchTerm("");
              setMovies([]);
              setPage(1);
              setHasMoreMovies(false);
              setHasSearched(false);
            }}
          >
            Clear
          </button>
        </div>
      )}
      <div className="movie-list">
        {movies.map((movie) => (
          <MovieCard key={movie.id} movie={movie} />
        ))}
      </div>
      <div className="load-more-container">
        {mode === MODES.SEARCH && !hasSearched ? (
          <p>Search for a movie!</p>
        ) : !hasMoreMovies ? (
          <p>No more movies to show.</p>
        ) : (
          <div>
            <button onClick={handleLoadMore}>Load More</button>
          </div>
        )}
      </div>
    </div>
  );
}
