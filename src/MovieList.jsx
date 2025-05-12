import MovieCard from "./MovieCard";
import Modal from "./Modal";
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

const SORT_OPTIONS = {
  NONE: "",
  TITLE_ASC: "title-asc",
  RELEASE_DESC: "release-desc",
  RATING_DESC: "rating-desc",
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
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [genres, setGenres] = useState([]);
  const [sortOption, setSortOption] = useState(SORT_OPTIONS.NONE);

  useEffect(() => {
    const url = `https://api.themoviedb.org/3/genre/movie/list?language=en&api_key=${
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
      .then((data) => setGenres(data.genres))
      .catch((err) => console.error(err));
  }, []);

  function getGenreNames(genreIds) {
    return genreIds
      .map((id) => genres.find((g) => g.id === id)?.name)
      .filter(Boolean)
      .join(", ");
  }

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
        setMovies((prev) => {
          const existingIds = new Set(prev.map((movie) => movie.id));
          const newMovies = data.results.filter(
            (movie) => !existingIds.has(movie.id)
          );

          if (page === 1) {
            setHasMoreMovies(true);
          }

          if (newMovies.length === 0 || data.results.length === 0) {
            setHasMoreMovies(false);
          }

          return [...prev, ...newMovies];
        });
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

  function handleSortChange(newSortOption) {
    setSortOption(newSortOption);
    if (newSortOption === SORT_OPTIONS.NONE) return;

    setMovies((prevMovies) => {
      let sortedMovies = [...prevMovies];

      if (newSortOption === SORT_OPTIONS.TITLE_ASC) {
        sortedMovies.sort((a, b) => a.title.localeCompare(b.title));
      } else if (newSortOption === SORT_OPTIONS.RELEASE_DESC) {
        sortedMovies.sort(
          (a, b) => new Date(b.release_date) - new Date(a.release_date)
        );
      } else if (newSortOption === SORT_OPTIONS.RATING_DESC) {
        sortedMovies.sort((a, b) => b.vote_average - a.vote_average);
      }

      return sortedMovies;
    });
  }

  function fetchMovieDetails(movieId) {
    const url = `https://api.themoviedb.org/3/movie/${movieId}?language=en-US&api_key=${
      import.meta.env.VITE_API_KEY
    }`;
    const options = {
      method: "GET",
      headers: {
        accept: "application/json",
        Authorization: `Bearer ${import.meta.env.VITE_TMDB_TOKEN}`,
      },
    };

    return fetch(url, options).then((res) => res.json());
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
            setPage(1);
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
              setMode(MODES.NOW_PLAYING);
              setPage(1);
              setHasMoreMovies(true);
              fetchedPages.current = new Set();
            }}
          >
            Clear
          </button>
        </div>
      )}
      <h2>
        {mode === MODES.NOW_PLAYING ? "Now Playing Movies" : "Search Results"}
      </h2>
      <div className="sort-dropdown-container">
        <label htmlFor="sort">Sort by: </label>
        <select
          id="sort"
          value={sortOption}
          onChange={(e) => handleSortChange(e.target.value)}
        >
          <option value={SORT_OPTIONS.NONE}>None</option>
          <option value={SORT_OPTIONS.TITLE_ASC}>Title (A-Z)</option>
          <option value={SORT_OPTIONS.RELEASE_DESC}>
            Release Date (Newest to Oldest)
          </option>
          <option value={SORT_OPTIONS.RATING_DESC}>
            Rating (Highest to Lowest)
          </option>
        </select>
      </div>
      <div className="movie-list">
        {movies.map((movie) => (
          <div
            key={movie.id}
            onClick={() => {
              fetchMovieDetails(movie.id).then((details) => {
                setSelectedMovie({ ...movie, runtime: details.runtime });
              });
            }}
          >
            <MovieCard key={movie.id} movie={movie} />
          </div>
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
      {selectedMovie && (
        <Modal
          movie={{
            ...selectedMovie,
            genre: getGenreNames(selectedMovie.genre_ids),
          }}
          onClose={() => setSelectedMovie(null)}
        />
      )}
    </div>
  );
}
