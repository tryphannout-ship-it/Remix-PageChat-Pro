import React from 'react';
import { 
  X, 
  Printer, 
  QrCode, 
  ShoppingBag, 
  CheckCircle2, 
  Truck, 
  MapPin, 
  Phone,
  Store
} from 'lucide-react';
import { Order, PageAccount } from '../types';

interface InvoicePrintModalProps {
  order: Order | null;
  page: PageAccount;
  onClose: () => void;
  onUpdateOrderStatus: (orderId: string, status: Order['status']) => void;
  language: 'kh' | 'en';
}

export const InvoicePrintModal: React.FC<InvoicePrintModalProps> = ({
  order,
  page,
  onClose,
  onUpdateOrderStatus,
  language,
}) => {
  if (!order) return null;

  const handlePrint = () => {
    window.print();
  };

  const getDeliveryLabel = (provider: Order['deliveryProvider']) => {
    switch (provider) {
      case 'jt':
        return 'J&T Express';
      case 'virak_buntham':
        return 'វីរៈប៊ុនថាំ (Virak Buntham)';
      case 'capitol':
        return 'កាពីតូល (Capitol Express)';
      case 'grab':
        return 'Grab Express (ផ្ញើបន្ទាន់)';
      default:
        return provider;
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-xl w-full max-h-[92vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Modal Header */}
        <div className="px-6 py-3.5 border-b border-slate-200 flex items-center justify-between bg-slate-50 print:hidden">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-slate-800 text-sm">
              {language === 'kh' ? 'វិក្កយបត្របញ្ជាទិញ (Order Slip)' : 'Order Invoice Slip'}
            </span>
            <span className="text-xs px-2 py-0.5 bg-blue-100 text-blue-800 rounded font-bold">
              #{order.orderNumber}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors shadow-xs"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>{language === 'kh' ? 'ព្រីនវិក្កយបត្រ' : 'Print Slip'}</span>
            </button>
            <button
              onClick={onClose}
              className="p-1 rounded-lg text-slate-400 hover:text-slate-600 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Invoice Container */}
        <div className="flex-1 overflow-y-auto p-6 md:p-8 bg-white print:p-0">
          {/* Shop Header */}
          <div className="flex items-start justify-between border-b pb-4 border-slate-200">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <div className="w-7 h-7 rounded-lg bg-blue-600 text-white flex items-center justify-center text-xs font-bold">
                  ឆ
                </div>
                <h2 className="text-base font-bold text-slate-900">{page.name}</h2>
              </div>
              <p className="text-xs text-slate-500">{page.category}</p>
              <p className="text-xs text-slate-500">ទូរស័ព្ទហាង៖ 012 234 567 / 098 765 432</p>
            </div>

            <div className="text-right">
              <span className="text-xs font-bold text-blue-600 uppercase tracking-wider block">
                INVOICE / វិក្កយបត្រ
              </span>
              <p className="text-sm font-bold text-slate-900 tabular-nums">#{order.orderNumber}</p>
              <p className="text-xs text-slate-400">{order.createdAt}</p>
            </div>
          </div>

          {/* Customer & Shipping Details */}
          <div className="grid grid-cols-2 gap-4 py-4 border-b border-slate-200 text-xs">
            <div>
              <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block mb-1">
                អតិថិជន (Customer)
              </span>
              <p className="font-bold text-slate-900 text-sm">{order.customerName}</p>
              <p className="text-slate-700 flex items-center gap-1 mt-0.5">
                <Phone className="w-3 h-3 text-slate-400 shrink-0" />
                <span>{order.customerPhone}</span>
              </p>
            </div>

            <div>
              <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block mb-1">
                ទីតាំងដឹកជញ្ជូន (Delivery Address)
              </span>
              <p className="text-slate-800 font-medium">{order.customerProvince}</p>
              <p className="text-slate-600 text-[11px] mt-0.5 leading-relaxed">{order.customerAddress}</p>
              <p className="text-blue-600 font-semibold text-[11px] mt-1 flex items-center gap-1">
                <Truck className="w-3 h-3" />
                <span>{getDeliveryLabel(order.deliveryProvider)}</span>
              </p>
            </div>
          </div>

          {/* Order Items Table */}
          <div className="py-4">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-200 text-slate-500 font-semibold">
                  <th className="pb-2">បរិយាយមុខទំនិញ</th>
                  <th className="pb-2 text-center">ចំនួន</th>
                  <th className="pb-2 text-right">តម្លៃរាយ</th>
                  <th className="pb-2 text-right">សរុប</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {order.items.map((item, idx) => (
                  <tr key={idx} className="py-2.5">
                    <td className="py-2.5 font-medium text-slate-800">{item.name}</td>
                    <td className="py-2.5 text-center text-slate-600 tabular-nums">{item.quantity}</td>
                    <td className="py-2.5 text-right text-slate-600 tabular-nums">${item.price.toFixed(2)}</td>
                    <td className="py-2.5 text-right font-semibold text-slate-900 tabular-nums">
                      ${item.subtotal.toFixed(2)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Totals & KHQR Box */}
          <div className="pt-3 border-t border-slate-200 grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* KHQR payment simulation box */}
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-center gap-3">
              <div className="w-20 h-20 bg-white p-1 rounded-lg border border-slate-200 flex flex-col items-center justify-center shrink-0">
                <QrCode className="w-14 h-14 text-slate-800" />
                <span className="text-[8px] font-bold text-red-600">KHQR</span>
              </div>
              <div className="text-[11px]">
                <p className="font-bold text-slate-800 mb-0.5">ស្កេនទូទាត់តាម Bakong / ABA</p>
                <p className="text-slate-500">គណនី៖ 001 234 567</p>
                <p className="text-slate-500">ឈ្មោះ៖ {page.name.split('-')[0]}</p>
                <p className="text-emerald-600 font-semibold mt-1">
                  វិធីសាស្ត្រ៖ {order.paymentMethod === 'aba_khqr' ? 'ABA KHQR' : 'COD (បង់លុយពេលដល់)'}
                </p>
              </div>
            </div>

            {/* Price Calculations */}
            <div className="space-y-1.5 text-xs text-right">
              <div className="flex justify-between text-slate-500">
                <span>តម្លៃទំនិញសរុប (Subtotal):</span>
                <span className="font-medium text-slate-800 tabular-nums">${order.subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-slate-500">
                <span>ថ្លៃដឹកជញ្ជូន (Delivery):</span>
                <span className="font-medium text-slate-800 tabular-nums">${order.deliveryFee.toFixed(2)}</span>
              </div>
              {order.discount > 0 && (
                <div className="flex justify-between text-emerald-600 font-medium">
                  <span>បញ្ចុះតម្លៃ (Discount):</span>
                  <span className="tabular-nums">-${order.discount.toFixed(2)}</span>
                </div>
              )}
              <div className="pt-2 border-t border-slate-200 flex justify-between items-baseline">
                <span className="font-bold text-slate-900 text-sm">សរុបត្រូវបង់ (Total):</span>
                <div>
                  <span className="font-bold text-blue-600 text-base tabular-nums">${order.total.toFixed(2)}</span>
                  <p className="text-[11px] text-slate-500 tabular-nums">≈ {order.totalKhr.toLocaleString()} ៛</p>
                </div>
              </div>
            </div>
          </div>

          {/* Footer note */}
          <div className="mt-6 pt-3 border-t border-dashed border-slate-200 text-center text-[11px] text-slate-400">
            <p>សូមពិនិត្យទំនិញពេលទទួល។ អរគុណបងសម្រាប់ការបញ្ជាទិញពី {page.name}!</p>
          </div>
        </div>

        {/* Change status bar (Admin footer) */}
        <div className="px-6 py-3 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-xs print:hidden">
          <span className="text-slate-500 font-medium">
            {language === 'kh' ? 'ស្ថានភាពដឹកជញ្ជូន៖' : 'Update Status:'}
          </span>
          <div className="flex items-center gap-1.5">
            {(['pending', 'packaging', 'shipped', 'delivered'] as Order['status'][]).map((st) => (
              <button
                key={st}
                onClick={() => onUpdateOrderStatus(order.id, st)}
                className={`px-2.5 py-1 rounded-md text-xs font-semibold capitalize transition-colors ${
                  order.status === st
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-100'
                }`}
              >
                {st}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
