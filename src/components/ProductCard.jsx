const TAG_STYLES = {
  'Best Value': 'bg-green-100 text-green-700 border-green-200',
  'Trending':   'bg-orange-100 text-orange-700 border-orange-200',
  'AI Pick':    'bg-purple-100 text-purple-700 border-purple-200',
};

const TAG_ICONS = {
  'Best Value': '🟢',
  'Trending':   '🔥',
  'AI Pick':    '💡',
};

export default function ProductCard({ product }) {
  const tagStyle = TAG_STYLES[product.tag] || 'bg-gray-100 text-gray-600 border-gray-200';
  const tagIcon  = TAG_ICONS[product.tag] || '🏷️';

  return (
    <div className="bg-white rounded-2xl p-3 flex flex-col shadow-sm border border-gray-100 hover:shadow-lg hover:border-blue-100 transition-all duration-300 group cursor-pointer">
      {/* Image */}
      <div className="relative aspect-square w-full rounded-xl overflow-hidden mb-3 bg-gray-50">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />
        {product.tag && (
          <div className={`absolute top-2 left-2 flex items-center gap-1 px-2 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wide border backdrop-blur-sm ${tagStyle}`}>
            <span>{tagIcon}</span>
            <span>{product.tag}</span>
          </div>
        )}
      </div>

      {/* Info */}
      <div className="flex flex-col flex-1 gap-1">
        <h4 className="font-semibold text-gray-800 text-sm leading-tight line-clamp-1">{product.name}</h4>

        {/* Rating */}
        <div className="flex items-center gap-1">
          <div className="flex">
            {[1, 2, 3, 4, 5].map(star => (
              <svg
                key={star}
                className={`w-3 h-3 ${star <= Math.round(product.rating) ? 'text-yellow-400' : 'text-gray-200'}`}
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
            ))}
          </div>
          <span className="text-[11px] font-medium text-gray-500">{product.rating}</span>
        </div>

        {/* Price & Action */}
        <div className="mt-auto pt-2 flex items-center justify-between">
          <span className="font-bold text-gray-900 text-base">₹{product.price.toLocaleString()}</span>
          <button className="text-xs font-semibold text-blue-600 bg-blue-50 hover:bg-blue-600 hover:text-white px-3 py-1.5 rounded-lg transition-all duration-200">
            View Details
          </button>
        </div>
      </div>
    </div>
  );
}
