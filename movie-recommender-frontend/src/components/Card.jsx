import React from "react";

const MovieCard = ({ title, description, imageUrl, rating }) => {
  return (
    <div className="card bg-stone-800/50 w-90 m-4">
      <figure className="px-10 pt-10">
        <img src={imageUrl} alt={title} className="rounded-xl" />
      </figure>
      <div className="card-body items-center text-center">
        <h2 className="card-title">{title}</h2>
        <p>{description}</p>
        <p className="text-sm font-bold">Rating: {rating}</p>
      </div>
    </div>
  );
};

export default MovieCard;