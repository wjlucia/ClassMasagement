import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Users, Coins, CheckSquare, PlusCircle, MinusCircle, Search, Edit3, ShoppingBag, Gift } from 'lucide-react';

export const TeacherMain = ({ onOpenShop }) => {
  const { students, adjustCurrency, updateStudentRole, AVAILABLE_ROLES } = useApp();

  // Search & Filter state
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('ALL');

  // Modal State for Individual & Group Money adjustment
  const [selectedStudentForMoney, setSelectedStudentForMoney] = useState(null);
  const [moneyAmount, setMoneyAmount] = useState(50);
  const [moneyReason, setMoneyReason] = useState('1인 1역 완수 보상');
  const [isGroupModalOpen, setIsGroupModalOpen] = useState(false);

  // Edit Role Modal State
  const [editingRoleStudent, setEditingRoleStudent] = useState(null);
  const [newRole, setNewRole] = useState('');

  // Dashboard Stats Calculations
  const totalStudents = students.length;
  const totalCirculation = students.reduce((acc, s) => acc + s.balance, 0);
  const completedTodayCount = students.filter(s => s.roleCompletedToday).length;
  const completionRate = Math.round((completedTodayCount / totalStudents) * 100);

  // Filtered Students List
  const filteredStudents = students.filter(s => {
    const matchesSearch = s.name.includes(searchTerm) || (s.role && s.role.includes(searchTerm));
    const matchesRole = roleFilter === 'ALL' || s.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  // Handle Money Give / Deduct Submit
  const handleSingleMoneySubmit = (isEarn) => {
    if (!selectedStudentForMoney) return;
    const finalAmount = isEarn ? Math.abs(Number(moneyAmount)) : -Math.abs(Number(moneyAmount));
    adjustCurrency(selectedStudentForMoney.id, finalAmount, moneyReason);
    setSelectedStudentForMoney(null);
  };

  const handleGroupMoneySubmit = () => {
    const amount = Number(moneyAmount);
    adjustCurrency(null, amount, moneyReason, true);
    setIsGroupModalOpen(false);
  };

  // Handle Role Submit
  const handleRoleSubmit = () => {
    if (!editingRoleStudent || !newRole) return;
    updateStudentRole(editingRoleStudent.id, newRole);
    setEditingRoleStudent(null);
  };

  return (
    <div style={{ padding: '0 1rem 2rem 1rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      
      {/* 1. Teacher Dashboard Summary Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem' }}>
        
        <div className="glass-panel" style={{ padding: '1.25rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ padding: '0.85rem', background: 'rgba(99, 102, 241, 0.2)', borderRadius: 'var(--radius-md)' }}>
            <Users size={26} color="#818cf8" />
          </div>
          <div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>총 학생 인원</div>
            <div style={{ fontSize: '1.5rem', fontWeight: 900, color: '#fff' }}>{totalStudents}명</div>
          </div>
        </div>

        <div className="glass-panel" style={{ padding: '1.25rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ padding: '0.85rem', background: 'rgba(245, 158, 11, 0.2)', borderRadius: 'var(--radius-md)' }}>
            <Coins size={26} color="#fbbf24" />
          </div>
          <div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>학급 발행 화폐 총액</div>
            <div style={{ fontSize: '1.5rem', fontWeight: 900, color: '#fbbf24' }}>💰 {totalCirculation.toLocaleString()} 미소</div>
          </div>
        </div>

        <div className="glass-panel" style={{ padding: '1.25rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ padding: '0.85rem', background: 'rgba(16, 185, 129, 0.2)', borderRadius: 'var(--radius-md)' }}>
            <CheckSquare size={26} color="#34d399" />
          </div>
          <div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>오늘 1인 1역 완수율</div>
            <div style={{ fontSize: '1.5rem', fontWeight: 900, color: '#34d399' }}>
              {completedTodayCount}/{totalStudents}명 <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>({completionRate}%)</span>
            </div>
          </div>
        </div>

      </div>

      {/* 2. Controls & Actions Header */}
      <div className="glass-panel" style={{ padding: '1.25rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
          
          {/* Search Input */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flex: 1, minWidth: '260px' }}>
            <div style={{ position: 'relative', width: '100%' }}>
              <Search size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
              <input
                type="text"
                placeholder="학생 이름 또는 역할 검색..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.625rem 1rem 0.625rem 2.5rem',
                  background: 'rgba(15, 23, 42, 0.6)',
                  border: '1px solid var(--border-color)',
                  borderRadius: 'var(--radius-md)',
                  color: '#fff',
                  outline: 'none'
                }}
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
            <button
              className="btn btn-amber"
              onClick={() => {
                setMoneyAmount(50);
                setMoneyReason('전체 학생 활동 보상');
                setIsGroupModalOpen(true);
              }}
            >
              <Gift size={16} /> 전체 학생 일괄 화폐 지급
            </button>

            <button className="btn btn-primary" onClick={onOpenShop}>
              <ShoppingBag size={16} /> 상점 상품 관리
            </button>
          </div>

        </div>
      </div>

      {/* 3. Students List Grid */}
      <div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
          <h3 style={{ fontSize: '1.15rem', fontWeight: 800 }}>전체 학생 리스트 ({filteredStudents.length}명)</h3>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(290px, 1fr))',
          gap: '1rem'
        }}>
          {filteredStudents.map(student => (
            <div key={student.id} className="glass-card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              
              <div>
                {/* Header info */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                    <span style={{ fontSize: '2rem' }}>{student.avatar || '👤'}</span>
                    <div>
                      <div style={{ fontWeight: 800, fontSize: '1.1rem', color: '#fff' }}>{student.name}</div>
                      <span className="badge badge-purple" style={{ fontSize: '0.675rem' }}>Lv.{student.level} ({student.xp} XP)</span>
                    </div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: '1.1rem', fontWeight: 900, color: '#fbbf24' }}>
                      💰 {student.balance}
                    </div>
                    <span style={{ fontSize: '0.725rem', color: 'var(--text-muted)' }}>미소</span>
                  </div>
                </div>

                {/* Role Info */}
                <div style={{
                  padding: '0.6rem 0.85rem',
                  background: 'rgba(15, 23, 42, 0.5)',
                  borderRadius: 'var(--radius-sm)',
                  marginBottom: '1rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between'
                }}>
                  <div>
                    <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>1인 1역</div>
                    <div style={{ fontSize: '0.875rem', fontWeight: 700, color: '#e2e8f0' }}>{student.role}</div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <span className={`badge ${student.roleCompletedToday ? 'badge-emerald' : 'badge-amber'}`} style={{ fontSize: '0.675rem' }}>
                      {student.roleCompletedToday ? '완수' : '미완수'}
                    </span>
                    <button
                      onClick={() => {
                        setEditingRoleStudent(student);
                        setNewRole(student.role);
                      }}
                      style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}
                      title="역할 변경"
                    >
                      <Edit3 size={14} />
                    </button>
                  </div>
                </div>
              </div>

              {/* Actions: Give / Deduct Money */}
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <button
                  className="btn btn-emerald btn-sm"
                  style={{ flex: 1 }}
                  onClick={() => {
                    setSelectedStudentForMoney(student);
                    setMoneyAmount(50);
                    setMoneyReason('칭찬/활동 보상');
                  }}
                >
                  <PlusCircle size={15} /> 지급
                </button>
                <button
                  className="btn btn-danger btn-sm"
                  style={{ flex: 1 }}
                  onClick={() => {
                    setSelectedStudentForMoney(student);
                    setMoneyAmount(30);
                    setMoneyReason('벌금/규칙 위반 차감');
                  }}
                >
                  <MinusCircle size={15} /> 차감
                </button>
              </div>

            </div>
          ))}
        </div>
      </div>

      {/* MODAL: Single Student Money Adjustment */}
      {selectedStudentForMoney && (
        <div className="modal-overlay" onClick={() => setSelectedStudentForMoney(null)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '1rem' }}>
              💰 화폐 지급 / 차감 - {selectedStudentForMoney.name}
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '1.5rem' }}>
              <div>
                <label style={{ fontSize: '0.85rem', color: 'var(--text-muted)', display: 'block', marginBottom: '0.4rem' }}>
                  금액 (미소)
                </label>
                <input
                  type="number"
                  value={moneyAmount}
                  onChange={e => setMoneyAmount(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '0.65rem 1rem',
                    background: 'rgba(15, 23, 42, 0.8)',
                    border: '1px solid var(--border-color)',
                    borderRadius: 'var(--radius-sm)',
                    color: '#fff',
                    fontSize: '1rem'
                  }}
                />
              </div>

              <div>
                <label style={{ fontSize: '0.85rem', color: 'var(--text-muted)', display: 'block', marginBottom: '0.4rem' }}>
                  지급/차감 사유
                </label>
                <input
                  type="text"
                  value={moneyReason}
                  onChange={e => setMoneyReason(e.target.value)}
                  placeholder="예: 1인 1역 성실 이행, 칭찬 스티커 환산 등"
                  style={{
                    width: '100%',
                    padding: '0.65rem 1rem',
                    background: 'rgba(15, 23, 42, 0.8)',
                    border: '1px solid var(--border-color)',
                    borderRadius: 'var(--radius-sm)',
                    color: '#fff'
                  }}
                />
              </div>
            </div>

            <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end' }}>
              <button className="btn btn-secondary" onClick={() => setSelectedStudentForMoney(null)}>
                취소
              </button>
              <button className="btn btn-danger" onClick={() => handleSingleMoneySubmit(false)}>
                - 차감하기
              </button>
              <button className="btn btn-emerald" onClick={() => handleSingleMoneySubmit(true)}>
                + 지급하기 (+XP)
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: Group Money Adjustment */}
      {isGroupModalOpen && (
        <div className="modal-overlay" onClick={() => setIsGroupModalOpen(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '1rem' }}>
              🎁 전체 학생 25명 일괄 화폐 지급
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '1.5rem' }}>
              <div>
                <label style={{ fontSize: '0.85rem', color: 'var(--text-muted)', display: 'block', marginBottom: '0.4rem' }}>
                  학생 1인당 지급 금액 (미소)
                </label>
                <input
                  type="number"
                  value={moneyAmount}
                  onChange={e => setMoneyAmount(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '0.65rem 1rem',
                    background: 'rgba(15, 23, 42, 0.8)',
                    border: '1px solid var(--border-color)',
                    borderRadius: 'var(--radius-sm)',
                    color: '#fff',
                    fontSize: '1rem'
                  }}
                />
              </div>

              <div>
                <label style={{ fontSize: '0.85rem', color: 'var(--text-muted)', display: 'block', marginBottom: '0.4rem' }}>
                  지급 사유
                </label>
                <input
                  type="text"
                  value={moneyReason}
                  onChange={e => setMoneyReason(e.target.value)}
                  placeholder="예: 학급 청소 완수, 주간 보너스 등"
                  style={{
                    width: '100%',
                    padding: '0.65rem 1rem',
                    background: 'rgba(15, 23, 42, 0.8)',
                    border: '1px solid var(--border-color)',
                    borderRadius: 'var(--radius-sm)',
                    color: '#fff'
                  }}
                />
              </div>
            </div>

            <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end' }}>
              <button className="btn btn-secondary" onClick={() => setIsGroupModalOpen(false)}>
                취소
              </button>
              <button className="btn btn-amber" onClick={handleGroupMoneySubmit}>
                🎁 25명 모두에게 지급하기!
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: Edit Student Role */}
      {editingRoleStudent && (
        <div className="modal-overlay" onClick={() => setEditingRoleStudent(null)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '1rem' }}>
              ✏️ 1인 1역 역할 배정 - {editingRoleStudent.name}
            </h3>

            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{ fontSize: '0.85rem', color: 'var(--text-muted)', display: 'block', marginBottom: '0.4rem' }}>
                새 역할 선택
              </label>
              <select
                value={newRole}
                onChange={e => setNewRole(e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.75rem 1rem',
                  background: 'rgba(15, 23, 42, 0.9)',
                  border: '1px solid var(--border-color)',
                  borderRadius: 'var(--radius-sm)',
                  color: '#fff',
                  fontSize: '0.95rem'
                }}
              >
                {AVAILABLE_ROLES.map(role => (
                  <option key={role} value={role}>{role}</option>
                ))}
              </select>
            </div>

            <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end' }}>
              <button className="btn btn-secondary" onClick={() => setEditingRoleStudent(null)}>
                취소
              </button>
              <button className="btn btn-primary" onClick={handleRoleSubmit}>
                저장하기
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
