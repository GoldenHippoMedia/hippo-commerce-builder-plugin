import React, { useState, useMemo } from "react";
import {
  HiOutlineUser,
  HiOutlineClock,
  HiOutlineGlobeAlt,
  HiCheck,
  HiOutlineExclamationTriangle,
  HiOutlineEye,
  HiOutlineChatBubbleLeft,
  HiOutlineShieldCheck,
  HiChevronLeft,
  HiChevronRight,
  HiOutlineArrowUturnRight,
  HiChevronDown,
  HiChevronUp,
  HiOutlineUserPlus,
  HiArrowsUpDown,
} from "react-icons/hi2";
import { HiOutlineReply, HiX } from "react-icons/hi";
import { BlogComment } from "@utils/utils.interfaces";
import LoadingSection from "@components/loading-section.component";

interface CommentThread {
  comment: BlogComment;
  replies: CommentThread[];
  level: number;
}

interface BlogCommentListProps {
  comments: BlogComment[];
  onApprove: (commentId: string) => void;
  onReject: (commentId: string) => void;
  onReply: (commentId: string, parentComment: BlogComment) => void;
  onViewBlog: (blogId: string) => void;
  loading: boolean;
  className?: string;
  pageSize?: number;
}

type StatusFilter = "all" | "pending" | "approved" | "rejected" | "no-replies";
type SortOrder = "newest" | "oldest";

