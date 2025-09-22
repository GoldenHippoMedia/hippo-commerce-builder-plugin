import React, { useEffect, useRef, useState } from "react";
import {
  HiOutlineArrowUturnRight,
  HiOutlineClock,
  HiOutlineGlobeAlt,
  HiOutlineShieldCheck,
  HiOutlineUser,
} from "react-icons/hi2";
import { HiOutlineReply, HiX } from "react-icons/hi";
import { BlogComment } from "@utils/utils.interfaces";
import { AppTabState } from "@application/AppCore";

interface CommentReplyModalProps {
  isOpen: boolean;
  onClose: () => void;
  parentComment: BlogComment | null;
  onSubmit: (replyData: {
    comment: string;
    internal: boolean;
    authorName?: string;
    authorEmail?: string;
  }) => Promise<void>;
  className?: string;
  state: AppTabState
}

const CommentReplyModal: React.FC<CommentReplyModalProps> = ({
  isOpen,
  onClose,
  parentComment,
  onSubmit,
  state,
  className = "",
}) => {
  const [replyContent, setReplyContent] = useState("");
  const [authorName, setAuthorName] = useState(state.brandDetails?.name || "");
  const [authorEmail, setAuthorEmail] = useState(state.brandDetails?.support.email || "");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPreview, setShowPreview] = useState(false);

  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const modalRef = useRef<HTMLDivElement>(null);

  // Reset form when modal opens/closes
  useEffect(() => {
    if (isOpen) {
      setReplyContent("");
      setAuthorName(state.brandDetails?.name || "");
      setAuthorEmail(state.brandDetails?.support.email || "");
      setShowPreview(false);
      // Focus textarea after modal animation
      setTimeout(() => textareaRef.current?.focus(), 100);
    }
  }, [isOpen, state.brandDetails]);

  // Handle escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };

    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [isOpen, onClose]);

  // Handle click outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      return () =>
        document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [isOpen, onClose]);

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(new Date(date));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyContent.trim() || !parentComment) return;

    setIsSubmitting(true);
    try {
      await onSubmit({
        comment: replyContent.trim(),
        internal: true, // All admin replies are internal
        authorName: authorName.trim(),
        authorEmail: authorEmail.trim(),
      });
      onClose();
    } catch (error) {
      console.error("Failed to submit reply:", error);
      // In a real app, you'd show an error toast here
    } finally {
      setIsSubmitting(false);
    }
  };

  const insertHtmlTag = (tag: string, hasClosingTag: boolean = true) => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = textarea.value.substring(start, end);

    let replacement: string;
    if (hasClosingTag) {
      replacement = selectedText
        ? `<${tag}>${selectedText}</${tag}>`
        : `<${tag}></${tag}>`;
    } else {
      replacement = `<${tag}>`;
    }

    const newValue =
      textarea.value.substring(0, start) +
      replacement +
      textarea.value.substring(end);

    setReplyContent(newValue);

    // Set the cursor position
    setTimeout(() => {
      const newPosition =
        hasClosingTag && !selectedText
          ? start + tag.length + 2 // Position between opening and closing tags
          : start + replacement.length;
      textarea.setSelectionRange(newPosition, newPosition);
      textarea.focus();
    }, 0);
  };

  if (!isOpen || !parentComment) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />

      {/* Modal */}
      <div
        ref={modalRef}
        className={`relative bg-base-100 rounded-lg shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden ${className}`}
      >
        {/* Header */}
        <div className="bg-base-200 px-6 py-4 border-b border-base-300">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold flex items-center gap-2">
                <HiOutlineReply className="h-5 w-5" />
                Reply to Comment
              </h2>
              <p className="text-sm text-base-content/60 mt-1">
                Responding to {parentComment.name} on "{parentComment.blogTitle}
                " (Internal Reply)
              </p>
            </div>
            <button
              onClick={onClose}
              className="btn btn-ghost btn-sm btn-circle"
              aria-label="Close modal"
            >
              <HiX className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="overflow-y-auto max-h-[calc(90vh-140px)]">
          <div className="p-6 space-y-6">
            {/* Parent Comment Context */}
            <div className="bg-base-200 rounded-lg p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <HiOutlineUser className="h-4 w-4 text-base-content/60" />
                  <span className="font-medium">{parentComment.name}</span>
                  {parentComment.internal && (
                    <div className="badge badge-info badge-xs gap-1">
                      <HiOutlineShieldCheck className="h-3 w-3" />
                      Internal
                    </div>
                  )}
                  <div className="flex items-center gap-1 text-sm text-base-content/60">
                    <HiOutlineClock className="h-4 w-4" />
                    <span>{formatDate(parentComment.date)}</span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <HiOutlineArrowUturnRight className="h-4 w-4 text-base-content/60" />
                  <span className="text-xs text-base-content/60">
                    Replying to this comment
                  </span>
                </div>
              </div>
              <div
                className="prose prose-sm max-w-none text-base-content/80"
                dangerouslySetInnerHTML={{ __html: parentComment.comment }}
              />
            </div>

            {/* Reply Form */}
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Author Information */}
              <div className="grid md:grid-cols-2 gap-4">
                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-medium">Your Name</span>
                    <span className="label-text-alt text-error">*</span>
                  </label>
                  <input
                    type="text"
                    className="input input-bordered w-full"
                    value={authorName}
                    onChange={(e) => setAuthorName(e.target.value)}
                    placeholder="Enter your name"
                    required
                  />
                </div>
                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-medium">Your Email</span>
                    <span className="label-text-alt text-error">*</span>
                  </label>
                  <input
                    type="email"
                    className="input input-bordered w-full"
                    value={authorEmail}
                    onChange={(e) => setAuthorEmail(e.target.value)}
                    placeholder="Enter your email"
                    required
                  />
                </div>
              </div>

              {/* Content Editor */}
              <div className="form-control">
                <div className="flex items-center justify-between mb-2">
                  <label className="label-text font-medium">
                    Reply Content
                  </label>
                  <div className="flex items-center gap-2">
                    <div className="join">
                      <button
                        type="button"
                        className={`btn btn-xs join-item ${!showPreview ? "btn-active" : ""}`}
                        onClick={() => setShowPreview(false)}
                      >
                        Edit
                      </button>
                      <button
                        type="button"
                        className={`btn btn-xs join-item ${showPreview ? "btn-active" : ""}`}
                        onClick={() => setShowPreview(true)}
                      >
                        Preview
                      </button>
                    </div>
                  </div>
                </div>

                {!showPreview ? (
                  <>
                    {/* HTML Formatting Toolbar */}
                    <div className="flex flex-wrap gap-1 p-2 bg-base-200 rounded-t-lg border border-base-300">
                      <button
                        type="button"
                        className="btn btn-xs btn-ghost"
                        onClick={() => insertHtmlTag("strong")}
                        title="Bold"
                      >
                        <strong>B</strong>
                      </button>
                      <button
                        type="button"
                        className="btn btn-xs btn-ghost"
                        onClick={() => insertHtmlTag("em")}
                        title="Italic"
                      >
                        <em>I</em>
                      </button>
                      <button
                        type="button"
                        className="btn btn-xs btn-ghost"
                        onClick={() => insertHtmlTag("u")}
                        title="Underline"
                      >
                        <u>U</u>
                      </button>
                      <div className="divider divider-horizontal mx-0" />
                      <button
                        type="button"
                        className="btn btn-xs btn-ghost"
                        onClick={() => insertHtmlTag("p")}
                        title="Paragraph"
                      >
                        P
                      </button>
                      <button
                        type="button"
                        className="btn btn-xs btn-ghost"
                        onClick={() => insertHtmlTag("ul")}
                        title="Bulleted List"
                      >
                        • List
                      </button>
                      <button
                        type="button"
                        className="btn btn-xs btn-ghost"
                        onClick={() => insertHtmlTag("li")}
                        title="List Item"
                      >
                        Li
                      </button>
                      <button
                        type="button"
                        className="btn btn-xs btn-ghost"
                        onClick={() => insertHtmlTag("br", false)}
                        title="Line Break"
                      >
                        BR
                      </button>
                    </div>

                    {/* Text Area */}
                    <textarea
                      ref={textareaRef}
                      className="textarea textarea-bordered w-full min-h-[200px] rounded-t-none border-t-0 font-mono text-sm"
                      value={replyContent}
                      onChange={(e) => setReplyContent(e.target.value)}
                      placeholder="Write your reply here. You can use HTML tags like <strong>, <em>, <p>, <ul>, <li>, etc."
                      required
                    />
                    <div className="text-xs text-base-content/60 mt-1">
                      HTML supported. Character count: {replyContent.length}
                    </div>
                  </>
                ) : (
                  <div className="min-h-[200px] p-4 border border-base-300 rounded-lg bg-base-50">
                    {replyContent ? (
                      <div
                        className="prose prose-sm max-w-none"
                        dangerouslySetInnerHTML={{ __html: replyContent }}
                      />
                    ) : (
                      <div className="text-base-content/50 italic">
                        Your reply preview will appear here...
                      </div>
                    )}
                  </div>
                )}
              </div>
            </form>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-base-200 px-6 py-4 border-t border-base-300">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm text-base-content/60">
              <HiOutlineGlobeAlt className="h-4 w-4" />
              <span>Reply will be posted to: {parentComment.blogTitle}</span>
            </div>
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={onClose}
                className="btn btn-ghost"
                disabled={isSubmitting}
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                className="btn btn-primary"
                disabled={
                  isSubmitting ||
                  !replyContent.trim() ||
                  !authorName.trim() ||
                  !authorEmail.trim()
                }
              >
                {isSubmitting ? (
                  <>
                    <span className="loading loading-spinner loading-sm" />
                    Posting Reply...
                  </>
                ) : (
                  <>
                    <HiOutlineReply className="h-4 w-4" />
                    Post Reply
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CommentReplyModal;
