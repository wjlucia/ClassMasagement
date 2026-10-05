import React from 'react';
import { useApp } from '../context/AppContext';
import { UserCheck, X } from 'lucide-react';

export const StudentProfileModal = ({ isOpen, onClose }) => {
  const { students, setSelectedStudentId, selectedStudentId } = useApp();

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" style={{ maxWidth: '750px' }} onClick={e => e.stopPropagation()}>
        
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
          <div>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#fff' }}>
              👤 내 이름 선택하기 (25명)
            </h2>
            <p style={{ fontSize: '0.825rem', color: 'var(--text-muted)' }}>
              본인의 프로필을 선택하면 해당 학생의 잔액, 레벨, 1인 1역 화면으로 이동합니다.
            </p>
          </div>
          <button className="btn btn-secondary btn-sm" onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(130px, 1fr))',
          gap: '0.75rem',
          maxHeight: '480px',
          overflowY: 'auto',
          paddingRight: '0.25rem'
        }}>
          {students.map(student => {
            const isSelected = student.id === selectedStudentId;
            return (
              <div
                key={student.id}
                onClick={() => {
                  setSelectedStudentId(student.id);
                  onClose();
                }}
                className="glass-card"
                style={{
                  textAlign: 'center',
                  cursor: 'pointer',
                  padding: '1rem 0.5rem',
                  borderColor: isSelected ? 'var(--primary)' : 'rgba(255, 255, 255, 0.1)',
                  background: isSelected ? 'rgba(99, 102, 241, 0.25)' : 'rgba(30, 41, 59, 0.4)',
                  position: 'relative'
                }}
              >
                {isSelected && (
                  <div style={{ position: 'absolute', top: '6px', right: '6px' }}>
                    <UserCheck size={14} color="#6366f1" />
                  </div>
                )}
                <div style={{ fontSize: '2rem', marginBottom: '0.25rem' }}>
                  {student.avatar || '👤'}
                </div>
                <div style={{ fontWeight: 700, fontSize: '0.95rem', color: '#fff' }}>
                  {student.name}
                </div>
                <div style={{ display: 'flex', justifyContent: 'center', gap: '0.25rem', marginTop: '0.35rem', flexWrap: 'wrap' }}>
                  <span className="badge badge-purple" style={{ fontSize: '0.65rem' }}>
                    Lv.{student.level}
                  </span>
                  <span className="badge badge-amber" style={{ fontSize: '0.65rem' }}>
                    💰 {student.balance}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </div>
  );
};
