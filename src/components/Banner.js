import "./Banner.css";
import React, { useEffect, useState } from "react";
import requests, { fetchData } from "../requests";
import { useQuery } from "react-query";
import { truncate } from "../utils";

const Banner = () => {
  const [movie, setMovie] = useState([]);
  const { fetchNetflixOriginals } = requests;

  // useQuery implementation for asynchronous data
  const { data, status } = useQuery(
    ["fetchData", fetchNetflixOriginals],
    fetchData,
    { staleTime: 24 * 60 * 60 }
  );

  console.log("FETCH DATA STATUS 👉 ", status);
  console.log("FETCH DATA 👉 ", data);

  useEffect(
    () =>
      setMovie(
        data?.data.results[(Math.random() * data.data.results.length - 1) | 0]
      ),
    [data]
  );

  return (
    <header
      className="banner"
      style={{
        backgroundSize: "cover",
        backgroundImage: `url(https://image.tmdb.org/t/p/original/${movie?.backdrop_path})`,
        backgroundPosition: "top center",
      }}
    >
      <div className="banner__contents">
        <h1 className="banner__title">
          {movie?.title || movie?.name || movie?.original_name}
        </h1>
        <div className="banner__buttons">
          <button className="banner__button">Play</button>
          <button className="banner__button">My List</button>
        </div>
        <h1 className="banner__description">
          {truncate(movie?.overview, 150)}
        </h1>
      </div>
      <div className="banner__fadeBottom" />
    </header>
  );
};

export default Banner;
