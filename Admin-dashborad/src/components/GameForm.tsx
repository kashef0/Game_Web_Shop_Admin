import React, { useState, useEffect } from 'react';
import type { GameFromDB, Genre } from '../types/Game';


interface GameFormProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  selected: any;
  onSave: (gameData: GameFromDB) => void;
  loading: boolean;
  postError: string | null;
}

const GameForm: React.FC<GameFormProps> = ({ selected, onSave, loading, postError }) => {
  const [price, setPrice] = useState('');
  const [stock, setStock] = useState('');
  const [rentalPrice, setRentalPrice] = useState('');
  const [availableForRent, setAvailableForRent] = useState(false);

  useEffect(() => {
    if (selected) {
      setPrice('');
      setStock('');
      setRentalPrice('');
      setAvailableForRent(false);
    }
  }, [selected]);

  const handleSubmit = () => {
    if (!selected || !price || !stock || !rentalPrice) {
      alert('All fields are required');
      return;
    }

    const gameData = {
      rawgId: selected.id,
      price: parseFloat(price),
      rentalPrice: parseFloat(rentalPrice),
      stock: parseInt(stock),
      availableForRent,
    };

    onSave(gameData); 
  };

  return (
    <div className="card p-4 mt-4 shadow-sm">
      <h4>{selected?.name}</h4>
      <img
        src={selected?.background_image}
        alt={selected?.name}
        className="img-fluid rounded mb-3"
      />
      <p><strong>Release Date:</strong> {selected?.released}</p>
      <p><strong>Rating:</strong> {selected?.rating}</p>
      <p><strong>Genres:</strong> {selected?.genres?.map((g: Genre) => g.name).join(', ') || 'N/A'}</p>

      <div className="mb-3">
        <label className="form-label">Price</label>
        <input
          type="number"
          className="form-control"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
        />
      </div>

      <div className="mb-3">
        <label className="form-label">Stock</label>
        <input
          type="number"
          className="form-control"
          value={stock}
          onChange={(e) => setStock(e.target.value)}
        />
      </div>

      <div className="mb-3">
        <label className="form-label">Rental Price</label>
        <input
          type="number"
          className="form-control"
          value={rentalPrice}
          onChange={(e) => setRentalPrice(e.target.value)}
        />
      </div>

      <div className="form-check form-switch mb-3">
        <input
          className="form-check-input"
          type="checkbox"
          checked={availableForRent}
          onChange={(e) => setAvailableForRent(e.target.checked)}
          id="availableForRentSwitch"
        />
        <label className="form-check-label" htmlFor="availableForRentSwitch">
          Available For Rent
        </label>
      </div>

      <button
        className="btn btn-success w-100"
        onClick={handleSubmit}
        disabled={loading}
      >
        {loading ? 'Saving...' : 'Save Game'}
      </button>

      {postError && <div className="alert alert-danger text-center mt-3">{postError}</div>}
    </div>
  );
};

export default GameForm;
