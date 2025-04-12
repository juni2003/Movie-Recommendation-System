import React, { useState } from "react";
import "./MovieRecommender.css";

const MovieRecommender = () => {
  const [movie, setMovie] = useState(""); // User input
  const [recommendations, setRecommendations] = useState([]); // Recommendations list
  const [error, setError] = useState(""); // Error message

  const handleRecommend = async () => {
    try {
      setError("");
      setRecommendations([]);

      const response = await fetch("http://127.0.0.1:5000/recommend", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ title: movie }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        setError(errorData.error || "An error occurred. Please try again.");
        return;
      }

      const data = await response.json();
      console.log("Response from backend:", data);
      setRecommendations(data.recommendations || []);
    } catch (err) {
      console.error("Error from backend:", err.message);
      setError("An error occurred. Please try again.");
    }
  };

  return (
    <div className="container">
      <h1>Movie Recommender</h1>
      <input
        type="text"
        value={movie}
        onChange={(e) => setMovie(e.target.value)}
        placeholder="Enter a movie name"
        className="input"
      />
      <button onClick={handleRecommend} className="button">
        Recommend
      </button>

      {error && <p className="error">{error}</p>}

      <div className="recommendations">
        {recommendations.length > 0 ? (
          recommendations.map((rec, index) => (
            <div key={index} className="recommendation">
              <img
                src={rec.poster_url || "/placeholder.jpg"}
                alt={rec.title}
                className="poster"
              />
              <h3>{rec.title}</h3>
              <p>Rating: {rec.rating || "N/A"}</p>
            </div>
          ))
        ) : (
          <p>No recommendations available. Try searching for a movie!</p>
        )}
      </div>
    </div>
  );
};

export default MovieRecommender;
