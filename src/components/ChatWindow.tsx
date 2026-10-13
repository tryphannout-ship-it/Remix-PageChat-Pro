import React, { useState, useRef, useEffect } from 'react';
import { 
  Send, 
  ShoppingBag, 
  Zap, 
  Image as ImageIcon, 
  Phone, 
  FileText, 
  Sparkles, 
  CheckCircle2, 
  CornerDownLeft,
  Tag,
  Paperclip,
  Check,
  Package
} from 'lucide-react';
import { ChatThread, ChatMessage, QuickReplyTemplate, ProductItem, Order } from '../types';

interface ChatWindowProps {
  thread: ChatThread;
  quickReplies: QuickReplyTemplate[];
  products: ProductItem[];
  orders: Order[];
  onSendMessage: (text: string, attachments?: any[]) => void;
  onOpenCreateOrder: () => void;
  onViewOrderInvoice: (orderId: string) => void;
  onSimulateCustomerReply: (threadId: string, replyText?: string) => void;
  language: 'kh' | 'en';
}

export const ChatWindow: React.FC<ChatWindowProps> = ({
  thread,
  quickReplies,
  products,
  orders,
  onSendMessage,
  onOpenCreateOrder,
  onViewOrderInvoice,
  onSimulateCustomerReply,
  language,
}) => {
  const [inputText, setInputText] = useState('');
  const [showQuickReplyMenu, setShowQuickReplyMenu] = useState(false);
  const [showProductPicker, setShowProductPicker] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [thread.messages]);

  const handleSend = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!inputText.trim()) return;

    onSendMessage(inputText.trim());
    setInputText('');
    setShowQuickReplyMenu(false);
  };

  const handleSelectQuickReply = (qr: QuickReplyTemplate) => {
    onSendMessage(qr.content);
    setShowQuickReplyMenu(false);
    setInputText('');
  };

  const handleSendProduct = (product: ProductItem) => {
    onSendMessage(`ព័ត៌មានទំនិញ៖ ${product.nameKh} (តម្លៃ $${product.price.toFixed(2)})`, [
      {
        type: 'product',
        data: product,
      },
    ]);
    setShowProductPicker(false);
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-slate-50 relative">
      {/* Top Chat Header */}
      <div className="h-16 px-4 bg-white border-b border-slate-200 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-3 min-w-0">
          <div className="relative">
            <img
              src={thread.customer.avatarUrl}
              alt={thread.customer.name}
              referrerPolicy="no-referrer"
              className="w-10 h-10 rounded-full object-cover border border-slate-200"
            />
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 absolute bottom-0 right-0 border-2 border-white"></span>
          </div>

          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <h2 className="text-sm font-semibold text-slate-900 truncate">
                {thread.customer.name}
              </h2>
              <span className="text-[11px] text-slate-500 hidden sm:inline">
                {thread.customer.phone}
              </span>
            </div>
            <div className="flex items-center gap-2 text-[11px] text-slate-500">
              <span className="capitalize">{thread.customer.platform}</span>
              <span aria-hidden="true">·</span>
              <span>{thread.customer.province}</span>
              {thread.customer.tags.length > 0 && (
                <>
                  <span aria-hidden="true">·</span>
                  <span className="text-blue-600 font-medium">{thread.customer.tags[0]}</span>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Top Actions */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => onSimulateCustomerReply(thread.id)}
            className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-amber-800 bg-amber-50 hover:bg-amber-100 border border-amber-200/80 rounded-lg transition-colors"
            title="អតិថិជនសួរនាំបន្ថែម"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-600" />
            <span>{language === 'kh' ? 'អតិថិជនតប' : 'Customer Reply'}</span>
          </button>

          <button
            onClick={onOpenCreateOrder}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors shadow-xs"
          >
            <ShoppingBag className="w-3.5 h-3.5" />
            <span>{language === 'kh' ? 'បង្កើតវិក្កយបត្រ' : 'Create Order'}</span>
          </button>
        </div>
      </div>

      {/* Messages Feed */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {/* Date divider */}
        <div className="flex justify-center">
          <span className="px-3 py-0.5 text-[11px] font-medium text-slate-400 bg-slate-200/60 rounded-full">
            {language === 'kh' ? 'សារសន្ទនាថ្ងៃនេះ' : 'Today'}
          </span>
        </div>

        {thread.messages.map((msg) => {
          const isMe = msg.sender === 'admin' || msg.sender === 'bot';
          const isBot = msg.sender === 'bot';

          return (
            <div
              key={msg.id}
              className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}
            >
              {/* Sender name for bot or admin */}
              <div className="flex items-center gap-1 text-[11px] text-slate-400 mb-1 px-1">
                <span>{msg.senderName}</span>
                {isBot && (
                  <span className="text-[10px] text-blue-600 font-semibold px-1 py-0.2 bg-blue-50 rounded">
                    BOT
                  </span>
                )}
                <span>·</span>
                <span className="tabular-nums">{msg.timestamp}</span>
              </div>

              {/* Message Bubble */}
              <div
                className={`max-w-[85%] md:max-w-[70%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed whitespace-pre-wrap ${
                  isMe
                    ? isBot
                      ? 'bg-blue-50 text-slate-800 border border-blue-200 rounded-tr-xs'
                      : 'bg-blue-600 text-white rounded-tr-xs shadow-xs'
                    : 'bg-white text-slate-800 border border-slate-200/80 rounded-tl-xs shadow-xs'
                }`}
              >
                {msg.text}

                {/* Attachments */}
                {msg.attachments && msg.attachments.length > 0 && (
                  <div className="mt-2.5 pt-2 border-t border-black/10 space-y-2">
                    {msg.attachments.map((att, idx) => {
                      if (att.type === 'product') {
                        const prod = att.data as ProductItem;
                        return (
                          <div
                            key={idx}
                            className="p-2.5 rounded-xl bg-white text-slate-900 border border-slate-200 flex items-center gap-3"
                          >
                            <img
                              src={prod.imageUrl}
                              alt={prod.nameKh}
                              referrerPolicy="no-referrer"
                              className="w-12 h-12 rounded-lg object-cover border border-slate-100"
                            />
                            <div className="min-w-0 flex-1">
                              <p className="text-xs font-semibold truncate">{prod.nameKh}</p>
                              <p className="text-[11px] text-blue-600 font-bold tabular-nums">
                                ${prod.price.toFixed(2)} (≈ {prod.priceKhr.toLocaleString()} ៛)
                              </p>
                              <p className="text-[10px] text-slate-500">ស្តុកនៅសល់៖ {prod.stock}</p>
                            </div>
                          </div>
                        );
                      }

                      if (att.type === 'order_invoice') {
                        const ord = att.data;
                        return (
                          <div
                            key={idx}
                            className="p-3 rounded-xl bg-slate-900 text-white border border-slate-800 flex items-center justify-between gap-3 shadow-md"
                          >
                            <div className="flex items-center gap-2.5">
                              <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold text-xs">
                                វិ
                              </div>
                              <div>
                                <p className="text-xs font-semibold">
                                  វិក្កយបត្រ #{ord.orderNumber}
                                </p>
                                <p className="text-[11px] text-emerald-400 font-bold tabular-nums">
                                  សរុប៖ ${Number(ord.total).toFixed(2)}
                                </p>
                              </div>
                            </div>

                            <button
                              onClick={() => {
                                // Find full order id
                                const found = orders.find(o => o.orderNumber === ord.orderNumber);
                                if (found) {
                                  onViewOrderInvoice(found.id);
                                }
                              }}
                              className="px-2.5 py-1 text-xs bg-white text-slate-900 font-medium rounded-lg hover:bg-slate-100 transition-colors"
                            >
                              {language === 'kh' ? 'មើលវិក្កយបត្រ' : 'View Slip'}
                            </button>
                          </div>
                        );
                      }

                      return null;
                    })}
                  </div>
                )}
              </div>
            </div>
          );
        })}

        <div ref={messagesEndRef} />
      </div>

      {/* Quick Reply & Attachment Drawer */}
      {showQuickReplyMenu && (
        <div className="bg-white border-t border-slate-200 p-3 shadow-lg max-h-56 overflow-y-auto">
          <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-100">
            <span className="text-xs font-semibold text-slate-700 flex items-center gap-1.5">
              <Zap className="w-3.5 h-3.5 text-amber-500" />
              {language === 'kh' ? 'សារឆ្លើយតបរហ័ស (Canned Responses)' : 'Quick Canned Responses'}
            </span>
            <button
              onClick={() => setShowQuickReplyMenu(false)}
              className="text-xs text-slate-400 hover:text-slate-600"
            >
              ✕
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {quickReplies.map((qr) => (
              <button
                key={qr.id}
                onClick={() => handleSelectQuickReply(qr)}
                className="p-2 text-left bg-slate-50 hover:bg-blue-50 hover:border-blue-200 border border-slate-200/80 rounded-lg transition-colors group"
              >
                <div className="flex items-center justify-between text-xs font-semibold text-slate-800 group-hover:text-blue-700">
                  <span>{qr.titleKh}</span>
                  <span className="font-mono text-[10px] text-slate-400 bg-white px-1.5 py-0.5 rounded border border-slate-200">
                    {qr.shortcut}
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 line-clamp-1 mt-0.5">
                  {qr.content}
                </p>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Product Picker Drawer */}
      {showProductPicker && (
        <div className="bg-white border-t border-slate-200 p-3 shadow-lg max-h-60 overflow-y-auto">
          <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-100">
            <span className="text-xs font-semibold text-slate-700 flex items-center gap-1.5">
              <Package className="w-3.5 h-3.5 text-blue-600" />
              {language === 'kh' ? 'ជ្រើសទំនិញដើម្បីផ្ញើក្នុងឆាត' : 'Select Product to Send'}
            </span>
            <button
              onClick={() => setShowProductPicker(false)}
              className="text-xs text-slate-400 hover:text-slate-600"
            >
              ✕
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            {products.map((p) => (
              <button
                key={p.id}
                onClick={() => handleSendProduct(p)}
                className="p-2 flex items-center gap-2 bg-slate-50 hover:bg-blue-50 border border-slate-200/80 rounded-lg text-left transition-colors"
              >
                <img
                  src={p.imageUrl}
                  alt={p.nameKh}
                  referrerPolicy="no-referrer"
                  className="w-10 h-10 rounded-md object-cover border border-slate-200 shrink-0"
                />
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-medium text-slate-800 truncate">{p.nameKh}</p>
                  <p className="text-[11px] font-bold text-blue-600 tabular-nums">
                    ${p.price.toFixed(2)}
                  </p>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Chat Input Toolbar & Form */}
      <div className="p-3 bg-white border-t border-slate-200 shrink-0">
        <div className="flex items-center gap-2 mb-2">
          {/* Quick Reply Button */}
          <button
            type="button"
            onClick={() => {
              setShowQuickReplyMenu(!showQuickReplyMenu);
              setShowProductPicker(false);
            }}
            className={`flex items-center gap-1 px-2.5 py-1 text-xs rounded-md transition-colors font-medium ${
              showQuickReplyMenu
                ? 'bg-amber-100 text-amber-800'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            <Zap className="w-3.5 h-3.5 text-amber-500" />
            <span>{language === 'kh' ? 'សារកាត់ ( / )' : 'Quick Reply'}</span>
          </button>

          {/* Catalog Attach Button */}
          <button
            type="button"
            onClick={() => {
              setShowProductPicker(!showProductPicker);
              setShowQuickReplyMenu(false);
            }}
            className={`flex items-center gap-1 px-2.5 py-1 text-xs rounded-md transition-colors font-medium ${
              showProductPicker
                ? 'bg-blue-100 text-blue-800'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            <Package className="w-3.5 h-3.5 text-blue-600" />
            <span>{language === 'kh' ? 'ផ្ញើទំនិញ' : 'Product'}</span>
          </button>

          {/* Bank ABA QR button */}
          <button
            type="button"
            onClick={() => {
              onSendMessage(
                'បងអាចទូទាត់តាម ABA ឬស្កេន KHQR បានចា៎៖\n- ABA Account: 001 234 567 (MALIS BOUTIQUE)\n- ឬអាចបង់លុយពេលដឹកដល់ផ្ទះ (COD) ក៏បានដែរចា៎!'
              );
            }}
            className="flex items-center gap-1 px-2.5 py-1 text-xs rounded-md bg-slate-100 hover:bg-slate-200 text-slate-600 transition-colors font-medium"
          >
            <span className="font-bold text-[10px] text-blue-600">ABA</span>
            <span>{language === 'kh' ? 'គណនីបង់ប្រាក់' : 'Bank QR'}</span>
          </button>
        </div>

        {/* Input Form */}
        <form onSubmit={handleSend} className="flex items-center gap-2">
          <input
            ref={inputRef}
            type="text"
            value={inputText}
            onChange={(e) => {
              setInputText(e.target.value);
              if (e.target.value === '/') {
                setShowQuickReplyMenu(true);
              }
            }}
            placeholder={language === 'kh' ? 'សរសេរសារតបទៅអតិថិជន... (វាយ / ដើម្បីបើកសារកាត់)' : 'Type a reply... (type / for shortcuts)'}
            className="flex-1 px-3.5 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all placeholder:text-slate-400"
          />

          <button
            type="submit"
            disabled={!inputText.trim()}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-200 disabled:text-slate-400 text-white font-medium text-sm rounded-lg transition-colors flex items-center gap-1.5 shadow-xs shrink-0"
          >
            <Send className="w-4 h-4" />
            <span className="hidden sm:inline">{language === 'kh' ? 'ផ្ញើសារ' : 'Send'}</span>
          </button>
        </form>
      </div>
    </div>
  );
};
