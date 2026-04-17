import { useState, useEffect, useRef } from 'react';
import ProductCard from './ProductCard';

// ─── AI BRAIN ───────────────────────────────────────────────────────────────
function generateAIResponse(query, allProducts, budget, category) {
  try {
    const lowerQuery = query.toLowerCase();

    // ── INTENT DETECTION ──────────────────────────────────────────────────
    const isGym    = lowerQuery.includes('gym') || lowerQuery.includes('workout') || lowerQuery.includes('fitness');
    const isShoes  = lowerQuery.includes('shoe') || lowerQuery.includes('sneaker');
    const isBudget = lowerQuery.includes('under') || lowerQuery.includes('cheap') || lowerQuery.includes('budget') || lowerQuery.includes('affordable');
    const isTrend  = lowerQuery.includes('trend') || lowerQuery.includes('popular') || lowerQuery.includes('best seller');
    const isGrocery= lowerQuery.includes('grocer') || lowerQuery.includes('food') || lowerQuery.includes('eat') || lowerQuery.includes('tea');
    const isFashion= lowerQuery.includes('fashion') || lowerQuery.includes('cloth') || lowerQuery.includes('jacket') || lowerQuery.includes('dress');
    const isBundle = lowerQuery.includes('setup') || lowerQuery.includes('bundle') || lowerQuery.includes('kit') || lowerQuery.includes('pack');

    // ── EXTRACT BUDGET FROM QUERY ──────────────────────────────────────────
    const budgetMatch = lowerQuery.match(/₹?(\d{3,5})/);
    const queryBudget = budgetMatch ? parseInt(budgetMatch[1]) : budget;
    const effectiveBudget = Math.min(queryBudget, budget);

    // ── PRE-FILTER BY BUDGET ───────────────────────────────────────────────
    const affordable = allProducts.filter(p => p.price <= effectiveBudget);

    // ── SMART SHOPPING GOAL: BUNDLE MODE ─────────────────────────────────
    if (isGym && isBundle) {
      const bundle = [];
      let total = 0;
      const fitnessItems = allProducts
        .filter(p => p.category === 'fitness')
        .sort((a, b) => b.rating - a.rating);
      for (const p of fitnessItems) {
        if (total + p.price <= effectiveBudget) {
          bundle.push(p);
          total += p.price;
        }
      }
      if (bundle.length > 0) {
        return {
          isBundle: true,
          text: `🎽 Here's your complete gym starter pack — all within ₹${effectiveBudget.toLocaleString()}! Total: ₹${total.toLocaleString()}.`,
          products: bundle,
          reasoning: [
            `🎯 Optimised for your fitness goal`,
            `💰 Total ₹${total.toLocaleString()} — well within your ₹${effectiveBudget.toLocaleString()} budget`,
            `⭐ Top-rated items across the fitness category`,
            `📦 Balanced selection of gym essentials`,
          ],
        };
      }
    }

    // ── CATEGORY INTENT ───────────────────────────────────────────────────
    if (isGym || isShoes) {
      const products = affordable
        .filter(p => p.category === 'fitness')
        .sort((a, b) => b.rating - a.rating)
        .slice(0, 3);
      return {
        text: `💪 Based on your interest in fitness, here are the top-rated items within ₹${effectiveBudget.toLocaleString()}:`,
        products,
        reasoning: [
          `🏋️ Matched intent: fitness / gym`,
          `💰 All items within your ₹${effectiveBudget.toLocaleString()} budget`,
          `⭐ Sorted by user rating for best quality`,
        ],
      };
    }

    if (isGrocery) {
      const products = affordable.filter(p => p.category === 'groceries').slice(0, 3);
      return {
        text: `🛒 Here are healthy grocery picks within your budget:`,
        products,
        reasoning: [
          `🥗 Matched intent: groceries / food`,
          `💰 Budget-friendly options under ₹${effectiveBudget.toLocaleString()}`,
          `⭐ Top-rated items by our community`,
        ],
      };
    }

    if (isFashion) {
      const products = affordable.filter(p => p.category === 'fashion').slice(0, 3);
      return {
        text: `👗 Here are the trending fashion picks for you:`,
        products,
        reasoning: [
          `👚 Matched intent: fashion / clothing`,
          `💰 Within your budget of ₹${effectiveBudget.toLocaleString()}`,
          `🔥 Trending styles selected`,
        ],
      };
    }

    if (isTrend) {
      const products = allProducts
        .filter(p => p.tag === 'Trending' && p.price <= effectiveBudget)
        .slice(0, 3);
      return {
        text: `🔥 Here are the most trending products right now:`,
        products,
        reasoning: [
          `📈 High demand and popularity score`,
          `💰 Within your ₹${effectiveBudget.toLocaleString()} budget`,
          `🛍️ Curated from top-selling categories`,
        ],
      };
    }

    if (isBudget) {
      const products = affordable
        .sort((a, b) => (b.rating / b.price) - (a.rating / a.price))
        .slice(0, 3);
      return {
        text: `🤑 Best value-for-money picks under ₹${effectiveBudget.toLocaleString()}:`,
        products,
        reasoning: [
          `💡 Ranked by value score (rating ÷ price)`,
          `💰 All items comfortably within your ₹${effectiveBudget.toLocaleString()} budget`,
          `⭐ High satisfaction ratings`,
        ],
      };
    }

    // ── DEFAULT SMART RECOMMENDATION ──────────────────────────────────────
    const products = affordable
      .filter(p => category === 'all' || p.category === category)
      .sort((a, b) => b.rating - a.rating)
      .slice(0, 3);

    return {
      text: `✨ Based on your budget of ₹${effectiveBudget.toLocaleString()}${category !== 'all' ? ` and interest in ${category}` : ''}, here are my top picks:`,
      products,
      reasoning: [
        `💰 Filtered by your budget of ₹${effectiveBudget.toLocaleString()}`,
        category !== 'all' ? `📂 Matched your selected category: ${category}` : `📂 Browsing across all categories`,
        `⭐ Sorted by highest user ratings`,
      ],
    };
  } catch (err) {
    // ── FALLBACK MODE ─────────────────────────────────────────────────────
    const fallback = allProducts
      .filter(p => p.price <= budget)
      .sort((a, b) => b.rating - a.rating)
      .slice(0, 2);
    return {
      text: `Showing best matches based on your current filters.`,
      products: fallback,
      reasoning: [`💡 Fallback mode: showing top-rated items within your budget`],
    };
  }
}

