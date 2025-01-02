import { useState, useCallback } from 'react';
import { ValidationError } from '../types';

export const useValidation = () => {
  const [errors, setErrors] = useState<ValidationError[]>([]);

  const isValidDate = (dateStr: string): boolean => {
    const date = new Date(dateStr);
    if (isNaN(date.getTime())) return false;

    const [year, month, day] = dateStr.split('-').map(Number);
    
    // בדיקת טווח שנים
    if (year < 1900 || year > 2100) return false;

    // בדיקת ימים בחודש
    const daysInMonth = new Date(year, month, 0).getDate();
    if (day > daysInMonth) return false;

    return true;
  };

  const validateDates = useCallback((startDate: string, endDate: string): boolean => {
    const newErrors: ValidationError[] = [];
    
    // בדיקת חובה
    if (!startDate) {
      newErrors.push({ field: 'startDate', message: 'חובה להזין תאריך התחלה' });
    }
    if (!endDate) {
      newErrors.push({ field: 'endDate', message: 'חובה להזין תאריך סיום' });
    }

    // בדיקת תקינות תאריכים
    if (startDate && !isValidDate(startDate)) {
      newErrors.push({ field: 'startDate', message: 'תאריך התחלה לא תקין' });
    }
    if (endDate && !isValidDate(endDate)) {
      newErrors.push({ field: 'endDate', message: 'תאריך סיום לא תקין' });
    }

    // בדיקות נוספות רק אם שני התאריכים תקינים
    if (startDate && endDate && isValidDate(startDate) && isValidDate(endDate)) {
      const start = new Date(startDate);
      const end = new Date(endDate);
      const today = new Date();
      const oneYearFromNow = new Date();
      oneYearFromNow.setFullYear(today.getFullYear() + 1);

      if (start > end) {
        newErrors.push({ 
          field: 'endDate', 
          message: 'תאריך סיום חייב להיות אחרי תאריך התחלה' 
        });
      }

      if (end > oneYearFromNow) {
        newErrors.push({ 
          field: 'endDate', 
          message: 'לא ניתן להזין תאריך מעבר לשנה מהיום' 
        });
      }
    }

    setErrors(newErrors);
    return newErrors.length === 0;
  }, []);

  const validateSizes = useCallback((sizes: any[]): boolean => {
    const newErrors: ValidationError[] = [];
    
    if (sizes.length === 0) {
      newErrors.push({ 
        field: 'sizes', 
        message: 'חייב להיות לפחות גודל אחד' 
      });
    }

    sizes.forEach((size, index) => {
      if (!size.tariffCode) {
        newErrors.push({ 
          field: `size-${index}`, 
          message: `שורה ${index + 1}: חובה להזין קוד תעריף` 
        });
      }
      if (size.size <= 0) {
        newErrors.push({ 
          field: `size-${index}`, 
          message: `שורה ${index + 1}: גודל חייב להיות גדול מ-0` 
        });
      }
    });

    setErrors(newErrors);
    return newErrors.length === 0;
  }, []);

  const clearErrors = useCallback(() => {
    setErrors([]);
  }, []);

  return {
    errors,
    validateDates,
    validateSizes,
    clearErrors
  };
};
