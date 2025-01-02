import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { RetroForm } from '@/components/RetroForm';

describe('RetroForm', () => {
  beforeEach(() => {
    // איפוס המצב לפני כל בדיקה
    localStorage.clear();
  });

  test('מציג את הטופס הריק בטעינה ראשונית', () => {
    render(<RetroForm />);
    
    expect(screen.getByText('חישוב רטרו')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('הזן קוד נכס...')).toBeInTheDocument();
  });

  test('מציג שגיאה בהזנת תאריך לא תקין', async () => {
    render(<RetroForm />);
    
    const startDateInput = screen.getByLabelText('תאריך התחלה');
    fireEvent.change(startDateInput, { target: { value: '2024-13-01' } });

    await waitFor(() => {
      expect(screen.getByText('תאריך התחלה לא תקין')).toBeInTheDocument();
    });
  });

  test('מבצע חישוב בהצלחה', async () => {
    render(<RetroForm />);
    
    // הכנסת נתונים תקינים
    fireEvent.change(screen.getByPlaceholderText('הזן קוד נכס...'), { 
      target: { value: '12345' } 
    });
    
    const calculateButton = screen.getByText('חשב');
    fireEvent.click(calculateButton);

    await waitFor(() => {
      expect(screen.getByText('תוצאות החישוב')).toBeInTheDocument();
    });
  });

  test('שומר את המצב בין רענונים', async () => {
    const { rerender } = render(<RetroForm />);
    
    // הכנסת נתונים
    fireEvent.change(screen.getByPlaceholderText('הזן קוד נכס...'), {
      target: { value: '12345' }
    });

    // רענון הקומפוננטה
    rerender(<RetroForm />);

    expect(screen.getByPlaceholderText('הזן קוד נכס...')).toHaveValue('12345');
  });
});
