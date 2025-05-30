import { useEffect, useRef, useState } from "react";
import { useDispatch } from "react-redux";
import usePost from "../hooks/usePost";
import useGet from "../hooks/useGet";
import {
  addGame,
  addGameSuccess,
  addGameFailure,
} from "../redux/slices/gameSlice";
import GameList from "../components/GameList";
import GameForm from "../components/GameForm";
import ShowMoreButton from "../components/ShowMoreButton";
import type { GameFromDB, Games } from "../types/Game";


interface RawgApiResponse {
  count: number;
  results: Games[];
}

const AdminAddGamePage = () => {
  // states för sökterm, valt spel, trigger för API anrop, nuvarande sida, total antal sidor och sökresultat
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<Games | null>(null);
  const [trigger, setTrigger] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [results, setResults] = useState<Games[]>([]);
  
  // referens för formuläret används för scrollning till formuläret
  const formRef = useRef<HTMLDivElement | null>(null);

  // reduxdispatch för att skicka actions
  const dispatch = useDispatch();

  // hämtar API nycklar och url från miljövariabler
  const apiKey = import.meta.env.VITE_API_KEY;
  const game_API_URL = import.meta.env.VITE_API_URL;
  const Database_API_URL = import.meta.env.VITE_DATABASE_API_URL;

  // hook för att posta data till databas-API
  const {
    error: postError,
    loading,
    postData,
  } = usePost(`${Database_API_URL}/api/games`);

  // hook för att hämta speldata från RAWG API körs när trigger ändras
  const {
    data,
    error: getError,
    loading: getLoading,
  } = useGet<RawgApiResponse>(
    `${game_API_URL}/games?key=${apiKey}&search=${search}&page=${currentPage}`,
    trigger
  );

  // när data från API kommer in uppdatera resultaten och total antal sidor
  useEffect(() => {
    if (data?.results) {
      if (currentPage === 1) {
        setResults(data.results); // ersätt resultat vid första sidan
      } else {
        setResults((prev) => [...prev, ...data.results]); // lägg till fler vid paginering
      }

      const count = data.count || 0;
      setTotalPages(Math.ceil(count / 20)); // RAWG returnerar 20 resultat per sida
    }
  }, [data]);

  // scrolla till formuläret när ett spel väljs
  useEffect(() => {
    if (selected && formRef.current) {
      formRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [selected]);

  // när användaren söker, sätt sidan till 1 och trigga nytt API-anrop
  const handleSearch = () => {
    setCurrentPage(1);
    setTrigger((prev) => !prev);
  };

  // hantera "visa fler" för att ladda nästa sida om det finns fler sidor
  const handleShowMore = () => {
    if (currentPage < totalPages) {
      setCurrentPage((prev) => prev + 1);
      setTrigger((prev) => !prev);
    }
  };

  // spara valt spel i databasen dispatchar redux actions och hanterar fel
  const handleSave = async (gameData: GameFromDB) => {
    dispatch(addGame());

    try {
      const result = await postData(gameData);

      if (!result || !selected) {
        dispatch(addGameFailure("Error saving game"));
        alert("Error: " + (postError));
        return;
      }

      // skapa nytt game objekt med uppdaterade fält från formuläret
      const newGame: Games = {
        ...selected,
        price: gameData.price,
        rentalPrice: gameData.rentalPrice,
        stock: gameData.stock,
        availableForRent: gameData.availableForRent,
      };

      dispatch(addGameSuccess(newGame));
      alert("Game saved");
      setSelected(null);
    } catch (error) {
      dispatch(addGameFailure("Error saving game"));
      alert("Error: " + (postError || error));
    }
  };

 
  return (
    <div className="container mt-4">
      <h2 className="mb-4">Add Game</h2>

      <div className="input-group mb-3">
        <input
          type="text"
          className="form-control"
          placeholder="Search RAWG..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <button className="btn btn-primary" onClick={handleSearch}>
          Search
        </button>
      </div>

      {getLoading && <p>Loading games...</p>}
      {getError && <p>Error: {getError}</p>}

      <GameList results={results} setSelected={setSelected} />

      {results.length > 0 && currentPage < totalPages && (
        <ShowMoreButton onClick={handleShowMore} />
      )}

      {selected && (
        <div ref={formRef}>
          <GameForm
            selected={selected}
            onSave={handleSave}
            loading={loading}
            postError={postError}
          />
        </div>
      )}
    </div>
  );
};

export default AdminAddGamePage;
