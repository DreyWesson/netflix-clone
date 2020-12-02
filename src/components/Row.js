import axios from "../axios";
import React, { useEffect, useState } from "react";
import "./Row.css";
import YouTube from "react-youtube";
import movieTrailer from "movie-trailer";

const baseurl = "https://image.tmdb.org/t/p/original/";
const Row = ({ title, fetchUrl, isLargeRow }) => {
  const [movies, setMovies] = useState([]);
  const [trailerUrl, setTrailerUrl] = useState("");
  console.log(trailerUrl);
  console.log(movies);

  useEffect(() => {
    async function fetchData() {
      const request = await axios.get(fetchUrl);
      // console.log(request);
      setMovies(request.data.results);
      return request;
    }
    fetchData();
  }, [fetchUrl]);
  // console.log(movies);

  const opts = {
    height: "390",
    width: "100%",
    playerVars: {
      autoplay: 1,
    },
  };

  const handleClick = (movie) => {
    if (trailerUrl) setTrailerUrl("");
    else {
      let movieName = movie?.name || "";
      // movieTrailer(movie?.name || "")
      movieTrailer(movieName)
        .then((url) => {
          const urlParams = new URLSearchParams(new URL(url).search);
          setTrailerUrl(urlParams.get("v"));
        })
        .catch((err) => {
          const confirmation = window.confirm(
            "Oops, no trailer for this movie as of now!. Watch random trailer"
          );
          let movieName = [
            "Star wars",
            "Ocean Eleven",
            "The Crown and the Dragon",
            "Dark Phoenix",
          ];
          confirmation &&
            movieTrailer(
              movieName[(Math.random() * movieName.length) | 0]
            ).then((url) => {
              const urlParams = new URLSearchParams(new URL(url).search);
              setTrailerUrl(urlParams.get("v"));
            });
        });
    }
  };
  console.log(trailerUrl);
  return (
    <div className="row">
      <h2 className="row__title">{title}</h2>
      {trailerUrl && <YouTube videoId={trailerUrl} opts={opts} />}

      <div className="row__posters">
        {movies.map((movie) => {
          return (
            <img
              key={movie?.id}
              onClick={() => handleClick(movie)}
              className={`row__poster ${isLargeRow && "row__posterLarge"}`}
              src={`${baseurl}${
                isLargeRow ? movie.poster_path : movie.backdrop_path
              }`}
              alt={movie.name}
            />
          );
        })}
      </div>
    </div>
  );
};

export default Row;
