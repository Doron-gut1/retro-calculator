import React, { useCallback, useEffect } from 'react';
import { useRetroStore } from '@/store';
import { useSession } from '@/hooks/useSession';
import { useErrorStore } from '@/lib/ErrorManager';
import { retroApi } from '@/services/api';
import { PropertySearch } from './Property/PropertySearch';
import { PayerInfo } from './Property/PayerInfo';
import { DateRange } from './Form/DateRange';
import { ChargeTypes } from './Form/ChargeTypes';
import { SizesTable } from './Property/SizesTable';
import { CalculationButtons } from './Form/CalculationButtons';
import { ResultsView } from './Form/ResultsView';
import { AnimatedAlert } from './UX/AnimatedAlert';
import { LoadingSpinner } from './UX/LoadingSpinner';

export const RetroForm: React.FC = () => {
  ...rest of the code...
};