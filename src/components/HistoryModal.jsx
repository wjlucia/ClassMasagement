import React from 'react';
import { useApp } from '../context/AppContext';
import { X, History } from 'lucide-react';

export const HistoryModal = ({ isOpen, onClose }) => {
  const { history, mode, currentStudent } = useApp();

  if (!isOpen) return null;

  // Filter history based on mode
  const filteredHistory = mode === 'student'
    ? history.filter(h => h.studentName === currentStudent?.name || h.studentName === '전체 학생')
    : history;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" style={{ maxWidth: '650px' }} onClick={e => e.stopPropagation()}>
        
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
            <div style={{ padding: '0.5rem', background: 'rgba(99, 102, 241, 0.2)', borderRadius: 'var(--radius-sm)' }}>
              <History size={22} color="#818cf8" />
            </div>
            <div>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#fff' }}>
                📜 {mode === 'student' ? `${currentStudent?.name} 학생의 활동 내역` : '학급 전체 화폐 & 활동 로그'}
              </h2>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                화폐 지급, 차감, 쿠폰 구매 등 모든 거래 내역입니다.
              </p>
            </div>
          </div>
          <button className="btn btn-secondary btn-sm" onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        <div style={{ maxHeight: '420px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
          {filteredHistory.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)' }}>
              기록된 내역이 없습니다.
            </div>
          ) : (
            filteredHistory.map(item => (
              <div key={item.id} className="glass-card" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.75rem 1rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
                  <span className={`badge ${item.type === 'EARN' ? 'badge-emerald' : item.type === 'SPEND' ? 'badge-amber' : 'badge-purple'}`}>
                    {item.type === 'EARN' ? '+ 획득' : item.type === 'SPEND' ? '- 차감' : '🎟️ 쿠폰'}
                  </span>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: '0.9rem', color: '#fff' }}>
                      <span style={{ color: '#818cf8', marginRight: '0.35rem' }}>[{item.studentName}]</span>
                      {item.description}
                    </div>
                    <div style={{ fontSize: '0.725rem', color: 'var(--text-muted)' }}>{item.timestamp}</div>
                  </div>
                </div>

                <div style={{
                  fontWeight: 900,
                  fontSize: '1rem',
                  color: item.type === 'EARN' ? '#34d399' : '#fbbf24'
                }}>
                  {item.amount > 0 ? `+${item.amount}` : item.amount} 미소
                </div>
              </div>
            ))
          )}
        </div>

      </div>
    </div>
  );
};
