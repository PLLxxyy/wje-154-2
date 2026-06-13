import React, { useState, useEffect, useCallback } from 'react';
import type { CurrentUser, Work, Author, CompletionRecord } from './types';
import { seedIfNeeded } from './utils/seed';
import {
  getWorks, getAuthors, getCurrentUser, setCurrentUser, clearCurrentUser,
  updateWork, getAuthorById, updateAuthor,
  getCompletions, toggleCompletion, getCompletionsByUser,
} from './utils/storage';
import { Header } from './components/Header';
import { LoginModal } from './components/LoginModal';
import { Home } from './pages/Home';
import { WorkDetail } from './pages/WorkDetail';
import { PublishWork } from './pages/PublishWork';
import { Profile } from './pages/Profile';
import { Favorites } from './pages/Favorites';

const PLACEHOLDER_COLORS = [
  '#f4e1d2', '#d4e2d4', '#d2d4f4', '#f4d2e2',
  '#e2d4f4', '#d2f4e8', '#f4e8d2', '#d2e8f4',
];

function makeAvatar(seed: number, emoji: string): string {
  const color = PLACEHOLDER_COLORS[seed % PLACEHOLDER_COLORS.length];
  return `data:image/svg+xml,${encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100"><circle fill="${color}" cx="50" cy="50" r="50"/><text x="50%" y="50%" dominant-baseline="central" text-anchor="middle" font-size="40">${emoji}</text></svg>`
  )}`;
}

type Page = 'home' | 'detail' | 'publish' | 'profile' | 'favorites';

const App: React.FC = () => {
  const [page, setPage] = useState<Page>('home');
  const [selectedWorkId, setSelectedWorkId] = useState<string | null>(null);
  const [currentUser, setUser] = useState<CurrentUser | null>(null);
  const [works, setWorks] = useState<Work[]>([]);
  const [authors, setAuthors] = useState<Author[]>([]);
  const [completions, setCompletions] = useState<CompletionRecord[]>([]);
  const [showLogin, setShowLogin] = useState(false);

  const refreshData = useCallback(() => {
    setWorks([...getWorks()]);
    setAuthors([...getAuthors()]);
    setCompletions([...getCompletions()]);
  }, []);

  useEffect(() => {
    seedIfNeeded();
    refreshData();
    const user = getCurrentUser();
    if (user) setUser(user);
  }, [refreshData]);

  const navigate = useCallback((p: string, data?: string) => {
    setPage(p as Page);
    if (p === 'detail' && data) {
      setSelectedWorkId(data);
    }
    window.scrollTo(0, 0);
  }, []);

  const handleOpenWork = useCallback((id: string) => {
    navigate('detail', id);
  }, [navigate]);

  const handleLogin = useCallback((name: string) => {
    const id = 'u_' + Date.now();
    const emojis = ['😊', '🤗', '😄', '😎', '🤓', '🧑‍🎨', '🧑‍🍳', '🧑‍🔧'];
    const emoji = emojis[Math.floor(Math.random() * emojis.length)];
    const avatar = makeAvatar(Math.floor(Math.random() * 100), emoji);
    const user: CurrentUser = { id, name, avatar };
    setCurrentUser(user);
    setUser(user);

    // Register as author if not existing
    const existingAuthors = getAuthors();
    if (!existingAuthors.find((a) => a.id === id)) {
      const newAuthor: Author = {
        id,
        name,
        avatar,
        bio: '手工爱好者',
        workCount: 0,
        followers: [],
      };
      existingAuthors.push(newAuthor);
      localStorage.setItem('craft_authors', JSON.stringify(existingAuthors));
    }

    setShowLogin(false);
    refreshData();
  }, [refreshData]);

  const handleLogout = useCallback(() => {
    clearCurrentUser();
    setUser(null);
    setPage('home');
  }, []);

  const handleToggleLike = useCallback((workId: string) => {
    if (!currentUser) { setShowLogin(true); return; }
    const w = getWorks().find((x) => x.id === workId);
    if (!w) return;
    const idx = w.likes.indexOf(currentUser.id);
    if (idx >= 0) {
      w.likes.splice(idx, 1);
    } else {
      w.likes.push(currentUser.id);
    }
    updateWork(w);
    refreshData();
  }, [currentUser, refreshData]);

  const handleToggleFavorite = useCallback((workId: string) => {
    if (!currentUser) { setShowLogin(true); return; }
    const w = getWorks().find((x) => x.id === workId);
    if (!w) return;
    const idx = w.favorites.indexOf(currentUser.id);
    if (idx >= 0) {
      w.favorites.splice(idx, 1);
    } else {
      w.favorites.push(currentUser.id);
    }
    updateWork(w);
    refreshData();
  }, [currentUser, refreshData]);

  const handleToggleComplete = useCallback((workId: string) => {
    if (!currentUser) { setShowLogin(true); return; }
    toggleCompletion(workId, currentUser.id);
    refreshData();
  }, [currentUser, refreshData]);

  const getCompletionByWorkAndUser = useCallback((workId: string, userId: string) => {
    return completions.find((c) => c.workId === workId && c.userId === userId);
  }, [completions]);

  const isWorkCompletedByUser = useCallback((workId: string, userId: string) => {
    return completions.some((c) => c.workId === workId && c.userId === userId);
  }, [completions]);

  const completedWorkIds = currentUser
    ? completions.filter((c) => c.userId === currentUser.id).map((c) => c.workId)
    : [];

  const handleFollow = useCallback((authorId: string) => {
    if (!currentUser) { setShowLogin(true); return; }
    const author = getAuthorById(authorId);
    if (!author) return;
    const idx = author.followers.indexOf(currentUser.id);
    if (idx >= 0) {
      author.followers.splice(idx, 1);
    } else {
      author.followers.push(currentUser.id);
    }
    updateAuthor(author);
    refreshData();
  }, [currentUser, refreshData]);

  const handleAddComment = useCallback((workId: string, text: string) => {
    if (!currentUser) return;
    const w = getWorks().find((x) => x.id === workId);
    if (!w) return;
    w.comments.push({
      id: 'c_' + Date.now(),
      userId: currentUser.id,
      userName: currentUser.name,
      userAvatar: currentUser.avatar,
      text,
      createdAt: Date.now(),
    });
    updateWork(w);
    refreshData();
  }, [currentUser, refreshData]);

  const handleTogglePublish = useCallback((workId: string) => {
    const w = getWorks().find((x) => x.id === workId);
    if (!w) return;
    w.published = !w.published;
    updateWork(w);
    refreshData();
  }, [refreshData]);

  const renderPage = () => {
    switch (page) {
      case 'home':
        return (
          <Home
            works={works}
            authors={authors}
            currentUser={currentUser}
            completedWorkIds={completedWorkIds}
            onOpenWork={handleOpenWork}
          />
        );
      case 'detail': {
        const w = works.find((x) => x.id === selectedWorkId);
        if (!w) return <div className="empty-state"><p>作品不存在</p></div>;
        const author = authors.find((a) => a.id === w.authorId);
        const completed = currentUser ? isWorkCompletedByUser(w.id, currentUser.id) : false;
        const completionRec = currentUser ? getCompletionByWorkAndUser(w.id, currentUser.id) : undefined;
        return (
          <WorkDetail
            work={w}
            author={author}
            currentUser={currentUser}
            isCompleted={completed}
            completionRecord={completionRec}
            onBack={() => navigate('home')}
            onToggleLike={handleToggleLike}
            onToggleFavorite={handleToggleFavorite}
            onToggleComplete={handleToggleComplete}
            onFollow={handleFollow}
            onAddComment={handleAddComment}
          />
        );
      }
      case 'publish':
        if (!currentUser) { setPage('home'); return null; }
        return (
          <PublishWork
            currentUserId={currentUser.id}
            currentUserName={currentUser.name}
            currentUserAvatar={currentUser.avatar}
            onNavigate={(p) => navigate(p)}
            onRefresh={refreshData}
          />
        );
      case 'profile':
        if (!currentUser) { setPage('home'); return null; }
        return (
          <Profile
            works={works}
            authors={authors}
            currentUser={currentUser}
            completions={completions}
            completedWorkIds={completedWorkIds}
            onOpenWork={handleOpenWork}
            onTogglePublish={handleTogglePublish}
            onNavigate={(p) => navigate(p)}
          />
        );
      case 'favorites':
        if (!currentUser) { setPage('home'); return null; }
        return (
          <Favorites
            works={works}
            authors={authors}
            currentUser={currentUser}
            completedWorkIds={completedWorkIds}
            onOpenWork={handleOpenWork}
          />
        );
      default:
        return null;
    }
  };

  return (
    <>
      <Header
        currentPage={page}
        onNavigate={(p) => navigate(p)}
        currentUser={currentUser}
        onLogin={() => setShowLogin(true)}
        onLogout={handleLogout}
      />
      <main className="main-content">
        {renderPage()}
      </main>
      <LoginModal
        visible={showLogin}
        onConfirm={handleLogin}
        onCancel={() => setShowLogin(false)}
      />
    </>
  );
};

export default App;
