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
  payer_name: string;
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
    <div className="bg-blue-500 text-white p-6 rounded-lg max-w-2xl max-h-[80vh] overflow-y-auto">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-bold">פירוט חישוב</h3>
        <button onClick={onClose} className="text-white hover:text-gray-200">
          <X size={20} />
        </button>
      </div>
      <pre className="whitespace-pre-wrap font-mono text-sm">{explanation}</pre>
    </div>
  </Dialog>
);

export const ResultsTable: React.FC<ResultsTableProps> = ({ results, onClose }) => {
  const [selectedExplanation, setSelectedExplanation] = useState<string | null>(null);

  if (!results.success || !results.results) {
    return (
      <div className="bg-white rounded-lg shadow p-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-red-600">שגיאה בחישוב</h2>
          <button onClick={onClose} className="p-2 text-red-600 hover:bg-red-100 rounded">
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
    return dateStr.split(' ')[0];
  };

  const totalPaysum = results.results.reduce((sum, row) => sum + parseFloat(row.paysum), 0);
  const totalSumhk = results.results.reduce((sum, row) => sum + (row.sumhk ? parseFloat(row.sumhk) : 0), 0);

  return (
    <div className="bg-white rounded-lg shadow p-4">
      <div className="bg-blue-500 text-white p-4 rounded-t-lg flex justify-between items-center">
        <h2 className="text-2xl font-bold">תוצאות החישוב</h2>
        <div className="flex gap-2">
          <button className="p-2 text-white hover:bg-blue-600 rounded">
            <FileText size={20} />
          </button>
          <button onClick={onClose} className="p-2 text-white hover:bg-blue-600 rounded">
            <X size={20} />
          </button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm border-collapse border">
          <thead className="bg-blue-50">
            <tr>
              <th className="p-2 text-right border font-bold">תקופה</th>
              <th className="p-2 text-right border font-bold">ת.התחלה</th>
              <th className="p-2 text-right border font-bold">ת.סיום</th>
              <th className="p-2 text-right border font-bold">משלם</th>
              <th className="p-2 text-right border font-bold">קוד חיוב</th>
              <th className="p-2 text-right border font-bold">שם חיוב</th>
              <th className="p-2 text-right border font-bold">תיאור</th>
              <th className="p-2 text-right border font-bold">סכום</th>
              <th className="p-2 text-right border font-bold">סכום הסדר</th>
              <th className="p-2 text-right border font-bold">ת.גביה</th>
              <th className="p-2 text-right border font-bold">ת.ערך</th>
              <th className="p-2 text-right border font-bold">פירוט</th>
            </tr>
          </thead>
          <tbody>
            {results.results.map((row: RetroResult) => (
              <tr key={row.moneln} className="hover:bg-blue-50 border-b">
                <td className="p-2 border">{row.mnt_display}</td>
                <td className="p-2 border">{formatDate(row.hdtme)}</td>
                <td className="p-2 border">{formatDate(row.hdtad)}</td>
                <td className="p-2 border">{row.payer_name}</td>
                <td className="p-2 border">{row.sugts}</td>
                <td className="p-2 border">{row.sugtsname}</td>
                <td className="p-2 border">{row.TASHREM}</td>
                <td className="p-2 border text-left text-blue-500 font-bold">₪{parseFloat(row.paysum).toFixed(2)}</td>
                <td className="p-2 border text-left text-blue-500 font-bold">{row.sumhk ? `₪${parseFloat(row.sumhk).toFixed(2)}` : ''}</td>
                <td className="p-2 border">{formatDate(row.dtgv)}</td>
                <td className="p-2 border">{formatDate(row.dtval)}</td>
                <td className="p-2 border">
                  <button 
                    onClick={() => handleShowExplanation(row.hesber)}
                    className="text-blue-500 hover:text-blue-600 flex items-center gap-1"
                  >
                    <Info size={16} />
                    פירוט
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
          <tfoot className="bg-blue-50 font-bold">
            <tr>
              <td colSpan={7} className="p-2 border-t text-right">סה"כ:</td>
              <td className="p-2 border-t text-left text-blue-500">₪{totalPaysum.toFixed(2)}</td>
              <td className="p-2 border-t text-left text-blue-500">₪{totalSumhk.toFixed(2)}</td>
              <td colSpan={4} className="p-2 border-t"></td>
            </tr>
          </tfoot>
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