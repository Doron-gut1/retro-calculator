import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import type { Tariff } from '../../../types';

interface TariffSelectorProps {
  onSelect: (tariff: Tariff) => void;
}

const MOCK_TARIFFS: Tariff[] = [
  { code: '101', name: 'מגורים רגיל', price: 100 },
  { code: '102', name: 'מרפסת', price: 80 },
  { code: '103', name: 'מחסן', price: 50 }
];

const TariffSelector: React.FC<TariffSelectorProps> = ({ onSelect }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTariff, setSelectedTariff] = useState<Tariff | null>(null);

  const filteredTariffs = MOCK_TARIFFS.filter(tariff => 
    tariff.code.includes(searchTerm) || tariff.name.includes(searchTerm)
  );

  const handleSelect = (tariff: Tariff) => {
    setSelectedTariff(tariff);
    onSelect(tariff);
    setIsOpen(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <button 
        className="text-xs bg-gray-100 px-2 py-1 rounded hover:bg-gray-200"
        onClick={() => setIsOpen(true)}
      >
        בחר
      </button>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>בחירת תעריף</DialogTitle>
        </DialogHeader>

        <div className="p-4 space-y-4">
          <input
            type="text"
            placeholder="חיפוש לפי קוד או שם..."
            className="w-full p-2 border rounded"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />

          <div className="max-h-[400px] overflow-y-auto">
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
                {filteredTariffs.map((tariff) => (
                  <tr 
                    key={tariff.code} 
                    className={`hover:bg-gray-50 cursor-pointer ${selectedTariff?.code === tariff.code ? 'bg-blue-50' : ''}`}
                    onClick={() => handleSelect(tariff)}
                  >
                    <td className="p-2">{tariff.code}</td>
                    <td className="p-2">{tariff.name}</td>
                    <td className="p-2">₪{tariff.price}</td>
                    <td className="p-2">
                      <button 
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
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default TariffSelector;