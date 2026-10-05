import React from 'react';
import { useApp } from '../context/AppContext';
import { ShieldCheck, User, Sparkles, RefreshCw, ShoppingBag, Award } from 'lucide-react';

export const Header = ({ onOpenStudentSelect, onOpenShop, onOpenHistory }) => {
  const { mode, setMode, currentStudent, resetAllData } = useApp();

  return (
    <header className="glass-panel" style={{ margin: '1rem', padding: '1rem 1.5rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
        
        {/* Brand & Logo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div style={{
            width: '42px',
            height: '42px',
            borderRadius: '12px',
            background: 'var(--primary-gradient)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 0 16px rgba(99, 102, 241, 0.5)'
          }}>
            <Sparkles size={24} color="#fff" />
          </div>
          <div>
            <h1 style={{ fontSize: '1.25rem', fontWeight: 800, background: 'linear-gradient(90deg, #fff, #cbd5e1)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              드림클래스 6학년
            </h1>
            <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
              학급 경제 & 게이미피케이션 관리
            </p>
          </div>
        </div>

        {/* Global Controls & Actions */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
          
          {/* Quick Shop & History buttons */}
          <button className="btn btn-secondary btn-sm" onClick={onOpenShop}>
            <ShoppingBag size={16} /> 학급 상점
          </button>
          
          <button className="btn btn-secondary btn-sm" onClick={onOpenHistory}>
            <Award size={16} /> 내역 로그
          </button>

          {/* Mode Switcher */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            background: 'rgba(15, 23, 42, 0.8)',
            padding: '4px',
            borderRadius: 'var(--radius-full)',
            border: '1px solid var(--border-color)'
          }}>
            <button
              className={`btn btn-sm ${mode === 'student' ? 'btn-primary' : 'btn-secondary'}`}
              style={{ borderRadius: 'var(--radius-full)', border: 'none' }}
              onClick={() => setMode('student')}
            >
              <User size={15} /> 학생 모드
            </button>
            <button
              className={`btn btn-sm ${mode === 'teacher' ? 'btn-primary' : 'btn-secondary'}`}
              style={{ borderRadius: 'var(--radius-full)', border: 'none' }}
              onClick={() => setMode('teacher')}
            >
              <ShieldCheck size={15} /> 교사 모드
            </button>
          </div>

          {/* Current Student Profile Button (Only in Student Mode) */}
          {mode === 'student' && (
            <button
              className="btn btn-amber btn-sm"
              onClick={onOpenStudentSelect}
              title="다른 학생 프로필 선택"
            >
              <span style={{ fontSize: '1.1rem' }}>{currentStudent?.avatar || '👤'}</span>
              <span>{currentStudent?.name}</span>
              <span className="badge badge-purple" style={{ fontSize: '0.7rem' }}>Lv.{currentStudent?.level}</span>
            </button>
          )}

          {/* Teacher Badge */}
          {mode === 'teacher' && (
            <span className="badge badge-amber" style={{ padding: '0.4rem 0.8rem', fontSize: '0.825rem' }}>
              👑 담임교사 권한
            </span>
          )}

          {/* Dev Reset */}
          <button
            onClick={resetAllData}
            style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: '4px' }}
            title="데이터 리셋"
          >
            <RefreshCw size={14} />
          </button>

        </div>

      </div>
    </header>
  );
};
