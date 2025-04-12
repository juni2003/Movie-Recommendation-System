from flask import Flask, request, jsonify
import pandas as pd
import requests
from sklearn.neighbors import NearestNeighbors
from scipy.sparse import load_npz
from flask_cors import CORS
import os
from kaggle.api.kaggle_api_extended import KaggleApi

# Initialize Flask app
app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

api = KaggleApi()
api.authenticate()

# Load data and model
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
TFIDF_PATH = os.path.join(BASE_DIR, 'data', 'tfidf_matrix.npz')
MOVIES_PATH = os.path.join(BASE_DIR, 'data', 'movies_metadata.csv')

try:
    tfidf_matrix = load_npz(TFIDF_PATH)
    print("TF-IDF matrix loaded successfully.")
except Exception as e:
    print("Error loading TF-IDF matrix:", e)

try:
    movies_df = pd.read_csv(MOVIES_PATH)
    print("Movies metadata loaded successfully.")
except Exception as e:
    print("Error loading movies metadata:", e)

# Initialize KNN model
knn_model = NearestNeighbors(metric="cosine", algorithm="brute")
knn_model.fit(tfidf_matrix)

TMDB_API_KEY = "8265bd1679663a7ea12ac168da84d2e8"

def fetch_movie_details(movie_title):
    url = f"https://api.themoviedb.org/3/search/movie?api_key={TMDB_API_KEY}&query={movie_title}"
    response = requests.get(url)

    if response.status_code == 200:
        results = response.json().get("results", [])
        if results:
            movie = results[0]  # Take the first result
            movie_id = movie.get("id")
            poster_path = movie.get("poster_path")
            vote_average = movie.get("vote_average", "N/A")
            poster_url = f"https://image.tmdb.org/t/p/w500{poster_path}" if poster_path else None
            
            # Fetch cast and director details using the movie_id
            cast_url = f"https://api.themoviedb.org/3/movie/{movie_id}/credits?api_key={TMDB_API_KEY}"
            cast_response = requests.get(cast_url)
            cast_data = cast_response.json()

            director = None
            top_cast = []

            # Find the director
            for crew_member in cast_data['crew']:
                if crew_member['job'] == 'Director':
                    director = crew_member['name']
                    break

            # Get top 3 cast members
            for actor in cast_data['cast'][:3]:
                top_cast.append(actor['name'])

            return {
                "poster_url": poster_url,
                "rating": vote_average,
                "director": director,
                "cast": top_cast
            }

    return {"poster_url": None, "rating": None, "director": None, "cast": []}

@app.route("/recommend", methods=["POST"])
def recommend():
    data = request.json
    movie_title = data.get("title")
    if not movie_title:
        return jsonify({"error": "No title provided"}), 400

    # Check if the movie exists (case-insensitive match)
    matched_movies = movies_df[movies_df["title"].str.lower() == movie_title.lower()]
    if matched_movies.empty:
        return jsonify({"error": "Movie not found"}), 404

    movie_index = matched_movies.index[0]

    # Find similar movies
    distances, indices = knn_model.kneighbors(tfidf_matrix[movie_index], n_neighbors=9)

    # Prepare response
    recommendations = []
    for i in range(1, len(indices[0])):  # Skip the first movie (the input movie itself)
        recommended_title = movies_df.iloc[indices[0][i]]["title"]
        movie_details = fetch_movie_details(recommended_title)

        recommendations.append(
            {
                "title": recommended_title,
                "poster_url": movie_details.get("poster_url") or "N/A",
                "rating": movie_details.get("rating") or "N/A",
                "director": movie_details.get("director") or "N/A",
                "cast": movie_details.get("cast") or ["N/A"]
            }
        )

    return jsonify({"recommendations": recommendations})
@app.route("/suggestions", methods=["GET"])
def suggestions():
    query = request.args.get("query", "").lower()
    if not query:
        return jsonify({"suggestions": []})

    matched_movies = movies_df[movies_df["title"].str.lower().str.contains(query, na=False)]
    suggestions = matched_movies["title"].head(10).tolist()

    return jsonify({"suggestions": suggestions})
@app.route("/trending", methods=["GET"])
def get_trending_movies():
    try:
        url = f"https://api.themoviedb.org/3/trending/movie/day?api_key={TMDB_API_KEY}"
        response = requests.get(url)

        if response.status_code == 200:
            trending_movies = response.json().get("results", [])
            # Extract the required details
            movies = [
                {
                    "title": movie["title"],
                    "poster_url": f"https://image.tmdb.org/t/p/w500{movie['poster_path']}" if movie.get("poster_path") else None,
                    "rating": movie.get("vote_average", "N/A"),
                    "release_date": movie.get("release_date", "N/A"),
                }
                for movie in trending_movies
            ]
            return jsonify({"trending": movies}), 200
        else:
            return jsonify({"error": "Failed to fetch trending movies"}), response.status_code

    except Exception as e:
        return jsonify({"error": str(e)}), 500


@app.route("/latest", methods=["GET"])
def get_latest_movie():
    try:
        url = f"https://api.themoviedb.org/3/movie/latest?api_key={TMDB_API_KEY}"
        response = requests.get(url)

        if response.status_code == 200:
            movie = response.json()
            latest_movie = {
                "title": movie.get("title"),
                "poster_url": f"https://image.tmdb.org/t/p/w500{movie.get('poster_path')}" if movie.get("poster_path") else None,
                "rating": movie.get("vote_average", "N/A"),
                "release_date": movie.get("release_date", "N/A"),
            }
            return jsonify({"latest": latest_movie}), 200
        else:
            return jsonify({"error": "Failed to fetch the latest movie"}), response.status_code

    except Exception as e:
        return jsonify({"error": str(e)}), 500


@app.route("/top-rated", methods=["GET"])
def get_top_rated_movies():
    try:
        url = f"https://api.themoviedb.org/3/movie/top_rated?api_key={TMDB_API_KEY}"
        response = requests.get(url)

        if response.status_code == 200:
            top_rated_movies = response.json().get("results", [])
            # Extract the required details
            movies = [
                {
                    "title": movie["title"],
                    "poster_url": f"https://image.tmdb.org/t/p/w500{movie['poster_path']}" if movie.get("poster_path") else None,
                    "rating": movie.get("vote_average", "N/A"),
                    "release_date": movie.get("release_date", "N/A"),
                }
                for movie in top_rated_movies
            ]
            return jsonify({"top_rated": movies}), 200
        else:
            return jsonify({"error": "Failed to fetch top-rated movies"}), response.status_code

    except Exception as e:
        return jsonify({"error": str(e)}), 500
@app.route("/")
def home():
    return "Flask server is running!"


@app.route("/favicon.ico")
def favicon():
    return "", 204  # Return an empty response


if __name__ == "__main__":
    app.run(debug=True)
