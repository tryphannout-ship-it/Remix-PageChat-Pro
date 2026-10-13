import React, { useState } from 'react';
import { 
  Package, 
  Plus, 
  Search, 
  Send, 
  DollarSign, 
  Tag, 
  Check, 
  ShoppingBag
} from 'lucide-react';
import { ProductItem } from '../types';

interface ProductsCatalogViewProps {
  products: ProductItem[];
  onAddProduct: (prod: Omit<ProductItem, 'id'>) => void;
  onSendProductToChat?: (product: ProductItem) => void;
  language: 'kh' | 'en';
}

export const ProductsCatalogView: React.FC<ProductsCatalogViewProps> = ({
  products,
  onAddProduct,
  onSendProductToChat,
  language,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);

  // New product state
  const [nameKh, setNameKh] = useState('');
  const [price, setPrice] = useState('25.00');
  const [stock, setStock] = useState('20');
  const [sku, setSku] = useState('PRD-01');
  const [category, setCategory] = useState('Fashion');
  const [description, setDescription] = useState('');

  const filtered = products.filter((p) => {
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        p.nameKh.toLowerCase().includes(q) ||
        p.name.toLowerCase().includes(q) ||
        p.sku.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    const pVal = parseFloat(price) || 0;
    const sVal = parseInt(stock) || 0;
    onAddProduct({
      name: nameKh,
      nameKh,
      price: pVal,
      priceKhr: Math.round(pVal * 4100),
      stock: sVal,
      sku,
      category,
      imageUrl: '/src/assets/images/product_silk_dress_1791900574999.jpg',
      description,
    });
    setNameKh('');
    setDescription('');
    setShowAddModal(false);
  };

  return (
    <div className="flex-1 bg-slate-50 flex flex-col h-full overflow-y-auto">
      {/* Header */}
      <div className="p-6 bg-white border-b border-slate-200 shrink-0 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-slate-900">
            {language === 'kh' ? 'ទំនិញក្នុងស្តុក (Product Catalog)' : 'Product Catalog'}
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            {language === 'kh'
              ? 'គ្រប់គ្រងតម្លៃ ចំនួនស្តុក និងផ្ញើព័ត៌មានទំនិញចូលក្នុងឆាតអតិថិជនរហ័ស'
              : 'Manage products, stock quantity, and send to chat instantly'}
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors shadow-xs"
        >
          <Plus className="w-4 h-4" />
          <span>{language === 'kh' ? 'បញ្ចូលទំនិញថ្មី' : 'Add Product'}</span>
        </button>
      </div>

      <div className="p-6 space-y-4">
        {/* Search */}
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={language === 'kh' ? 'ស្វែងរកឈ្មោះទំនិញ, កូដ SKU...' : 'Search products...'}
            className="w-full pl-9 pr-3 py-1.5 text-xs bg-white border border-slate-200 rounded-lg focus:outline-none"
          />
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filtered.map((prod) => (
            <div
              key={prod.id}
              className="bg-white border border-slate-200/90 rounded-2xl overflow-hidden hover:shadow-md transition-shadow flex flex-col justify-between"
            >
              <div>
                <div className="relative aspect-square bg-slate-100 overflow-hidden">
                  <img
                    src={prod.imageUrl}
                    alt={prod.nameKh}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover"
                  />
                  <span className="absolute top-2.5 right-2.5 px-2 py-0.5 bg-slate-900/80 backdrop-blur-xs text-white text-[10px] font-mono rounded-md">
                    {prod.sku}
                  </span>
                </div>

                <div className="p-4">
                  <div className="text-[11px] font-medium text-slate-400 mb-1 uppercase tracking-wider">
                    {prod.category}
                  </div>
                  <h3 className="font-semibold text-slate-900 text-sm line-clamp-1 mb-1">
                    {prod.nameKh}
                  </h3>
                  <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed mb-3">
                    {prod.description}
                  </p>

                  <div className="flex items-baseline justify-between pt-2 border-t border-slate-100">
                    <div>
                      <p className="text-base font-bold text-blue-600 tabular-nums">
                        ${prod.price.toFixed(2)}
                      </p>
                      <p className="text-[10px] text-slate-400 tabular-nums">
                        ≈ {prod.priceKhr.toLocaleString()} ៛
                      </p>
                    </div>
                    <div className="text-right">
                      <span className="text-[11px] text-slate-500 block">ស្តុកនៅសល់</span>
                      <span className="text-xs font-bold text-slate-800 tabular-nums">
                        {prod.stock} {language === 'kh' ? 'កំប្លេ' : 'pcs'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {onSendProductToChat && (
                <div className="p-3 bg-slate-50 border-t border-slate-100">
                  <button
                    onClick={() => onSendProductToChat(prod)}
                    className="w-full flex items-center justify-center gap-1.5 py-1.5 px-3 text-xs font-medium text-blue-700 bg-blue-50 hover:bg-blue-100 border border-blue-200/80 rounded-lg transition-colors"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>{language === 'kh' ? 'ផ្ញើទៅឆាតកំពុងបើក' : 'Send to Active Chat'}</span>
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Add Product Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-6 animate-in fade-in zoom-in-95">
            <h3 className="text-sm font-bold text-slate-900 mb-4">
              {language === 'kh' ? 'បញ្ចូលមុខទំនិញថ្មី' : 'Add New Product'}
            </h3>

            <form onSubmit={handleCreate} className="space-y-3">
              <div>
                <label className="text-xs font-medium text-slate-700 block mb-1">
                  {language === 'kh' ? 'ឈ្មោះទំនិញ' : 'Product Name'}
                </label>
                <input
                  type="text"
                  required
                  value={nameKh}
                  onChange={(e) => setNameKh(e.target.value)}
                  placeholder="ឧ. រ៉ូបសូត្រខ្មែរ..."
                  className="w-full px-3 py-1.5 text-xs border border-slate-200 rounded-lg"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-medium text-slate-700 block mb-1">
                    {language === 'kh' ? 'តម្លៃ ($)' : 'Price ($)'}
                  </label>
                  <input
                    type="number"
                    step="0.5"
                    required
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    className="w-full px-3 py-1.5 text-xs border border-slate-200 rounded-lg"
                  />
                </div>
                <div>
                  <label className="text-xs font-medium text-slate-700 block mb-1">
                    {language === 'kh' ? 'ចំនួនស្តុក' : 'Stock'}
                  </label>
                  <input
                    type="number"
                    required
                    value={stock}
                    onChange={(e) => setStock(e.target.value)}
                    className="w-full px-3 py-1.5 text-xs border border-slate-200 rounded-lg"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-medium text-slate-700 block mb-1">កូដ SKU</label>
                  <input
                    type="text"
                    required
                    value={sku}
                    onChange={(e) => setSku(e.target.value)}
                    className="w-full px-3 py-1.5 text-xs border border-slate-200 rounded-lg font-mono"
                  />
                </div>
                <div>
                  <label className="text-xs font-medium text-slate-700 block mb-1">ផ្នែក</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full px-3 py-1.5 text-xs border border-slate-200 rounded-lg"
                  >
                    <option value="Fashion">Fashion</option>
                    <option value="Beauty">Beauty</option>
                    <option value="Electronics">Electronics</option>
                    <option value="General">General</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-xs font-medium text-slate-700 block mb-1">បរិយាយទំនិញ</label>
                <textarea
                  rows={2}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-3 py-1.5 text-xs border border-slate-200 rounded-lg"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-3 py-1.5 text-xs text-slate-600 hover:bg-slate-100 rounded-lg"
                >
                  បោះបង់
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg"
                >
                  បញ្ចូល
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
