import React from 'react';
import type { Work, Author } from '../types';

interface Props {
  work: Work;
  author: Author | undefined;
  isCompleted?: boolean;
  onClick: (id: string) => void;
}

export const WorkCard: React.FC<Props> = ({ work, author, isCompleted, onClick }) => {
  return (
    <div className="work-card" onClick={() => onClick(work.id)}>
      <div className="card-cover-wrap">
        <img className="card-cover" src={work.cover} alt={work.title} style={{ height: 200 + (parseInt(work.id.replace(/\D/g, ''), 10) % 4) * 30 }} />
        {isCompleted && (
          <div className="completion-badge">
            <span className="completion-check">✓</span>
            <span>已完成</span>
          </div>
        )}
      </div>
      <div className="card-body">
        <div className="card-title">{work.title}</div>
        <div className="card-meta">
          <div className="card-author">
            {author && <img src={author.avatar} alt={author.name} />}
            <span>{author?.name || '匿名'}</span>
          </div>
          <div className="card-likes">
            <span className="heart">♥</span>
            <span>{work.likes.length}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
