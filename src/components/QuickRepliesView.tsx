import React, { useState } from 'react';
import { 
  Zap, 
  Bot, 
  Plus, 
  Trash2, 
  Check, 
  Sparkles, 
  ToggleLeft, 
  ToggleRight,
  Search,
  MessageSquare
} from 'lucide-react';
import { QuickReplyTemplate, AutoReplyRule } from '../types';

interface QuickRepliesViewProps {
  quickReplies: QuickReplyTemplate[];
  autoReplies: AutoReplyRule[];
  onAddQuickReply: (qr: Omit<QuickReplyTemplate, 'id'>) => void;
  onDeleteQuickReply: (id: string) => void;
  onToggleAutoReply: (id: string) => void;
  onAddAutoReply: (rule: Omit<AutoReplyRule, 'id'>) => void;
  language: 'kh' | 'en';
}

export const QuickRepliesView: React.FC<QuickRepliesViewProps> = ({
  quickReplies,
  autoReplies,
  onAddQuickReply,
  onDeleteQuickReply,
  onToggleAutoReply,
  onAddAutoReply,
  language,
}) => {
  const [activeTab, setActiveTab] = useState<'quick' | 'bot'>('quick');

  // New Quick Reply Modal/State
  const [showAddQr, setShowAddQr] = useState(false);
  const [shortcut, setShortcut] = useState('/');
  const [titleKh, setTitleKh] = useState('');
  const [content, setContent] = useState('');

  // New Auto Reply State
  const [showAddBot, setShowAddBot] = useState(false);
  const [botKeywords, setBotKeywords] = useState('');
  const [botReplyKh, setBotReplyKh] = useState('');

  // Test Simulator
  const [testInput, setTestInput] = useState('');
  const [testResult, setTestResult] = useState<string | null>(null);

  const handleTestBot = () => {
    if (!testInput.trim()) return;
    const input = testInput.toLowerCase();
    const matchedRule = autoReplies.find((rule) => {
      if (!rule.enabled) return false;
      return rule.triggerKeywords.some((k) => input.includes(k.toLowerCase()));
    });

    if (matchedRule) {
      setTestResult(`🤖 Bot នឹងឆ្លើយតប៖ "${matchedRule.responseKh}"`);
    } else {
      setTestResult('⚠️ មិនមានពាក្យគន្លឹះត្រូវគ្នាទេ (បុគ្គលិក Admin នឹងឆ្លើយផ្ទាល់)');
    }
  };

  const handleCreateQr = (e: React.FormEvent) => {
    e.preventDefault();
    if (!shortcut || !titleKh || !content) return;
    onAddQuickReply({
      shortcut: shortcut.startsWith('/') ? shortcut : `/${shortcut}`,
      title: titleKh,
      titleKh,
      content,
      category: 'general',
    });
    setShortcut('/');
    setTitleKh('');
    setContent('');
    setShowAddQr(false);
  };

  const handleCreateBot = (e: React.FormEvent) => {
    e.preventDefault();
    if (!botKeywords || !botReplyKh) return;
    const keywords = botKeywords.split(',').map((k) => k.trim()).filter(Boolean);
    onAddAutoReply({
      enabled: true,
      triggerKeywords: keywords,
      responseKh: botReplyKh,
      matchType: 'contains',
    });
    setBotKeywords('');
    setBotReplyKh('');
    setShowAddBot(false);
  };

  return (
    <div className="flex-1 bg-slate-50 flex flex-col h-full overflow-y-auto">
      {/* Top Header */}
      <div className="p-6 bg-white border-b border-slate-200 shrink-0">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h2 className="text-lg font-bold text-slate-900">
              {language === 'kh' ? 'សារឆ្លើយតបរហ័ស & Bot ស្វ័យប្រវត្តិ' : 'Quick Replies & Auto Bot'}
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              {language === 'kh'
                ? 'កំណត់សារកាត់ឆ្លើយតបលឿន និងបង្កើតប្រព័ន្ធឆ្លើយតបស្វ័យប្រវត្តិតាមពាក្យគន្លឹះ'
                : 'Configure shortcuts (/) and auto-reply keywords for 24/7 customer support'}
            </p>
          </div>

          {/* Tab Switcher */}
          <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-lg">
            <button
              onClick={() => setActiveTab('quick')}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-md transition-colors ${
                activeTab === 'quick'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Zap className="w-3.5 h-3.5 text-amber-500" />
              <span>{language === 'kh' ? 'សារកាត់ (Quick Replies)' : 'Quick Replies'}</span>
            </button>
            <button
              onClick={() => setActiveTab('bot')}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-md transition-colors ${
                activeTab === 'bot'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Bot className="w-3.5 h-3.5 text-blue-600" />
              <span>{language === 'kh' ? 'Bot ឆ្លើយស្វ័យប្រវត្តិ' : 'Auto Bot'}</span>
            </button>
          </div>
        </div>
      </div>

      <div className="p-6 space-y-6">
        {/* Quick Replies Tab */}
        {activeTab === 'quick' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-semibold text-slate-800">
                  {language === 'kh' ? 'បញ្ជីសារឆ្លើយតបរហ័ស' : 'Canned Reply Templates'}
                </h3>
                <p className="text-xs text-slate-500">
                  {language === 'kh'
                    ? 'ពេល Admin ឆាតជាមួយភ្ញៀវ គ្រាន់តែវាយសញ្ញា / នឹងបង្ហាញសារទាំងនេះភ្លាម'
                    : 'Type / in chat to quickly insert these canned answers'}
                </p>
              </div>

              <button
                onClick={() => setShowAddQr(true)}
                className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors shadow-xs"
              >
                <Plus className="w-4 h-4" />
                <span>{language === 'kh' ? 'បន្ថែមសារថ្មី' : 'Add Template'}</span>
              </button>
            </div>

            {/* Add New QR Form Drawer */}
            {showAddQr && (
              <form onSubmit={handleCreateQr} className="p-4 bg-white border border-blue-200 rounded-xl shadow-xs space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-blue-800">
                    {language === 'kh' ? 'បង្កើតសារឆ្លើយតបរហ័សថ្មី' : 'Create New Quick Reply'}
                  </span>
                  <button
                    type="button"
                    onClick={() => setShowAddQr(false)}
                    className="text-xs text-slate-400 hover:text-slate-600"
                  >
                    ✕
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-[11px] font-medium text-slate-600 block mb-1">
                      {language === 'kh' ? 'ពាក្យកាត់ (Shortcut ឧ. /aba)' : 'Shortcut (e.g. /aba)'}
                    </label>
                    <input
                      type="text"
                      required
                      value={shortcut}
                      onChange={(e) => setShortcut(e.target.value)}
                      placeholder="/shortcut"
                      className="w-full px-2.5 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-md font-mono"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] font-medium text-slate-600 block mb-1">
                      {language === 'kh' ? 'ចំណងជើងចំណាំ' : 'Template Title'}
                    </label>
                    <input
                      type="text"
                      required
                      value={titleKh}
                      onChange={(e) => setTitleKh(e.target.value)}
                      placeholder="ឧ. គណនី ABA..."
                      className="w-full px-2.5 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-md"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-[11px] font-medium text-slate-600 block mb-1">
                    {language === 'kh' ? 'ខ្លឹមសារសារពេញ' : 'Full Message Content'}
                  </label>
                  <textarea
                    required
                    rows={3}
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    placeholder="សរសេរខ្លឹមសារដែលត្រូវផ្ញើទៅភ្ញៀវ..."
                    className="w-full px-2.5 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-md"
                  />
                </div>

                <div className="flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setShowAddQr(false)}
                    className="px-3 py-1.5 text-xs text-slate-600 hover:bg-slate-100 rounded-md"
                  >
                    បោះបង់
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-1.5 text-xs font-semibold text-white bg-blue-600 rounded-md"
                  >
                    រក្សាទុក
                  </button>
                </div>
              </form>
            )}

            {/* List */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {quickReplies.map((qr) => (
                <div
                  key={qr.id}
                  className="p-4 bg-white border border-slate-200/90 rounded-xl hover:border-slate-300 transition-all flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded border border-blue-100">
                          {qr.shortcut}
                        </span>
                        <h4 className="text-xs font-bold text-slate-900">{qr.titleKh}</h4>
                      </div>

                      <button
                        onClick={() => onDeleteQuickReply(qr.id)}
                        className="text-slate-400 hover:text-red-500 p-1 transition-colors"
                        title="លុបសារនេះ"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <p className="text-xs text-slate-600 leading-relaxed whitespace-pre-wrap bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                      {qr.content}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Auto Bot Tab */}
        {activeTab === 'bot' && (
          <div className="space-y-6">
            {/* Top Info & Simulator */}
            <div className="p-4 bg-blue-50/80 border border-blue-200 rounded-xl space-y-3">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-blue-600 text-white flex items-center justify-center shrink-0">
                  <Bot className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-blue-900">
                    {language === 'kh' ? 'សាកល្បងតេស្ត Bot ឆ្លើយតប (Bot Simulator)' : 'Test Bot Simulation'}
                  </h4>
                  <p className="text-[11px] text-blue-700 mt-0.5">
                    {language === 'kh'
                      ? 'វាយសំណួរដែលអតិថិជនតែងតែសួរ (ឧ. "តម្លៃប៉ុន្មានបង?", "ផ្ញើទៅសៀមរាបថ្លៃដឹកប៉ុន្មាន?") ដើម្បីមើលការឆ្លើយតប'
                      : 'Test keywords to see how the bot responds automatically'}
                  </p>
                </div>
              </div>

              <div className="flex gap-2">
                <input
                  type="text"
                  value={testInput}
                  onChange={(e) => setTestInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleTestBot()}
                  placeholder={language === 'kh' ? 'វាយសំណួរតេស្តទីនេះ (ឧ. តម្លៃ, ដឹកជញ្ជូន, aba)...' : 'Type test prompt...'}
                  className="flex-1 px-3 py-1.5 text-xs bg-white border border-blue-200 rounded-lg focus:outline-none"
                />
                <button
                  onClick={handleTestBot}
                  className="px-4 py-1.5 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
                >
                  {language === 'kh' ? 'តេស្ត Bot' : 'Test'}
                </button>
              </div>

              {testResult && (
                <div className="p-2.5 bg-white rounded-lg border border-blue-200 text-xs text-slate-800 font-medium">
                  {testResult}
                </div>
              )}
            </div>

            {/* Auto reply rules list */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-semibold text-slate-800">
                    {language === 'kh' ? 'វិធានឆ្លើយតបតាមពាក្យគន្លឹះ (Keyword Rules)' : 'Keyword Trigger Rules'}
                  </h3>
                  <p className="text-xs text-slate-500">
                    {language === 'kh' ? 'ពេលសារភ្ញៀវមានពាក្យទាំងនេះ ប្រព័ន្ធនឹងតបស្វ័យប្រវត្តិ' : 'Auto responds when customer message contains matched keywords'}
                  </p>
                </div>

                <button
                  onClick={() => setShowAddBot(true)}
                  className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors shadow-xs"
                >
                  <Plus className="w-4 h-4" />
                  <span>{language === 'kh' ? 'ថែមវិធាន Bot' : 'Add Rule'}</span>
                </button>
              </div>

              {showAddBot && (
                <form onSubmit={handleCreateBot} className="p-4 bg-white border border-blue-200 rounded-xl space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-blue-800">
                      {language === 'kh' ? 'បន្ថែមវិធាន Bot ថ្មី' : 'Add New Bot Rule'}
                    </span>
                    <button type="button" onClick={() => setShowAddBot(false)} className="text-xs text-slate-400">
                      ✕
                    </button>
                  </div>

                  <div>
                    <label className="text-[11px] font-medium text-slate-600 block mb-1">
                      {language === 'kh' ? 'ពាក្យគន្លឹះ (Keywords បំបែកដោយក្បៀស ,)' : 'Keywords (comma-separated)'}
                    </label>
                    <input
                      type="text"
                      required
                      value={botKeywords}
                      onChange={(e) => setBotKeywords(e.target.value)}
                      placeholder="តម្លៃ, ប៉ុន្មាន, ថ្លៃ, price"
                      className="w-full px-2.5 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-md"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] font-medium text-slate-600 block mb-1">
                      {language === 'kh' ? 'សារឆ្លើយតបស្វ័យប្រវត្តិ' : 'Auto Response'}
                    </label>
                    <textarea
                      required
                      rows={2}
                      value={botReplyKh}
                      onChange={(e) => setBotReplyKh(e.target.value)}
                      placeholder="សរសេរសារដែល Bot នឹងតប..."
                      className="w-full px-2.5 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-md"
                    />
                  </div>

                  <div className="flex justify-end gap-2">
                    <button
                      type="button"
                      onClick={() => setShowAddBot(false)}
                      className="px-3 py-1.5 text-xs text-slate-600 hover:bg-slate-100 rounded-md"
                    >
                      បោះបង់
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-1.5 text-xs font-semibold text-white bg-blue-600 rounded-md"
                    >
                      រក្សាទុកវិធាន
                    </button>
                  </div>
                </form>
              )}

              <div className="space-y-3">
                {autoReplies.map((rule) => (
                  <div
                    key={rule.id}
                    className="p-4 bg-white border border-slate-200/90 rounded-xl flex items-start justify-between gap-4"
                  >
                    <div className="min-w-0 flex-1 space-y-2">
                      <div className="flex flex-wrap items-center gap-1.5">
                        <span className="text-xs font-semibold text-slate-600">
                          {language === 'kh' ? 'ពាក្យគន្លឹះ៖' : 'Keywords:'}
                        </span>
                        {rule.triggerKeywords.map((kw, i) => (
                          <span
                            key={i}
                            className="px-2 py-0.5 bg-blue-50 text-blue-700 text-xs font-medium rounded-md border border-blue-100"
                          >
                            {kw}
                          </span>
                        ))}
                      </div>

                      <div className="p-3 bg-slate-50 rounded-lg border border-slate-100 text-xs text-slate-700 leading-relaxed">
                        🤖 {rule.responseKh}
                      </div>
                    </div>

                    <button
                      onClick={() => onToggleAutoReply(rule.id)}
                      className="flex items-center gap-1.5 text-xs font-medium shrink-0"
                    >
                      {rule.enabled ? (
                        <div className="flex items-center gap-1.5 text-emerald-600">
                          <ToggleRight className="w-6 h-6 text-emerald-500" />
                          <span>{language === 'kh' ? 'បើកដំណើរការ' : 'Active'}</span>
                        </div>
                      ) : (
                        <div className="flex items-center gap-1.5 text-slate-400">
                          <ToggleLeft className="w-6 h-6 text-slate-300" />
                          <span>{language === 'kh' ? 'បានបិទ' : 'Disabled'}</span>
                        </div>
                      )}
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
