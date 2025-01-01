"use client"; 

import { useState, ChangeEvent } from "react"; 
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button"; 
import { CalendarIcon, StarIcon } from "lucide-react"; 
import Image from "next/image";
import ClipLoader from "react-spinners/ClipLoader";

// Define the MovieDetails type
type MovieDetails = {
  Title: string;
  Year: string;
  Plot: string;
  Poster: string;
  imdbRating: string;
  Genre: string;
  Director: string;
  Actors: string;
  Runtime: string;
  Released: string;
};

export default function MovieSearch() {
  const [searchTerm, setSearchTerm] = useState<string>(""); 
  const [movieDetails, setMovieDetails] = useState<MovieDetails | null>(null); 
  const [loading, setLoading] = useState<boolean>(false); 
  const [error, setError] = useState<string | null>(null);

  const handleSearch = async (): Promise<void> => {
    setLoading(true);
    setError(null);
    setMovieDetails(null);
    try {
      const response = await fetch(
        `https://www.omdbapi.com/?t=${searchTerm}&apikey=${process.env.NEXT_PUBLIC_OMDB_API_KEY}`
      );
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const data = await response.json();
      if (data.Response === "False") {
        throw new Error(data.Error);
      }
      setMovieDetails(data);
    } catch (error: unknown) {
      if (error instanceof Error) {
        setError(error.message); // Now safely access 'message' property
      } else {
        setError("An unknown error occurred");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>): void => {
    setSearchTerm(e.target.value);
  };

  return (
    <div
      className="flex items-center justify-center min-h-screen bg-cover bg-center bg-no-repeat p-4"
      style={{
        backgroundImage: "url('/image/background-image.jpg')",
      }}
    >
      <div className="w-full max-w-lg p-6 bg-white bg-opacity-80 rounded-lg shadow-md">
        <h1 className="text-3xl font-bold mb-2 text-center text-black">Movie Search</h1>
        <p className="mb-6 text-center text-gray-700">
          Search for any movies and display details
        </p>
        <div className="flex items-center mb-6">
          <Input
            type="text"
            placeholder="Enter a movie title"
            value={searchTerm}
            onChange={handleChange}
            className="flex-1 mr-2 px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <Button
            onClick={handleSearch}
            className="px-4 py-2 bg-black text-white rounded-md hover:bg-gray-600"
          >
            Search
          </Button>
        </div>
        {loading && (
          <div className="flex justify-center items-center">
            <ClipLoader className="w-6 h-6 text-blue-500" />
          </div>
        )}
        {error && (
          <div className="text-red-500 text-center mb-4">
            {error}. Please try searching for another movie.
          </div>
        )}
        {movieDetails && (
          <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
            {/* Movie Poster */}
            <div className="flex-shrink-0">
              <Image
                src={movieDetails.Poster !== "N/A" ? movieDetails.Poster : "/placeholder.svg"}
                alt={movieDetails.Title}
                width={200}
                height={300}
                className="rounded-md shadow-md"
              />
            </div>

            {/* Movie Details */}
            <div className="flex-grow text-left">
              <h2 className="text-2xl font-bold mb-2">{movieDetails.Title}</h2>
              <p className="text-gray-600 mb-4 italic">{movieDetails.Plot}</p>
              <div className="text-gray-500 mb-2">
                <CalendarIcon className="w-4 h-4 inline mr-1" />
                {movieDetails.Year} &nbsp;&nbsp;
                <StarIcon className="w-4 h-4 inline mr-1 fill-yellow-500" />
                {movieDetails.imdbRating}
              </div>
              <p className="text-gray-500">
                <strong>Genre:</strong> {movieDetails.Genre}
              </p>
              <p className="text-gray-500">
                <strong>Director:</strong> {movieDetails.Director}
              </p>
              <p className="text-gray-500">
                <strong>Actors:</strong> {movieDetails.Actors}
              </p>
              <p className="text-gray-500">
                <strong>Runtime:</strong> {movieDetails.Runtime}
              </p>
              <p className="text-gray-500">
                <strong>Released:</strong> {movieDetails.Released}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
