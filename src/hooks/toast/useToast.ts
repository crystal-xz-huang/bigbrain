import { useContext } from 'react';
import ToastContext from './toast-context';
import { ToastType, ToastInput, ToastOptions } from '@/lib/types';

const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  const { addToast } = context;

  const showToast = (type: ToastType, input: ToastInput, options: ToastOptions = {}) => {
    let message = '';
    let description = '';

    // Determine message and description based on input type
    if (typeof input === 'string') {
      message = input;
    } else if (typeof input === 'object' && input !== null) {
      const fallback = Object.values(input).filter(v => typeof v === 'string');
      message = input.message || fallback[0] || '';
      description = input.description || fallback[1] || '';
    }

    addToast(type, message, description, options);
  };

  return {
    success: (input: ToastInput, options?: ToastOptions) => showToast('success', input, options),
    error: (input: ToastInput, options?: ToastOptions) => showToast('error', input, options),
    info: (input: ToastInput, options?: ToastOptions) => showToast('info', input, options),
    warn: (input: ToastInput, options?: ToastOptions) => showToast('warning', input, options),
  };
};

export default useToast;