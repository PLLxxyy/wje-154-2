import React, { useState } from 'react';
import type { Work, Author, CurrentUser } from '../types';
import { WorkCard } from '../components/WorkCard';

interface Props {
  works: Work[];
  authors: Author[];
  currentUser: CurrentUser;
  onOpenWork: (id: string) => void;
  onTogglePublish: (workId: string) => void;
  onNavigate: (page: string) => void;
}

export const Profile: React.FC<Props> = ({ works, authors, currentUser, onOpenWork, onTogglePublish, onNavigate }) => {
  const [tab, setTab] = useState<'works' | 'favorites'>('works');

  const myWorks = works.filter((w) => w.authorId === currentUser.id);
  const favWorks = works.filter((w) => w.favorites.includes(currentUser.id));
  const displayWorks = tab === 'works' ? myWorks : favWorks;

  const currentAuthor = authors.find((a) => a.id === currentUser.id);

  return (
    <div>
      <div className="profile-header">
        <img className="profile-avatar" src={currentUser.avatar} alt={currentUser.name} />
        <div className="profile-info">
          <h2>{currentUser.name}</h2>
          <p className="bio">{currentAuthor?.bio || '这个人很懒，什么都没写'}</p>
          <div className="profile-stats">
            <span><strong>{myWorks.length}</strong> 作品</span>
            <span><strong>{currentAuthor?.followers.length || 0}</strong> 关注者</span>
          </div>
        </div>
      </div>

      <div className="tabs">
        <button className={`tab-btn ${tab === 'works' ? 'active' : ''}`} onClick={() => setTab('works')}>
          我的作品
        </button>
        <button className={`tab-btn ${tab === 'favorites' ? 'active' : ''}`} onClick={() => setTab('favorites')}>
          我的收藏
        </button>
      </div>

      {displayWorks.length === 0 ? (
        <div className="empty-state">
          <div className="icon">{tab === 'works' ? '📦' : '⭐'}</div>
          <p>{tab === 'works' ? '还没有发布作品' : '还没有收藏作品'}</p>
          {tab === 'works' && (
            <button
              style={{ marginTop: 12, padding: '8px 24px', background: '#b8860b', color: '#fff', borderRadius: 20, fontSize: 14 }}
              onClick={() => onNavigate('publish')}
            >
              去发布
            </button>
          )}
        </div>
      ) : tab === 'works' ? (
        <div>
          {myWorks.map((w) => (
            <div key={w.id} className="work-manage-card">
              <img src={w.cover} alt={w.title} />
              <div className="work-manage-info">
                <h4>{w.title}</h4>
                <p>{w.category} | {w.difficulty} | {w.likes.length} 赞 | {w.comments.length} 评论</p>
                <p style={{ fontSize: 11, color: w.published ? '#388e3c' : '#e74c3c', marginTop: 2 }}>
                  {w.published ? '已上架' : '已下架'}
                </p>
              </div>
              <div className="work-manage-actions">
                <button className="btn-manage" onClick={() => onOpenWork(w.id)}>查看</button>
                <button className="btn-manage" onClick={() => onTogglePublish(w.id)}>
                  {w.published ? '下架' : '上架'}
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="waterfall">
          {favWorks.map((w) => {
            const author = authors.find((a) => a.id === w.authorId);
            return <WorkCard key={w.id} work={w} author={author} onClick={onOpenWork} />;
          })}
        </div>
      )}
    </div>
  );
};
