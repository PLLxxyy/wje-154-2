import React from 'react';

interface Props {
  currentPage: string;
  onNavigate: (page: string) => void;
  currentUser: { id: string; name: string; avatar: string } | null;
  onLogin: () => void;
  onLogout: () => void;
}

export const Header: React.FC<Props> = ({ currentPage, onNavigate, currentUser, onLogin, onLogout }) => {
  return (
    <header className="site-header">
      <div className="header-inner">
        <div className="logo" onClick={() => onNavigate('home')} style={{ cursor: 'pointer' }}>
          <span>手</span>工作坊
        </div>
        <nav className="header-nav">
          <a href="#" onClick={(e) => { e.preventDefault(); onNavigate('home'); }} style={currentPage === 'home' ? { color: '#b8860b', fontWeight: 600 } : {}}>
            发现
          </a>
          {currentUser ? (
            <>
              <button className="btn-publish" onClick={() => onNavigate('publish')}>
                发布作品
              </button>
              <a href="#" onClick={(e) => { e.preventDefault(); onNavigate('favorites'); }} style={currentPage === 'favorites' ? { color: '#b8860b', fontWeight: 600 } : {}}>
                收藏
              </a>
              <a href="#" onClick={(e) => { e.preventDefault(); onNavigate('profile'); }}>
                <img src={currentUser.avatar} alt="" className="user-avatar-small" title={currentUser.name} />
              </a>
              <button onClick={onLogout} style={{ fontSize: 12, color: '#999' }}>退出</button>
            </>
          ) : (
            <button onClick={onLogin} style={{ fontSize: 14, color: '#b8860b', fontWeight: 500 }}>
              登录
            </button>
          )}
        </nav>
      </div>
    </header>
  );
};
