import React from 'react';
import { create } from 'zustand';
import { LoadingSpinner } from '@/components/UX/LoadingSpinner';

interface LoadingState {
  isLoading: boolean;
  message?: string;
  progress?: number;
  setLoading: (loading: boolean, message?: string) => void;
  setProgress: (progress: number) => void;
}

export const useLoadingManager = create<LoadingState>((set) => ({
  isLoading: false,
  message: undefined,
  progress: undefined,

  setLoading: (loading, message) => set({ isLoading: loading, message }),
  setProgress: (progress) => set({ progress })
}));

export const LoadingOverlay: React.FC = () => {
  const { isLoading, message, progress } = useLoadingManager();

  if (!isLoading) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-xl text-center space-y-4">
        <LoadingSpinner size="lg" />
        {message && (
          <p className="text-gray-600">{message}</p>
        )}
        {progress !== undefined && (
          <div className="w-48 bg-gray-200 rounded-full h-2.5">
            <div
              className="bg-blue-600 h-2.5 rounded-full"
              style={{ width: `${progress}%` }}
            />
          </div>
        )}
      </div>
    </div>
  );
};