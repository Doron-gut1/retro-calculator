import React, { useCallback } from 'react';
import { useRetroStore } from '../store';
import { useErrorSystem } from '../lib/ErrorSystem';
import PropertySearch from './PropertySearch';
import { SizesTable } from './SizesAndTariffs';
import { DateRangeSelect, ChargeTypesSelect } from './inputs';
import { CalculationButtons } from './buttons';
import { CalculationResults } from './results';
import { AnimatedAlert } from './UX';
import { LoadingSpinner } from './UX';
import { Property } from '../types';

export const RetroForm: React.FC = () => {
  const {
    property,
    selectedChargeTypes,
    results,
    isLoading,
    setStartDate,
    setEndDate,
    setSelectedChargeTypes,
    setProperty
  } = useRetroStore();

  const { errors } = useErrorSystem();

  const handleDateChange = useCallback((startDate: Date | null, endDate: Date | null) => {
    setStartDate(startDate?.toISOString() || ''); 
    setEndDate(endDate?.toISOString() || '');
  }, [setStartDate, setEndDate]);

  const handleChargeTypesChange = useCallback((types: string[]) => {
    setSelectedChargeTypes(types);
  }, [setSelectedChargeTypes]);

  const handlePropertySelect = useCallback((selectedProperty: Property) => {
    setProperty(selectedProperty);
  }, [setProperty]);

  const handleResultsReceived = useCallback((results: any) => {
    console.log('התקבלו תוצאות:', results);
  }, []);

  return (
    <div className="flex flex-col gap-4 p-4 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="bg-blue-600 text-white p-4 rounded-lg shadow">
        <h1 className="text-2xl font-semibold">חישוב רטרו</h1>
      </div>

      {/* Main Form */}
      <div className="bg-white rounded-lg shadow p-4 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Property Search */}
          <div className="space-y-4">
            <PropertySearch onPropertySelect={handlePropertySelect} />
          </div>

          {/* Dates & Charge Types */}
          <div className="space-y-4">
            <DateRangeSelect onChange={handleDateChange} />
            <ChargeTypesSelect 
              selected={selectedChargeTypes}
              onChange={handleChargeTypesChange}
            />
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col justify-end gap-2">
            <CalculationButtons
              propertyId={property?.hskod || ''}
              startDate={property?.startDate || ''}
              endDate={property?.endDate || ''}
              chargeTypes={selectedChargeTypes.map(Number)}
              sizes={[]}
              onResultsReceived={handleResultsReceived}
              disabled={isLoading}
            />
          </div>
        </div>

        {/* Sizes Table */}
        {property && (
          <div className="mt-6">
            <SizesTable />
          </div>
        )}
      </div>

      {/* Results Section */}
      {results.length > 0 && (
        <div className="bg-white rounded-lg shadow p-4">
          <CalculationResults results={results} />
        </div>
      )}

      {/* Loading Indicator */}
      {isLoading && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <LoadingSpinner size="lg" />
        </div>
      )}

      {/* Error Messages */}
      {errors.length > 0 && (
        <div className="fixed bottom-4 right-4 space-y-2 max-w-md">
          {errors.map((error, index) => (
            <AnimatedAlert
              key={`${error.field}-${index}`}
              type={error.type || 'error'}
              title="שגיאה"
              message={error.message}
              duration={5000}
            />
          ))}
        </div>
      )}
    </div>
  );
};