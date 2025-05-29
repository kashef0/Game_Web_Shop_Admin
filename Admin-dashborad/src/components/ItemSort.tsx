import type { FC } from "react";
import type { SortOption } from "../types/Order";


interface Props {
  sortOption: SortOption["value"];
  onChange: (value: SortOption["value"]) => void;
  options: SortOption[];
}

const ItemSort: FC<Props> = ({ sortOption, onChange, options }) => {
  return (
    <div className="mb-3">
      <label className="form-label">Sortera efter:</label>
      <select
        className="form-select"
        value={sortOption}
        onChange={(e) => onChange(e.target.value as SortOption["value"])}
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  );
};

export default ItemSort;
