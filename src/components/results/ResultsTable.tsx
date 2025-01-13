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
  sumhk: string;
  dtval: string;
  dtgv: string;
  hesber: string;
  TASHREM: string;
  hdtme: string;
  hdtad: string;
  payername: string;
}

interface ResultsTableProps {
  results: {
    success: boolean;
    results?: RetroResult[];
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
    <div className="bg-blue-50 p-6 rounded-lg max-w-2xl max-h-[80vh] overflow-y-auto">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-medium text-blue-900">פירוט חישוב</h3>
        <button onClick={onClose} className="text-blue-600 hover:text-blue-800">
          <X size={20} />
        </button>
      </div>
      <pre className="whitespace-pre-wrap font-mono text-sm text-blue-900">{explanation}</pre>
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

  const formatDate = (dateStr: string) => {
    if (!dateStr || dateStr === 'Invalid Date') return '';
    return dateStr.split(' ')[0];  // רק מסיר את השעה אם קיימת
  };


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
      
      <div className="overflow-x-auto">
      <table className="w-full text-sm border-collapse border">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-2 text-right border">תקופה</th>
              <th className="p-2 text-right border">ת.התחלה</th>
              <th className="p-2 text-right border">ת.סיום</th>
              <th className="p-2 text-right border">משלם</th>
              <th className="p-2 text-right border">קוד חיוב</th>
              <th className="p-2 text-right border">שם חיוב</th>
              <th className="p-2 text-right border">תיאור</th>
              <th className="p-2 text-right border">סכום</th>
              <th className="p-2 text-right border">סכום הסדר</th>
              <th className="p-2 text-right border">ת.גביה</th>
              <th className="p-2 text-right border">ת.ערך</th>
              <th className="p-2 text-right border">פירוט</th>
            </tr>
          </thead>
          <tbody>
            {results.results.map((row: RetroResult) => (
              <tr key={row.moneln} className="hover:bg-gray-50 border-b">
                <td className="p-2 border">{row.mnt_display}</td>
                <td className="p-2 border">{formatDate(row.hdtme)}</td>
                <td className="p-2 border">{formatDate(row.hdtad)}</td>
                <td className="p-2 border">{row.payername}</td>
                <td className="p-2 border">{row.sugts}</td>
                <td className="p-2 border">{row.sugtsname}</td>
                <td className="p-2 border">{row.TASHREM}</td>
                <td className="p-2 border text-left">₪{parseFloat(row.paysum).toFixed(2)}</td>
                <td className="p-2 border text-left">{row.sumhk ? `₪${parseFloat(row.sumhk).toFixed(2)}` : ''}</td>
                <td className="p-2 border">{formatDate(row.dtgv)}</td>
                <td className="p-2 border">{formatDate(row.dtval)}</td>
                <td className="p-2 border">
                  <button 
                    onClick={() => handleShowExplanation(row.hesber)}
                    className="text-blue-670 hover:text-blue-800 flex items-center gap-1"
                  >
                    <Info size={16} />
                    פירוט
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <ExplanationDialog 
        isOpen={!!selectedExplanation}
        onClose={() => setSelectedExplanation(null)}
        explanation={selectedExplanation || ''}
      />
    </div>
  );
};

export default ResultsTable;