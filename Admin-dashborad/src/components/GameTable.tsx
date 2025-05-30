import type { GameDataForm } from "../types/Game";
import Button from "./Button";


interface GameTableProps {
  games: GameDataForm[];
  editingId: string | null;
  form: Partial<GameDataForm>;
  updateLoading: boolean;
  deleteLoading: boolean;
  getGameDetailsByRawgId: (rawgId: number) => { name: string } | undefined;
  handleEditClick: (game: GameDataForm) => void;
  handleCancelEdit: () => void;
  handleFormChange: (field: keyof GameDataForm, value: number | boolean) => void;
  handleUpdate: () => void;
  handleDelete: (gameId: string) => void;
}

const GameTable = ({
  games,
  editingId,
  form,
  updateLoading,
  deleteLoading,
  getGameDetailsByRawgId,
  handleEditClick,
  handleCancelEdit,
  handleFormChange,
  handleUpdate,
  handleDelete,
}: GameTableProps) => {
  return (
    <table className="table mt-3">
      <thead>
        <tr>
          <th>Title</th>
          <th>Price</th>
          <th>Rental Price</th>
          <th>Stock</th>
          <th>Rent?</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        {games.map((game) =>
          editingId === game._id ? (
            <tr key={game._id}>
              <td>
                <input
                  disabled
                  value={getGameDetailsByRawgId(game.rawgId)?.name || form.name || ""}
                  className="form-control"
                />
              </td>
              <td>
                <input
                  type="number"
                  value={form.price || 0}
                  onChange={(e) => handleFormChange("price", +e.target.value)}
                  className="form-control"
                />
              </td>
              <td>
                <input
                  type="number"
                  value={form.rentalPrice || 0}
                  onChange={(e) => handleFormChange("rentalPrice", +e.target.value)}
                  className="form-control"
                />
              </td>
              <td>
                <input
                  type="number"
                  value={form.stock || 0}
                  onChange={(e) => handleFormChange("stock", +e.target.value)}
                  className="form-control"
                />
              </td>
              <td>
                <input
                  type="checkbox"
                  checked={form.availableForRent || false}
                  onChange={(e) => handleFormChange("availableForRent", e.target.checked)}
                />
              </td>
              <td>
                <Button
                  onClick={handleUpdate}
                  variant="success"
                  disabled={updateLoading}
                  classNames="btn-sm me-2"
                >
                  {updateLoading ? "Saving..." : "Save"}
                </Button>

                <Button
                  onClick={handleCancelEdit}
                  variant="secondary"
                  disabled={updateLoading}
                  classNames="btn-sm me-2"
                >
                  Cancel
                </Button>
              </td>
            </tr>
          ) : (
            <tr key={game._id}>
              <td>{getGameDetailsByRawgId(game.rawgId)?.name || game.name}</td>
              <td>{game.price} SEK</td>
              <td>{game.rentalPrice} SEK</td>
              <td>{game.stock}</td>
              <td>{game.availableForRent ? "Yes" : "No"}</td>
              <td>
                <Button
                  onClick={() => handleEditClick(game)}
                  variant="warning"
                  classNames="btn-sm me-2"
                >
                  Edit
                </Button>

                <Button
                  onClick={() => handleDelete(game._id)}
                  variant="danger"
                  disabled={deleteLoading}
                  classNames="btn-sm"
                >
                  {deleteLoading ? "Deleting..." : "Delete"}
                </Button>
              </td>
            </tr>
          )
        )}
      </tbody>
    </table>
  );
};

export default GameTable;
