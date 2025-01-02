import React, { useState } from 'react';
import { PropertySearch } from '../property/PropertySearch';
import PayerInfo from '../property/PayerInfo';
import SizesTable from '../property/SizesTable';
import DateRangeSelect from '../inputs/DateRangeSelect';
import ChargeTypesSelect from '../inputs/ChargeTypesSelect';
import CalculationButtons from '../buttons/CalculationButtons';
import CalculationResults from '../results/CalculationResults';

interface PropertyDetails {
  id: string;
  address: string;
  payerCode: string;
  payerName: string;
}

interface CalculationResult {
  period: string;
  chargeType: string;
  amount: number;
  discount: number;
  total: number;
}

interface Size {
  index: number;
  size: number;
  code: string;
  name: string;
  price: number;
}

const RetroCalculator = () => {
  const [property, setProperty] = useState<PropertyDetails | null>(null);
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [selectedChargeTypes, setSelectedChargeTypes] = useState<string[]>([]);
  const [results, setResults] = useState<CalculationResult[]>([]);
  const [sizes, setSizes] = useState<Size[]>([
    { index: 1, size: 80, code: '101', name: 'מגורים רגיל', price: 100 },
    { index: 2, size: 20, code: '102', name: 'מרפסת', price: 80 },
    { index: 3, size: 15, code: '103', name: 'מחסן', price: 50 }
  ]);

  const handlePropertySearch = (foundProperty: PropertyDetails) => {
    console.log('Found property:', foundProperty);
    setProperty(foundProperty);
  };

  const handleChangePayer = () => {
    alert('בשלב זה לא פעיל - יופעל בחיבור ל-DB');
  };

  const handleSizeChange = (index: number, newSize: number) => {
    console.log('Updating size at RetroCalculator:', index, newSize);
    const newSizes = sizes.map((size, i) => 
      i === index ? { ...size, size: newSize } : size
    );
    console.log('New sizes array:', newSizes);
    setSizes(newSizes);
  };

  const handleDeleteSize = (index: number) => {
    setSizes(sizes.filter(size => size.index !== index));
  };

  const handleAddSize = () => {
    const newIndex = Math.max(...sizes.map(s => s.index)) + 1;
    setSizes([...sizes, { 
      index: newIndex, 
      size: 0, 
      code: '', 
      name: '', 
      price: 0 
    }]);
  };

  const handleCalculate = () => {
    if (!property) {
      alert('נא לבחור נכס');
      return;
    }

    if (!startDate || !endDate) {
      alert('נא לבחור תאריכי התחלה וסיום');
      return;
    }

    if (selectedChargeTypes.length === 0) {
      alert('נא לבחור לפחות סוג חיוב אחד');
      return;
    }

    // מוקאפ לתוצאות
    const mockResults = selectedChargeTypes.map(type => ({
      period: startDate.toLocaleDateString('he-IL', { month: '2-digit', year: 'numeric' }),
      chargeType: type === '1010' ? 'ארנונה' : type === '1020' ? 'מים' : 'ביוב',
      amount: 1500,
      discount: 150,
      total: 1350
    }));

    setResults(mockResults);
  };

  const handleConfirm = () => {
    if (results.length === 0) {
      alert('יש לבצע חישוב לפני אישור');
      return;
    }
    alert('החישוב אושר בהצלחה');
  };

  return (
    <div className="flex flex-col bg-gray-50 min-h-screen text-right">
      <div className="bg-blue-600 text-white p-4">
        <h1 className="text-2xl font-semibold">חישוב רטרו</h1>
      </div>
      
      <div className="flex flex-col p-4 gap-4">
        <div className="bg-white rounded-lg shadow p-4">
          <PropertySearch onPropertyFound={handlePropertySearch} />

          {property && (
            <div className="mt-4">
              <PayerInfo 
                payerCode={property.payerCode}
                payerName={property.payerName}
                onChangePayer={handleChangePayer}
              />
            </div>
          )}

          {property && (
            <div className="mt-4">
              <SizesTable 
                sizes={sizes}
                onSizeChange={handleSizeChange}
                onDelete={handleDeleteSize}
                onAdd={handleAddSize}
              />
            </div>
          )}

          <div className="mt-4">
            <DateRangeSelect 
              onChange={(start, end) => {
                setStartDate(start);
                setEndDate(end);
              }} 
            />
          </div>

          <div className="mt-4">
            <ChargeTypesSelect 
              selected={selectedChargeTypes}
              onChange={setSelectedChargeTypes}
            />
          </div>

          <div className="mt-4">
            <CalculationButtons
              onCalculate={handleCalculate}
              onConfirm={handleConfirm}
              disabled={!property || !startDate || !endDate || selectedChargeTypes.length === 0}
            />
          </div>
        </div>

        {results.length > 0 && (
          <CalculationResults results={results} />
        )}
      </div>
    </div>
  );
};

export default RetroCalculator;