import React from "react";
import clsx from "clsx";

type StarVariant = "primary" | "secondary" | "success" | "warning" | "danger";

interface Props {
  rating: number;
  variant?: StarVariant;
}
function StarRating(props: Props) {
  const { rating, variant = "primary" } = props;
  const cleanNumber =
    Number(rating) > 5 ? 5 : Number(rating) < 0 ? 0 : Number(rating);
  const colorClass = (otherClasses: string, variant?: StarVariant) => {
    let variantString = "";
    switch (variant) {
      case "success":
        variantString = "bg-success";
        break;
      case "warning":
        variantString = "bg-warning";
        break;
      case "danger":
        variantString = "bg-error";
        break;
      case "secondary":
        variantString = "bg-secondary";
        break;
      default:
        variantString = "bg-primary";
    }
    return clsx(variantString, otherClasses);
  };
  return (
    <div className="rating rating-lg rating-half">
      <span className="rating-hidden" />
      <span
        className={colorClass("mask mask-star-2 mask-half-1", variant)}
        aria-label="0.5 star"
        aria-current={cleanNumber > 0 && cleanNumber < 0.75}
      />
      <span
        className={colorClass("mask mask-star-2 mask-half-2", variant)}
        aria-label="1 star"
        aria-current={cleanNumber >= 0.75 && cleanNumber < 1.25}
      />
      <span
        className={colorClass("mask mask-star-2 mask-half-1", variant)}
        aria-label="1.5 star"
        aria-current={cleanNumber >= 1.25 && cleanNumber < 1.75}
      />
      <span
        className={colorClass("mask mask-star-2 mask-half-2", variant)}
        aria-label="2 star"
        aria-current={cleanNumber >= 1.75 && cleanNumber < 2.25}

      />
      <span
        className={colorClass("mask mask-star-2 mask-half-1", variant)}
        aria-label="2.5 star"
        aria-current={cleanNumber >= 2.25 && cleanNumber < 2.75}
      />
      <span
        className={colorClass("mask mask-star-2 mask-half-2", variant)}
        aria-label="3 star"
        aria-current={cleanNumber > 2.75 && cleanNumber < 3.25}
      />
      <span
        className={colorClass("mask mask-star-2 mask-half-1", variant)}
        aria-label="3.5 star"
        aria-current={cleanNumber > 3.25 && cleanNumber < 3.75}
      />
      <span
        className={colorClass("mask mask-star-2 mask-half-2", variant)}
        aria-label="4 star"
        aria-current={cleanNumber >= 3.75 && cleanNumber < 4.25}
      />
      <span
        className={colorClass("mask mask-star-2 mask-half-1", variant)}
        aria-label="4.5 star"
        aria-current={cleanNumber >= 4.25 && cleanNumber < 4.75}
      />
      <span
        className={colorClass("mask mask-star-2 mask-half-2", variant)}
        aria-label="5 star"
        aria-current={cleanNumber >= 4.75}
      />
    </div>
  );
}

export default StarRating;
