import PropTypes from "prop-types";

export default function MovieCard({ movie }) {
  return (
    <div className="movie-card">
      <img
        src={`https://image.tmdb.org/t/p/w200${movie.poster_path}`}
        alt={`${movie.title} poster`}
      />
      <h2>{movie.title}</h2>
      <p>Rating: {movie.vote_average}</p>
    </div>
  );
}

MovieCard.propTypes = {
  movie: PropTypes.shape({
    title: PropTypes.string.isRequired,
    vote_average: PropTypes.number.isRequired,
    poster_path: PropTypes.string.isRequired,
  }).isRequired,
};
