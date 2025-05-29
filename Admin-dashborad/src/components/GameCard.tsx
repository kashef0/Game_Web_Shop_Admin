import type { FC } from "react";
import type { Games } from "../types/Game";


type Props = {
  game: Games;
};

const GameCard: FC<Props> = ({ game }) => {
  return (
    <div className="card h-100 shadow-sm border border-light p-2">
      <img
        src={game.background_image}
        className="card-img-top"
        alt={game.name}
        height={200}
        style={{ objectFit: "cover" }}
      />
      <div className="card-body">
        <h5 className="card-title">{game.name}</h5>
        <div className="mb-2">
          {game.parent_platforms?.map(({ platform }) => (
            <span key={platform.id} className="badge bg-secondary me-1">
              {platform.name}
            </span>
          ))}
        </div>
        <p>Metacritic: {game.metacritic || "N/A"}</p>
        <p>Price: {game.price} SEK</p>
        {game.availableForRent && (
          <p>Rental Price: {game.rentalPrice} SEK/month</p>
        )}
      </div>
      <div className="card-footer">
        <small className="text-muted">
          Genres: {game.genres?.map((g) => g.name).join(", ")}
        </small>
      </div>
    </div>
  );
};

export default GameCard;
