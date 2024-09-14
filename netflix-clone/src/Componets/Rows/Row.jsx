import { useEffect, useState } from "react";
import "./row.css";

import axios from "../Utilites/axios";
import movieTrailer from "movie-trailer";
import YouTube from "react-youtube";

const Row = ({ title, fetchUrl, isLargeRow }) => {
  const [movies, setMovie] = useState([]);
  const [trailerUrl, setTrailerUrl] = useState("");

  const base_url = "https://image.tmdb.org/t/p/original";

  useEffect(() => {
    (async () => {
      try {
        // console.log(fetchUrl)
        const request = await axios.get(fetchUrl);
        // console.log(request)
        setMovie(request.data.results);
      } catch (error) {
        console.log("error", error);
      }
    })();
  }, [fetchUrl]);

  const handleClick = (movie) => {
    if (trailerUrl) {
      setTrailerUrl("");
    } else {
      movieTrailer(movie?.title || movie?.name || movie?.original_name).then(
        (url) => {
          console.log(url);
          const urlParams = new URLSearchParams(new URL(url).search);
          console.log(urlParams);
          console.log(urlParams.get("v"));
          setTrailerUrl(urlParams.get("v"));
        }
      );
    }
  };

  const opts = {
    height: "350",
    width: "100%",
    playerVars: {
      autoplay: 1,
      controls: 1, // Show controls to the user
      mute: 1, // Mute the video
      rel: 0, // Don't show related videos
      loop: 1, // Loop the video
    },
  };
  return (
    <div className="row">
      <h1>{title}</h1>
      <div className="row-posters">
        {movies?.map((movie, index) => (
          <img
            onClick={() => handleClick(movie)}
            key={index}
            src={`${base_url}${
              isLargeRow ? movie.poster_path : movie.backdrop_path
            }`}
            alt={movie.name}
            //If row poster is large used the other
            className={`row-poster ${isLargeRow && "row-posterLarge"}`}
          />
        ))}
      </div>
      <div style={{ padding: "10px" }}>
        {trailerUrl && <YouTube videoId={trailerUrl} opts={opts} />}
      </div>
    </div>
  );
};

export default Row;
