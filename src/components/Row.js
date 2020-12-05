import React, { useEffect, useState } from "react";
import "./Row.css";
import YouTube from "react-youtube";
import movieTrailer from "movie-trailer";
import { useQuery } from "react-query";
import { fetchData } from "../requests";

const Row = ({ title, fetchUrl, isLargeRow }) => {
  const [baseUrl, setBaseUrl] = useState(
      "https://image.tmdb.org/t/p/original/"
    ),
    [movies, setMovies] = useState([]),
    [trailerUrl, setTrailerUrl] = useState(""),
    [opts, setOpts] = useState({
      height: "390",
      width: "100%",
      playerVars: {
        autoplay: 1,
      },
    });

  // useQuery implementation for asynchronous data
  const { data, status } = useQuery(["fetchUrl", fetchUrl], fetchData, {
    staleTime: 24 * 60 * 60,
  });

  console.log(`Fetch ${fetchUrl} URL STATUS 👉 , ${status}`);
  console.log("Fetch URL 👉 ", data);
  useEffect(() => setMovies(data?.data.results), [data]);
  useEffect(() => {
    setOpts({
      height: "390",
      width: "100%",
      playerVars: {
        autoplay: 1,
      },
    });
    setBaseUrl("https://image.tmdb.org/t/p/original/");
  }, []);

  const handleClick = (movie) => {
    if (trailerUrl) setTrailerUrl("");
    else {
      let movieName = movie?.name || "";
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
        {movies?.map((movie) => {
          return (
            <img
              key={movie?.id}
              onClick={() => handleClick(movie)}
              className={`row__poster ${isLargeRow && "row__posterLarge"}`}
              src={`${baseUrl}${
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
