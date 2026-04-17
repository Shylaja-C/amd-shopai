export default function Sidebar({ budget, setBudget, category, setCategory, recommendedForYou, activeView, setActiveView, onClose }) {
  return (
    <aside className="w-72 bg-white border-r border-gray-200 flex flex-col h-full overflow-y-auto">
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center shadow-sm">
            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          <span className="font-bold text-gray-800 text-lg">ShopAI</span>
        </div>
        <button onClick={onClose} className="md:hidden text-gray-400 hover:text-gray-600 p-1">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      {/* ── NAVIGATION ─────────────────────────────────────────────── */}
      <div className="px-4 pt-4 pb-2">
        <div className="flex bg-gray-100 rounded-xl p-1">
          <button
            onClick={() => { setActiveView('dashboard'); onClose(); }}
            className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-xs font-semibold transition-all ${
              activeView === 'dashboard'
                ? 'bg-white text-blue-600 shadow-sm'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            📊 Dashboard
          </button>
          <button
            onClick={() => { setActiveView('chat'); onClose(); }}
            className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-xs font-semibold transition-all ${
              activeView === 'chat'
                ? 'bg-white text-blue-600 shadow-sm'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            💬 AI Chat
          </button>
        </div>
      </div>

      <div className="px-5 py-4 flex flex-col gap-5 flex-1">
        {/* ── FILTERS ──────────────────────────────────────────────── */}
        <div>
          <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Filters</h3>

          {/* Budget */}
          <div className="mb-5">
            <label className="flex items-center justify-between text-sm font-medium text-gray-700 mb-2">
              <span>💰 Budget</span>
              <span className="text-blue-600 font-bold bg-blue-50 px-2 py-0.5 rounded-md text-xs">₹{budget.toLocaleString()}</span>
            </label>
            <input
              type="range"
              id="budget-slider"
              min={100}
              max={5000}
              step={100}
              value={budget}
              onChange={(e) => setBudget(Number(e.target.value))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-500"
            />
            <div className="flex justify-between text-[10px] text-gray-400 mt-1">
              <span>₹100</span>
              <span>₹5,000</span>
            </div>
          </div>

          {/* Category */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">📂 Category</label>
            <select
              id="category-select"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all cursor-pointer"
            >
              <option value="all">All Categories</option>
              <option value="electronics">🔌 Electronics</option>
              <option value="fashion">👕 Fashion</option>
              <option value="fitness">🏋️ Fitness</option>
              <option value="groceries">🛒 Groceries</option>
            </select>
          </div>
        </div>

        {/* ── RECOMMENDED FOR YOU ──────────────────────────────────── */}
        {recommendedForYou && recommendedForYou.length > 0 && (
          <div>
            <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">🧠 Recommended for You</h3>
            <div className="flex flex-col gap-2">
              {recommendedForYou.map(product => (
                <div
                  key={product.id}
                  className="flex items-center gap-3 bg-gray-50 hover:bg-blue-50 rounded-xl p-2.5 transition-colors cursor-pointer group border border-transparent hover:border-blue-100"
                >
                  <img src={product.image} alt={product.name} className="w-10 h-10 rounded-lg object-cover flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold text-gray-700 truncate group-hover:text-blue-700">{product.name}</p>
                    <p className="text-[10px] text-gray-400">₹{product.price.toLocaleString()} · ⭐ {product.rating}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── QUICK PROMPTS ───────────────────────────────────────── */}
        <div>
          <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">⚡ Quick Prompts</h3>
          <div className="flex flex-col gap-2">
            {[
              "Gym setup under ₹3000",
              "Best value electronics",
              "I need shoes for running",
              "Trending products",
              "Healthy groceries under ₹500",
            ].map((prompt, i) => (
              <button
                key={i}
                onClick={() => {
                  setActiveView('chat');
                  onClose();
                  setTimeout(() => window.dispatchEvent(new CustomEvent('quickPrompt', { detail: prompt })), 100);
                }}
                className="text-left text-xs text-gray-600 bg-gray-50 hover:bg-blue-50 hover:text-blue-600 px-3 py-2 rounded-lg transition-all duration-200 border border-transparent hover:border-blue-100"
              >
                💬 {prompt}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="px-5 py-3 border-t border-gray-100 bg-gray-50">
        <div className="text-[10px] text-gray-400 text-center">ShopAI ✨ · 108 Products · Context-Aware</div>
      </div>
    </aside>
  );
}
