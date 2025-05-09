import PropTypes from "prop-types";

export default function Modal({ movie, onClose }) {
  if (!movie) return null;
  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>{movie.title}</h2>
        <img
          src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
          alt={movie.title}
        />
        <p>
          <strong>Release Date: </strong> {movie.release_date}
        </p>
        <p>
          <strong>Overview: </strong> {movie.overview}
        </p>
        <p>
          <strong>Genre: </strong> {movie.genre}
        </p>
        <button className="close-button" onClick={onClose}>
          Close
        </button>
      </div>
    </div>
  );
}

Modal.propTypes = {
  movie: PropTypes.shape({
    poster_path: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    release_date: PropTypes.string.isRequired,
    overview: PropTypes.string.isRequired,
    genre: PropTypes.string.isRequired,
  }).isRequired,
  onClose: PropTypes.func.isRequired,
};
