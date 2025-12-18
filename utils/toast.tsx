/**
 * Simple toast notification system
 * In production, consider using react-hot-toast or sonner
 */

export type ToastType = 'success' | 'error' | 'info' | 'warning';

interface Toast {
  id: string;
  message: string;
  type: ToastType;
  duration?: number;
}

class ToastManager {
  private toasts: Toast[] = [];
  private listeners: Set<(toasts: Toast[]) => void> = new Set();

  subscribe(listener: (toasts: Toast[]) => void) {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  private notify() {
    this.listeners.forEach(listener => listener([...this.toasts]));
  }

  show(message: string, type: ToastType = 'info', duration: number = 3000) {
    const id = Math.random().toString(36).substr(2, 9);
    const toast: Toast = { id, message, type, duration };
    
    this.toasts.push(toast);
    this.notify();

    if (duration > 0) {
      setTimeout(() => {
        this.remove(id);
      }, duration);
    }

    return id;
  }

  remove(id: string) {
    this.toasts = this.toasts.filter(t => t.id !== id);
    this.notify();
  }

  clear() {
    this.toasts = [];
    this.notify();
  }

  success(message: string, duration?: number) {
    return this.show(message, 'success', duration);
  }

  error(message: string, duration?: number) {
    return this.show(message, 'error', duration || 5000);
  }

  info(message: string, duration?: number) {
    return this.show(message, 'info', duration);
  }

  warning(message: string, duration?: number) {
    return this.show(message, 'warning', duration);
  }
}

export const toast = new ToastManager();

