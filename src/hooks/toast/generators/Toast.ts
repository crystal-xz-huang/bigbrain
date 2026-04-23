import type { ToastType, ToastOptions } from "@/lib/definitions/types";
import { ToastTypeEnum } from "@/lib/definitions/constants";

export default class Toast {
  static TYPES: ToastType[] = Object.values(ToastTypeEnum);
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
    if (!Toast.TYPES.includes(type)) type = ToastTypeEnum.INFO;
    this.id = crypto.randomUUID();
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
