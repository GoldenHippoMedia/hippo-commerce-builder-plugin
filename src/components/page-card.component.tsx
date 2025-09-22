import {
  HiCheckCircle,
  HiOutlineClock,
  HiOutlineDocument,
  HiOutlineExternalLink,
  HiOutlineLink,
  HiXCircle,
} from "react-icons/hi";
import {
  HiExclamationTriangle,
  HiOutlineExclamationTriangle,
} from "react-icons/hi2";
import { PageDetails } from "@utils/utils.interfaces";
import React from "react";

interface Props {
  page: PageDetails;
  onSelectPage?: (page: PageDetails) => void;
  onSelectPageLabel?: string;
}

function PageCard(props: Props) {
  const { page, onSelectPage, onSelectPageLabel = "View Details" } = props;

  // Format date helper (you can adjust the format as needed)
  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <div
      className="card bg-base-100 shadow-lg hover:shadow-xl transition-shadow cursor-pointer"
      onClick={() => onSelectPage && onSelectPage(page)}
    >
      {/* Thumbnail */}
      <figure className="h-48 overflow-hidden bg-base-200 flex items-center justify-center">
        {page.thumbnail ? (
          <img
            src={page.thumbnail}
            alt={page.title}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="flex flex-col items-center justify-center text-base-content/30">
            <HiOutlineDocument className="h-12 w-12 mb-2" />
            <span className="text-xs">No Image</span>
          </div>
        )}
      </figure>

      {/* Body */}
      <div className="card-body p-4">
        {/* Top badges */}
        <div className="flex justify-between items-start mb-2">
          <div className="badge badge-neutral badge-sm">{page.pageType}</div>
          <div className="flex items-center gap-2">
            {page.validationStatus === "valid" && (
              <div className="badge badge-success gap-1">
                <HiCheckCircle className="h-3 w-3" />
                Valid
              </div>
            )}
            {page.validationStatus === "warning" && (
              <div className="badge badge-warning gap-1">
                <HiExclamationTriangle className="h-3 w-3" />
                {page.warnings.length}
              </div>
            )}
            {page.validationStatus === "invalid" && (
              <div className="badge badge-error gap-1">
                <HiXCircle className="h-3 w-3" />
                {page.issues.length}
              </div>
            )}
          </div>
        </div>

        {/* Title */}
        <h2 className="card-title text-base line-clamp-2">{page.title}</h2>

        {/* Description */}
        {page.description && (
          <p className="text-sm text-base-content/70 line-clamp-3">
            {page.description}
          </p>
        )}

        {/* Meta */}
        <div className="flex items-center justify-between mt-3 text-xs text-base-content/60">
          <div className="flex items-center gap-1 truncate max-w-[70%]">
            <HiOutlineLink className="h-3 w-3" />
            <span className="truncate">{page.path}</span>
          </div>
          <div className="flex items-center gap-1">
            <HiOutlineClock className="h-3 w-3" />
            <span>{formatDate(page.lastUpdated)}</span>
          </div>
        </div>

        {/* Action */}
        {onSelectPage && (
          <div className="card-actions justify-end mt-3">
            <button
              className="btn btn-secondary btn-sm gap-1"
              onClick={(e) => {
                e.stopPropagation();
                onSelectPage(page);
              }}
            >
              <HiOutlineExternalLink className="h-4 w-4" />
              {onSelectPageLabel}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default PageCard;
