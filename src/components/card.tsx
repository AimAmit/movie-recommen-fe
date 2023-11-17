import { FiThumbsUp, FiThumbsDown } from "react-icons/fi";

interface Genres {
  id: number;
  name: string;
}
interface MovieProps {
  id: number;
  title: string;
  genres: Genres[];
  // spokenLanguages: string[];
  overview: string;
  originalLanguage: string;
  posterPath: string;
  onClick: Function;
  isOnboarding?: boolean;
}

export const Card: React.FC<MovieProps> = ({
  id,
  title,
  genres,
  // spokenLanguages,
  overview,
  originalLanguage,
  posterPath,
  onClick,
  isOnboarding,
}) => {
  console.log("genres", genres, typeof genres, isOnboarding);

  return (
    <div
      className={
        `max-w-sm rounded-lg border border-gray-200 bg-white shadow dark:border-gray-700 dark:bg-gray-800 ` +
        (isOnboarding === true ? "hover:opacity-70" : "")
      }
      onClick={() => (isOnboarding === true ? onClick(id, 'like') : undefined)}
    >
      <img
        className="mx-auto rounded-2xl p-2"
        src={`https://image.tmdb.org/t/p/w185/${posterPath}`}
        alt={title}
      />
      <div className="p-5">
        <a href="#">
          <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
            {title}
          </h5>
        </a>
        <div className={`h-4em flex overflow-hidden`}>
          <p className="mb-3 line-clamp-3 flex-1 font-normal leading-6 text-gray-700 dark:text-gray-400">
            {overview}
          </p>
        </div>
        <p className="mb-3 font-normal text-gray-700 dark:text-gray-400">
          {genres.map((g) => g.name).join(", ")}
        </p>

        {!isOnboarding && (
          <div className="flex justify-around">
            <FiThumbsUp
              size={25}
              color="#1258af"
              className="hover:fill-[#1258af]"
              onClick={() => onClick(id, 'like')}
            />
            <FiThumbsDown
              size={25}
              color="#ff2828"
              className="hover:fill-[#ff2828]"
              onClick={() => onClick(id, 'dislike')}
            />
          </div>
        )}
      </div>
    </div>
  );
};
