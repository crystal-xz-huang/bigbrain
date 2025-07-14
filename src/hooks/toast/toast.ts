import { uid } from "@/lib/utils";
import type { ToastType, ToastOptions } from "@/lib/types";


export default class Toast {
  static TYPES: ToastType[] = ['success', 'error', 'info', 'warning'];
  static DEFAULT_DURATION = 5000;
  static DEFAULT_OPTIONS: Required<ToastOptions> = {
    duration: Toast.DEFAULT_DURATION,
    replace: true,
  };

  id: string;
  timestamp: number;
  type: ToastType;
  message: string;
  description: string;
  options: Required<ToastOptions>;

  constructor(
    type: ToastType,
    message: string,
    description: string = '',
    options: ToastOptions = {}
  ) {
    if (!Toast.TYPES.includes(type)) type = 'info';
    this.id = uid();
    this.timestamp = Date.now();
    this.type = type;
    this.message = message.trim();
    this.description = description.trim();
    this.options = { ...Toast.DEFAULT_OPTIONS, ...options };
  }

  static isEqual(a: Toast, b: Toast): boolean {
    return a.id === b.id || a.timestamp === b.timestamp;
  }
}
