import React, { useState } from 'react';

interface Props {
  visible: boolean;
  onConfirm: (name: string) => void;
  onCancel: () => void;
}

export const LoginModal: React.FC<Props> = ({ visible, onConfirm, onCancel }) => {
  const [name, setName] = useState('');

  if (!visible) return null;

  return (
    <div className="modal-overlay" onClick={onCancel}>
      <div className="modal-box" onClick={(e) => e.stopPropagation()}>
        <h3>欢迎来到手工作坊</h3>
        <input
          type="text"
          placeholder="输入你的昵称"
          value={name}
          onChange={(e) => setName(e.target.value)}
          onKeyDown={(e) => { if (e.key === 'Enter' && name.trim()) onConfirm(name.trim()); }}
          autoFocus
        />
        <div className="modal-actions">
          <button className="btn-cancel" onClick={onCancel}>取消</button>
          <button
            className="btn-confirm"
            onClick={() => { if (name.trim()) onConfirm(name.trim()); }}
            style={{ opacity: name.trim() ? 1 : 0.5 }}
          >
            确认登录
          </button>
        </div>
      </div>
    </div>
  );
};
