import React from 'react';
import { useApp } from '../context/AppContext';
import { CheckCircle2, Circle, ShoppingBag, Ticket, Coins, Zap, Clock } from 'lucide-react';

export const StudentMain = ({ onOpenShop }) => {
  const { currentStudent, toggleRoleCompletion, coupons, useCoupon, history } = useApp();

  if (!currentStudent) return null;

  // Level XP calculations (e.g. Level N requires (N-1)*100 XP, next level is N*100 XP)
  const currentLevel = currentStudent.level;
  const currentXp = currentStudent.xp;
  const xpInCurrentLevel = currentXp % 100;
  const nextLevelXp = 100;

  // Student's coupons
  const myCoupons = coupons.filter(c => c.studentId === currentStudent.id);
  const unusedCoupons = myCoupons.filter(c => c.status === 'unused');
  const usedCoupons = myCoupons.filter(c => c.status === 'used');

  // Student's recent history
  const myHistory = history.filter(h => h.studentName === currentStudent.name).slice(0, 5);

  return (
    <div style={{ padding: '0 1rem 2rem 1rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      
      {/* 1. Profile Hero Section */}
      <div className="glass-panel" style={{
        padding: '1.75rem',
        background: 'linear-gradient(135deg, rgba(30, 41, 59, 0.8) 0%, rgba(49, 46, 129, 0.6) 100%)',
        position: 'relative',
        overflow: 'hidden'
      }}>
        {/* Background Decorative Glow */}
        <div style={{
          position: 'absolute',
          top: '-50px',
          right: '-50px',
          width: '200px',
          height: '200px',
          background: 'radial-gradient(circle, rgba(99, 102, 241, 0.25) 0%, transparent 70%)',
          borderRadius: '50%',
          pointerEvents: 'none'
        }} />

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1.5rem' }}>
          
          {/* Avatar & Name */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
            <div style={{
              fontSize: '3.5rem',
              width: '80px',
              height: '80px',
              borderRadius: '24px',
              background: 'rgba(255, 255, 255, 0.1)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              border: '2px solid rgba(255, 255, 255, 0.15)',
              boxShadow: 'var(--shadow-glow)'
            }}>
              {currentStudent.avatar || '👤'}
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
                <h2 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#fff' }}>
                  {currentStudent.name}
                </h2>
                <span className="badge badge-purple" style={{ fontSize: '0.85rem', padding: '0.3rem 0.75rem' }}>
                  <Zap size={14} /> Level {currentLevel}
                </span>
              </div>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>
                오늘도 신나는 학급 경제 활동을 시작해봐요! 🚀
              </p>
            </div>
          </div>

          {/* Balance Widget */}
          <div style={{
            background: 'rgba(15, 23, 42, 0.6)',
            padding: '1rem 1.5rem',
            borderRadius: 'var(--radius-md)',
            border: '1px solid var(--border-glow)',
            textAlign: 'right',
            minWidth: '180px'
          }}>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '0.35rem' }}>
              <Coins size={14} color="#f59e0b" /> 내 보유 학급 화폐
            </div>
            <div style={{ fontSize: '2rem', fontWeight: 900, color: '#fbbf24', letterSpacing: '-0.02em' }}>
              💰 {currentStudent.balance.toLocaleString()} <span style={{ fontSize: '1rem', fontWeight: 600 }}>미소</span>
            </div>
          </div>

        </div>

        {/* Level XP Progress Bar */}
        <div style={{ marginTop: '1.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', marginBottom: '0.4rem' }}>
            <span style={{ color: 'var(--text-muted)' }}>경험치 (XP) 진행률</span>
            <span style={{ fontWeight: 700, color: '#c084fc' }}>
              {xpInCurrentLevel} / {nextLevelXp} XP (총 {currentXp} XP)
            </span>
          </div>
          <div className="xp-progress-bar">
            <div className="xp-progress-fill" style={{ width: `${(xpInCurrentLevel / nextLevelXp) * 100}%` }} />
          </div>
        </div>

      </div>

      {/* 2. Main Content Grid (1인 1역 오늘 할 일 + 내 쿠폰함) */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.25rem' }}>
        
        {/* Today's Role / Task Card */}
        <div className="glass-panel" style={{ padding: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span style={{ fontSize: '1.5rem' }}>📌</span>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 800 }}>오늘의 1인 1역</h3>
            </div>
            <span className={`badge ${currentStudent.roleCompletedToday ? 'badge-emerald' : 'badge-amber'}`}>
              {currentStudent.roleCompletedToday ? '수행 완료 🎉' : '진행 중'}
            </span>
          </div>

          <div className="glass-card" style={{ marginBottom: '1.25rem', background: currentStudent.roleCompletedToday ? 'rgba(16, 185, 129, 0.12)' : 'rgba(30, 41, 59, 0.6)' }}>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.2rem' }}>나에게 배정된 역할</div>
            <div style={{ fontSize: '1.35rem', fontWeight: 800, color: '#fff', marginBottom: '0.5rem' }}>
              {currentStudent.role || '담당 역할 없음'}
            </div>
            <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', lineHeight: 1.4 }}>
              맡은 역할을 성실하게 수행하고 완수 버튼을 눌러주세요! 교사 확인 후 보너스 화폐가 추가로 지급됩니다.
            </p>
          </div>

          <button
            className={`btn ${currentStudent.roleCompletedToday ? 'btn-emerald' : 'btn-primary'}`}
            style={{ width: '100%', padding: '0.85rem', fontSize: '1rem' }}
            onClick={() => toggleRoleCompletion(currentStudent.id)}
          >
            {currentStudent.roleCompletedToday ? (
              <>
                <CheckCircle2 size={20} /> 오늘 역할 수행 완료됨 (클릭 시 취소)
              </>
            ) : (
              <>
                <Circle size={20} /> 오늘 역할 수행 완료하기! (+ 보상)
              </>
            )}
          </button>
        </div>

        {/* My Coupons Section */}
        <div className="glass-panel" style={{ padding: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Ticket size={22} color="#f59e0b" />
              <h3 style={{ fontSize: '1.15rem', fontWeight: 800 }}>내 쿠폰함</h3>
            </div>
            <button className="btn btn-secondary btn-sm" onClick={onOpenShop}>
              <ShoppingBag size={14} /> 상점 이동
            </button>
          </div>

          {unusedCoupons.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '2rem 1rem', color: 'var(--text-muted)' }}>
              <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>🎟️</div>
              <p style={{ fontSize: '0.9rem' }}>보유 중인 미사용 쿠폰이 없습니다.</p>
              <p style={{ fontSize: '0.8rem', marginTop: '0.2rem' }}>상점에서 화폐로 원하는 쿠폰을 구매해보세요!</p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', maxHeight: '250px', overflowY: 'auto' }}>
              {unusedCoupons.map(coupon => (
                <div key={coupon.id} className="glass-card" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.85rem 1rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <span style={{ fontSize: '1.5rem' }}>{coupon.icon}</span>
                    <div>
                      <div style={{ fontWeight: 700, fontSize: '0.925rem', color: '#fff' }}>{coupon.title}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>구매일: {coupon.purchasedAt}</div>
                    </div>
                  </div>
                  <button
                    className="btn btn-amber btn-sm"
                    onClick={() => {
                      if (window.confirm(`[${coupon.title}] 쿠폰을 사용하시겠습니까?\n선생님에게 화면을 확인시켜 주세요!`)) {
                        useCoupon(coupon.id);
                      }
                    }}
                  >
                    선생님께 보여주고 사용
                  </button>
                </div>
              ))}
            </div>
          )}

          {usedCoupons.length > 0 && (
            <div style={{ marginTop: '1rem', paddingTop: '0.75rem', borderTop: '1px dashed var(--border-color)', fontSize: '0.775rem', color: 'var(--text-muted)' }}>
              ✔ 사용 완료된 쿠폰: {usedCoupons.length}개
            </div>
          )}

        </div>

      </div>

      {/* 3. Recent Activity History Timeline */}
      <div className="glass-panel" style={{ padding: '1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
          <Clock size={20} color="#6366f1" />
          <h3 style={{ fontSize: '1.1rem', fontWeight: 800 }}>최근 나의 활동 & 화폐 내역</h3>
        </div>

        {myHistory.length === 0 ? (
          <div style={{ fontSize: '0.875rem', color: 'var(--text-muted)', textAlign: 'center', padding: '1rem' }}>
            아직 기록된 화폐 활동 내역이 없습니다.
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            {myHistory.map(item => (
              <div key={item.id} style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '0.65rem 0.85rem',
                borderRadius: 'var(--radius-sm)',
                background: 'rgba(255, 255, 255, 0.04)'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <span className={`badge ${item.type === 'EARN' ? 'badge-emerald' : 'badge-amber'}`} style={{ fontSize: '0.7rem' }}>
                    {item.type === 'EARN' ? '+ 획득' : '- 사용'}
                  </span>
                  <div>
                    <div style={{ fontSize: '0.875rem', fontWeight: 600 }}>{item.description}</div>
                    <div style={{ fontSize: '0.725rem', color: 'var(--text-muted)' }}>{item.timestamp}</div>
                  </div>
                </div>
                <div style={{
                  fontWeight: 800,
                  fontSize: '0.95rem',
                  color: item.type === 'EARN' ? '#34d399' : '#fbbf24'
                }}>
                  {item.type === 'EARN' ? `+${item.amount}` : `-${item.amount}`} 미소
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
};