const BlogCommentList: React.FC<BlogCommentListProps> = ({
  comments,
  onApprove,
  onReject,
  onReply,
  onViewBlog,
  className = "",
  pageSize = 20,
  loading = true,
}) => {
  const [selectedBlogId, setSelectedBlogId] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [sortOrder, setSortOrder] = useState<SortOrder>("newest");
  const [currentPage, setCurrentPage] = useState(1);
  const [expandedComments, setExpandedComments] = useState<Set<string>>(
    new Set(),
  );
  const [expandedThreads, setExpandedThreads] = useState<Set<string>>(
    new Set(),
  );

  // Get unique blogs from comments
  const availableBlogs = useMemo(() => {
    const blogMap = new Map<
      string,
      { id: string; title: string; count: number }
    >();

    comments.forEach((comment) => {
      if (!blogMap.has(comment.blogId)) {
        blogMap.set(comment.blogId, {
          id: comment.blogId,
          title: comment.blogTitle,
          count: 0,
        });
      }
      blogMap.get(comment.blogId)!.count++;
    });

    return Array.from(blogMap.values()).sort((a, b) =>
      a.title.localeCompare(b.title),
    );
  }, [comments]);

  // Filter comments by blog and status
  const filteredComments = useMemo(() => {
    let filtered = comments;

    if (selectedBlogId) {
      filtered = filtered.filter(
        (comment) => comment.blogId === selectedBlogId,
      );
    }

    if (statusFilter !== "all" && statusFilter !== "no-replies") {
      filtered = filtered.filter((comment) => {
        switch (statusFilter) {
          case "pending":
            return comment.status === "Pending Approval";
          case "approved":
            return comment.status === "Approved";
          case "rejected":
            return comment.status === "Rejected";
          default:
            return true;
        }
      });
    }

    return filtered;
  }, [comments, selectedBlogId, statusFilter]);

  // Build comment threads with hierarchy
  const commentThreads = useMemo(() => {
    const buildThreads = (
      parentId: string | null,
      level: number = 0,
      processed: Set<string> = new Set(),
    ): CommentThread[] => {
      if (level > 5) return []; // Prevent infinite recursion

      return filteredComments
        .filter(
          (comment) =>
            comment.parentId === parentId && !processed.has(comment.id),
        )
        .sort((a, b) => {
          const dateA = new Date(a.date).getTime();
          const dateB = new Date(b.date).getTime();
          return sortOrder === "newest" ? dateB - dateA : dateA - dateB;
        })
        .map((comment) => {
          processed.add(comment.id);
          const replies = buildThreads(comment.id, level + 1, processed);
          return {
            comment,
            replies,
            level,
          };
        });
    };

    const threads = buildThreads(null);

    // If filtering for no-replies, only show threads where the top-level comment has no replies
    if (statusFilter === "no-replies") {
      return threads.filter((thread) => thread.replies.length === 0);
    }

    return threads;
  }, [filteredComments, statusFilter, sortOrder]);

  // Paginate threads
  const totalThreads = commentThreads.length;
  const totalPages = Math.ceil(totalThreads / pageSize);
  const paginatedThreads = commentThreads.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize,
  );

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(new Date(date));
  };

  const getStatusBadge = (status: BlogComment["status"]) => {
    switch (status) {
      case "Pending Approval":
        return (
          <div className="badge badge-warning badge-sm gap-1">
            <HiOutlineExclamationTriangle className="h-3 w-3" />
            Pending
          </div>
        );
      case "Approved":
        return (
          <div className="badge badge-success badge-sm gap-1">
            <HiCheck className="h-3 w-3" />
            Approved
          </div>
        );
      case "Rejected":
        return (
          <div className="badge badge-error badge-sm gap-1">
            <HiX className="h-3 w-3" />
            Rejected
          </div>
        );
    }
  };

  const getStatusCounts = () => {
    // Start with comments filtered by blog (if selected)
    let baseComments = comments;
    if (selectedBlogId) {
      baseComments = baseComments.filter(
        (comment) => comment.blogId === selectedBlogId,
      );
    }

    // For no-replies, we need to count top-level comments that have no replies
    const topLevelComments = baseComments.filter((c) => !c.parentId);
    const topLevelCommentsWithNoReplies = topLevelComments.filter(
      (topComment) => !baseComments.some((c) => c.parentId === topComment.id),
    );

    return {
      all: baseComments.length,
      pending: baseComments.filter((c) => c.status === "Pending Approval")
        .length,
      approved: baseComments.filter((c) => c.status === "Approved").length,
      rejected: baseComments.filter((c) => c.status === "Rejected").length,
      "no-replies": topLevelCommentsWithNoReplies.length,
    };
  };

  const statusCounts = getStatusCounts();

  const toggleExpanded = (commentId: string) => {
    const newExpanded = new Set(expandedComments);
    if (newExpanded.has(commentId)) {
      newExpanded.delete(commentId);
    } else {
      newExpanded.add(commentId);
    }
    setExpandedComments(newExpanded);
  };

  const toggleThreadExpanded = (commentId: string) => {
    const newExpanded = new Set(expandedThreads);
    if (newExpanded.has(commentId)) {
      newExpanded.delete(commentId);
    } else {
      newExpanded.add(commentId);
    }
    setExpandedThreads(newExpanded);
  };

  const toggleSortOrder = () => {
    setSortOrder((current) => (current === "newest" ? "oldest" : "newest"));
    setCurrentPage(1); // Reset to first page when sorting changes
  };

  // Helper function to get thread statistics
  const getThreadStats = (replies: CommentThread[]) => {
    let totalReplies = 0;
    let internalReplies = 0;
    let pendingReplies = 0;

    const countReplies = (threads: CommentThread[]) => {
      threads.forEach((thread) => {
        totalReplies++;
        if (thread.comment.internal) internalReplies++;
        if (thread.comment.status === "Pending Approval") pendingReplies++;
        countReplies(thread.replies);
      });
    };

    countReplies(replies);
    return { totalReplies, internalReplies, pendingReplies };
  };

  const stripHtmlTags = (html: string): string => {
    const tmp = document.createElement("div");
    tmp.innerHTML = html;
    return tmp.textContent || tmp.innerText || "";
  };

  const truncateHtml = (
    html: string,
    maxLength: number = 150,
  ): { content: string; isTruncated: boolean } => {
    const textContent = stripHtmlTags(html);
    if (textContent.length <= maxLength) {
      return { content: html, isTruncated: false };
    }

    // Simple truncation - in production you might want a more sophisticated HTML truncation
    const truncatedText = textContent.substring(0, maxLength) + "...";
    return { content: truncatedText, isTruncated: true };
  };

  const renderComment = (thread: CommentThread): React.ReactNode => {
    const { comment, replies, level } = thread;
    const isExpanded = expandedComments.has(comment.id);
    const isThreadExpanded = expandedThreads.has(comment.id);
    const { content, isTruncated } = isExpanded
      ? { content: comment.comment, isTruncated: false }
      : truncateHtml(comment.comment);

    const marginLeft = Math.min(level * 24, 120); // Cap at 5 levels
    const hasReplies = replies.length > 0;
    const threadStats = hasReplies ? getThreadStats(replies) : null;
    const needsReply = level === 0 && !hasReplies && !comment.parentId; // Top-level with no replies

    return (
      <div key={comment.id} className="mb-4">
        <div
          className={`bg-base-100 border border-base-300 rounded-lg p-4 ${
            level > 0 ? "border-l-4 border-l-primary bg-base-50" : ""
          } ${comment.internal ? "ring-2 ring-info/20" : ""} ${
            needsReply && statusFilter !== "no-replies"
              ? "ring-2 ring-warning/30"
              : ""
          }`}
          style={{ marginLeft: `${marginLeft}px` }}
        >
          {/* Comment Header */}
          <div className="flex items-start justify-between mb-3">
            <div className="flex items-center gap-3 flex-wrap">
              {/* Thread Level Indicator */}
              {level > 0 && (
                <div className="flex items-center gap-1 text-xs text-base-content/50">
                  <HiOutlineArrowUturnRight className="h-3 w-3" />
                  <span>Level {level}</span>
                </div>
              )}

              {/* Commenter Info */}
              <div className="flex items-center gap-2">
                <HiOutlineUser className="h-4 w-4 text-base-content/60" />
                <span className="font-medium">{comment.name}</span>
                {comment.internal && (
                  <div className="badge badge-info badge-xs gap-1">
                    <HiOutlineShieldCheck className="h-3 w-3" />
                    Internal
                  </div>
                )}
                {needsReply && statusFilter !== "no-replies" && (
                  <div className="badge badge-warning badge-xs gap-1">
                    <HiOutlineUserPlus className="h-3 w-3" />
                    Needs Reply
                  </div>
                )}
              </div>

              {/* Date and Locale */}
              <div className="flex items-center gap-3 text-sm text-base-content/60">
                <div className="flex items-center gap-1">
                  <HiOutlineClock className="h-4 w-4" />
                  <span>{formatDate(comment.date)}</span>
                </div>
                <div className="flex items-center gap-1">
                  <HiOutlineGlobeAlt className="h-4 w-4" />
                  <span>{comment.locale}</span>
                </div>
              </div>
            </div>

            {/* Status Badge */}
            {getStatusBadge(comment.status)}
          </div>

          {/* Comment Content */}
          <div className="mb-4">
            {isExpanded || !isTruncated ? (
              <div
                className="prose prose-sm max-w-none"
                dangerouslySetInnerHTML={{ __html: content }}
              />
            ) : (
              <p className="text-sm leading-relaxed text-base-content/80">
                {content}
              </p>
            )}
            {isTruncated && (
              <button
                onClick={() => toggleExpanded(comment.id)}
                className="text-primary text-xs mt-1 hover:underline"
              >
                {isExpanded ? "Show less" : "Show more"}
              </button>
            )}
          </div>

          {/* Reply Thread Indicator and Toggle */}
          {hasReplies && threadStats && (
            <div className="mb-4 p-3 bg-base-200 rounded-lg border border-base-300">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-2 text-sm font-medium">
                    <HiOutlineChatBubbleLeft className="h-4 w-4" />
                    <span>
                      {threadStats.totalReplies}{" "}
                      {threadStats.totalReplies === 1 ? "reply" : "replies"}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    {threadStats.internalReplies > 0 && (
                      <div className="badge badge-info badge-xs gap-1">
                        <HiOutlineShieldCheck className="h-3 w-3" />
                        {threadStats.internalReplies} internal
                      </div>
                    )}
                    {threadStats.pendingReplies > 0 && (
                      <div className="badge badge-warning badge-xs gap-1">
                        <HiOutlineExclamationTriangle className="h-3 w-3" />
                        {threadStats.pendingReplies} pending
                      </div>
                    )}
                  </div>
                </div>

                <button
                  onClick={() => toggleThreadExpanded(comment.id)}
                  className="btn btn-ghost btn-sm gap-1"
                >
                  {isThreadExpanded ? (
                    <>
                      Hide Replies
                      <HiChevronUp className="h-4 w-4" />
                    </>
                  ) : (
                    <>
                      Show Replies
                      <HiChevronDown className="h-4 w-4" />
                    </>
                  )}
                </button>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {comment.status === "Pending Approval" && (
                <>
                  <button
                    onClick={() => onApprove(comment.id)}
                    className="btn btn-success btn-sm gap-1"
                  >
                    <HiCheck className="h-4 w-4" />
                    Approve
                  </button>
                  <button
                    onClick={() => onReject(comment.id)}
                    className="btn btn-error btn-sm gap-1"
                  >
                    <HiX className="h-4 w-4" />
                    Reject
                  </button>
                </>
              )}
              {level < 5 && (
                <button
                  onClick={() => onReply(comment.id, comment)}
                  className="btn btn-outline btn-sm gap-1"
                >
                  <HiOutlineReply className="h-4 w-4" />
                  Reply
                </button>
              )}
            </div>

            {/* Comment ID for reference */}
            <div className="text-xs text-base-content/40 font-mono">
              ID: {comment.id}
            </div>
          </div>
        </div>

        {/* Render replies only if thread is expanded */}
        {hasReplies && isThreadExpanded && (
          <div className="mt-4">
            {replies.map((replyThread) => renderComment(replyThread))}
          </div>
        )}
      </div>
    );
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    setExpandedComments(new Set()); // Reset expanded comments on page change
    setExpandedThreads(new Set()); // Reset expanded threads on page change
  };

  return (
    <div className={`bg-base-100 rounded-lg overflow-hidden ${className}`}>
      {/* Header with Blog Selection and Filters */}
      <div className="bg-base-200 p-4 border-b border-base-300">
        <div className="space-y-4">
          {/* Blog Selection */}
          <div>
            <label className="text-sm font-medium text-base-content/80 mb-2 block">
              Select Blog
            </label>
            <select
              value={selectedBlogId || ""}
              onChange={(e) => {
                setSelectedBlogId(e.target.value || null);
                setCurrentPage(1); // Reset to first page
              }}
              className="select select-bordered w-full max-w-md"
            >
              <option value="">All Blogs ({comments.length} comments)</option>
              {availableBlogs.map((blog) => (
                <option key={blog.id} value={blog.id}>
                  {blog.title} ({blog.count} comments)
                </option>
              ))}
            </select>
          </div>

          {/* Status Filter and Info */}
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <h2 className="text-lg font-semibold flex items-center gap-2">
                <HiOutlineChatBubbleLeft className="h-5 w-5" />
                Comments ({statusCounts.all} total)
              </h2>
              {selectedBlogId && (
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-sm text-base-content/60">
                    Viewing:{" "}
                    {availableBlogs.find((b) => b.id === selectedBlogId)?.title}
                  </span>
                  <button
                    onClick={() => onViewBlog(selectedBlogId)}
                    className="btn btn-ghost btn-xs gap-1"
                  >
                    <HiOutlineEye className="h-3 w-3" />
                    View Blog
                  </button>
                </div>
              )}
            </div>

            <div className="flex items-center gap-3">
              {/* Sort Toggle */}
              <div className="flex items-center gap-2">
                <span className="text-sm text-base-content/60">Sort:</span>
                <button
                  onClick={toggleSortOrder}
                  className="btn btn-outline btn-sm gap-1"
                  title={`Currently sorting ${sortOrder === "newest" ? "newest to oldest" : "oldest to newest"}`}
                >
                  <HiArrowsUpDown className="h-4 w-4" />
                  {sortOrder === "newest" ? "Newest First" : "Oldest First"}
                </button>
              </div>

              {/* Status Filter Tabs */}
              <div className="tabs tabs-box tabs-sm">
                <button
                  className={`tab ${statusFilter === "all" ? "tab-active" : ""}`}
                  onClick={() => {
                    setStatusFilter("all");
                    setCurrentPage(1);
                  }}
                >
                  All ({statusCounts.all})
                </button>
                <button
                  className={`tab ${statusFilter === "pending" ? "tab-active" : ""}`}
                  onClick={() => {
                    setStatusFilter("pending");
                    setCurrentPage(1);
                  }}
                >
                  Pending ({statusCounts.pending})
                </button>
                <button
                  className={`tab ${statusFilter === "no-replies" ? "tab-active" : ""}`}
                  onClick={() => {
                    setStatusFilter("no-replies");
                    setCurrentPage(1);
                  }}
                >
                  <div className="flex items-center gap-1">
                    <HiOutlineUserPlus className="h-3 w-3" />
                    <span>Need Reply ({statusCounts["no-replies"]})</span>
                  </div>
                </button>
                <button
                  className={`tab ${statusFilter === "approved" ? "tab-active" : ""}`}
                  onClick={() => {
                    setStatusFilter("approved");
                    setCurrentPage(1);
                  }}
                >
                  Approved ({statusCounts.approved})
                </button>
                <button
                  className={`tab ${statusFilter === "rejected" ? "tab-active" : ""}`}
                  onClick={() => {
                    setStatusFilter("rejected");
                    setCurrentPage(1);
                  }}
                >
                  Rejected ({statusCounts.rejected})
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Comments List */}
      <div className="p-4">
        {paginatedThreads.length === 0 ? (
          <div>
            {loading && (
              <div className="text-center py-12">
                <HiOutlineChatBubbleLeft className="h-12 w-12 text-base-content/30 mx-auto mb-4" />
                <LoadingSection size={"sm"} />
                <p className="text-sm text-base-content/50">
                  Loading Comments...
                </p>
              </div>
            )}
            {!loading && (
              <div className="text-center py-12">
                <HiOutlineChatBubbleLeft className="h-12 w-12 text-base-content/30 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-base-content/60 mb-2">
                  No Comments Found
                </h3>
                <p className="text-sm text-base-content/50">
                  {statusFilter !== "all" || selectedBlogId
                    ? "No comments match the selected filters."
                    : "There are no blog comments to display at this time."}
                </p>
              </div>
            )}
          </div>
        ) : (
          <div className="space-y-6">
            {paginatedThreads.map((thread) => renderComment(thread))}
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between mt-8 pt-4 border-t border-base-300">
            <div className="text-sm text-base-content/60">
              Showing {(currentPage - 1) * pageSize + 1} to{" "}
              {Math.min(currentPage * pageSize, totalThreads)} of {totalThreads}{" "}
              comment threads
            </div>

            <div className="join">
              <button
                className="join-item btn btn-sm"
                disabled={currentPage === 1}
                onClick={() => handlePageChange(currentPage - 1)}
              >
                <HiChevronLeft className="h-4 w-4" />
                Previous
              </button>

              {/* Page Numbers */}
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                const pageNumber =
                  currentPage <= 3 ? i + 1 : currentPage + i - 2;

                if (pageNumber > totalPages) return null;

                return (
                  <button
                    key={pageNumber}
                    className={`join-item btn btn-sm ${
                      currentPage === pageNumber ? "btn-active" : ""
                    }`}
                    onClick={() => handlePageChange(pageNumber)}
                  >
                    {pageNumber}
                  </button>
                );
              })}

              <button
                className="join-item btn btn-sm"
                disabled={currentPage === totalPages}
                onClick={() => handlePageChange(currentPage + 1)}
              >
                Next
                <HiChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default BlogCommentList;
