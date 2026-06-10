import { motion } from "motion/react";

const Button = ({
  children,
  variant = "primary",
  size = "md",
  onClick,
  disabled = false,
  className = "",
  ...props
}) => {
  const sizeClass = {
    sm: "btn-sm",
    md: "",
    lg: "btn-lg",
  }[size];

  return (
    <motion.button
      className={`btn btn-${variant} ${sizeClass} ${className}`}
      onClick={onClick}
      disabled={disabled}
      whileHover={disabled ? undefined : { y: -1 }}
      whileTap={disabled ? undefined : { scale: 0.98 }}
      transition={{ duration: 0.12 }}
      {...props}
    >
      {children}
    </motion.button>
  );
};

export default Button;
