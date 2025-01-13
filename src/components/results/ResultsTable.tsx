import React, { useState } from 'react';
import { FileText, X, Info } from 'lucide-react';
import { Dialog } from '@/components/ui/dialog';

interface RetroResult {
  moneln: string;
  mnt: string;
  mnt_display: string;
  hs: string;
  mspkod: string;
  sugts: string;
  sugtsname: string;
  paysum: string;
  sumhan: string;
  dtval: string;
  dtgv: string;
  hesber: string;
  TASHREM: string;
}

interface ResultsTableProps {
  results: {
    success: boolean;
    results?: RetroResult[];
    totals?: {
      totalAmount: number;
      totalDiscount: number;
      finalAmount: number;
    };
    error?: string;
  };
  onClose?: () => void;
}

interface ExplanationDialogProps {
  isOpen: boolean;
  onClose: () => void;
  explanation: string;
}

const ExplanationDialog: React.FC<ExplanationDialogProps> = ({ isOpen, onClose, explanation }) => (
  <Dialog open={isOpen} onOpenChange={onClose}>
    <div className="bg-white p-4 rounded-lg max-w-2xl max-h-[80vh] overflow-y-auto">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-medium">פירוט חישוב</h3>
        <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
          <X size={20} />
        </button>
      </div>
      <pre className="whitespace-pre-wrap text-sm">{explanation}</pre>
    </div>
  </Dialog>
);

export const ResultsTable: React.FC<ResultsTableProps> = ({ results, onClose }) => {
  const [selectedExplanation, setSelectedExplanation] = useState<string | null>(null);

  if (!results.success || !results.results) {
    return (
      <div className="bg-white rounded-lg shadow p-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-medium text-red-600">שגיאה בחישוב</h2>
          <button onClick={onClose} className="p-2 text-red-600 hover:bg-red-50 rounded">
            <X size={20} />
          </button>
        </div>
        <p>{results.error || 'אירעה שגיאה בלתי צפויה'}</p>
      </div>
    );
  }

  const handleShowExplanation = (hesber: string) => {
    setSelectedExplanation(hesber);
  };

  const calculateTotal = (row: RetroResult): number => {
    const paysum = parseFloat(row.paysum) || 0;
    const sumhan = parseFloat(row.sumhan) || 0;
    return paysum - sumhan;
  };

  const allTotal = results.results.reduce((sum, row) => sum + calculateTotal(row), 0);

  return (
    <div className="bg-white rounded-lg shadow p-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-medium">תוצאות החישוב</h2>
        <div className="flex gap-2">
          <button className="p-2 text-blue-600 hover:bg-blue-50 rounded">
            <FileText size={20} />
          </button>
          <button onClick={onClose} className="p-2 text-red-600 hover:bg-red-50 rounded">
            <X size={20} />
          </button>
        </div>
      </div>
      
      <table className="w-full text-sm">
        <thead className="bg-gray-50">
          <tr>
            <th className="p-2 text-right">תקופה</th>
            <th className="p-2 text-right">סוג חיוב</th>
            <th className="p-2 text-right">סכום</th>
            <th className="p-2 text-right">הנחה</th>
            <th className="p-2 text-right">סה"כ</th>
            <th className="p-2 text-right">פעולות</th>
          </tr>
        </thead>
        <tbody className="divide-y">
          {results.results.map((row: RetroResult, index: number) => {
            const total = calculateTotal(row);
            return (
              <tr key={row.moneln || index} className="hover:bg-gray-50">
                <td className="p-2">{row.mnt_display}</td>
                <td className="p-2">{row.sugtsname}</td>
                <td className="p-2">₪{parseFloat(row.paysum).toFixed(2)}</td>
                <td className="p-2 text-red-600">
                  {parseFloat(row.sumhan) > 0 ? `-₪${parseFloat(row.sumhan).toFixed(2)}` : '₪0.00'}
                </td>
                <td className="p-2 font-medium">₪{total.toFixed(2)}</td>
                <td className="p-2">
                  <button 
                    onClick={() => handleShowExplanation(row.hesber)}
                    className="text-blue-600 hover:text-blue-800 flex items-center gap-1"
                  >
                    <Info size={16} />
                    פירוט
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
        <tfoot className="bg-gray-50 font-medium">
          <tr>
            <td colSpan={4} className="p-2">סה"כ</td>
            <td className="p-2">₪{allTotal.toFixed(2)}</td>
            <td></td>
          </tr>
        </tfoot>
      </table>

      <ExplanationDialog 
        isOpen={!!selectedExplanation}
        onClose={() => setSelectedExplanation(null)}
        explanation={selectedExplanation || ''}
      />
    </div>
  );
};

export default ResultsTable;