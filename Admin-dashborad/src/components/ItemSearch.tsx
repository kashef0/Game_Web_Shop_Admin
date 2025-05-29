import type { FC } from "react";

interface Props {
  searchTerm: string;
  onChange: (value: string) => void;
}

const ItemSearch: FC<Props> = ({ searchTerm, onChange }) => {
  return (
    <div className="mb-3">
      <input
        type="text"
        className="form-control"
        placeholder="Search by name or email"
        value={searchTerm}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
};

export default ItemSearch;
