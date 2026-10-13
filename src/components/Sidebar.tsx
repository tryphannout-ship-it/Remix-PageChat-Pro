import React, { useState } from 'react';
import { 
  MessageSquare, 
  ShoppingBag, 
  Zap, 
  Package, 
  BarChart3, 
  ChevronDown, 
  Check, 
  Store,
  Globe,
  Radio
} from 'lucide-react';
import { PageAccount } from '../types';

interface SidebarProps {
  pages: PageAccount[];
  selectedPage: PageAccount;
  onSelectPage: (page: PageAccount) => void;
  activeView: 'inbox' | 'orders' | 'quick_replies' | 'products' | 'analytics';
  onChangeView: (view: 'inbox' | 'orders' | 'quick_replies' | 'products' | 'analytics') => void;
  totalUnread: number;
  totalOrdersCount: number;
  language: 'kh' | 'en';
  onToggleLanguage: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  pages,
  selectedPage,
  onSelectPage,
  activeView,
  onChangeView,
  totalUnread,
  totalOrdersCount,
  language,
  onToggleLanguage,
}) => {
  const [showPageMenu, setShowPageMenu] = useState(false);

  const navItems = [
    {
      id: 'inbox' as const,
      labelKh: 'ឆាតផេក',
      labelEn: 'Page Inbox',
      icon: MessageSquare,
      badge: totalUnread > 0 ? totalUnread : null,
    },
    {
      id: 'orders' as const,
      labelKh: 'ការកុម្ម៉ង់',
      labelEn: 'Orders',
      icon: ShoppingBag,
      badge: totalOrdersCount > 0 ? totalOrdersCount : null,
    },
    {
      id: 'quick_replies' as const,
      labelKh: 'ឆ្លើយរហ័ស & Bot',
      labelEn: 'Quick Reply & Bot',
      icon: Zap,
      badge: null,
    },
    {
      id: 'products' as const,
      labelKh: 'ទំនិញក្នុងស្តុក',
      labelEn: 'Product Catalog',
      icon: Package,
      badge: null,
    },
    {
      id: 'analytics' as const,
      labelKh: 'របាយការណ៍លក់',
      labelEn: 'Sales Analytics',
      icon: BarChart3,
      badge: null,
    },
  ];

  return (
    <aside className="w-64 bg-slate-900 text-slate-200 flex flex-col border-r border-slate-800 shrink-0 select-none">
      {/* App Brand Header */}
      <div className="h-16 px-4 flex items-center justify-between border-b border-slate-800">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-lg bg-blue-600 flex items-center justify-center text-white font-bold text-lg shadow-sm">
            ឆ
          </div>
          <div>
            <h1 className="font-semibold text-white text-base leading-tight">
              PageChat <span className="text-blue-400 font-normal text-xs">PRO</span>
            </h1>
            <p className="text-[11px] text-slate-400">
              {language === 'kh' ? 'ប្រព័ន្ធគ្រប់គ្រងឆាតផេក' : 'Social Page Manager'}
            </p>
          </div>
        </div>

        <button
          onClick={onToggleLanguage}
          title={language === 'kh' ? 'ប្តូរជាភាសាអង់គ្លេស' : 'Switch to Khmer'}
          className="text-xs px-2 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded border border-slate-700 flex items-center gap-1 transition-colors"
        >
          <Globe className="w-3 h-3" />
          <span>{language === 'kh' ? 'ខ្មែរ' : 'EN'}</span>
        </button>
      </div>

      {/* Page Selector Dropdown */}
      <div className="p-3 border-b border-slate-800 relative">
        <button
          onClick={() => setShowPageMenu(!showPageMenu)}
          className="w-full flex items-center justify-between p-2 rounded-lg bg-slate-800/80 hover:bg-slate-800 border border-slate-700/60 transition-colors text-left"
        >
          <div className="flex items-center gap-2.5 min-w-0">
            <img
              src={selectedPage.avatar}
              alt={selectedPage.name}
              referrerPolicy="no-referrer"
              className="w-8 h-8 rounded-full object-cover border border-slate-600 shrink-0"
            />
            <div className="min-w-0 flex-1">
              <div className="text-xs font-medium text-white truncate">
                {selectedPage.name}
              </div>
              <div className="text-[10px] text-slate-400 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                <span>{selectedPage.followerCount}</span>
              </div>
            </div>
          </div>
          <ChevronDown className="w-4 h-4 text-slate-400 shrink-0 ml-1" />
        </button>

        {showPageMenu && (
          <div className="absolute top-full left-3 right-3 mt-1 bg-slate-800 border border-slate-700 rounded-lg shadow-xl z-50 py-1">
            <div className="px-3 py-1 text-[11px] font-medium text-slate-400 uppercase tracking-wider">
              {language === 'kh' ? 'ផេកដែលបានភ្ជាប់' : 'Connected Pages'}
            </div>
            {pages.map((p) => (
              <button
                key={p.id}
                onClick={() => {
                  onSelectPage(p);
                  setShowPageMenu(false);
                }}
                className="w-full px-3 py-2 flex items-center justify-between hover:bg-slate-700/70 text-left transition-colors"
              >
                <div className="flex items-center gap-2 min-w-0">
                  <img
                    src={p.avatar}
                    alt={p.name}
                    referrerPolicy="no-referrer"
                    className="w-6 h-6 rounded-full object-cover shrink-0"
                  />
                  <div className="min-w-0">
                    <p className="text-xs font-medium text-slate-200 truncate">{p.name}</p>
                    <p className="text-[10px] text-slate-400 truncate">{p.category}</p>
                  </div>
                </div>
                {p.id === selectedPage.id && (
                  <Check className="w-4 h-4 text-blue-400 shrink-0 ml-1" />
                )}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Nav Menu */}
      <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeView === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onChangeView(item.id)}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                isActive
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-300 hover:bg-slate-800/80 hover:text-white'
              }`}
            >
              <div className="flex items-center gap-3">
                <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                <span>{language === 'kh' ? item.labelKh : item.labelEn}</span>
              </div>
              {item.badge !== null && (
                <span
                  className={`text-[11px] font-semibold px-2 py-0.5 rounded-full tabular-nums ${
                    isActive
                      ? 'bg-white text-blue-700'
                      : 'bg-blue-600/30 text-blue-300'
                  }`}
                >
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Bottom Status / Profile */}
      <div className="p-3 border-t border-slate-800 bg-slate-900/50">
        <div className="flex items-center justify-between text-xs text-slate-400 mb-2 px-1">
          <div className="flex items-center gap-1.5">
            <Radio className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
            <span>{language === 'kh' ? 'ប្រព័ន្ធដំណើរការធម្មតា' : 'Live Connected'}</span>
          </div>
          <span className="text-[10px] text-slate-500">v2.4</span>
        </div>

        <div className="flex items-center gap-2.5 p-2 rounded-lg bg-slate-800/40 border border-slate-800">
          <div className="w-7 h-7 rounded-full bg-slate-700 flex items-center justify-center text-xs font-bold text-slate-300">
            A
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-xs font-medium text-slate-200 truncate">{selectedPage.activeStaff}</p>
            <p className="text-[10px] text-slate-400 truncate">Page Admin</p>
          </div>
        </div>
      </div>
    </aside>
  );
};
