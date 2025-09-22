import React, { useMemo, useState } from "react";
import clsx from "clsx";
import { PageDetails } from "@utils/utils.interfaces";
import PageDetailsDialog from "./page-details-dialog.component";
import {
  AiOutlineCheckCircle,
  AiOutlineComment,
  AiOutlineGlobal,
  AiOutlineProduct,
  AiOutlineSearch,
  AiOutlineSortAscending,
  AiOutlineSortDescending,
  AiOutlineWarning,
} from "react-icons/ai";
import PageCard from "./page-card.component";
import LoadingSection from "./loading-section.component";
import { IProduct } from "@services/commerce-api/types";

interface PageListProps {
  pages: PageDetails[];
  products: IProduct[];
  isLoading: boolean;
}

type SortDirection = "asc" | "desc";
type FilterType = "All" | "General" | "Product" | "Blog";
type StatusFilter = "valid" | "warning" | "invalid" | "all";

function PageList(props: PageListProps) {
  const { pages, isLoading, products } = props;
  const [searchTerm, setSearchTerm] = useState("");
  const [sortDirection, setSortDirection] = useState<SortDirection>("asc");
  const [filterType, setFilterType] = useState<FilterType>("All");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [selectedPage, setSelectedPage] = useState<PageDetails>();

  const handlePageSelect = (page: PageDetails | undefined) => {
    setSelectedPage(page);
  };

  // Filter and sort pages
  const filteredAndSortedPages = useMemo(() => {
    let filtered = pages;

    // Apply search filter
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (page) =>
          page.title.toLowerCase().includes(term) ||
          page.description.toLowerCase().includes(term) ||
          page.path.toLowerCase().includes(term),
      );
    }

    // Apply type filter
    if (filterType !== "All") {
      filtered = filtered.filter((page) => page.pageType === filterType);
    }

    if (statusFilter !== "all") {
      switch (statusFilter) {
        case "invalid":
          filtered = filtered.filter((page) => page.issues.length > 0);
          break;
        case "warning":
          filtered = filtered.filter((page) => page.warnings.length > 0);
          break;
        case "valid":
          filtered = filtered.filter(
            (page) => page.issues.length === 0 && page.warnings.length === 0,
          );
          break;
        default:
          break;
      }
    }

    // Sort by title
    filtered.sort((a, b) => {
      const comparison = a.title.localeCompare(b.title);
      return sortDirection === "asc" ? comparison : -comparison;
    });

    return filtered;
  }, [pages, searchTerm, sortDirection, filterType, statusFilter]);

  // Calculate stats
  const stats = useMemo(() => {
    return {
      total: filteredAndSortedPages.length,
      valid: filteredAndSortedPages.filter(
        (p) => p.warnings.length === 0 && p.issues.length === 0,
      ).length,
      warning: filteredAndSortedPages.filter((p) => p.warnings.length > 0).length,
      invalid: filteredAndSortedPages.filter((p) => p.issues.length > 0).length,
      general: filteredAndSortedPages.filter((p) => p.pageType === "General")
        .length,
      product: filteredAndSortedPages.filter((p) => p.pageType === "Product")
        .length,
      blog: filteredAndSortedPages.filter((p) => p.pageType === "Blog").length,
    };
  }, [filteredAndSortedPages]);

  const handleSortToggle = () => {
    setSortDirection((prev) => (prev === "asc" ? "desc" : "asc"));
  };

  const handleFilterClick = (type: FilterType) => {
    setFilterType((prevState) => {
      if (prevState === type) {
        return "All";
      }
      return type;
    });
  };

  const handleStatusClick = (type: StatusFilter) => {
    setStatusFilter((prevState) => {
      if (prevState === type) {
        return "all";
      }
      return type;
    });
  };

  const getFilterClass = (active: boolean) => {
    return clsx(
      "flex align-items-center rounded-lg",
      active ? "outline-primary " : "outline-neutral-content",
    );
  };

  const getButtonClass = (active: boolean) => {
    return clsx("btn btn-outline", active ? "btn-info" : "");
  };

  if (isLoading) {
    return <LoadingSection message={"Loading your pages..."} size={"lg"} />;
  }

  return (
    <section className={"p-4 max-w-7xl min-w-full mx-auto rounded-lg"}>
      <div className={"mb-4 text-xl"}>Manage Your Pages</div>
      <div className={"flex flex-wrap justify-between mb-2 px-4 md:px-12"}>
        <div>
          <div className={"text-sm uppercase tracking-tight"}>
            Filter by Status
          </div>
          <div className={"flex w-full flex-wrap gap-2 mt-2 mb-4"}>
            {(statusFilter === "all" || statusFilter === "valid") &&
              stats.valid > 0 && (
                <div className={getFilterClass(statusFilter === "valid")}>
                  <button
                    className={getButtonClass(statusFilter === "valid")}
                    onClick={() => handleStatusClick("valid")}
                  >
                    <AiOutlineCheckCircle className={"text-success text-lg"} />
                    <div className={"text-xs"}>
                      <span className={"text-success"}>{stats.valid}</span>{" "}
                      Valid Pages
                    </div>
                  </button>
                </div>
              )}
            {(statusFilter === "all" || statusFilter === "warning") &&
              stats.warning > 0 && (
                <div className={getFilterClass(statusFilter === "warning")}>
                  <button
                    className={getButtonClass(statusFilter === "warning")}
                    onClick={() => handleStatusClick("warning")}
                  >
                    <AiOutlineWarning className={"text-md text-warning"} />
                    <div className={"text-xs"}>
                      <span className={"text-warning"}>{stats.warning}</span>{" "}
                      Pages with Warnings
                    </div>
                  </button>
                </div>
              )}
            {(statusFilter === "all" || statusFilter === "invalid") &&
              stats.invalid > 0 && (
                <div className={getFilterClass(statusFilter === "invalid")}>
                  <button
                    className={getButtonClass(statusFilter === "invalid")}
                    onClick={() => handleStatusClick("invalid")}
                  >
                    <AiOutlineWarning className={"text-md text-error"} />
                    <div className={"text-xs"}>
                      <span className={"text-error"}>{stats.invalid}</span>{" "}
                      Invalid Pages
                    </div>
                  </button>
                </div>
              )}
          </div>
        </div>
        <div>
          <div className={"text-sm uppercase tracking-tight"}>
            Filter by Page Type
          </div>
          <div className={"flex w-full flex-wrap gap-2 mt-2 mb-4"}>
            {(filterType === "All" || filterType === "General") &&
              stats.general > 0 && (
                <div className={getFilterClass(filterType === "General")}>
                  <button
                    className={getButtonClass(filterType === "General")}
                    onClick={() => handleFilterClick("General")}
                  >
                    <AiOutlineGlobal className={"text-info text-lg"} />
                    <div className={"text-xs"}>
                      <span className={"text-info"}>{stats.general}</span>{" "}
                      General Pages
                    </div>
                  </button>
                </div>
              )}
            {(filterType === "All" || filterType === "Product") &&
              stats.product > 0 && (
                <div className={getFilterClass(filterType === "Product")}>
                  <button
                    className={getButtonClass(filterType === "Product")}
                    onClick={() => handleFilterClick("Product")}
                  >
                    <AiOutlineProduct className={"text-info text-lg"} />
                    <div className={"text-xs"}>
                      <span className={"text-info"}>{stats.product}</span>{" "}
                      Product Pages
                    </div>
                  </button>
                </div>
              )}
            {(filterType === "All" || filterType === "Blog") &&
              stats.blog > 0 && (
                <div className={getFilterClass(filterType === "Blog")}>
                  <button
                    className={getButtonClass(filterType === "Blog")}
                    onClick={() => handleFilterClick("Blog")}
                  >
                    <AiOutlineComment className={"text-info text-lg"} />
                    <div className={"text-xs"}>
                      <span className={"text-info"}>{stats.blog}</span> Blog
                      Pages
                    </div>
                  </button>
                </div>
              )}
          </div>
        </div>
      </div>

      <div className={"flex gap-2 flex-wrap mb-2 items-center"}>
        <label className="input grow mx-6">
          <AiOutlineSearch className={"text-sm mr-2"} />
          <input
            type="search"
            className="grow pr-12 bg-base-100"
            placeholder="   Search pages..."
            onChange={(e) => setSearchTerm(e.target.value)}
            value={searchTerm}
          />
        </label>
        <div
          className={
            "flex items-center cursor-pointer gap-2 p-2 rounded-lg hover:bg-base-200"
          }
          onClick={handleSortToggle}
        >
          {sortDirection === "asc" ? (
            <AiOutlineSortAscending className={"mr-2"} />
          ) : (
            <AiOutlineSortDescending className={"mr-2"} />
          )}
          <div className={"mr-2"}>Title</div>
        </div>
      </div>

      {filteredAndSortedPages.length === 0 ? (
        <div className={"text-center p-4"}>
          <div className="font-semibold text-accent text-lg">No pages found</div>
          <p className={"mt-2"}>Try adjusting your search or filters</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pt-4 pr-4">
          {filteredAndSortedPages.map((page) => (
            <PageCard
              key={page.id}
              page={page}
              onSelectPage={handlePageSelect}
              onSelectPageLabel="View Details"
            />
          ))}
        </div>
      )}

      {selectedPage && (
        <PageDetailsDialog
          page={selectedPage}
          onClose={() => handlePageSelect(undefined)}
          products={products}
        />
      )}
    </section>
  );
}

export default PageList;
