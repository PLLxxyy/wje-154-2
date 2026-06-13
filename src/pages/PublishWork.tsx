import React, { useState } from 'react';
import type { Category, Difficulty, TutorialStep, Material, Work } from '../types';
import { addWork, getAuthors } from '../utils/storage';

const CATEGORIES: Category[] = ['烘焙', '编织', '木工', '陶艺', '皮具', '花艺'];
const DIFFICULTIES: Difficulty[] = ['简单', '中等', '较难'];

const PLACEHOLDER_COLORS = [
  '#f4e1d2', '#d4e2d4', '#d2d4f4', '#f4d2e2',
  '#e2d4f4', '#d2f4e8', '#f4e8d2', '#d2e8f4',
];

function makePlaceholder(seed: number, w: number, h: number, emoji: string): string {
  const color = PLACEHOLDER_COLORS[seed % PLACEHOLDER_COLORS.length];
  return `data:image/svg+xml,${encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}"><rect fill="${color}" width="${w}" height="${h}"/><text x="50%" y="50%" dominant-baseline="central" text-anchor="middle" font-size="${Math.min(w, h) * 0.3}">${emoji}</text></svg>`
  )}`;
}

interface Props {
  currentUserId: string;
  currentUserName: string;
  currentUserAvatar: string;
  onNavigate: (page: string) => void;
  onRefresh: () => void;
}

interface StepDraft {
  text: string;
  emoji: string;
}

export const PublishWork: React.FC<Props> = ({
  currentUserId, currentUserName, currentUserAvatar, onNavigate, onRefresh,
}) => {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<Category>('烘焙');
  const [difficulty, setDifficulty] = useState<Difficulty>('简单');
  const [description, setDescription] = useState('');
  const [steps, setSteps] = useState<StepDraft[]>([{ text: '', emoji: '📸' }]);
  const [materials, setMaterials] = useState<{ name: string; amount: string }[]>([{ name: '', amount: '' }]);
  const [tips, setTips] = useState('');

  const EMOJIS = ['📸', '🎨', '✂️', '🔧', '✨', '🧵', '🖌️', '🔨', '📦', '🎀'];

  const addStep = () => {
    setSteps([...steps, { text: '', emoji: EMOJIS[steps.length % EMOJIS.length] }]);
  };

  const removeStep = (idx: number) => {
    if (steps.length <= 1) return;
    setSteps(steps.filter((_, i) => i !== idx));
  };

  const updateStep = (idx: number, field: keyof StepDraft, value: string) => {
    const updated = [...steps];
    updated[idx] = { ...updated[idx], [field]: value };
    setSteps(updated);
  };

  const addMaterial = () => {
    setMaterials([...materials, { name: '', amount: '' }]);
  };

  const removeMaterial = (idx: number) => {
    if (materials.length <= 1) return;
    setMaterials(materials.filter((_, i) => i !== idx));
  };

  const updateMaterial = (idx: number, field: 'name' | 'amount', value: string) => {
    const updated = [...materials];
    updated[idx] = { ...updated[idx], [field]: value };
    setMaterials(updated);
  };

  const handleSubmit = () => {
    if (!title.trim()) { alert('请输入标题'); return; }
    if (!description.trim()) { alert('请输入描述'); return; }
    const validSteps = steps.filter((s) => s.text.trim());
    if (validSteps.length === 0) { alert('至少添加一个步骤'); return; }
    const validMaterials = materials.filter((m) => m.name.trim());

    const categoryEmojis: Record<Category, string> = {
      '烘焙': '🍰', '编织': '🧶', '木工': '🪵', '陶艺': '🏺', '皮具': '👜', '花艺': '🌸',
    };
    const rnd = Math.floor(Math.random() * 1000);

    const tutorialSteps: TutorialStep[] = validSteps.map((s, i) => ({
      image: makePlaceholder(rnd + i, 600, 400, s.emoji),
      text: s.text,
    }));

    const work: Work = {
      id: 'w_' + Date.now() + '_' + Math.random().toString(36).slice(2, 6),
      title: title.trim(),
      category,
      difficulty,
      cover: makePlaceholder(rnd, 400, 450, categoryEmojis[category]),
      authorId: currentUserId,
      description: description.trim(),
      steps: tutorialSteps,
      materials: validMaterials.map((m) => ({ name: m.name.trim(), amount: m.amount.trim() })),
      tips: tips.trim(),
      likes: [],
      favorites: [],
      comments: [],
      createdAt: Date.now(),
      published: true,
    };

    // Update author work count
    const authors = getAuthors();
    const authorIdx = authors.findIndex((a) => a.id === currentUserId);
    if (authorIdx !== -1) {
      authors[authorIdx].workCount += 1;
      localStorage.setItem('craft_authors', JSON.stringify(authors));
    }

    addWork(work);
    onRefresh();
    onNavigate('profile');
  };

  return (
    <div className="publish-page">
      <div className="back-link" onClick={() => onNavigate('home')}>← 返回首页</div>
      <h2>发布作品</h2>

      <div className="form-section">
        <h3>基本信息</h3>
        <div className="form-group">
          <label>作品标题</label>
          <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="给你的作品起个名字" />
        </div>
        <div className="form-group">
          <label>作品分类</label>
          <select value={category} onChange={(e) => setCategory(e.target.value as Category)}>
            {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
        <div className="form-group">
          <label>难度等级</label>
          <select value={difficulty} onChange={(e) => setDifficulty(e.target.value as Difficulty)}>
            {DIFFICULTIES.map((d) => <option key={d} value={d}>{d}</option>)}
          </select>
        </div>
        <div className="form-group">
          <label>作品描述</label>
          <textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="简要描述你的作品" />
        </div>
      </div>

      <div className="form-section">
        <h3>制作教程</h3>
        {steps.map((step, idx) => (
          <div key={idx} className="step-editor">
            <div className="step-header">
              <span className="step-number">步骤 {idx + 1}</span>
              {steps.length > 1 && (
                <button className="btn-remove-step" onClick={() => removeStep(idx)}>删除</button>
              )}
            </div>
            <div className="form-group">
              <label>步骤配图图标</label>
              <select value={step.emoji} onChange={(e) => updateStep(idx, 'emoji', e.target.value)}>
                {EMOJIS.map((em) => <option key={em} value={em}>{em}</option>)}
              </select>
            </div>
            <div className="form-group">
              <label>步骤说明</label>
              <textarea
                value={step.text}
                onChange={(e) => updateStep(idx, 'text', e.target.value)}
                placeholder={`描述第 ${idx + 1} 步的操作`}
              />
            </div>
          </div>
        ))}
        <button className="btn-add-step" onClick={addStep}>+ 添加步骤</button>
      </div>

      <div className="form-section">
        <h3>材料清单</h3>
        {materials.map((mat, idx) => (
          <div key={idx} style={{ display: 'flex', gap: 10, marginBottom: 10 }}>
            <input
              type="text"
              value={mat.name}
              onChange={(e) => updateMaterial(idx, 'name', e.target.value)}
              placeholder="材料名称"
              style={{ flex: 2 }}
            />
            <input
              type="text"
              value={mat.amount}
              onChange={(e) => updateMaterial(idx, 'amount', e.target.value)}
              placeholder="用量"
              style={{ flex: 1 }}
            />
            {materials.length > 1 && (
              <button className="btn-remove-step" onClick={() => removeMaterial(idx)} style={{ alignSelf: 'center' }}>删除</button>
            )}
          </div>
        ))}
        <button className="btn-add-step" onClick={addMaterial}>+ 添加材料</button>
      </div>

      <div className="form-section tips-area">
        <h3>小贴士</h3>
        <div className="form-group">
          <textarea value={tips} onChange={(e) => setTips(e.target.value)} placeholder="分享一些小技巧或注意事项" />
        </div>
      </div>

      <button className="btn-submit-work" onClick={handleSubmit}>发布作品</button>
    </div>
  );
};
