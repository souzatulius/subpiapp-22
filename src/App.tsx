
import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { Routes } from './Routes';
import { Toaster } from './components/ui/toaster';
import { FeedbackProvider } from './components/ui/feedback-provider';

function App() {
  return (
    <BrowserRouter>
      <FeedbackProvider>
        <Routes />
        <Toaster />
      </FeedbackProvider>
    </BrowserRouter>
  );
}

export default App;
