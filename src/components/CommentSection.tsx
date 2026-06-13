import React, { useState } from 'react';
import type { Comment as CommentType } from '../types';

interface Props {
  comments: CommentType[];
  currentUserId: string | undefined;
  currentUser: { name: string; avatar: string } | null;
  onAddComment: (text: string) => void;
}

export const CommentSection: React.FC<Props> = ({ comments, currentUserId, currentUser, onAddComment }) => {
  const [text, setText] = useState('');

  const handleSubmit = () => {
    if (!text.trim()) return;
    onAddComment(text.trim());
    setText('');
  };

  const formatTime = (ts: number): string => {
    const d = new Date(ts);
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
  };

  return (
    <div className="comments-section">
      <h3 style={{ fontSize: 16, fontWeight: 600, marginBottom: 16 }}>
        评论 ({comments.length})
      </h3>
      {currentUserId && currentUser && (
        <div className="comment-input-wrap">
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="写下你的想法..."
          />
          <button className="comment-submit" onClick={handleSubmit}>发表</button>
        </div>
      )}
      {!currentUserId && (
        <p style={{ fontSize: 13, color: '#999', marginBottom: 16 }}>登录后可以发表评论</p>
      )}
      {comments.slice().sort((a, b) => b.createdAt - a.createdAt).map((c) => (
        <div key={c.id} className="comment-item">
          <img src={c.userAvatar} alt="" />
          <div className="comment-body">
            <div className="comment-author">{c.userName}</div>
            <div className="comment-time">{formatTime(c.createdAt)}</div>
            <div className="comment-text">{c.text}</div>
          </div>
        </div>
      ))}
      {comments.length === 0 && (
        <p style={{ fontSize: 13, color: '#bbb', textAlign: 'center', padding: '20px 0' }}>暂无评论，来抢沙发吧</p>
      )}
    </div>
  );
};
