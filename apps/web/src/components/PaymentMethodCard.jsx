
import React from 'react';
import { Smartphone } from 'lucide-react';

const PaymentMethodCard = ({ method, selected, onSelect }) => {
  const paymentInfo = {
    'MTN MoMo': {
      code: '*165*3#',
      instructions: 'Dial *165*3# on your MTN line, select Pay Bill, enter merchant code 123456, then enter the amount and your PIN.'
    },
    'Airtel Money': {
      code: '*185*9#',
      instructions: 'Dial *185*9# on your Airtel line, select Pay Bill, enter merchant code 654321, then enter the amount and your PIN.'
    }
  };

  const info = paymentInfo[method];

  return (
    <button
      onClick={() => onSelect(method)}
      className={`w-full text-left p-6 rounded-xl border-2 transition-all duration-200 ${
        selected
          ? 'border-primary bg-primary/5'
          : 'border-border bg-card hover:border-primary/50'
      }`}
    >
      <div className="flex items-start gap-4">
        <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
          selected ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'
        }`}>
          <Smartphone className="w-6 h-6" />
        </div>
        <div className="flex-1">
          <h3 className="font-semibold text-lg mb-1">{method}</h3>
          <p className="text-sm text-muted-foreground mb-3">
            Dial <span className="font-mono font-semibold text-primary">{info.code}</span>
          </p>
          {selected && (
            <div className="mt-3 p-4 bg-muted rounded-lg">
              <p className="text-sm leading-relaxed">
                {info.instructions}
              </p>
            </div>
          )}
        </div>
      </div>
    </button>
  );
};

export default PaymentMethodCard;
