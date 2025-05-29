import type { Games } from "../types/Game";

interface GameListProps {
  results: Games[];
  setSelected: (game: Games | null) => void;
}

const GameList = ({ results, setSelected }: GameListProps) => {
  return (
    <div className="row">
      {results.map((game) => (
        <div
          key={game.id}
          className="col-md-6 mb-3"
          onClick={() => setSelected(game)}
          style={{ cursor: 'pointer' }}
        >
          <div className="card h-100 shadow-sm">
            <div className="row g-0">
              <div className="col-4">
                <img
                  src={game.background_image}
                  className="img-fluid rounded-start"
                  alt={game.name}
                  style={{ height: '100%', objectFit: 'cover' }}
                />
              </div>
              <div className="col-8">
                <div className="card-body">
                  <h5 className="card-title mb-1">{game.name}</h5>
                  <p className="mb-1"><strong>Release:</strong> {game.released}</p>
                  <p className="mb-1"><strong>Rating:</strong> {game.rating} / 5</p>
                  <p className="mb-0"><strong>Genres:</strong> {game.genres?.map((g) => g.name).join(', ') || 'N/A'}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default GameList;
