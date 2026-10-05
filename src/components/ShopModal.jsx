import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { X, Plus, Trash2, ShoppingBag } from 'lucide-react';

export const ShopModal = ({ isOpen, onClose }) => {
  const { shopItems, mode, currentStudent, buyShopItem, addShopItem, deleteShopItem } = useApp();

  // Teacher Add Item Form state
  const [isAddFormOpen, setIsAddFormOpen] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newPrice, setNewPrice] = useState(200);
  const [newDesc, setNewDesc] = useState('');
  const [newStock, setNewStock] = useState(10);
  const [newIcon, setNewIcon] = useState('🎁');

  if (!isOpen) return null;

  const handleBuy = (itemId) => {
    if (!currentStudent) return;
    const result = buyShopItem(currentStudent.id, itemId);
    alert(result.message);
  };

  const handleAddItemSubmit = (e) => {
    e.preventDefault();
    if (!newTitle || !newPrice) return;

    addShopItem({
      title: newTitle,
      price: Number(newPrice),
      description: newDesc,
      stock: Number(newStock),
      icon: newIcon
    });

    setIsAddFormOpen(false);
    setNewTitle('');
    setNewPrice(200);
    setNewDesc('');
    setNewStock(10);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" style={{ maxWidth: '800px' }} onClick={e => e.stopPropagation()}>
        
        {/* Modal Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
            <div style={{ padding: '0.5rem', background: 'rgba(245, 158, 11, 0.2)', borderRadius: 'var(--radius-sm)' }}>
              <ShoppingBag size={22} color="#fbbf24" />
            </div>
            <div>
              <h2 style={{ fontSize: '1.3rem', fontWeight: 800, color: '#fff' }}>학급 상점 & 쿠폰 마켓</h2>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                {mode === 'student' ? `현재 보유 화폐: 💰 ${currentStudent?.balance} 미소` : '담임교사 상품 등록 및 목록 관리 모드'}
              </p>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            {mode === 'teacher' && (
              <button className="btn btn-emerald btn-sm" onClick={() => setIsAddFormOpen(!isAddFormOpen)}>
                <Plus size={16} /> 상품 등록
              </button>
            )}
            <button className="btn btn-secondary btn-sm" onClick={onClose}>
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Teacher Add Item Form */}
        {mode === 'teacher' && isAddFormOpen && (
          <form onSubmit={handleAddItemSubmit} className="glass-card" style={{ marginBottom: '1.5rem', background: 'rgba(15, 23, 42, 0.8)' }}>
            <h4 style={{ fontWeight: 700, marginBottom: '1rem', color: '#fbbf24' }}>➕ 새 학급 상점 상품 등록</h4>
            
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '0.75rem', marginBottom: '1rem' }}>
              <div>
                <label style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>아이콘 (이모지)</label>
                <input
                  type="text"
                  value={newIcon}
                  onChange={e => setNewIcon(e.target.value)}
                  style={{ width: '100%', padding: '0.5rem', background: '#0f172a', border: '1px solid var(--border-color)', borderRadius: '6px', color: '#fff' }}
                />
              </div>

              <div>
                <label style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>상품/쿠폰명</label>
                <input
                  type="text"
                  placeholder="예: 5분 자유시간 쿠폰"
                  value={newTitle}
                  onChange={e => setNewTitle(e.target.value)}
                  required
                  style={{ width: '100%', padding: '0.5rem', background: '#0f172a', border: '1px solid var(--border-color)', borderRadius: '6px', color: '#fff' }}
                />
              </div>

              <div>
                <label style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>가격 (미소)</label>
                <input
                  type="number"
                  value={newPrice}
                  onChange={e => setNewPrice(e.target.value)}
                  required
                  style={{ width: '100%', padding: '0.5rem', background: '#0f172a', border: '1px solid var(--border-color)', borderRadius: '6px', color: '#fff' }}
                />
              </div>

              <div>
                <label style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>재고 수량</label>
                <input
                  type="number"
                  value={newStock}
                  onChange={e => setNewStock(e.target.value)}
                  required
                  style={{ width: '100%', padding: '0.5rem', background: '#0f172a', border: '1px solid var(--border-color)', borderRadius: '6px', color: '#fff' }}
                />
              </div>
            </div>

            <div style={{ marginBottom: '1rem' }}>
              <label style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>상품 설명</label>
              <input
                type="text"
                placeholder="쿠폰 사용 조건 및 관련 혜택 설명..."
                value={newDesc}
                onChange={e => setNewDesc(e.target.value)}
                style={{ width: '100%', padding: '0.5rem', background: '#0f172a', border: '1px solid var(--border-color)', borderRadius: '6px', color: '#fff' }}
              />
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem' }}>
              <button type="button" className="btn btn-secondary btn-sm" onClick={() => setIsAddFormOpen(false)}>취소</button>
              <button type="submit" className="btn btn-emerald btn-sm">상품 저장</button>
            </div>
          </form>
        )}

        {/* Shop Items Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(230px, 1fr))',
          gap: '1rem',
          maxHeight: '480px',
          overflowY: 'auto'
        }}>
          {shopItems.map(item => {
            const canAfford = currentStudent && currentStudent.balance >= item.price;
            const isOutOfStock = item.stock <= 0;

            return (
              <div key={item.id} className="glass-card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                    <span style={{ fontSize: '2rem' }}>{item.icon}</span>
                    <span className="badge badge-amber" style={{ fontSize: '0.8rem' }}>
                      💰 {item.price} 미소
                    </span>
                  </div>

                  <h4 style={{ fontWeight: 800, fontSize: '1rem', color: '#fff', marginBottom: '0.35rem' }}>
                    {item.title}
                  </h4>

                  <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', lineHeight: 1.4, marginBottom: '0.85rem' }}>
                    {item.description}
                  </p>
                </div>

                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>
                    <span>재고: {item.stock}개 남음</span>
                    {mode === 'teacher' && (
                      <button
                        onClick={() => deleteShopItem(item.id)}
                        style={{ background: 'transparent', border: 'none', color: '#f43f5e', cursor: 'pointer' }}
                        title="상품 삭제"
                      >
                        <Trash2 size={15} />
                      </button>
                    )}
                  </div>

                  {mode === 'student' && (
                    <button
                      className={`btn ${canAfford && !isOutOfStock ? 'btn-amber' : 'btn-secondary'}`}
                      style={{ width: '100%', opacity: canAfford && !isOutOfStock ? 1 : 0.6 }}
                      disabled={!canAfford || isOutOfStock}
                      onClick={() => handleBuy(item.id)}
                    >
                      {isOutOfStock ? '품절됨' : !canAfford ? '화폐 부족' : '구매하기 🛍️'}
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </div>
  );
};
