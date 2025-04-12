import React, { useState, useEffect } from "react";
import NavBar from "./NavBar";


const MovieRecommender = () => {
  const [movie, setMovie] = useState("");
  const [recommendations, setRecommendations] = useState([]);
  const [suggestions, setSuggestions] = useState([]);
  const [error, setError] = useState("");
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchSuggestions = async () => {
      if (movie.trim() === "") {
        setSuggestions([]);
        return;
      }

      try {
        const response = await fetch(`http://127.0.0.1:5000/suggestions?query=${movie}`);
        if (response.ok) {
          const data = await response.json();
          setSuggestions(data.suggestions || []);
        }
      } catch (err) {
        console.error("Error fetching suggestions:", err);
      }
    };

    fetchSuggestions();
  }, [movie]);

  const handleRecommend = async () => {
    try {
      setError("");
      setRecommendations([]);
      setIsLoading(true);

      const response = await fetch("http://127.0.0.1:5000/recommend", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ title: movie }),
      });

      setIsLoading(false);

      if (!response.ok) {
        const errorData = await response.json();
        setError(errorData.error || "Movie not found");
        return;
      }

      const data = await response.json();
      setRecommendations(data.recommendations || []);

      if (!data.recommendations || data.recommendations.length === 0) {
        setError("Movie not found");
      }
    } catch (err) {
      setIsLoading(false);
      setError("An error occurred. Please try again.");
    }
  };

  const handleMovieClick = (movieTitle) => {
    setMovie(movieTitle);
    setSuggestions([]);
    setSelectedMovie(null); // Clear selected movie for a fresh fetch
  };

  const handleCloseError = () => setError("");
  const handleCloseMoviePopup = () => setSelectedMovie(null);

  const displayRatingStars = (rating) => {
    const totalStars = 5;
    const scaledRating = rating / 2;
    const fullStars = Math.floor(scaledRating);
    const stars = [];

    for (let i = 1; i <= fullStars; i++) {
      stars.push(<i key={i} className="fa fa-star text-yellow-500"></i>);
    }

    for (let i = fullStars; i < totalStars; i++) {
      stars.push(<i key={i} className="fa fa-star text-gray-300"></i>);
    }

    return stars;
  };

  return (
    <div className="relative bg-cover bg-center min-h-screen" style={{ backgroundImage: "url('/background-image.jpg')" }}>
      <NavBar />
      <div className="flex flex-col items-center pt-16 text-center">
        <h1 className="relative text-5xl font-extrabold text-white mb-4 tracking-wide">
          <span className="absolute inset-0 bg-black/80 hover:bg-black/50 transition-all rounded-lg shadow-lg"></span>
          <span className="relative z-10 drop-shadow-[2px_2px_4px_rgba(0,0,0,0.9)]">
            Movie Recommender
          </span>
        </h1>
          <p className="relative text-lg text-gray-200 mb-8 max-w-2xl">
            <span className="absolute inset-0 bg-black/80 hover:bg-black/50 transition-all rounded-lg"></span>
            <span className="relative z-10 px-2">
              Unlock the magic of cinema! Whether you're searching for the next{" "}
              <span className="text-orange-500">Avengers-level blockbuster</span> or a
              hidden gem worthy of <span className="text-orange-500">The Ring</span>,
              we’ve got you covered.
            </span>
          </p>
        <div className="relative w-full max-w-md mb-8">
          <input
            type="text"
            value={movie}
            onChange={(e) => setMovie(e.target.value)}
            placeholder="Enter a movie name"
            className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg shadow-sm focus:outline-none focus:border-orange-500"
          />
          {suggestions.length > 0 && (
            <div className="absolute z-10 mt-1 w-full bg-white rounded-lg shadow-lg">
              {suggestions.map((suggestion, index) => (
                <div
                  key={index}
                  className="px-4 py-2 cursor-pointer hover:bg-gray-100"
                  onClick={() => handleMovieClick(suggestion)}
                >
                  {suggestion}
                </div>
              ))}
            </div>
          )}
        </div>
        <button
          onClick={handleRecommend}
          className="px-4 py-2 bg-orange-500 text-white rounded-lg shadow-md hover:bg-orange-600 transition"
        >
          {isLoading ? "Searching..." : "Recommend"}
        </button>

        {error && (
          <div className="fixed top-1/3 left-1/2 transform -translate-x-1/2 bg-red-500 text-white p-4 rounded-lg shadow-lg">
            <p>{error}</p>
            <button onClick={handleCloseError} className="mt-2 underline">
              Close
            </button>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6 mt-8">
          {recommendations.map((rec, index) => (
            <div
              key={index}
              className="bg-white rounded-lg shadow-lg p-4 cursor-pointer hover:shadow-2xl transform hover:scale-105 transition"
              onClick={() => setSelectedMovie(rec)}
            >
              <img
                src={rec.poster_url || "/placeholder.jpg"}
                alt={rec.title}
                className="rounded-lg mb-4"
              />
              <h3 className="text-lg font-bold">{rec.title}</h3>
              <p className="text-sm text-gray-600">Rating: {rec.rating}</p>
            </div>
          ))}
        </div>
      </div>

      {selectedMovie && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center">
          <div className="bg-white rounded-lg p-6 w-96 relative shadow-lg">
            <button
              onClick={handleCloseMoviePopup}
              className="absolute top-2 right-2 text-gray-400 hover:text-black"
            >
              &times;
            </button>
            <img
              src={selectedMovie.poster_url || "/placeholder.jpg"}
              alt={selectedMovie.title}
              className="rounded-lg mb-4"
            />
            <h3 className="text-lg font-bold mb-2">{selectedMovie.title}</h3>
            <div className="mb-4">{displayRatingStars(parseFloat(selectedMovie.rating))}</div>
            <p className="text-sm mb-2">
              Director:{" "}
              <a
                href={`https://www.google.com/search?q=${encodeURIComponent(selectedMovie.director)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-500 underline"
              >
                {selectedMovie.director}
              </a>
            </p>
            <p className="text-sm">
              Cast:{" "}
              {selectedMovie.cast.map((actor, index) => (
                <span key={index}>
                  <a
                    href={`https://www.google.com/search?q=${encodeURIComponent(actor)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-500 underline"
                  >
                    {actor}
                  </a>
                  {index < selectedMovie.cast.length - 1 && ", "}
                </span>
              ))}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default MovieRecommender;