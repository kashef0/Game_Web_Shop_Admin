import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import useGet from "../hooks/useGet";
import usePut from "../hooks/usePut";
import useDelete from "../hooks/useDelete";
import ItemSearch from "../components/ItemSearch";
import ShowMoreButton from "../components/ShowMoreButton";
import GameTable from "../components/GameTable";
import type { RootState } from "../redux/store";
import type { GameDataForm } from "../types/Game";

// komponent för admin att redigera och ta bort spel
const AdminEditGamePage = () => {
  // hämtar användare och spel från redux store
  const { user } = useSelector((state: RootState) => state.auth);
  const { games: gamesdetails } = useSelector((state: RootState) => state.game);
  const navigate = useNavigate();

  // state för vilket spel som redigeras formulärdata sökterm och antal synliga spel
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<Partial<GameDataForm>>({});
  const [searchTerm, setSearchTerm] = useState("");
  const [visibleCount, setVisibleCount] = useState(10);

  // token från localStorage för autentisering
  const token = localStorage.getItem("token") ?? "";
  // bas URL för API
  const Database_API_URL = import.meta.env.VITE_DATABASE_API_URL;

  // hämtar spel från databas-API med token och automatisk fetch
  const {
    data: games,
    error: fetchError,
    loading: fetchLoading,
    fetchData: refetchGames,
  } = useGet<GameDataForm[]>(`${Database_API_URL}/api/games`, true, "", token);

  // hook för uppdatering av spel via PUT med valt spel-id
  const {
    error: updateError,
    loading: updateLoading,
    updateData,
  } = usePut<GameDataForm>(`${Database_API_URL}/api/games/${editingId}`);

  // hook för radering av spel via DELETE
  const {
    error: deleteError,
    loading: deleteLoading,
    deleteData,
  } = useDelete<GameDataForm>(`${Database_API_URL}/api/games`);

  // navigera bort från sidan om användaren inte är admin
  useEffect(() => {
    if (!user || user.role !== "admin") {
      navigate("/login");
    }
  }, [user, navigate]);

  // starta redigering av valt spel  fyll i formulär med dess data
  const handleEditClick = (game: GameDataForm) => {
    setEditingId(game._id);
    setForm({
      name: game.name,
      price: game.price,
      rentalPrice: game.rentalPrice,
      stock: game.stock,
      availableForRent: game.availableForRent,
    });
  };

  // avbryt redigering och nollställ formulär och valt id
  const handleCancelEdit = () => {
    setEditingId(null);
    setForm({});
  };

  // uppdatera formulärfält vid ändring
  const handleFormChange = (
    field: keyof GameDataForm,
    value: number | boolean
  ) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  // spara uppdateringar av spel till API och hämta om spel listan och avbryt redigering
  const handleUpdate = async () => {
    if (!editingId) return;

    try {
      await updateData(form);
      refetchGames();
      handleCancelEdit();
    } catch (err) {
      console.error("Update failed:", err);
    }
  };

  // ta bort spel efter bekräftelse och hämta om spel listan
  const handleDelete = async (gameId: string) => {
    const confirm = window.confirm("Delete this game?");
    if (!confirm) return;

    try {
      await deleteData(gameId);
      refetchGames();
    } catch (err) {
      console.error("Delete failed:", err);
    }
  };

  // hjälpfunktion för att hitta RAWG spelobjekt baserat på rawgId
  const getGameDetailsByRawgId = (rawgId: number) => {
    return gamesdetails.find((g) => g.id === rawgId);
  };

  // filtrera spel baserat på sökterm i RAWG spelens namn
  const filteredGames = games.filter((game) => {
    const rawgName = getGameDetailsByRawgId(game.rawgId)?.name || "";
    return rawgName.toLowerCase().includes(searchTerm.toLowerCase());
  });

  // för paginering
  const visibleGames = filteredGames.slice(0, visibleCount);

  return (
    <div className="container mt-5">
      <h2>Manage Games</h2>
      <ItemSearch searchTerm={searchTerm} onChange={setSearchTerm} />
      {fetchLoading && <div className="container mt-5">Loading games...</div>}
      {fetchError && (
        <div className="container mt-5">Error loading games: {fetchError}</div>
      )}
      {!games ||
        (games.length === 0 && (
          <div className="container mt-5">No games found...</div>
        ))}
      {updateError && (
        <div className="alert alert-danger">Update error: {updateError}</div>
      )}
      {deleteError && (
        <div className="alert alert-danger">Delete error: {deleteError}</div>
      )}

      <GameTable
        games={visibleGames}
        editingId={editingId}
        form={form}
        updateLoading={updateLoading}
        deleteLoading={deleteLoading}
        getGameDetailsByRawgId={getGameDetailsByRawgId}
        handleEditClick={handleEditClick}
        handleCancelEdit={handleCancelEdit}
        handleFormChange={handleFormChange}
        handleUpdate={handleUpdate}
        handleDelete={handleDelete}
      />

      {visibleCount < filteredGames.length && (
        <ShowMoreButton onClick={() => setVisibleCount((prev) => prev + 10)} />
      )}
    </div>
  );
};

export default AdminEditGamePage;
