import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";


import useGet from "../hooks/useGet";
import { setGames } from "../redux/slices/gameSlice";
import Pagination from "../components/Pagination";
import ItemSearch from "../components/ItemSearch";
import GameCard from "../components/GameCard";
import type { RootState } from "../redux/store";
import type { Games } from "../types/Game";
import { setLoading } from "../redux/slices/orderSlice";

const GameListPage = () => {
    
    const dispatch = useDispatch();
    // hämtar spel från redux store
    const { games } = useSelector((state: RootState) => state.game);
  const { messages, loading: messageLoaoding } = useSelector((state: RootState) => state.message);

  // lokal state för sök och sidhantering
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const apiKey = import.meta.env.VITE_API_KEY;
  const Database_API_URL = import.meta.env.VITE_DATABASE_API_URL;
  const game_API_URL = import.meta.env.VITE_API_URL;

  // hämtar speldata från backend
  const {
    data: backendGames,
    error: backendError,
    loading: backendLoading,
  } = useGet<Games[]>(`${Database_API_URL}/api/games`, true);

  useEffect(() => {
    if (!messageLoaoding && messages.length === 0)
    dispatch(setLoading(true));
  }, [messages.length, messageLoaoding, dispatch]);

  // uppdaterar redux store när data har hämtats
  useEffect(() => {
    if (backendGames && backendGames.length > 0) {
      // hämtar detaljer från externa api
      const fetchAllDetails = async () => {
        try {
          const detailsPromises = backendGames.map((game) =>
            fetch(`${game_API_URL}/games/${game.rawgId}?key=${apiKey}`).then(
              (res) => res.json()
            )
          );
          const details = await Promise.all(detailsPromises);

          // kombinerar backend-data med detaljer
          const combinedGames = backendGames.map((backendGame, index) => ({
            ...details[index],
            price: backendGame.price,
            rentalPrice: backendGame.rentalPrice,
            stock: backendGame.stock,
            availableForRent: backendGame.availableForRent,
            _id: backendGame.id,
          }));

          // uppdaterar redux store
          dispatch(setGames(combinedGames));
        } catch (error) {
          console.error("Error fetching game details:", error);
        }
      };

      fetchAllDetails();
    }
  }, [backendGames, dispatch]);

  // filtrerar spel baserat på söktermen
  const filteredGames = games.filter((game) =>
    game.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // beräknar sidindelning
  const gamesPerPage = 6;
  const totalPages = Math.ceil(games.length / gamesPerPage);
  const start = (currentPage - 1) * gamesPerPage;
  const end = start + gamesPerPage;
  const paginatedGames = filteredGames.slice(start, end);

  return (
    <div className="container mt-4">
      <h2>Game Store</h2>
      <ItemSearch searchTerm={searchTerm} onChange={setSearchTerm} />
      {backendLoading && <div className="container mt-4">Loading games...</div>}
      {backendError && (
        <div className="alert alert-danger text-center mt-3">
          Error loading games: {backendError}
        </div>
      )}
      <div className="row">
        {paginatedGames &&
          paginatedGames.length > 0 &&
          paginatedGames.map((game: Games) => (
            <div className="col-md-4 mb-4" key={game.id}>
              <GameCard game={game} />
            </div>
          ))}
      </div>
      {totalPages > 1 && (
        <div className="d-flex justify-content-center mt-4">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={(page) => setCurrentPage(page)}
          />
        </div>
      )}
    </div>
  );
};

export default GameListPage;
