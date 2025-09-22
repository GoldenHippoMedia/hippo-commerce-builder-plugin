import React from 'react';
import { BlogComment } from '@utils/utils.interfaces';
import { AppTabState } from '@application/AppCore';
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
    state: AppTabState;
}
declare const CommentReplyModal: React.FC<CommentReplyModalProps>;
export default CommentReplyModal;
