import React from 'react';
import { BlogComment } from '@utils/utils.interfaces';
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
declare const BlogCommentList: React.FC<BlogCommentListProps>;
export default BlogCommentList;
