import React, { useEffect, useState } from "react";
import NavBar from "./NavBar";
import MovieCard from "./Card";

const Home = () => {
  const [trendingMovies, setTrendingMovies] = useState([]);
  const [topRatedMovies, setTopRatedMovies] = useState([]);

  // Fetch trending movies
  const fetchTrendingMovies = async () => {
    try {
      const response = await fetch("http://127.0.0.1:5000/trending");
      const data = await response.json();
      if (data.trending) setTrendingMovies(data.trending.slice(0, 12)); // Limit to top 12
    } catch (error) {
      console.error("Error fetching trending movies:", error);
    }
  };

  // Fetch top-rated movies
  const fetchTopRatedMovies = async () => {
    try {
      const response = await fetch("http://127.0.0.1:5000/top-rated");
      const data = await response.json();
      if (data.top_rated) setTopRatedMovies(data.top_rated.slice(0, 12)); // Limit to top 12
    } catch (error) {
      console.error("Error fetching top-rated movies:", error);
    }
  };

  useEffect(() => {
    fetchTrendingMovies();
    fetchTopRatedMovies();
  }, []);

  return (
    <>
      <NavBar />
      {/* Welcome Paragraph */}
      <div className="relative bg-black/70 text-white text-center px-8 py-6 rounded-lg shadow-lg mx-auto max-w-4xl my-8">
        <p className="text-lg leading-relaxed">
          Welcome to the ultimate cinematic portal! Whether you're hunting for a{" "}
          <span className="text-orange-500 font-bold">Marvel-sized blockbuster</span>, a tale as
          enchanting as <span className="text-orange-500 font-bold">Harry Potter</span>, or a journey
          as epic as <span className="text-orange-500 font-bold">The Lord of the Rings</span>, you’re in
          the right place. Here, every click unlocks a new adventure. With our powerful
          recommendation engine, you’ll discover stories that stir your soul, heroes that inspire you, and
          worlds you’ll want to revisit again and again. So buckle up—because, in the words of{" "}
          <span className="italic">Star Wars</span>, "your journey to the stars begins now!" Ready to find
          your next favorite movie?
        </p>
      </div>

      {/* Trending Movies */}
      <h1 className="relative bg-black/70 text-center text-3xl px-2 py-5 rounded-lg shadow-lg mx-auto font-bold mb-6">Trending Movies</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {trendingMovies.map((movie, index) => (
          <MovieCard
            key={index}
            title={movie.title}
            description={`Released: ${movie.release_date}`}
            imageUrl={movie.poster_url || "/placeholder.jpg"}
            rating={movie.rating}
          />
        ))}
      </div>

      {/* Top-Rated Movies */}
      <h1 className="relative bg-black/70 text-center text-3xl px-2 py-5 rounded-lg shadow-lg mx-auto font-bold mb-6">Top-Rated Movies</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {topRatedMovies.map((movie, index) => (
          <MovieCard
            key={index}
            title={movie.title}
            description={`Released: ${movie.release_date}`}
            imageUrl={movie.poster_url || "/placeholder.jpg"}
            rating={movie.rating}
          />
        ))}
      </div>
    </>
  );
};

export default Home;