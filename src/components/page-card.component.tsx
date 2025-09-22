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
    <div className="card mb-12 bg-base-100 shadow-xl hover:shadow-2xl transition-shadow duration-200 overflow-hidden w-full">
      <div className="flex flex-col lg:flex-row">
        {/* Image Section */}
        <div className="lg:w-1/3 xl:w-2/5 bg-base-200">
          {page.thumbnail ? (
            <img
              src={page.thumbnail}
              alt={page.title}
              className="w-full h-full object-cover aspect-video lg:aspect-[4/3] xl:aspect-video"
            />
          ) : (
            <div className="w-full aspect-video lg:aspect-[4/3] xl:aspect-video bg-gradient-to-br from-base-200 to-base-300 flex items-center justify-center">
              <HiOutlineDocument className="h-20 w-20 text-base-content/20" />
            </div>
          )}
        </div>

        {/* Content Section */}
        <div className="flex-1 p-6 lg:p-8">
          {/* Top Row: Type Badge and Status */}
          <div className="flex justify-between items-start mb-3">
            <div className="badge badge-neutral badge-sm">{page.pageType}</div>

            {/* Validation Status */}
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
                  {page.warnings.length} Warning
                  {page.warnings.length !== 1 ? "s" : ""}
                </div>
              )}

              {page.validationStatus === "invalid" && (
                <div className="badge badge-error gap-1">
                  <HiXCircle className="h-3 w-3" />
                  {page.issues.length} Issue
                  {page.issues.length !== 1 ? "s" : ""}
                </div>
              )}

              {page.validationStatus === "invalid" &&
                page.warnings.length > 0 && (
                  <div className="badge badge-warning badge-outline gap-1">
                    <HiOutlineExclamationTriangle className="h-3 w-3" />
                    {page.warnings.length}
                  </div>
                )}
            </div>
          </div>

          {/* Title */}
          <h2 className="text-2xl font-bold mb-2 line-clamp-2">{page.title}</h2>

          {/* Description */}
          <p className="text-base-content/70 mb-4 line-clamp-2 lg:line-clamp-3">
            {page.description || "No description available"}
          </p>

          {/* Metadata Row */}
          <div className="flex flex-wrap gap-4 text-sm text-base-content/60 mb-6">
            {/* Path */}
            <div className="flex items-center gap-1">
              <HiOutlineLink className="h-4 w-4 flex-shrink-0" />
              <span className="truncate max-w-xs">{page.path}</span>
            </div>

            {/* Last Updated */}
            <div className="flex items-center gap-1">
              <HiOutlineClock className="h-4 w-4 flex-shrink-0" />
              <span>Last updated: {formatDate(page.lastUpdated)}</span>
            </div>
          </div>

          {onSelectPage && (
            <div className="flex gap-2">
              <button
                className="btn btn-outline gap-1"
                onClick={() => onSelectPage(page)}
              >
                <HiOutlineExternalLink className="h-4 w-4" />
                {onSelectPageLabel}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default PageCard;
