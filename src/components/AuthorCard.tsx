import React from 'react';
import type { Author } from '../types';

interface Props {
  author: Author;
  currentUserId: string | undefined;
  onFollow: (authorId: string) => void;
  onNavigate?: (page: string, data?: string) => void;
}

export const AuthorCard: React.FC<Props> = ({ author, currentUserId, onFollow }) => {
  const isFollowing = currentUserId ? author.followers.includes(currentUserId) : false;

  return (
    <div className="sidebar-card author-card">
      <img src={author.avatar} alt={author.name} />
      <div className="name">{author.name}</div>
      <div className="bio">{author.bio}</div>
      <div className="author-stats">
        <span><strong>{author.workCount}</strong> 作品</span>
        <span><strong>{author.followers.length}</strong> 关注</span>
      </div>
      {currentUserId && currentUserId !== author.id && (
        <button
          className={`btn-follow ${isFollowing ? 'following' : ''}`}
          onClick={() => onFollow(author.id)}
        >
          {isFollowing ? '已关注' : '+ 关注'}
        </button>
      )}
    </div>
  );
};
