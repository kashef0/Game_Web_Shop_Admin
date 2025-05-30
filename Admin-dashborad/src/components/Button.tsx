import type { FC, ReactNode } from "react";


interface ButtonProps {
  children: ReactNode;
  onClick?: () => void;
  type?: "button" | "submit" | "reset";
  variant?: "primary" | "secondary" | "danger" | "warning" | "success";
  disabled?: boolean;
  classNames?: string | '';
}

const Button: FC<ButtonProps> = ({
 children,
  onClick,
  type = "button",
  variant = "primary",
  disabled = false,
  classNames = '',
}) => {
  const base = "btn";
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${base} ${base}-${variant} ${classNames}`}
    >
      {children}
    </button>
  );
};

export default Button;
