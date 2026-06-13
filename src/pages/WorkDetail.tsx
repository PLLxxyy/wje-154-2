import React from 'react';
import type { Work, Author, CurrentUser } from '../types';
import { AuthorCard } from '../components/AuthorCard';
import { CommentSection } from '../components/CommentSection';

interface Props {
  work: Work;
  author: Author | undefined;
  currentUser: CurrentUser | null;
  onBack: () => void;
  onToggleLike: (workId: string) => void;
  onToggleFavorite: (workId: string) => void;
  onFollow: (authorId: string) => void;
  onAddComment: (workId: string, text: string) => void;
}

export const WorkDetail: React.FC<Props> = ({
  work, author, currentUser, onBack, onToggleLike, onToggleFavorite, onFollow, onAddComment,
}) => {
  const isLiked = currentUser ? work.likes.includes(currentUser.id) : false;
  const isFavorited = currentUser ? work.favorites.includes(currentUser.id) : false;

  const diffClass = work.difficulty === '简单' ? 'easy' : work.difficulty === '中等' ? 'medium' : 'hard';

  return (
    <div>
      <div className="back-link" onClick={onBack}>← 返回列表</div>
      <div className="detail-page">
        <div className="detail-main">
          <h1 className="detail-title">{work.title}</h1>
          <div className="detail-info">
            <span className="tag">{work.category}</span>
            <span className={`difficulty-badge difficulty-${diffClass}`}>{work.difficulty}</span>
            <span>{work.steps.length} 个步骤</span>
          </div>
          <p style={{ fontSize: 14, color: '#666', lineHeight: 1.8, marginBottom: 16 }}>{work.description}</p>

          <h3 style={{ fontSize: 16, fontWeight: 600, marginBottom: 16 }}>制作步骤</h3>
          <div className="step-list">
            {work.steps.map((step, idx) => (
              <div key={idx} className="step-item">
                <div className="step-num">{idx + 1}</div>
                <img className="step-img" src={step.image} alt={`步骤${idx + 1}`} />
                <p className="step-text">{step.text}</p>
              </div>
            ))}
          </div>

          <div className="action-bar">
            <button
              className={`action-btn ${isLiked ? 'liked' : ''}`}
              onClick={() => onToggleLike(work.id)}
            >
              {isLiked ? '❤️' : '🤍'} {work.likes.length}
            </button>
            <button
              className={`action-btn ${isFavorited ? 'favorited' : ''}`}
              onClick={() => onToggleFavorite(work.id)}
            >
              {isFavorited ? '⭐' : '☆'} 收藏 {work.favorites.length}
            </button>
          </div>

          <CommentSection
            comments={work.comments}
            currentUserId={currentUser?.id}
            currentUser={currentUser}
            onAddComment={(text) => onAddComment(work.id, text)}
          />
        </div>

        <div className="sidebar">
          {author && (
            <AuthorCard
              author={author}
              currentUserId={currentUser?.id}
              onFollow={onFollow}
            />
          )}

          <div className="sidebar-card">
            <h3>材料清单</h3>
            {work.materials.map((m, i) => (
              <div key={i} className="material-item">
                <span>{m.name}</span>
                <span style={{ color: '#b8860b' }}>{m.amount}</span>
              </div>
            ))}
          </div>

          <div className="sidebar-card">
            <h3>难度等级</h3>
            <span className={`difficulty-badge difficulty-${diffClass}`}>{work.difficulty}</span>
          </div>

          {work.tips && (
            <div className="sidebar-card">
              <h3>小贴士</h3>
              <p style={{ fontSize: 13, color: '#666', lineHeight: 1.7 }}>{work.tips}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
