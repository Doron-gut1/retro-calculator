import { useState } from 'react';
import { Tariff } from '../../../types';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';

interface TariffSelectorProps {
  onSelect: (tariff: Tariff) => void;
}

const TariffSelector: React.FC<TariffSelectorProps> = ({ onSelect }) => {
  const [isOpen, setIsOpen] = useState(false);

  // Mock tariffs for now
  const tariffs: Tariff[] = [
    { code: '101', name: 'מגורים רגיל', price: 100 },
    { code: '102', name: 'מרפסת', price: 80 },
    { code: '103', name: 'מחסן', price: 50 }
  ];

  const handleSelect = (tariff: Tariff) => {
    onSelect(tariff);
    setIsOpen(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <button className="text-xs bg-gray-100 px-2 py-1 rounded hover:bg-gray-200">
        בחר
      </button>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>בחירת תעריף</DialogTitle>
        </DialogHeader>
        <div className="mt-4">
          <table className="w-full text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="p-2 text-right">קוד</th>
                <th className="p-2 text-right">שם</th>
                <th className="p-2 text-right">מחיר</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {tariffs.map((tariff) => (
                <tr key={tariff.code} className="hover:bg-gray-50">
                  <td className="p-2">{tariff.code}</td>
                  <td className="p-2">{tariff.name}</td>
                  <td className="p-2">₪{tariff.price}</td>
                  <td className="p-2">
                    <button 
                      onClick={() => handleSelect(tariff)}
                      className="text-blue-600 hover:text-blue-800"
                    >
                      בחר
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default TariffSelector;