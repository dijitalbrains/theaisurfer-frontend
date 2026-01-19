import React from "react";

interface ContainerProps {
  children: React.ReactNode;
  className?: string;
}

export const Container: React.FC<ContainerProps> = ({
  children,
  className = "",
}) => {
  return (
    <div
      className={`
        glass-dark w-full rounded-2xl p-6
        border border-white/5
        shadow-2xl shadow-black/50
        backdrop-blur-xl
        transition-all duration-300 ease-out
        ${className}
      `}
    >
      {children}
    </div>
  );
};

export default Container;
