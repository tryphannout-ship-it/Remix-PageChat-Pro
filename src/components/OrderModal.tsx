import React, { useState } from 'react';
import { 
  X, 
  Plus, 
  Trash2, 
  ShoppingBag, 
  Check, 
  Truck, 
  CreditCard, 
  DollarSign
} from 'lucide-react';
import { Customer, ProductItem, Order, OrderLineItem } from '../types';

interface OrderModalProps {
  isOpen: boolean;
  onClose: () => void;
  customer: Customer;
  products: ProductItem[];
  pageId: string;
  threadId: string;
  onSaveOrder: (newOrder: Order) => void;
  language: 'kh' | 'en';
}

export const OrderModal: React.FC<OrderModalProps> = ({
  isOpen,
  onClose,
  customer,
  products,
  pageId,
  threadId,
  onSaveOrder,
  language,
}) => {
  if (!isOpen) return null;

  const [customerName, setCustomerName] = useState(customer.name);
  const [customerPhone, setCustomerPhone] = useState(customer.phone);
  const [customerProvince, setCustomerProvince] = useState(customer.province);
  const [customerAddress, setCustomerAddress] = useState(customer.address);

  // Line items
  const [items, setItems] = useState<OrderLineItem[]>([
    {
      productId: products[0]?.id || 'custom_1',
      name: products[0]?.nameKh || 'ទំនិញ',
      quantity: 1,
      price: products[0]?.price || 38.00,
      subtotal: products[0]?.price || 38.00,
    },
  ]);

  const [deliveryProvider, setDeliveryProvider] = useState<'jt' | 'virak_buntham' | 'capitol' | 'grab'>('jt');
  const [deliveryFee, setDeliveryFee] = useState<number>(customer.province === 'រាជធានីភ្នំពេញ' ? 1.50 : 2.00);
  const [discount, setDiscount] = useState<number>(0);
  const [paymentMethod, setPaymentMethod] = useState<'aba_khqr' | 'cod' | 'wing' | 'cash'>('aba_khqr');
  const [notes, setNotes] = useState('ហៅទូរស័ព្ទមុនពេលដឹក');

  // Calculations
  const subtotal = items.reduce((acc, curr) => acc + curr.subtotal, 0);
  const total = Math.max(0, subtotal + deliveryFee - discount);
  const totalKhr = Math.round(total * 4100);

  const handleAddItem = (productId: string) => {
    const prod = products.find((p) => p.id === productId);
    if (!prod) return;

    setItems([
      ...items,
      {
        productId: prod.id,
        name: prod.nameKh,
        quantity: 1,
        price: prod.price,
        subtotal: prod.price,
      },
    ]);
  };

  const handleUpdateItemQuantity = (index: number, newQty: number) => {
    if (newQty <= 0) return;
    const updated = [...items];
    updated[index].quantity = newQty;
    updated[index].subtotal = updated[index].price * newQty;
    setItems(updated);
  };

  const handleRemoveItem = (index: number) => {
    if (items.length <= 1) return;
    setItems(items.filter((_, idx) => idx !== index));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const orderNumber = `ORD-${Math.floor(1000 + Math.random() * 9000)}`;
    const now = new Date();
    const formattedDate = `${now.getHours()}:${String(now.getMinutes()).padStart(2, '0')} ${now.getHours() >= 12 ? 'PM' : 'AM'}`;

    const newOrder: Order = {
      id: `ord_${Date.now()}`,
      orderNumber,
      customerName,
      customerPhone,
      customerAddress,
      customerProvince,
      items,
      subtotal,
      deliveryFee,
      discount,
      total,
      totalKhr,
      paymentMethod,
      deliveryProvider,
      status: 'pending',
      createdAt: `ថ្ងៃនេះ, ${formattedDate}`,
      pageId,
      threadId,
      notes,
    };

    onSaveOrder(newOrder);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-blue-600 text-white flex items-center justify-center">
              <ShoppingBag className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-semibold text-slate-900 text-base">
                {language === 'kh' ? 'បង្កើតការកុម្ម៉ង់ថ្មី (New Order)' : 'Create New Order'}
              </h3>
              <p className="text-xs text-slate-500">
                {language === 'kh' ? 'បញ្ចូលទំនិញ ទីតាំងដឹក និងគណនាតម្លៃ' : 'Add items, delivery, and calculate slip'}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-200/60 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Customer info section */}
          <div>
            <h4 className="text-xs font-semibold uppercase text-slate-500 tracking-wider mb-3">
              1. {language === 'kh' ? 'ព័ត៌មានអតិថិជន និងការដឹក' : 'Customer & Shipping'}
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-medium text-slate-700 block mb-1">
                  {language === 'kh' ? 'ឈ្មោះអតិថិជន' : 'Customer Name'}
                </label>
                <input
                  type="text"
                  required
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  className="w-full px-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="text-xs font-medium text-slate-700 block mb-1">
                  {language === 'kh' ? 'លេខទូរស័ព្ទ' : 'Phone Number'}
                </label>
                <input
                  type="text"
                  required
                  value={customerPhone}
                  onChange={(e) => setCustomerPhone(e.target.value)}
                  className="w-full px-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="text-xs font-medium text-slate-700 block mb-1">
                  {language === 'kh' ? 'ខេត្ត / រាជធានី' : 'Province'}
                </label>
                <input
                  type="text"
                  required
                  value={customerProvince}
                  onChange={(e) => setCustomerProvince(e.target.value)}
                  className="w-full px-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="text-xs font-medium text-slate-700 block mb-1">
                  {language === 'kh' ? 'ក្រុមហ៊ុនដឹកជញ្ជូន' : 'Delivery Service'}
                </label>
                <select
                  value={deliveryProvider}
                  onChange={(e) => setDeliveryProvider(e.target.value as any)}
                  className="w-full px-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-blue-500"
                >
                  <option value="jt">J&T Express</option>
                  <option value="virak_buntham">វីរៈប៊ុនថាំ (Virak Buntham)</option>
                  <option value="capitol">កាពីតូល (Capitol Express)</option>
                  <option value="grab">Grab Delivery (ផ្ញើបន្ទាន់)</option>
                </select>
              </div>

              <div className="sm:col-span-2">
                <label className="text-xs font-medium text-slate-700 block mb-1">
                  {language === 'kh' ? 'អាសយដ្ឋានដឹកជញ្ជូនលម្អិត' : 'Full Shipping Address'}
                </label>
                <input
                  type="text"
                  required
                  value={customerAddress}
                  onChange={(e) => setCustomerAddress(e.target.value)}
                  placeholder="ផ្ទះលេខ, ផ្លូវ, សង្កាត់, ខណ្ឌ..."
                  className="w-full px-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>
          </div>

          {/* Product Items Section */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <h4 className="text-xs font-semibold uppercase text-slate-500 tracking-wider">
                2. {language === 'kh' ? 'មុខទំនិញដែលបានកុម្ម៉ង់' : 'Order Line Items'}
              </h4>

              {/* Add item dropdown */}
              <div className="flex items-center gap-1.5">
                <span className="text-xs text-slate-500">{language === 'kh' ? 'ថែមទំនិញ៖' : 'Add:'}</span>
                <select
                  onChange={(e) => {
                    if (e.target.value) {
                      handleAddItem(e.target.value);
                      e.target.value = '';
                    }
                  }}
                  defaultValue=""
                  className="px-2 py-1 text-xs bg-blue-50 text-blue-700 font-medium rounded-md border border-blue-200 focus:outline-none"
                >
                  <option value="" disabled>
                    + {language === 'kh' ? 'ជ្រើសទំនិញពីស្តុក' : 'Select Product'}
                  </option>
                  {products.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.nameKh} (${p.price.toFixed(2)})
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="border border-slate-200 rounded-xl overflow-hidden divide-y divide-slate-100">
              {items.map((item, idx) => (
                <div key={idx} className="p-3 flex items-center justify-between gap-3 bg-white">
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-semibold text-slate-800 truncate">{item.name}</p>
                    <p className="text-[11px] text-slate-500 tabular-nums">
                      ${item.price.toFixed(2)} / មួយ
                    </p>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <div className="flex items-center border border-slate-200 rounded-md">
                      <button
                        type="button"
                        onClick={() => handleUpdateItemQuantity(idx, item.quantity - 1)}
                        className="px-2 py-0.5 text-xs text-slate-600 hover:bg-slate-100"
                      >
                        -
                      </button>
                      <span className="px-2.5 text-xs font-semibold tabular-nums text-slate-800">
                        {item.quantity}
                      </span>
                      <button
                        type="button"
                        onClick={() => handleUpdateItemQuantity(idx, item.quantity + 1)}
                        className="px-2 py-0.5 text-xs text-slate-600 hover:bg-slate-100"
                      >
                        +
                      </button>
                    </div>

                    <div className="w-16 text-right font-semibold text-xs text-slate-900 tabular-nums">
                      ${item.subtotal.toFixed(2)}
                    </div>

                    {items.length > 1 && (
                      <button
                        type="button"
                        onClick={() => handleRemoveItem(idx)}
                        className="text-slate-400 hover:text-red-500 p-1"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Pricing & Payment Method */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            <div>
              <h4 className="text-xs font-semibold uppercase text-slate-500 tracking-wider mb-2">
                3. {language === 'kh' ? 'វិធីទូទាត់ប្រាក់' : 'Payment Method'}
              </h4>
              <div className="space-y-2">
                <label className="flex items-center gap-2 p-2.5 rounded-lg border border-slate-200 hover:bg-slate-50 cursor-pointer">
                  <input
                    type="radio"
                    name="pay"
                    checked={paymentMethod === 'aba_khqr'}
                    onChange={() => setPaymentMethod('aba_khqr')}
                    className="text-blue-600"
                  />
                  <div className="text-xs">
                    <span className="font-semibold text-slate-800">ABA Bank & KHQR</span>
                    <p className="text-[10px] text-slate-500">ស្កេនទូទាត់ភ្លាមៗ</p>
                  </div>
                </label>

                <label className="flex items-center gap-2 p-2.5 rounded-lg border border-slate-200 hover:bg-slate-50 cursor-pointer">
                  <input
                    type="radio"
                    name="pay"
                    checked={paymentMethod === 'cod'}
                    onChange={() => setPaymentMethod('cod')}
                    className="text-blue-600"
                  />
                  <div className="text-xs">
                    <span className="font-semibold text-slate-800">បង់លុយពេលដឹកដល់ (COD)</span>
                    <p className="text-[10px] text-slate-500">Cash On Delivery</p>
                  </div>
                </label>
              </div>
            </div>

            {/* Price Breakdown Card */}
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2 text-xs">
              <div className="flex justify-between text-slate-600">
                <span>{language === 'kh' ? 'តម្លៃទំនិញសរុប (Subtotal)' : 'Subtotal'}:</span>
                <span className="font-semibold text-slate-800 tabular-nums">${subtotal.toFixed(2)}</span>
              </div>

              <div className="flex items-center justify-between text-slate-600">
                <span>{language === 'kh' ? 'ថ្លៃដឹកជញ្ជូន' : 'Delivery Fee'}:</span>
                <div className="flex items-center gap-1">
                  <span>$</span>
                  <input
                    type="number"
                    step="0.5"
                    min="0"
                    value={deliveryFee}
                    onChange={(e) => setDeliveryFee(parseFloat(e.target.value) || 0)}
                    className="w-16 px-1.5 py-0.5 text-right font-semibold bg-white border border-slate-200 rounded text-xs tabular-nums"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between text-slate-600">
                <span>{language === 'kh' ? 'បញ្ចុះតម្លៃ (Discount)' : 'Discount'}:</span>
                <div className="flex items-center gap-1">
                  <span>-$</span>
                  <input
                    type="number"
                    step="0.5"
                    min="0"
                    value={discount}
                    onChange={(e) => setDiscount(parseFloat(e.target.value) || 0)}
                    className="w-16 px-1.5 py-0.5 text-right font-semibold bg-white border border-slate-200 rounded text-xs tabular-nums"
                  />
                </div>
              </div>

              <div className="pt-2 border-t border-slate-200 flex justify-between items-baseline">
                <span className="font-bold text-slate-900 text-sm">
                  {language === 'kh' ? 'ទឹកប្រាក់ត្រូវទូទាត់' : 'Total'}:
                </span>
                <div className="text-right">
                  <p className="font-bold text-blue-600 text-base tabular-nums">${total.toFixed(2)}</p>
                  <p className="text-[11px] text-slate-500 tabular-nums">≈ {totalKhr.toLocaleString()} ៛</p>
                </div>
              </div>
            </div>
          </div>

          {/* Submit Buttons */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-200">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-medium text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
            >
              {language === 'kh' ? 'បោះបង់' : 'Cancel'}
            </button>

            <button
              type="submit"
              className="px-5 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors shadow-sm flex items-center gap-2"
            >
              <Check className="w-4 h-4" />
              <span>
                {language === 'kh' ? 'រក្សាទុក និងផ្ញើវិក្កយបត្រក្នុងឆាត' : 'Save & Send Slip to Chat'}
              </span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
