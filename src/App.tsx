import React, { useState, useEffect } from 'react';
import { Sidebar } from './components/Sidebar';
import { ConversationList } from './components/ConversationList';
import { ChatWindow } from './components/ChatWindow';
import { CustomerPanel } from './components/CustomerPanel';
import { OrderModal } from './components/OrderModal';
import { InvoicePrintModal } from './components/InvoicePrintModal';
import { QuickRepliesView } from './components/QuickRepliesView';
import { OrdersListView } from './components/OrdersListView';
import { ProductsCatalogView } from './components/ProductsCatalogView';
import { AnalyticsView } from './components/AnalyticsView';

import { 
  INITIAL_PAGES, 
  INITIAL_PRODUCTS, 
  INITIAL_QUICK_REPLIES, 
  INITIAL_AUTO_REPLIES, 
  INITIAL_ORDERS, 
  INITIAL_THREADS 
} from './data/initialData';

import { 
  PageAccount, 
  ChatThread, 
  ProductItem, 
  QuickReplyTemplate, 
  AutoReplyRule, 
  Order, 
  Customer,
  ChatMessage
} from './types';

import { soundNotifier } from './utils/audio';

export const App: React.FC = () => {
  const [pages, setPages] = useState<PageAccount[]>(INITIAL_PAGES);
  const [selectedPage, setSelectedPage] = useState<PageAccount>(INITIAL_PAGES[0]);
  const [threads, setThreads] = useState<ChatThread[]>(INITIAL_THREADS);
  const [selectedThreadId, setSelectedThreadId] = useState<string>('th_1');
  const [products, setProducts] = useState<ProductItem[]>(INITIAL_PRODUCTS);
  const [quickReplies, setQuickReplies] = useState<QuickReplyTemplate[]>(INITIAL_QUICK_REPLIES);
  const [autoReplies, setAutoReplies] = useState<AutoReplyRule[]>(INITIAL_AUTO_REPLIES);
  const [orders, setOrders] = useState<Order[]>(INITIAL_ORDERS);

  const [activeView, setActiveView] = useState<'inbox' | 'orders' | 'quick_replies' | 'products' | 'analytics'>('inbox');
  const [language, setLanguage] = useState<'kh' | 'en'>('kh');
  const [isOrderModalOpen, setIsOrderModalOpen] = useState(false);
  const [activeInvoiceOrderId, setActiveInvoiceOrderId] = useState<string | null>(null);

  // Selected thread
  const selectedThread = threads.find((t) => t.id === selectedThreadId) || threads[0];

  // Mark thread as read when selected
  const handleSelectThread = (threadId: string) => {
    setSelectedThreadId(threadId);
    setThreads((prev) =>
      prev.map((t) =>
        t.id === threadId ? { ...t, unreadCount: 0 } : t
      )
    );
  };

  // Send message from Admin
  const handleSendMessage = (text: string, attachments?: any[]) => {
    if (!selectedThread) return;

    const now = new Date();
    const timeStr = `${now.getHours()}:${String(now.getMinutes()).padStart(2, '0')} ${now.getHours() >= 12 ? 'PM' : 'AM'}`;

    const newMsg: ChatMessage = {
      id: `msg_${Date.now()}`,
      sender: 'admin',
      senderName: selectedPage.activeStaff,
      text,
      timestamp: timeStr,
      attachments,
      isRead: true,
    };

    setThreads((prev) =>
      prev.map((t) => {
        if (t.id === selectedThread.id) {
          return {
            ...t,
            lastMessage: text,
            lastMessageTime: timeStr,
            status: 'completed',
            messages: [...t.messages, newMsg],
          };
        }
        return t;
      })
    );

    soundNotifier.playMessageChime();
  };

  // Simulate new incoming customer chat
  const handleSimulateCustomerChat = () => {
    const customerPrompts = [
      {
        name: 'ស្រីណុច ម៉ានី',
        province: 'កំពង់ចាម',
        phone: '088 911 223',
        text: 'សួស្តីបង! រ៉ូបសូត្រពណ៌មាសនេះ នៅសល់ Size L អត់បង? តម្លៃប៉ុន្មានដែរ?',
      },
      {
        name: 'សុវណ្ណ ឧត្តម',
        province: 'រាជធានីភ្នំពេញ',
        phone: '015 678 901',
        text: 'បង កាសឥតខ្សែ Sonos Pro នេះ មានស្តុកអត់? ផ្ញើ Grab មកទួលគោកបានអត់?',
      },
      {
        name: 'ធីតា ពេជ្រ',
        province: 'បាត់ដំបង',
        phone: '097 334 556',
        text: 'សួស្តីចា៎ សេរ៉ូមមុខ Botanica នេះ ស្បែកមុខស្តើងប្រើត្រូវអត់បង? ផ្ញើលេខកុង ABA មកផង!',
      },
    ];

    const randomPick = customerPrompts[Math.floor(Math.random() * customerPrompts.length)];
    const now = new Date();
    const timeStr = `${now.getHours()}:${String(now.getMinutes()).padStart(2, '0')} ${now.getHours() >= 12 ? 'PM' : 'AM'}`;

    const newThreadId = `th_${Date.now()}`;
    const newCustomer: Customer = {
      id: `cust_${Date.now()}`,
      name: randomPick.name,
      avatarUrl: '/src/assets/images/avatar_cambodia_shopper_1791900576533.jpg',
      platform: 'messenger',
      phone: randomPick.phone,
      province: randomPick.province,
      address: `ក្រុង${randomPick.province}`,
      tags: ['អតិថិជនថ្មី'],
      totalOrders: 0,
      totalSpent: 0,
      notes: 'ភ្ញៀវទើបឆាតមកសួរនាំទំនិញ',
      createdAt: '2026-04-13',
    };

    const newChatMessage: ChatMessage = {
      id: `msg_${Date.now()}`,
      sender: 'customer',
      senderName: randomPick.name,
      text: randomPick.text,
      timestamp: timeStr,
    };

    const newThread: ChatThread = {
      id: newThreadId,
      pageId: selectedPage.id,
      customer: newCustomer,
      unreadCount: 1,
      status: 'needs_reply',
      lastMessage: randomPick.text,
      lastMessageTime: timeStr,
      orderIds: [],
      messages: [newChatMessage],
    };

    setThreads([newThread, ...threads]);
    setSelectedThreadId(newThreadId);
    soundNotifier.playMessageChime();

    // Check if auto-reply bot applies
    setTimeout(() => {
      const inputLower = randomPick.text.toLowerCase();
      const matched = autoReplies.find(
        (rule) => rule.enabled && rule.triggerKeywords.some((kw) => inputLower.includes(kw.toLowerCase()))
      );

      if (matched) {
        const botMsg: ChatMessage = {
          id: `bot_${Date.now()}`,
          sender: 'bot',
          senderName: 'PageChat Auto-Bot',
          text: matched.responseKh,
          timestamp: timeStr,
        };

        setThreads((prev) =>
          prev.map((t) => {
            if (t.id === newThreadId) {
              return {
                ...t,
                messages: [...t.messages, botMsg],
              };
            }
            return t;
          })
        );
        soundNotifier.playMessageChime();
      }
    }, 1200);
  };

  // Simulate customer replying to current active thread
  const handleSimulateCustomerReply = (threadId: string, replyText?: string) => {
    const defaultReplies = [
      'ចា៎បង អូនយកទំហំ M មួយ! ជួយធ្វើវិក្កយបត្រចេញឥវ៉ាន់ឲ្យអូនមក!',
      'បងផ្ញើតាម J&T មកផ្ទះលេខ 45B ផ្លូវ 315 ទួលគោកណា៎ ដល់ហើយតេមកលេខ 012 889 977',
      'អូខេបង អូនបានស្កេនបង់តាម KHQR ហើយណា៎!',
      'ចុះថ្លៃដឹកជញ្ជូនបន្តិចបានអត់បង? បើបានអូនយកឥឡូវហ្នឹង!',
    ];

    const text = replyText || defaultReplies[Math.floor(Math.random() * defaultReplies.length)];
    const now = new Date();
    const timeStr = `${now.getHours()}:${String(now.getMinutes()).padStart(2, '0')} ${now.getHours() >= 12 ? 'PM' : 'AM'}`;

    const newMsg: ChatMessage = {
      id: `msg_${Date.now()}`,
      sender: 'customer',
      senderName: selectedThread.customer.name,
      text,
      timestamp: timeStr,
    };

    setThreads((prev) =>
      prev.map((t) => {
        if (t.id === threadId) {
          return {
            ...t,
            lastMessage: text,
            lastMessageTime: timeStr,
            status: 'needs_reply',
            messages: [...t.messages, newMsg],
          };
        }
        return t;
      })
    );

    soundNotifier.playMessageChime();
  };

  // Update customer details from CRM panel
  const handleUpdateCustomer = (updated: Partial<Customer>) => {
    if (!selectedThread) return;
    setThreads((prev) =>
      prev.map((t) => {
        if (t.id === selectedThread.id) {
          return {
            ...t,
            customer: {
              ...t.customer,
              ...updated,
            },
          };
        }
        return t;
      })
    );
  };

  // Save new order created from modal
  const handleSaveOrder = (newOrder: Order) => {
    setOrders([newOrder, ...orders]);
    soundNotifier.playOrderSuccess();

    // Send invoice slip directly into chat thread
    const now = new Date();
    const timeStr = `${now.getHours()}:${String(now.getMinutes()).padStart(2, '0')} ${now.getHours() >= 12 ? 'PM' : 'AM'}`;

    const invoiceMsg: ChatMessage = {
      id: `msg_inv_${Date.now()}`,
      sender: 'admin',
      senderName: 'ប្រព័ន្ធគ្រប់គ្រងការកុម្ម៉ង់',
      text: `វិក្កយបត្របញ្ជាទិញ #${newOrder.orderNumber} ត្រូវបានបង្កើតដោយជោគជ័យ។\nសរុបទឹកប្រាក់៖ $${newOrder.total.toFixed(2)} (≈ ${newOrder.totalKhr.toLocaleString()} ៛)\nក្រុមហ៊ុនដឹកជញ្ជូន៖ ${newOrder.deliveryProvider === 'jt' ? 'J&T Express' : 'វីរៈប៊ុនថាំ'}`,
      timestamp: timeStr,
      attachments: [
        {
          type: 'order_invoice',
          data: {
            orderNumber: newOrder.orderNumber,
            total: newOrder.total,
            status: newOrder.status,
          },
        },
      ],
      isRead: true,
    };

    setThreads((prev) =>
      prev.map((t) => {
        if (t.id === selectedThread.id) {
          return {
            ...t,
            status: 'ordered',
            orderIds: [...t.orderIds, newOrder.id],
            customer: {
              ...t.customer,
              totalOrders: t.customer.totalOrders + 1,
              totalSpent: t.customer.totalSpent + newOrder.total,
              phone: newOrder.customerPhone,
              address: newOrder.customerAddress,
              province: newOrder.customerProvince,
              tags: Array.from(new Set([...t.customer.tags, 'បានកុម្ម៉ង់'])),
            },
            messages: [...t.messages, invoiceMsg],
          };
        }
        return t;
      })
    );
  };

  const handleUpdateOrderStatus = (orderId: string, status: Order['status']) => {
    setOrders((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, status } : o))
    );
  };

  // Quick replies management
  const handleAddQuickReply = (qr: Omit<QuickReplyTemplate, 'id'>) => {
    setQuickReplies([...quickReplies, { ...qr, id: `qr_${Date.now()}` }]);
  };

  const handleDeleteQuickReply = (id: string) => {
    setQuickReplies(quickReplies.filter((q) => q.id !== id));
  };

  const handleToggleAutoReply = (id: string) => {
    setAutoReplies((prev) =>
      prev.map((r) => (r.id === id ? { ...r, enabled: !r.enabled } : r))
    );
  };

  const handleAddAutoReply = (rule: Omit<AutoReplyRule, 'id'>) => {
    setAutoReplies([...autoReplies, { ...rule, id: `ar_${Date.now()}` }]);
  };

  const handleAddProduct = (prod: Omit<ProductItem, 'id'>) => {
    setProducts([...products, { ...prod, id: `prod_${Date.now()}` }]);
  };

  const handleSendProductToChat = (product: ProductItem) => {
    setActiveView('inbox');
    handleSendMessage(`ព័ត៌មានទំនិញ៖ ${product.nameKh} (តម្លៃ $${product.price.toFixed(2)})`, [
      {
        type: 'product',
        data: product,
      },
    ]);
  };

  // Find invoice order to display
  const activeInvoiceOrder = orders.find((o) => o.id === activeInvoiceOrderId) || null;

  const totalUnreadCount = threads.reduce((acc, t) => acc + (t.unreadCount > 0 ? 1 : 0), 0);

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-slate-100 font-sans">
      {/* 1. Left Navigation Sidebar */}
      <Sidebar
        pages={pages}
        selectedPage={selectedPage}
        onSelectPage={setSelectedPage}
        activeView={activeView}
        onChangeView={setActiveView}
        totalUnread={totalUnreadCount}
        totalOrdersCount={orders.length}
        language={language}
        onToggleLanguage={() => setLanguage(language === 'kh' ? 'en' : 'kh')}
      />

      {/* 2. Main Work View */}
      {activeView === 'inbox' && (
        <div className="flex flex-1 h-full overflow-hidden">
          {/* Conversation list */}
          <ConversationList
            threads={threads}
            selectedThreadId={selectedThreadId}
            onSelectThread={handleSelectThread}
            language={language}
            onSimulateCustomerChat={handleSimulateCustomerChat}
          />

          {/* Active Chat Window */}
          {selectedThread ? (
            <ChatWindow
              thread={selectedThread}
              quickReplies={quickReplies}
              products={products}
              orders={orders}
              onSendMessage={handleSendMessage}
              onOpenCreateOrder={() => setIsOrderModalOpen(true)}
              onViewOrderInvoice={(orderId) => setActiveInvoiceOrderId(orderId)}
              onSimulateCustomerReply={handleSimulateCustomerReply}
              language={language}
            />
          ) : (
            <div className="flex-1 flex items-center justify-center text-slate-400">
              {language === 'kh' ? 'សូមជ្រើសរើសការសន្ទនា' : 'Select a conversation'}
            </div>
          )}

          {/* Right Customer CRM Panel */}
          {selectedThread && (
            <div className="hidden lg:block">
              <CustomerPanel
                customer={selectedThread.customer}
                orders={orders}
                onUpdateCustomer={handleUpdateCustomer}
                onOpenCreateOrder={() => setIsOrderModalOpen(true)}
                onViewOrderInvoice={(orderId) => setActiveInvoiceOrderId(orderId)}
                language={language}
              />
            </div>
          )}
        </div>
      )}

      {activeView === 'orders' && (
        <OrdersListView
          orders={orders}
          onViewInvoice={(id) => setActiveInvoiceOrderId(id)}
          onUpdateStatus={handleUpdateOrderStatus}
          language={language}
        />
      )}

      {activeView === 'quick_replies' && (
        <QuickRepliesView
          quickReplies={quickReplies}
          autoReplies={autoReplies}
          onAddQuickReply={handleAddQuickReply}
          onDeleteQuickReply={handleDeleteQuickReply}
          onToggleAutoReply={handleToggleAutoReply}
          onAddAutoReply={handleAddAutoReply}
          language={language}
        />
      )}

      {activeView === 'products' && (
        <ProductsCatalogView
          products={products}
          onAddProduct={handleAddProduct}
          onSendProductToChat={handleSendProductToChat}
          language={language}
        />
      )}

      {activeView === 'analytics' && (
        <AnalyticsView
          orders={orders}
          threads={threads}
          language={language}
        />
      )}

      {/* Order Creation Modal */}
      {selectedThread && (
        <OrderModal
          isOpen={isOrderModalOpen}
          onClose={() => setIsOrderModalOpen(false)}
          customer={selectedThread.customer}
          products={products}
          pageId={selectedPage.id}
          threadId={selectedThread.id}
          onSaveOrder={handleSaveOrder}
          language={language}
        />
      )}

      {/* Invoice Slip Print Modal */}
      <InvoicePrintModal
        order={activeInvoiceOrder}
        page={selectedPage}
        onClose={() => setActiveInvoiceOrderId(null)}
        onUpdateOrderStatus={handleUpdateOrderStatus}
        language={language}
      />
    </div>
  );
};
