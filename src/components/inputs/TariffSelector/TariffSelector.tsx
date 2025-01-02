import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '../../../components/ui/dialog';

interface Tariff {
  kod: string;
  name: string;
  amount: number;
}

interface TariffSelectorProps {
  currentTariff?: Tariff;
  onSelect: (tariff: Tariff) => void;
  onTariffCodeChange: (code: string) => void;
}

export const TariffSelector: React.FC<TariffSelectorProps> = ({ 
  currentTariff, 
  onSelect,
  onTariffCodeChange 
}) => {
  // בשלב זה - נתונים לדוגמה. בהמשך יגיעו מה-API
  const sampleTariffs: Tariff[] = [
    { kod: '101', name: 'מגורים רגיל', amount: 100 },
    { kod: '102', name: 'מרפסת', amount: 80 },
    { kod: '103', name: 'מחסן', amount: 50 },
  ];

  return (
    <div className="flex gap-2 items-center">
      <input 
        type="text" 
        className="w-20 p-1 border rounded" 
        value={currentTariff?.kod || ''}
        onChange={(e) => onTariffCodeChange(e.target.value)}
        placeholder="קוד"
      />
      <Dialog>
        <DialogTrigger asChild>
          <button 
            type="button"
            className="text-xs bg-gray-100 px-2 py-1 rounded hover:bg-gray-200"
          >
            בחר תעריף
          </button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>בחירת תעריף</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4">
            {sampleTariffs.map((tariff) => (
              <button
                key={tariff.kod}
                className="flex justify-between items-center p-2 hover:bg-gray-100 rounded-md w-full text-right"
                onClick={() => {
                  onSelect(tariff);
                }}
              >
                <span className="font-medium">{tariff.name}</span>
                <div className="flex gap-4 text-sm text-gray-600">
                  <span>{tariff.kod}</span>
                  <span>₪{tariff.amount}</span>
                </div>
              </button>
            ))}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};
