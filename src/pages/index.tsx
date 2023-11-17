import { signIn, signOut, useSession } from "next-auth/react";
import Head from "next/head";
import Link from "next/link";
import { Navbar } from "flowbite-react";

import { api } from "~/utils/api";
import Image from "next/image";
import { Card } from "~/components/card";
import { useEffect, useState } from "react";
import Modal from "react-modal";

import { EolData } from "~/data/elo";
import { randomUUID } from "crypto";

const customStyles = {
  content: {
    top: "50%",
    left: "50%",
    right: "auto",
    bottom: "auto",
    marginRight: "-50%",
    transform: "translate(-50%, -50%)",
  },
};

interface MovieInterface {
  poster_path: string;
  id: number;
  title: string;
  genres: { id: number; name: string }[];
  overview: string;
  original_language: string;
}

interface RecommendResponse {
  data: MovieInterface[];
}

function shuffleArray<T>(array: (T | undefined)[]): (T | undefined)[] {
  const shuffledArray = [...array];

  for (let i = shuffledArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));

    // Swap elements, handling undefined
    [shuffledArray[i], shuffledArray[j]] = [shuffledArray[j], shuffledArray[i]];
  }

  return shuffledArray;
}

export default function Home() {
  const session = useSession();

  const isLoggedIn = !!session.data;

  const [movies, setMovies] = useState<MovieInterface[]>([]);
  const [eolMovies, setEolMovies] = useState<any[]>([]);
  const [eolMoviesIdx, setEolMoviesIdx] = useState(0);

  const [modalIsOpen, setModelIsOpen] = useState(false);

  const onMovieCardClick = (id: number, userInput: string = "like") => {
    console.log("onMovieCardClick", id, userInput);

    let userId = localStorage.getItem("movie:userId");
    if (userId == null) {
      userId = crypto.randomUUID();
      console.log("userId", userId);
    }

    fetch(`/api/proxy/user/${userId}/log?${userInput}=${id}`)
      .then(() => localStorage.setItem("movie:userId", userId!))
      .catch(console.log);
  };

  // let movieOnboardingCard = <></>;

  const [movieOnboardingCard, setMovieOnboardingCard] = useState(<></>);

  const fetchMovies = async (userId: string | number) => {
    try {
      let rawRes = await fetch(`/api/proxy/user/${userId}/recommend`);
      let res = (await rawRes.json()) as RecommendResponse;
      console.log("res", res);
      setMovies(res.data);
    } catch (e) {
      console.log(e);
    }
  };

  useEffect(() => {
    const userId = localStorage.getItem("movie:userId");
    if (userId == null) {
      const onboardingMovieList = shuffleArray(EolData);
      setEolMovies(onboardingMovieList);
      setModelIsOpen(true);
    } else {
      fetchMovies(userId);
    }
  }, []);

  useEffect(() => {
    if (eolMoviesIdx >= eolMovies.length) {
      console.log("eolMoviesIdx exceeds");
      setMovieOnboardingCard(<></>);
      // setModelIsOpen(false)
      fetchMovies(localStorage.getItem("movie:userId")!);
      return;
    }

    console.log("eolMovies", eolMovies);

    const moviePair = eolMovies[eolMoviesIdx];

    const _movieOnboardingCard = (
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={() => setModelIsOpen(false)}
        style={customStyles}
      >
        <div className="text-center font-serif text-xl text-cyan-800">
          Tell us about your likes
        </div>
        <div className="mt-2 flex justify-between gap-10">
          <Card
            posterPath={moviePair[0].poster_path}
            id={moviePair[0].id}
            title={moviePair[0].title}
            genres={moviePair[0].genres}
            overview={moviePair[0].overview}
            originalLanguage={moviePair[0].original_language}
            onClick={onMovieCardClick}
            isOnboarding
          />
          <Card
            posterPath={moviePair[1].poster_path}
            id={moviePair[1].id}
            title={moviePair[1].title}
            genres={moviePair[1].genres}
            overview={moviePair[1].overview}
            originalLanguage={moviePair[1].original_language}
            onClick={onMovieCardClick}
            isOnboarding
          />
        </div>

        <div className="flex justify-center gap-1">
          <div
            className=" mt-4 inline-flex items-center rounded-lg bg-blue-600 px-3 py-2 text-center text-sm font-medium text-white hover:cursor-pointer hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
            onClick={() => setEolMoviesIdx(eolMoviesIdx + 1)}
          >
            Next
          </div>

          <div
            className=" mt-4 inline-flex items-center rounded-lg bg-red-600 px-3 py-2 text-center text-sm font-medium text-white hover:cursor-pointer hover:bg-red-800 focus:outline-none focus:ring-4 focus:ring-red-300 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-800"
            onClick={() => setModelIsOpen(false)}
          >
            Close
          </div>
        </div>
      </Modal>
    );

    setMovieOnboardingCard(_movieOnboardingCard);
  }, [eolMovies, eolMoviesIdx, modalIsOpen]);

  return (
    <>
      <Head>
        <title>Create T3 App</title>
        <meta name="description" content="Generated by create-t3-app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Navbar fluid={true} rounded={true}>
        <Navbar.Brand href="https://flowbite.com/">
          <img
            src="https://flowbite.com/docs/images/logo.svg"
            className="mr-3 h-6 sm:h-9"
            alt="Flowbite Logo"
          />
          <span className="self-center whitespace-nowrap text-xl font-semibold dark:text-white">
            Flowbite
          </span>
        </Navbar.Brand>
        <Navbar.Toggle />
        <Navbar.Collapse>
          {!session.data?.user.image && (
            <Image
              priority
              className="rounded-full"
              alt="user-profile-image"
              src={session.data?.user.image!}
              width="40"
              height="40"
            />
          )}
        </Navbar.Collapse>
      </Navbar>

      {movieOnboardingCard}

      <main className="container mx-auto mb-24 mt-4 flex min-h-screen flex-col gap-2 px-8">
        <div className="grid grid-cols-3 gap-2 md:grid-cols-4 xl:grid-cols-6">
          {movies.map((movie) => (
            <Card
              posterPath={movie.poster_path}
              id={movie.id}
              title={movie.title}
              genres={movie.genres}
              overview={movie.overview}
              originalLanguage={movie.original_language}
              onClick={onMovieCardClick}
            />
          ))}
        </div>
      </main>
    </>
  );
}
