import React from 'react';
import type { Work, Author, CurrentUser } from '../types';
import { WorkCard } from '../components/WorkCard';

interface Props {
  works: Work[];
  authors: Author[];
  currentUser: CurrentUser;
  completedWorkIds: string[];
  onOpenWork: (id: string) => void;
}

export const Favorites: React.FC<Props> = ({ works, authors, currentUser, completedWorkIds, onOpenWork }) => {
  const favWorks = works.filter((w) => w.favorites.includes(currentUser.id));
  const getAuthor = (id: string): Author | undefined => authors.find((a) => a.id === id);

  return (
    <div>
      <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 20 }}>我的收藏</h2>
      {favWorks.length > 0 ? (
        <div className="waterfall">
          {favWorks.map((w) => (
            <WorkCard
              key={w.id}
              work={w}
              author={getAuthor(w.authorId)}
              isCompleted={completedWorkIds.includes(w.id)}
              onClick={onOpenWork}
            />
          ))}
        </div>
      ) : (
        <div className="empty-state">
          <div className="icon">⭐</div>
          <p>还没有收藏作品</p>
          <p style={{ fontSize: 13, color: '#ccc', marginTop: 4 }}>浏览作品时点击收藏按钮即可</p>
        </div>
      )}
    </div>
  );
};
