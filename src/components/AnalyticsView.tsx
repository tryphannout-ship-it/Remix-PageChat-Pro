import React from 'react';
import { 
  BarChart3, 
  TrendingUp, 
  Users, 
  MessageSquare, 
  ShoppingBag, 
  Clock, 
  Truck,
  DollarSign
} from 'lucide-react';
import { Order, ChatThread } from '../types';

interface AnalyticsViewProps {
  orders: Order[];
  threads: ChatThread[];
  language: 'kh' | 'en';
}

export const AnalyticsView: React.FC<AnalyticsViewProps> = ({
  orders,
  threads,
  language,
}) => {
  const totalRevenue = orders.reduce((sum, o) => sum + o.total, 0);
  const totalRevenueKhr = orders.reduce((sum, o) => sum + o.totalKhr, 0);
  const conversionRate = threads.length > 0 ? ((orders.length / threads.length) * 100).toFixed(1) : '0';

  return (
    <div className="flex-1 bg-slate-50 flex flex-col h-full overflow-y-auto">
      {/* Header */}
      <div className="p-6 bg-white border-b border-slate-200 shrink-0">
        <h2 className="text-lg font-bold text-slate-900">
          {language === 'kh' ? 'របាយការណ៍លក់ និងដំណើរការឆាត' : 'Sales & Chat Performance'}
        </h2>
        <p className="text-xs text-slate-500 mt-0.5">
          {language === 'kh'
            ? 'ស្ថិតិជាក់ស្តែងនៃការឆ្លើយតបឆាត ការបម្លែងទៅជាការបញ្ជាទិញ និងចំណូល'
            : 'Key sales metrics, chat response times, and conversion rates'}
        </p>
      </div>

      <div className="p-6 space-y-6">
        {/* Core KPI Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-4 bg-white border border-slate-200/90 rounded-2xl shadow-xs">
            <div className="flex items-center justify-between text-slate-500 mb-2">
              <span className="text-xs font-medium">
                {language === 'kh' ? 'ចំណូលសរុប (USD)' : 'Total Sales'}
              </span>
              <DollarSign className="w-4 h-4 text-blue-600" />
            </div>
            <p className="text-2xl font-bold text-slate-900 tabular-nums">
              ${totalRevenue.toFixed(2)}
            </p>
            <p className="text-[11px] text-slate-400 tabular-nums mt-1">
              ≈ {totalRevenueKhr.toLocaleString()} ៛
            </p>
          </div>

          <div className="p-4 bg-white border border-slate-200/90 rounded-2xl shadow-xs">
            <div className="flex items-center justify-between text-slate-500 mb-2">
              <span className="text-xs font-medium">
                {language === 'kh' ? 'ការកុម្ម៉ង់ជោគជ័យ' : 'Completed Orders'}
              </span>
              <ShoppingBag className="w-4 h-4 text-emerald-600" />
            </div>
            <p className="text-2xl font-bold text-slate-900 tabular-nums">
              {orders.length}
            </p>
            <p className="text-[11px] text-emerald-600 font-medium mt-1">
              +12% {language === 'kh' ? 'ធៀបនឹងសប្តាហ៍មុន' : 'vs last week'}
            </p>
          </div>

          <div className="p-4 bg-white border border-slate-200/90 rounded-2xl shadow-xs">
            <div className="flex items-center justify-between text-slate-500 mb-2">
              <span className="text-xs font-medium">
                {language === 'kh' ? 'អត្រាបម្លែងជាការទិញ' : 'Conversion Rate'}
              </span>
              <TrendingUp className="w-4 h-4 text-purple-600" />
            </div>
            <p className="text-2xl font-bold text-slate-900 tabular-nums">
              {conversionRate}%
            </p>
            <p className="text-[11px] text-slate-400 mt-1">
              {language === 'kh' ? 'ភ្ញៀវឆាត ➜ កុម្ម៉ង់ទំនិញ' : 'Chat inquiries converted'}
            </p>
          </div>

          <div className="p-4 bg-white border border-slate-200/90 rounded-2xl shadow-xs">
            <div className="flex items-center justify-between text-slate-500 mb-2">
              <span className="text-xs font-medium">
                {language === 'kh' ? 'ល្បឿនឆ្លើយតបមធ្យម' : 'Avg Response Time'}
              </span>
              <Clock className="w-4 h-4 text-amber-500" />
            </div>
            <p className="text-2xl font-bold text-slate-900 tabular-nums">
              1.4 {language === 'kh' ? 'នាទី' : 'min'}
            </p>
            <p className="text-[11px] text-emerald-600 font-medium mt-1">
              {language === 'kh' ? 'លឿនជាង 95% នៃផេកដទៃ' : 'Faster than industry avg'}
            </p>
          </div>
        </div>

        {/* Detailed breakdown grids */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Channel Share */}
          <div className="p-5 bg-white border border-slate-200/90 rounded-2xl">
            <h3 className="text-sm font-bold text-slate-800 mb-3">
              {language === 'kh' ? 'ប្រភពឆាតតាមបណ្តាញសង្គម (Channel Share)' : 'Traffic by Channel'}
            </h3>

            <div className="space-y-3">
              <div>
                <div className="flex justify-between text-xs font-medium text-slate-700 mb-1">
                  <span>Facebook Messenger (ផេកសំខាន់)</span>
                  <span className="tabular-nums">68%</span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-2">
                  <div className="bg-blue-600 h-2 rounded-full" style={{ width: '68%' }}></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs font-medium text-slate-700 mb-1">
                  <span>Telegram Channel & Group</span>
                  <span className="tabular-nums">22%</span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-2">
                  <div className="bg-sky-500 h-2 rounded-full" style={{ width: '22%' }}></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs font-medium text-slate-700 mb-1">
                  <span>TikTok Shop Inquiries</span>
                  <span className="tabular-nums">10%</span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-2">
                  <div className="bg-slate-900 h-2 rounded-full" style={{ width: '10%' }}></div>
                </div>
              </div>
            </div>
          </div>

          {/* Delivery Services Distribution */}
          <div className="p-5 bg-white border border-slate-200/90 rounded-2xl">
            <h3 className="text-sm font-bold text-slate-800 mb-3">
              {language === 'kh' ? 'ក្រុមហ៊ុនដឹកជញ្ជូនដែលប្រើញឹកញាប់' : 'Delivery Providers'}
            </h3>

            <div className="space-y-3">
              <div>
                <div className="flex justify-between text-xs font-medium text-slate-700 mb-1">
                  <span>J&T Express (ភ្នំពេញ & តាមខេត្ត)</span>
                  <span className="tabular-nums">54%</span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-2">
                  <div className="bg-red-500 h-2 rounded-full" style={{ width: '54%' }}></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs font-medium text-slate-700 mb-1">
                  <span>វីរៈប៊ុនថាំ (Virak Buntham)</span>
                  <span className="tabular-nums">36%</span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-2">
                  <div className="bg-emerald-600 h-2 rounded-full" style={{ width: '36%' }}></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs font-medium text-slate-700 mb-1">
                  <span>កាពីតូល & Grab Express</span>
                  <span className="tabular-nums">10%</span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-2">
                  <div className="bg-amber-500 h-2 rounded-full" style={{ width: '10%' }}></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
