import React, { createContext, useContext, useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { INITIAL_STUDENTS, INITIAL_SHOP_ITEMS, AVAILABLE_ROLES } from '../data/initialData';

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  // 1. LocalStorage state loading
  const [students, setStudents] = useState(() => {
    const saved = localStorage.getItem('class_students');
    return saved ? JSON.parse(saved) : INITIAL_STUDENTS;
  });

  const [shopItems, setShopItems] = useState(() => {
    const saved = localStorage.getItem('class_shop_items');
    return saved ? JSON.parse(saved) : INITIAL_SHOP_ITEMS;
  });

  const [coupons, setCoupons] = useState(() => {
    const saved = localStorage.getItem('class_coupons');
    return saved ? JSON.parse(saved) : [
      { id: 101, studentId: 2, itemId: 2, title: '📝 숙제 1회 면제권', icon: '📝', status: 'unused', purchasedAt: '2026-10-04' },
      { id: 102, studentId: 4, itemId: 1, title: '🌟 자리 선택권', icon: '🌟', status: 'used', purchasedAt: '2026-10-03' }
    ];
  });

  const [history, setHistory] = useState(() => {
    const saved = localStorage.getItem('class_history');
    return saved ? JSON.parse(saved) : [
      { id: 1, timestamp: '2026-10-05 09:00', studentName: '김민서', type: 'EARN', amount: 50, description: '1인 1역 (칠판 도우미) 완수' },
      { id: 2, timestamp: '2026-10-05 09:30', studentName: '서아린', type: 'EARN', amount: 100, description: '주간 학급 기여 칭찬' }
    ];
  });

  // App mode & current selected student
  const [mode, setMode] = useState('student'); // 'student' | 'teacher'
  const [selectedStudentId, setSelectedStudentId] = useState(1);

  // Sync to localStorage
  useEffect(() => {
    localStorage.setItem('class_students', JSON.stringify(students));
  }, [students]);

  useEffect(() => {
    localStorage.setItem('class_shop_items', JSON.stringify(shopItems));
  }, [shopItems]);

  useEffect(() => {
    localStorage.setItem('class_coupons', JSON.stringify(coupons));
  }, [coupons]);

  useEffect(() => {
    localStorage.setItem('class_history', JSON.stringify(history));
  }, [history]);

  // Current Student Helper
  const currentStudent = students.find(s => s.id === selectedStudentId) || students[0];

  // Helper: Trigger Confetti Animation
  const triggerConfetti = () => {
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 }
    });
  };

  // --- ACTIONS ---

  // 1. Give / Deduct Money & Experience
  const adjustCurrency = (studentId, amount, reason, isGroup = false) => {
    setStudents(prev => prev.map(student => {
      if (!isGroup && student.id !== studentId) return student;

      const oldLevel = student.level;
      const newBalance = Math.max(0, student.balance + amount);
      // Only increase XP when earning money
      const newXp = amount > 0 ? student.xp + amount : student.xp;
      const newLevel = Math.floor(newXp / 100) + 1;

      if (newLevel > oldLevel) {
        triggerConfetti();
      }

      return {
        ...student,
        balance: newBalance,
        xp: newXp,
        level: newLevel
      };
    }));

    // Add to history
    const targetName = isGroup ? '전체 학생' : (students.find(s => s.id === studentId)?.name || '학생');
    setHistory(prev => [
      {
        id: Date.now(),
        timestamp: new Date().toLocaleString('ko-KR', { hour12: false }),
        studentName: targetName,
        type: amount >= 0 ? 'EARN' : 'SPEND',
        amount: Math.abs(amount),
        description: reason || (amount >= 0 ? '화폐 지급' : '화폐 차감')
      },
      ...prev
    ]);
  };

  // 2. Toggle Today's 1인 1역 Completion
  const toggleRoleCompletion = (studentId) => {
    setStudents(prev => prev.map(student => {
      if (student.id === studentId) {
        const nextState = !student.roleCompletedToday;
        if (nextState) {
          triggerConfetti();
        }
        return { ...student, roleCompletedToday: nextState };
      }
      return student;
    }));
  };

  // 3. Update Student Role (Teacher)
  const updateStudentRole = (studentId, newRole) => {
    setStudents(prev => prev.map(s => s.id === studentId ? { ...s, role: newRole } : s));
  };

  // 4. Shop Operations
  const buyShopItem = (studentId, itemId) => {
    const student = students.find(s => s.id === studentId);
    const item = shopItems.find(i => i.id === itemId);

    if (!student || !item) return { success: false, message: '상품 또는 학생을 찾을 수 없습니다.' };
    if (student.balance < item.price) return { success: false, message: '잔액이 부족합니다!' };
    if (item.stock <= 0) return { success: false, message: '재고가 품절되었습니다.' };

    // Deduct balance
    setStudents(prev => prev.map(s => s.id === studentId ? { ...s, balance: s.balance - item.price } : s));

    // Reduce stock
    setShopItems(prev => prev.map(i => i.id === itemId ? { ...i, stock: i.stock - 1 } : i));

    // Add coupon
    const newCoupon = {
      id: Date.now(),
      studentId,
      itemId,
      title: item.title,
      icon: item.icon,
      status: 'unused',
      purchasedAt: new Date().toLocaleDateString('ko-KR')
    };
    setCoupons(prev => [newCoupon, ...prev]);

    // History
    setHistory(prev => [
      {
        id: Date.now(),
        timestamp: new Date().toLocaleString('ko-KR', { hour12: false }),
        studentName: student.name,
        type: 'COUPON',
        amount: -item.price,
        description: `상점 쿠폰 구매: [${item.title}]`
      },
      ...prev
    ]);

    triggerConfetti();
    return { success: true, message: `'${item.title}' 구매가 완료되었습니다!` };
  };

  // 5. Use Coupon
  const useCoupon = (couponId) => {
    setCoupons(prev => prev.map(c => c.id === couponId ? { ...c, status: 'used' } : c));
    triggerConfetti();
  };

  // 6. Add/Edit/Delete Shop Item (Teacher)
  const addShopItem = (newItem) => {
    const item = { ...newItem, id: Date.now() };
    setShopItems(prev => [...prev, item]);
  };

  const deleteShopItem = (itemId) => {
    setShopItems(prev => prev.filter(i => i.id !== itemId));
  };

  // 7. Reset all data (For testing)
  const resetAllData = () => {
    if (window.confirm('모든 학급 데이터를 초기 상태로 리셋하시겠습니까?')) {
      localStorage.clear();
      setStudents(INITIAL_STUDENTS);
      setShopItems(INITIAL_SHOP_ITEMS);
      setCoupons([]);
      setHistory([]);
    }
  };

  return (
    <AppContext.Provider value={{
      students,
      shopItems,
      coupons,
      history,
      mode,
      setMode,
      selectedStudentId,
      setSelectedStudentId,
      currentStudent,
      adjustCurrency,
      toggleRoleCompletion,
      updateStudentRole,
      buyShopItem,
      useCoupon,
      addShopItem,
      deleteShopItem,
      resetAllData,
      AVAILABLE_ROLES
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => useContext(AppContext);
