
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import RankingSubs from './pages/dashboard/zeladoria/RankingSubs';
import { NotificationsProvider } from './hooks/useNotifications';

function App() {
  return (
    <NotificationsProvider>
      <Router>
        <Routes>
          <Route path="/dashboard/zeladoria/ranking-subs" element={<RankingSubs />} />
          <Route path="*" element={<RankingSubs />} />
        </Routes>
      </Router>
    </NotificationsProvider>
  );
}

export default App;
