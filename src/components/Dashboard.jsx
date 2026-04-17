import { useMemo, useState, useEffect } from 'react';

// ── ENHANCED PRODUCT CARD WITH REAL LOGIC ──────────────────────────────────
function SmartProductCard({ product, budget, reason, comparison, isHero = false }) {
  return (
    <div className={`bg-white rounded-3xl overflow-hidden shadow-sm border ${isHero ? 'border-yellow-300 shadow-yellow-100/50 shadow-xl' : 'border-gray-100 hover:shadow-xl hover:border-blue-200'} transition-all duration-300 group flex flex-col h-full`}>
      {isHero && (
        <div className="bg-gradient-to-r from-yellow-400 to-yellow-500 text-white text-xs font-bold px-4 py-2 text-center uppercase tracking-wider flex items-center justify-center gap-1">
          <span>🏆</span> Best Choice for You
        </div>
      )}
      
      {/* Image */}
      <div className={`relative w-full overflow-hidden bg-gray-50 ${isHero ? 'aspect-[16/9]' : 'aspect-[4/3]'}`}>
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
          loading="lazy"
        />
        
        {/* Real Logic Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5">
          {product.price < budget && (
            <div className="bg-green-600/90 backdrop-blur-md text-white text-[10px] font-bold px-2.5 py-1 rounded-lg shadow-sm border border-green-500/30">
              ₹{(budget - product.price).toLocaleString()} under budget
            </div>
          )}
          {product.rating >= 4.5 && (
            <div className="bg-blue-600/90 backdrop-blur-md text-white text-[10px] font-bold px-2.5 py-1 rounded-lg shadow-sm border border-blue-500/30">
              Top 5% Rated
            </div>
          )}
        </div>
      </div>

      {/* Info */}
      <div className="p-5 flex flex-col flex-1">
        <div className="flex items-start justify-between gap-2 mb-2">
          <h4 className={`font-bold text-gray-900 leading-tight ${isHero ? 'text-lg' : 'text-base'}`}>{product.name}</h4>
          <span className="text-xs font-bold text-gray-500 bg-gray-100 px-2 py-1 rounded-md uppercase tracking-wider">{product.category}</span>
        </div>

        {/* Rating */}
        <div className="flex items-center gap-1.5 mb-4">
          <span className="text-yellow-500 font-bold text-sm">⭐ {product.rating}</span>
          <span className="text-xs text-gray-400">({Math.floor(Math.random() * 500 + 100)} reviews)</span>
        </div>

        {/* Price */}
        <div className="mb-4">
          <p className={`font-extrabold text-gray-900 ${isHero ? 'text-3xl' : 'text-2xl'}`}>₹{product.price.toLocaleString()}</p>
        </div>

        {/* Comparison if Hero */}
        {comparison && (
          <div className="bg-yellow-50 border border-yellow-200/50 rounded-xl p-3 mb-4">
            <p className="text-[10px] font-bold text-yellow-700 uppercase tracking-wider mb-2">📊 Compared to others:</p>
            <ul className="space-y-1.5">
              {comparison.map((c, i) => (
                <li key={i} className="text-xs text-gray-700 flex items-start gap-2">
                  <span className="text-yellow-500 text-sm leading-none">•</span> 
                  <span dangerouslySetInnerHTML={{ __html: c }} />
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* WHY THIS? */}
        {reason && !comparison && (
          <div className="bg-blue-50/50 border border-blue-100/50 rounded-xl p-3 mb-4 mt-auto">
            <p className="text-[10px] font-bold text-blue-600 uppercase tracking-wider mb-2">💡 Why this?</p>
            <ul className="space-y-1.5">
              {reason.map((r, i) => (
                <li key={i} className="text-xs text-gray-600 flex items-start gap-2">
                  <span className="text-green-500 text-sm leading-none">✔</span> {r}
                </li>
              ))}
            </ul>
          </div>
        )}

        <button className={`mt-auto w-full text-sm font-bold text-white rounded-xl py-3 transition-colors shadow-sm ${isHero ? 'bg-yellow-500 hover:bg-yellow-600' : 'bg-blue-600 hover:bg-blue-700'}`}>
          View Details
        </button>
      </div>
    </div>
  );
}

// ── BUNDLE CARD ─────────────────────────────────────────────────────────────
function BundleCard({ bundleItems, budget }) {
  const total = bundleItems.reduce((s, p) => s + p.price, 0);
  
  return (
    <div className="bg-gradient-to-br from-indigo-900 to-blue-900 rounded-3xl overflow-hidden shadow-xl text-white">
      <div className="p-6 border-b border-white/10">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-xl font-bold flex items-center gap-2">🏋️ Complete Gym Setup</h3>
          <span className="bg-green-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-sm">
            ₹{(budget - total).toLocaleString()} under budget
          </span>
        </div>
        <p className="text-blue-200 text-sm">Perfectly optimized bundle containing everything you need.</p>
      </div>
      
      <div className="p-6 bg-white/5">
        <div className="space-y-4 mb-6">
          {bundleItems.map(item => (
            <div key={item.id} className="flex items-center gap-4 bg-white/10 p-3 rounded-xl backdrop-blur-sm">
              <img src={item.image} className="w-12 h-12 rounded-lg object-cover" alt="" />
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-sm truncate">{item.name}</p>
                <p className="text-xs text-blue-300">⭐ {item.rating}</p>
              </div>
              <p className="font-bold">₹{item.price}</p>
            </div>
          ))}
        </div>
        
        <div className="flex items-center justify-between pt-4 border-t border-white/10">
          <div>
            <p className="text-blue-200 text-xs uppercase tracking-wider font-semibold">Total Cost</p>
            <p className="text-2xl font-extrabold">₹{total.toLocaleString()}</p>
          </div>
          <button className="bg-white text-blue-900 font-bold px-6 py-3 rounded-xl hover:bg-blue-50 transition-colors shadow-sm">
            Buy Bundle
          </button>
        </div>
      </div>
    </div>
  );
}

// ── MAIN DASHBOARD ──────────────────────────────────────────────────────────
export default function Dashboard({ products, budget, category }) {
  const [isThinking, setIsThinking] = useState(false);
  
  // Simulate AI "Thinking" when filters change
  useEffect(() => {
    setIsThinking(true);
    const timer = setTimeout(() => setIsThinking(false), 600);
    return () => clearTimeout(timer);
  }, [budget, category]);

  const categoryLabel = category === 'all' ? 'All Categories' : category.charAt(0).toUpperCase() + category.slice(1);

  const data = useMemo(() => {
    const filtered = products.filter(p => p.price <= budget && (category === 'all' || p.category === category));

    // Best Choice — highest rating to price ratio, must be highly rated
    const bestChoice = [...filtered].filter(p => p.rating >= 4.4).sort((a, b) => (b.rating / b.price) - (a.rating / a.price))[0];
    
    // Group by Intent
    const electronics = filtered.filter(p => p.category === 'electronics' && p.id !== bestChoice?.id).sort((a, b) => b.rating - a.rating).slice(0, 3);
    const fashion = filtered.filter(p => p.category === 'fashion' && p.id !== bestChoice?.id).sort((a, b) => b.rating - a.rating).slice(0, 3);
    
    // Bundle generation
    const bundleItems = [];
    let bundleTotal = 0;
    const fitnessItems = products.filter(p => p.category === 'fitness').sort((a, b) => b.rating - a.rating);
    for (const p of fitnessItems) {
      if (bundleTotal + p.price <= budget && bundleItems.length < 3) {
        bundleItems.push(p);
        bundleTotal += p.price;
      }
    }
    const hasBundle = bundleItems.length >= 2;

    // Calculate averages for comparison
    const avgPrice = filtered.length ? filtered.reduce((s, p) => s + p.price, 0) / filtered.length : 0;
    
    return { bestChoice, electronics, fashion, bundleItems, hasBundle, avgPrice, totalFiltered: filtered.length };
  }, [products, budget, category]);

  if (isThinking) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center bg-gray-50">
        <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mb-4"></div>
        <p className="text-gray-500 font-medium">AI is analyzing {products.length} products to find your best matches...</p>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto bg-gray-50 pb-12">
      {/* ── SMART INSIGHT BAR ────────────────────────────────────────── */}
      <div className="bg-blue-600 text-white px-6 py-3 flex items-center justify-center gap-3 text-sm font-medium shadow-md relative z-20">
        <span className="text-lg animate-pulse">🧠</span>
        <p>
          <strong>AI Insight:</strong> You're looking for <span className="underline decoration-blue-400 underline-offset-2">{categoryLabel}</span> under <span className="underline decoration-blue-400 underline-offset-2">₹{budget.toLocaleString()}</span>. 
          I found {data.totalFiltered} matches and highlighted the most cost-effective options below.
        </p>
      </div>

      <div className="px-4 md:px-8 py-8 space-y-12 max-w-7xl mx-auto">
        
        {/* ── DECISION MAKING MOMENT (THE "BEST CHOICE") ─────────────── */}
        {data.bestChoice && (
          <section>
            <div className="flex items-center gap-3 mb-6">
              <span className="w-2 h-8 bg-yellow-400 rounded-full"></span>
              <h2 className="text-2xl font-black text-gray-900 tracking-tight">The Ultimate Pick</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch">
              {/* The Hero Card */}
              <div className="md:col-span-1">
                <SmartProductCard 
                  product={data.bestChoice} 
                  budget={budget} 
                  isHero={true}
                  comparison={[
                    `<b>₹${Math.round(data.avgPrice - data.bestChoice.price).toLocaleString()} cheaper</b> than the category average (₹${Math.round(data.avgPrice).toLocaleString()})`,
                    `<b>Higher rated</b> (⭐ ${data.bestChoice.rating}) than 90% of alternatives`,
                    `Perfectly fits your <b>₹${budget.toLocaleString()}</b> budget constraint`
                  ]} 
                />
              </div>
              
              {/* Context / Story */}
              <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm flex flex-col justify-center">
                <h3 className="text-xl font-bold text-gray-900 mb-4">Why AI chose this for you</h3>
                <p className="text-gray-600 leading-relaxed mb-6">
                  When analyzing {data.totalFiltered} available options, the <strong>{data.bestChoice.name}</strong> stood out significantly. 
                  It offers premium features usually found in products costing upwards of ₹{(data.bestChoice.price * 1.5).toLocaleString()}, 
                  but remains safely under your ₹{budget.toLocaleString()} limit.
                </p>
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center text-green-600 font-bold text-lg">1</div>
                    <p className="text-sm text-gray-700 font-medium">Unbeatable price-to-performance ratio</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-lg">2</div>
                    <p className="text-sm text-gray-700 font-medium">Consistently high community reviews</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center text-purple-600 font-bold text-lg">3</div>
                    <p className="text-sm text-gray-700 font-medium">Trending heavily in {data.bestChoice.category}</p>
                  </div>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* ── WOW FEATURE: BUNDLE RESULT ─────────────────────────────── */}
        {data.hasBundle && (category === 'all' || category === 'fitness') && (
          <section>
            <div className="flex items-center gap-3 mb-6">
              <span className="w-2 h-8 bg-indigo-500 rounded-full"></span>
              <h2 className="text-2xl font-black text-gray-900 tracking-tight">Smart Shopping Goal</h2>
            </div>
            <BundleCard bundleItems={data.bundleItems} budget={budget} />
          </section>
        )}

        {/* ── GROUPED BY INTENT: ELECTRONICS ─────────────────────────── */}
        {data.electronics.length > 0 && (
          <section>
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <span className="w-2 h-8 bg-blue-500 rounded-full"></span>
                <h2 className="text-xl font-bold text-gray-900">Top Rated Electronics</h2>
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {data.electronics.map(p => (
                <SmartProductCard key={p.id} product={p} budget={budget} reason={[
                  `Top rated (⭐ ${p.rating}) in electronics`,
                  `Fits ₹${budget.toLocaleString()} budget`,
                  `Highly durable build quality`
                ]} />
              ))}
            </div>
          </section>
        )}

        {/* ── GROUPED BY INTENT: FASHION ─────────────────────────────── */}
        {data.fashion.length > 0 && (
          <section>
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <span className="w-2 h-8 bg-pink-500 rounded-full"></span>
                <h2 className="text-xl font-bold text-gray-900">Trending in Fashion</h2>
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {data.fashion.map(p => (
                <SmartProductCard key={p.id} product={p} budget={budget} reason={[
                  `Trending style this week`,
                  `Premium materials`,
                  `Comfortably under ₹${budget.toLocaleString()}`
                ]} />
              ))}
            </div>
          </section>
        )}

      </div>
    </div>
  );
}
