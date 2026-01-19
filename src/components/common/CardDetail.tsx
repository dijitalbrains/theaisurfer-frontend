import React from "react";
import type { UserCard } from "../../types/wax.types";

interface CardDetailProps {
  card: UserCard | null;
  title?: string;
}

const getCardBrandDisplay = (brand: string): React.ReactNode => {
  const brandStyles: Record<string, string> = {
    visa: "text-blue-600",
    mastercard: "text-red-600",
    amex: "text-blue-800",
    discover: "text-orange-600",
  };

  const brandTexts: Record<string, string> = {
    visa: "VISA",
    mastercard: "MC",
    amex: "AMEX",
    discover: "DISC",
  };

  if (brandStyles[brand]) {
    return (
      <span className={`text-sm font-bold ${brandStyles[brand]}`}>
        {brandTexts[brand]}
      </span>
    );
  }

  return (
    <span className="text-sm font-bold text-[#222F3E]">
      {brand.toUpperCase().substring(0, 4)}
    </span>
  );
};

export const CardDetail: React.FC<CardDetailProps> = ({
  card,
  title = "Active Payment Method",
}) => {
  if (!card) return null;

  return (
    <div className="w-full">
      {title && <h4 className="mb-3 font-normal text-white">{title}</h4>}
      <div className="flex justify-between items-center text-[#70FFE9] gap-4">
        <div className="flex gap-2 items-center">
          <div className="flex justify-center items-center w-12 h-5 bg-white rounded shadow-sm">
            {getCardBrandDisplay(card.brand)}
          </div>
          <span className="text-sm text-[#91ACC8] sm:text-base font-medium">
            **** **** **** {card.last4}
          </span>
        </div>
        <span className="text-[#91ACC8] text-[12px] whitespace-nowrap">
          Expires {card.expMonth.toString().padStart(2, "0")}/
          {card.expYear.toString().slice(-2)}
        </span>
      </div>
    </div>
  );
};
