import React, { useState, useMemo } from 'react';
import { 
  Search, 
  MessageCircle, 
  Send, 
  CheckCheck, 
  SlidersHorizontal,
  PlusCircle,
  Sparkles
} from 'lucide-react';
import { ChatThread, ThreadStatus, PlatformType } from '../types';

interface ConversationListProps {
  threads: ChatThread[];
  selectedThreadId: string | null;
  onSelectThread: (threadId: string) => void;
  language: 'kh' | 'en';
  onSimulateCustomerChat: () => void;
}

export const ConversationList: React.FC<ConversationListProps> = ({
  threads,
  selectedThreadId,
  onSelectThread,
  language,
  onSimulateCustomerChat,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<ThreadStatus>('all');
  const [platformFilter, setPlatformFilter] = useState<PlatformType | 'all'>('all');

  const statusTabs: { id: ThreadStatus; labelKh: string; labelEn: string }[] = [
    { id: 'all', labelKh: 'ទាំងអស់', labelEn: 'All' },
    { id: 'unread', labelKh: 'មិនទាន់អាន', labelEn: 'Unread' },
    { id: 'needs_reply', labelKh: 'ត្រូវឆ្លើយ', labelEn: 'Pending' },
    { id: 'ordered', labelKh: 'បានកុម្ម៉ង់', labelEn: 'Ordered' },
    { id: 'completed', labelKh: 'បញ្ចប់', labelEn: 'Done' },
  ];

  const filteredThreads = useMemo(() => {
    return threads.filter((thread) => {
      // Status filter
      if (statusFilter === 'unread' && thread.unreadCount === 0) return false;
      if (statusFilter === 'needs_reply' && thread.status !== 'needs_reply') return false;
      if (statusFilter === 'ordered' && thread.status !== 'ordered') return false;
      if (statusFilter === 'completed' && thread.status !== 'completed') return false;
      if (statusFilter === 'vip' && !thread.customer.tags.includes('VIP')) return false;

      // Platform filter
      if (platformFilter !== 'all' && thread.customer.platform !== platformFilter) return false;

      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchName = thread.customer.name.toLowerCase().includes(q);
        const matchPhone = thread.customer.phone.includes(q);
        const matchTag = thread.customer.tags.some(t => t.toLowerCase().includes(q));
        const matchMsg = thread.lastMessage.toLowerCase().includes(q);
        if (!matchName && !matchPhone && !matchTag && !matchMsg) return false;
      }

      return true;
    });
  }, [threads, statusFilter, platformFilter, searchQuery]);

  const getPlatformBadge = (platform: PlatformType) => {
    switch (platform) {
      case 'messenger':
        return <span className="w-4 h-4 rounded-full bg-blue-600 text-white flex items-center justify-center text-[10px] font-bold" title="Facebook Messenger">f</span>;
      case 'telegram':
        return <span className="w-4 h-4 rounded-full bg-sky-500 text-white flex items-center justify-center text-[10px] font-bold" title="Telegram">✈</span>;
      case 'tiktok':
        return <span className="w-4 h-4 rounded-full bg-black text-white flex items-center justify-center text-[10px] font-bold" title="TikTok Shop">♪</span>;
      default:
        return <span className="w-4 h-4 rounded-full bg-pink-500 text-white flex items-center justify-center text-[10px] font-bold">ig</span>;
    }
  };

  return (
    <div className="w-80 md:w-96 bg-white border-r border-slate-200 flex flex-col shrink-0 h-full">
      {/* Header & Search */}
      <div className="p-3 border-b border-slate-200">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <h2 className="text-base font-semibold text-slate-800">
              {language === 'kh' ? 'ប្រអប់សារឆាត' : 'Chat Inbox'}
            </h2>
            <span className="text-xs px-2 py-0.5 bg-slate-100 text-slate-600 rounded-full font-medium tabular-nums">
              {filteredThreads.length}
            </span>
          </div>

          <button
            onClick={onSimulateCustomerChat}
            className="flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium text-blue-700 bg-blue-50 hover:bg-blue-100 rounded-md transition-colors"
            title={language === 'kh' ? 'សាកល្បងទទួលសារអតិថិជនថ្មី' : 'Simulate incoming customer message'}
          >
            <Sparkles className="w-3.5 h-3.5 text-blue-600" />
            <span>{language === 'kh' ? 'សាកល្បងសារ' : 'Simulate'}</span>
          </button>
        </div>

        {/* Search Bar */}
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={language === 'kh' ? 'ស្វែងរកឈ្មោះ, លេខទូរស័ព្ទ, សារ...' : 'Search customer or phone...'}
            className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all placeholder:text-slate-400"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-600"
            >
              ✕
            </button>
          )}
        </div>

        {/* Status Filter Tabs */}
        <div className="flex items-center gap-1 mt-2.5 overflow-x-auto pb-1 scrollbar-none">
          {statusTabs.map((tab) => {
            const isActive = statusFilter === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setStatusFilter(tab.id)}
                className={`px-2.5 py-1 text-xs rounded-md whitespace-nowrap transition-colors font-medium ${
                  isActive
                    ? 'bg-slate-900 text-white shadow-xs'
                    : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                {language === 'kh' ? tab.labelKh : tab.labelEn}
              </button>
            );
          })}
        </div>
      </div>

      {/* Conversation Item List */}
      <div className="flex-1 overflow-y-auto divide-y divide-slate-100">
        {filteredThreads.length === 0 ? (
          <div className="p-8 text-center text-slate-400">
            <MessageCircle className="w-10 h-10 mx-auto text-slate-300 mb-2 stroke-[1.5]" />
            <p className="text-sm font-medium text-slate-600">
              {language === 'kh' ? 'មិនមានសារក្នុងប្រអប់នេះទេ' : 'No conversations found'}
            </p>
            <p className="text-xs text-slate-400 mt-1">
              {language === 'kh' ? 'ចុចប៊ូតុង "សាកល្បងសារ" ដើម្បីបង្កើតសារចូលថ្មី' : 'Click "Simulate" to test new incoming chat'}
            </p>
          </div>
        ) : (
          filteredThreads.map((thread) => {
            const isSelected = thread.id === selectedThreadId;
            return (
              <div
                key={thread.id}
                onClick={() => onSelectThread(thread.id)}
                className={`p-3 cursor-pointer transition-colors relative flex items-start gap-3 ${
                  isSelected
                    ? 'bg-blue-50/80 border-l-3 border-blue-600'
                    : 'hover:bg-slate-50'
                }`}
              >
                {/* Customer Avatar & Platform badge */}
                <div className="relative shrink-0">
                  <img
                    src={thread.customer.avatarUrl}
                    alt={thread.customer.name}
                    referrerPolicy="no-referrer"
                    className="w-11 h-11 rounded-full object-cover border border-slate-200"
                  />
                  <div className="absolute -bottom-1 -right-1">
                    {getPlatformBadge(thread.customer.platform)}
                  </div>
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-0.5">
                    <h3 className={`text-sm truncate ${thread.unreadCount > 0 ? 'font-bold text-slate-900' : 'font-medium text-slate-800'}`}>
                      {thread.customer.name}
                    </h3>
                    <span className="text-[11px] text-slate-400 whitespace-nowrap ml-2 tabular-nums">
                      {thread.lastMessageTime}
                    </span>
                  </div>

                  {/* Customer Province / Tag metadata */}
                  <div className="flex items-center gap-1.5 text-[11px] text-slate-500 mb-1">
                    <span>{thread.customer.province}</span>
                    {thread.customer.tags.length > 0 && (
                      <>
                        <span aria-hidden="true">·</span>
                        <span className="truncate text-blue-600">{thread.customer.tags[0]}</span>
                      </>
                    )}
                  </div>

                  {/* Last message preview */}
                  <div className="flex items-center justify-between gap-2">
                    <p className={`text-xs truncate ${thread.unreadCount > 0 ? 'text-slate-900 font-medium' : 'text-slate-500'}`}>
                      {thread.lastMessage}
                    </p>

                    {/* Unread badge */}
                    {thread.unreadCount > 0 && (
                      <span className="shrink-0 w-5 h-5 rounded-full bg-blue-600 text-white text-[11px] font-bold flex items-center justify-center tabular-nums">
                        {thread.unreadCount}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
