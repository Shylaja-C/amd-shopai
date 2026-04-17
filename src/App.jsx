import { useState, useMemo, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import ChatInterface from './components/ChatInterface';
import Dashboard from './components/Dashboard';
import productsData from './data/products.json';

function App() {
  const [activeView, setActiveView] = useState('dashboard');

  // ── MEMORY ────────────────────────────────────────────────────────────
  const [budget, setBudget] = useState(() => {
    const saved = localStorage.getItem('shopai_budget');
    return saved ? Number(saved) : 5000;
  });
  const [category, setCategory] = useState(() => {
    return localStorage.getItem('shopai_category') || 'all';
  });
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => { localStorage.setItem('shopai_budget', budget); }, [budget]);
  useEffect(() => { localStorage.setItem('shopai_category', category); }, [category]);

  // Listen for Dashboard → Chat switch
  useEffect(() => {
    const handler = (e) => {
      setActiveView('chat');
      if (e.detail) {
        setTimeout(() => window.dispatchEvent(new CustomEvent('quickPrompt', { detail: e.detail })), 200);
      }
    };
    window.addEventListener('switchToChat', handler);
    return () => window.removeEventListener('switchToChat', handler);
  }, []);

  const filteredProducts = useMemo(() => {
    return productsData.filter(product => {
      const withinBudget = product.price <= budget;
      const matchesCategory = category === 'all' || product.category === category;
      return withinBudget && matchesCategory;
    });
  }, [budget, category]);

  const recommendedForYou = useMemo(() => {
    return productsData
      .filter(p => p.price <= budget && (category === 'all' || p.category === category))
      .sort((a, b) => b.rating - a.rating)
      .slice(0, 3);
  }, [budget, category]);

  return (
    <div className="flex h-screen bg-gray-100 font-sans overflow-hidden">
      {/* Mobile overlay */}
      {isSidebarOpen && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-20 md:hidden" onClick={() => setIsSidebarOpen(false)} />
      )}

      {/* Sidebar */}
      <div className={`
        fixed inset-y-0 left-0 z-30 transform transition-transform duration-300 ease-in-out md:relative md:translate-x-0
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <Sidebar
          budget={budget}
          setBudget={setBudget}
          category={category}
          setCategory={setCategory}
          recommendedForYou={recommendedForYou}
          activeView={activeView}
          setActiveView={setActiveView}
          onClose={() => setIsSidebarOpen(false)}
        />
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Mobile Header */}
        <header className="md:hidden bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between flex-shrink-0">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center">
              <svg className="w-3.5 h-3.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <span className="font-bold text-gray-800">ShopAI</span>
          </div>
          <div className="flex items-center gap-2">
            {/* View toggle */}
            <div className="flex bg-gray-100 rounded-lg p-0.5">
              <button
                onClick={() => setActiveView('dashboard')}
                className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all ${activeView === 'dashboard' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-500'}`}
              >📊</button>
              <button
                onClick={() => setActiveView('chat')}
                className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all ${activeView === 'chat' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-500'}`}
              >💬</button>
            </div>
            <button onClick={() => setIsSidebarOpen(true)} className="p-2 text-gray-500 hover:bg-gray-100 rounded-lg">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </header>

        {/* View */}
        {activeView === 'dashboard' ? (
          <Dashboard products={productsData} budget={budget} category={category} />
        ) : (
          <ChatInterface
            products={productsData}
            filteredProducts={filteredProducts}
            budget={budget}
            category={category}
            isSidebarOpen={isSidebarOpen}
            setIsSidebarOpen={setIsSidebarOpen}
          />
        )}
      </div>
    </div>
  );
}

export default App;
