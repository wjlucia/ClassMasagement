import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Header } from './components/Header';
import { StudentMain } from './components/StudentMain';
import { TeacherMain } from './components/TeacherMain';
import { StudentProfileModal } from './components/StudentProfileModal';
import { ShopModal } from './components/ShopModal';
import { HistoryModal } from './components/HistoryModal';

const AppContent = () => {
  const { mode } = useApp();

  const [isStudentSelectOpen, setIsStudentSelectOpen] = useState(false);
  const [isShopOpen, setIsShopOpen] = useState(false);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      
      {/* App Header Bar */}
      <Header
        onOpenStudentSelect={() => setIsStudentSelectOpen(true)}
        onOpenShop={() => setIsShopOpen(true)}
        onOpenHistory={() => setIsHistoryOpen(true)}
      />

      {/* Main Mode View Switching */}
      <main style={{ flex: 1 }}>
        {mode === 'student' ? (
          <StudentMain onOpenShop={() => setIsShopOpen(true)} />
        ) : (
          <TeacherMain onOpenShop={() => setIsShopOpen(true)} />
        )}
      </main>

      {/* Footer */}
      <footer style={{ textAlign: 'center', padding: '1.5rem', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
        ✨ 초등학교 6학년 학급 경제 & 게이미피케이션 플랫폼 | 2026 DreamClass
      </footer>

      {/* Modals */}
      <StudentProfileModal
        isOpen={isStudentSelectOpen}
        onClose={() => setIsStudentSelectOpen(false)}
      />

      <ShopModal
        isOpen={isShopOpen}
        onClose={() => setIsShopOpen(false)}
      />

      <HistoryModal
        isOpen={isHistoryOpen}
        onClose={() => setIsHistoryOpen(false)}
      />

    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
