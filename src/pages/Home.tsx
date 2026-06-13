import React, { useState, useMemo } from 'react';
import type { Category, Work, Author } from '../types';
import { WorkCard } from '../components/WorkCard';

const CATEGORIES: Category[] = ['烘焙', '编织', '木工', '陶艺', '皮具', '花艺'];

interface Props {
  works: Work[];
  authors: Author[];
  onOpenWork: (id: string) => void;
}

export const Home: React.FC<Props> = ({ works, authors, onOpenWork }) => {
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState<Category | ''>('');
  const [sort, setSort] = useState<'newest' | 'hottest'>('newest');

  const filtered = useMemo(() => {
    let result = works.filter((w) => w.published);

    if (search.trim()) {
      const q = search.trim().toLowerCase();
      result = result.filter(
        (w) =>
          w.title.toLowerCase().includes(q) ||
          w.description.toLowerCase().includes(q) ||
          w.materials.some((m) => m.name.toLowerCase().includes(q))
      );
    }

    if (category) {
      result = result.filter((w) => w.category === category);
    }

    if (sort === 'newest') {
      result.sort((a, b) => b.createdAt - a.createdAt);
    } else {
      result.sort((a, b) => b.likes.length - a.likes.length);
    }

    return result;
  }, [works, search, category, sort]);

  const getAuthor = (id: string): Author | undefined => authors.find((a) => a.id === id);

  return (
    <div>
      <div className="filter-bar">
        <div className="search-row">
          <input
            className="search-input"
            type="text"
            placeholder="搜索作品标题或材料..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <button className="search-btn" onClick={() => {}}>搜索</button>
        </div>
        <div className="category-row">
          <span
            className={`category-chip ${category === '' ? 'active' : ''}`}
            onClick={() => setCategory('')}
          >
            全部
          </span>
          {CATEGORIES.map((c) => (
            <span
              key={c}
              className={`category-chip ${category === c ? 'active' : ''}`}
              onClick={() => setCategory(c)}
            >
              {c}
            </span>
          ))}
          <div className="sort-group">
            <button
              className={`sort-btn ${sort === 'newest' ? 'active' : ''}`}
              onClick={() => setSort('newest')}
            >
              最新
            </button>
            <button
              className={`sort-btn ${sort === 'hottest' ? 'active' : ''}`}
              onClick={() => setSort('hottest')}
            >
              最热
            </button>
          </div>
        </div>
      </div>

      {filtered.length > 0 ? (
        <div className="waterfall">
          {filtered.map((w) => (
            <WorkCard key={w.id} work={w} author={getAuthor(w.authorId)} onClick={onOpenWork} />
          ))}
        </div>
      ) : (
        <div className="empty-state">
          <div className="icon">🔍</div>
          <p>没有找到匹配的作品</p>
        </div>
      )}
    </div>
  );
};