// ─── REASONING BOX ──────────────────────────────────────────────────────────
function ReasoningBox({ reasons }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="mt-2 border border-blue-100 rounded-xl overflow-hidden">
      <button
        onClick={() => setOpen(o => !o)}
        className="w-full flex items-center justify-between px-4 py-2 bg-blue-50 text-blue-700 text-xs font-semibold hover:bg-blue-100 transition-colors"
      >
        <span>💡 Why this recommendation?</span>
        <svg
          className={`w-4 h-4 transition-transform ${open ? 'rotate-180' : ''}`}
          fill="none" stroke="currentColor" viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      {open && (
        <ul className="bg-white px-4 py-3 space-y-1.5">
          {reasons.map((r, i) => (
            <li key={i} className="text-xs text-gray-600 flex items-start gap-2">
              <span className="text-blue-400 mt-0.5">•</span>
              <span>{r}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

// ─── TYPING INDICATOR ───────────────────────────────────────────────────────
function TypingIndicator() {
  return (
    <div className="flex justify-start">
      <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center mx-2">
        <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      </div>
      <div className="bg-white border border-gray-100 rounded-2xl rounded-bl-sm px-4 py-3 shadow-sm">
        <div className="flex gap-1 items-center h-5">
          {[0, 1, 2].map(i => (
            <span
              key={i}
              className="w-2 h-2 bg-blue-400 rounded-full animate-bounce"
              style={{ animationDelay: `${i * 0.15}s` }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── MAIN COMPONENT ─────────────────────────────────────────────────────────
export default function ChatInterface({ products, filteredProducts, budget, category, isSidebarOpen, setIsSidebarOpen }) {
  const [messages, setMessages] = useState([
    {
      id: 1,
      type: 'assistant',
      text: "👋 Hi! I'm your AI shopping assistant. Tell me what you need — try something like **\"gym setup under ₹3000\"** or **\"trending electronics\"**.",
    }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  useEffect(() => { scrollToBottom(); }, [messages, isTyping]);

  useEffect(() => {
    const handler = (e) => handleSend(e.detail);
    window.addEventListener('quickPrompt', handler);
    return () => window.removeEventListener('quickPrompt', handler);
  }, [budget, category, filteredProducts]);

  const handleSend = (text = input) => {
    if (!text.trim()) return;
    const userMsg = { id: Date.now(), type: 'user', text };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    setTimeout(() => {
      const response = generateAIResponse(text, products, budget, category);
      setIsTyping(false);
      setMessages(prev => [...prev, {
        id: Date.now() + 1,
        type: 'assistant',
        ...response,
      }]);
    }, 1200);
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-gray-50 relative overflow-hidden">
      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-5">
        {messages.map((msg) => (
          <div key={msg.id} className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'} items-end gap-2`}>
            {/* Avatar — assistant */}
            {msg.type === 'assistant' && (
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center mb-1">
                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
            )}

            <div className="max-w-[85%] md:max-w-[78%]">
              <div className={`p-4 rounded-2xl text-sm leading-relaxed shadow-sm ${
                msg.type === 'user'
                  ? 'bg-blue-600 text-white rounded-br-sm'
                  : 'bg-white text-gray-800 rounded-bl-sm border border-gray-100'
              }`}>
                {msg.text}
                {msg.isBundle && (
                  <div className="mt-2 inline-flex items-center gap-1 bg-green-100 text-green-700 text-xs font-semibold px-2 py-1 rounded-full">
                    🎁 Smart Bundle
                  </div>
                )}
              </div>

              {/* Reasoning Box */}
              {msg.reasoning && msg.reasoning.length > 0 && (
                <ReasoningBox reasons={msg.reasoning} />
              )}

              {/* Product Cards */}
              {msg.products && msg.products.length > 0 && (
                <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {msg.products.map(product => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>
              )}

              {msg.products && msg.products.length === 0 && msg.type === 'assistant' && (
                <p className="text-xs text-gray-400 mt-2 px-1">No products found for your query. Try adjusting your filters.</p>
              )}
            </div>

            {/* Avatar — user */}
            {msg.type === 'user' && (
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center mb-1">
                <svg className="w-4 h-4 text-gray-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                </svg>
              </div>
            )}
          </div>
        ))}

        {isTyping && <TypingIndicator />}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-4 bg-white border-t border-gray-200 flex-shrink-0">
        <div className="max-w-4xl mx-auto flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-full px-4 py-2 shadow-sm focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-blue-500 transition-all">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && !isTyping && handleSend()}
            placeholder='Try "gym setup under ₹3000" or "trending electronics"'
            className="flex-1 bg-transparent text-sm text-gray-800 placeholder-gray-400 focus:outline-none"
          />
          <button
            id="send-button"
            onClick={() => !isTyping && handleSend()}
            disabled={!input.trim() || isTyping}
            className="flex-shrink-0 w-8 h-8 flex items-center justify-center text-white bg-blue-600 rounded-full hover:bg-blue-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
            </svg>
          </button>
        </div>
        <p className="text-center text-[10px] text-gray-400 mt-2">AI-powered · Personalised · Context-aware</p>
      </div>
    </div>
  );
}
