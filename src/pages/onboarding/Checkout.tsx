import { useNavigate } from "react-router-dom";
import { ChevronLeft, ChevronRight, Check } from "lucide-react";
import { useOnboarding } from "@/contexts/OnboardingContext";

export default function Checkout() {
  const navigate = useNavigate();
  const { completeOnboarding } = useOnboarding();

  const handleFinish = () => {
    // Aqui simulamos a conclusão da compra
    completeOnboarding();
    navigate('/app/home', { replace: true });
  };

  const paymentMethods = [
    { id: 'apple', name: 'Apple Pay', sub: 'Save and pay via Cards', icon: '🍎' },
    { id: 'google', name: 'Google Pay', sub: 'Save and pay via Cards', icon: 'G' },
    { id: 'paypal', name: 'PayPal', sub: 'Save and pay via Cards', icon: 'P' },
    { id: 'hsa', name: 'HSA/FSA', sub: '', icon: '💳' },
    { id: 'card', name: 'Credit/Debit Card', sub: '', icon: '💳' },
  ];

  return (
    <div className="min-h-[100svh] bg-[#f9f9f9] flex flex-col">
      {/* Header */}
      <div className="bg-white px-6 pt-6 pb-4 flex items-center justify-between border-b border-gray-100">
        <button onClick={() => navigate(-1)} className="p-2 -ml-2 text-gray-900">
          <ChevronLeft size={24} />
        </button>
        <h1 className="text-[18px] font-bold text-gray-900">Check Out</h1>
        <div className="w-10" /> {/* Spacer */}
      </div>

      <div className="flex-1 overflow-y-auto px-6 py-6">
        {/* Saved Payment Methods */}
        <section className="mb-8">
          <h2 className="text-[16px] font-bold text-gray-900 mb-4">Saved Payment Methods</h2>
          <div className="bg-white rounded-2xl p-5 flex items-center justify-between shadow-sm border border-gray-50">
            <div className="flex items-center gap-4">
              <div className="w-12 h-8 bg-gray-900 rounded-md flex items-center justify-center text-white text-[10px] font-bold">
                MC
              </div>
              <div>
                <p className="text-[15px] font-bold text-gray-900">MasterCard...4320</p>
                <p className="text-[13px] text-gray-400">Exp. 04/20/2030</p>
              </div>
            </div>
            <Check size={20} className="text-gray-900" />
          </div>
        </section>

        {/* Add Payment Method */}
        <section>
          <h2 className="text-[16px] font-bold text-gray-900 mb-4">Add Payment Method</h2>
          <div className="space-y-3">
            {paymentMethods.map((method) => (
              <button
                key={method.id}
                onClick={handleFinish}
                className="w-full bg-white rounded-2xl p-5 flex items-center justify-between shadow-sm border border-gray-50 hover:bg-gray-50 transition-colors group"
              >
                <div className="flex items-center gap-4 text-left">
                  <div className="w-10 h-10 bg-gray-50 rounded-full flex items-center justify-center text-lg">
                    {method.icon === '🍎' ? <span className="scale-125">🍎</span> : method.icon}
                  </div>
                  <div>
                    <p className="text-[15px] font-bold text-gray-900">{method.name}</p>
                    {method.sub && <p className="text-[13px] text-gray-400">{method.sub}</p>}
                  </div>
                </div>
                <ChevronRight size={20} className="text-gray-300 group-hover:text-gray-900 transition-colors" />
              </button>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
