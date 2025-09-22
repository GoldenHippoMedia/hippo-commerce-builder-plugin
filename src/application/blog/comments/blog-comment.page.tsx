import React, { useState } from "react";
import { AppTabState } from "@application/AppCore";
import { useObserver } from "mobx-react";
import BlogCommentList from "@components/blog-comment-list.component";
import { BlogComment } from "@utils/utils.interfaces";
import CommentReplyModal from "@components/comment-reply-modal.component";

interface Props {
  state: AppTabState;
}

function BlogCommentPage(props: Props) {
  const { state } = props;
  const [isReplyModalOpen, setIsReplyModalOpen] = useState(false);
  const [replyingToComment, setReplyingToComment] =
    useState<BlogComment | null>(null);
  const handleApprove = (commentId: string) => {
    // setComments(prev =>
    //   prev.map(comment =>
    //     comment.id === commentId
    //       ? { ...comment, status: 'Approved' as const }
    //       : comment
    //   )
    // );
    console.log(`Approved comment: ${commentId}`);
  };

  const handleReject = (commentId: string) => {
    // setComments(prev =>
    //   prev.map(comment =>
    //     comment.id === commentId
    //       ? { ...comment, status: 'Rejected' as const }
    //       : comment
    //   )
    // );
    console.log(`Rejected comment: ${commentId}`);
  };

  const handleReply = (commentId: string, parentComment: BlogComment) => {
    setReplyingToComment(parentComment);
    setIsReplyModalOpen(true);
  };

  const handleCloseReplyModal = () => {
    setIsReplyModalOpen(false);
    setReplyingToComment(null);
  };

  const handleSubmitReply = async (replyData: {
    comment: string;
    internal: boolean;
    authorName?: string;
    authorEmail?: string;
  }) => {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));

    if (!replyingToComment) return;

    const newReply: BlogComment = {
      id: `reply-${Date.now()}`,
      blogId: replyingToComment.blogId,
      blogTitle: replyingToComment.blogTitle,
      name: replyData.authorName || state.brandDetails?.name || "",
      date: new Date(),
      comment: replyData.comment,
      locale: "en-US",
      language: "en",
      parentId: replyingToComment.id,
      internal: replyData.internal,
      blog: replyingToComment.blog,
      status: "Approved" as const, // Admin replies are auto-approved
    };
    console.log("Reply submitted:", newReply);
  };

  const handleViewBlog = (blogId: string) => {
    console.log(`Viewing blog: ${blogId}`);
    alert(`Navigating to blog: ${blogId}`);
  };

  return useObserver(() => (
    <div>
      <BlogCommentList
        comments={state.blogComments}
        onApprove={handleApprove}
        onReject={handleReject}
        onReply={handleReply}
        onViewBlog={handleViewBlog}
        loading={state.loadingBlogComments}
        pageSize={10}
      />
      <CommentReplyModal
        isOpen={isReplyModalOpen}
        onClose={handleCloseReplyModal}
        parentComment={replyingToComment}
        onSubmit={handleSubmitReply}
        state={state}
      />
    </div>
  ));
}

export default BlogCommentPage;
