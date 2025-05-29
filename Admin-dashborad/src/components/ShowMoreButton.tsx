
import { FaChevronDown } from "react-icons/fa";


const ShowMoreButton = ({ onClick }: { onClick: () => void }) => {
  return (
    <div
      className="flex justify-center items-center cursor-pointer p-4 costume-style"
      onClick={onClick} role="button"
    >
      <FaChevronDown className="w-5 h-5" />
      <span>
        Show more
      </span>
    </div>
  );
};

export default ShowMoreButton;
