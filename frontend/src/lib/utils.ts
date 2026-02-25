import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const formatCurrency = (val: string) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "MMK", maximumFractionDigits: 0 }).format(Number(val));


export const formatDate = (d: string) => new Date(d).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" });