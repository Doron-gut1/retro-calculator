/**
 * מפורמט מספרים למטבע ישראלי
 */
export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('he-IL', {
    style: 'currency',
    currency: 'ILS',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(amount);
};

/**
 * מפורמט תאריכים לפורמט ישראלי
 */
export const formatDate = (dateStr: string | null): string => {
  if (!dateStr) return '';
  
  try {
    const date = new Date(dateStr);
    return new Intl.DateTimeFormat('he-IL', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    }).format(date);
  } catch {
    return '';
  }
};

/**
 * מפורמט תקופה (MM/YY)
 */
export const formatPeriod = (period: string): string => {
  if (!period || period.length !== 6) return period;
  
  const month = period.substring(4, 6);
  const year = period.substring(2, 4);
  return `${month}/${year}`;
};
