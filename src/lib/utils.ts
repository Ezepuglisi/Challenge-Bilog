import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"


export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export interface Hour {
  hour: number;
  period: string;
  time: string;
}

export const hoursInDay: Hour[] = [
  // { hour: 12, period: 'AM', time: '12:00 AM' },
  // { hour: 12, period: 'AM', time: '12:30 AM' },
  // { hour: 1, period: 'AM', time: '1:00 AM' },
  // { hour: 1, period: 'AM', time: '1:30 AM' },
  // { hour: 2, period: 'AM', time: '2:00 AM' },
  // { hour: 2, period: 'AM', time: '2:30 AM' },
  // { hour: 3, period: 'AM', time: '3:00 AM' },
  // { hour: 3, period: 'AM', time: '3:30 AM' },
  // { hour: 4, period: 'AM', time: '4:00 AM' },
  // { hour: 4, period: 'AM', time: '4:30 AM' },
  // { hour: 5, period: 'AM', time: '5:00 AM' },
  // { hour: 5, period: 'AM', time: '5:30 AM' },
  // { hour: 6, period: 'AM', time: '6:00 AM' },
  // { hour: 6, period: 'AM', time: '6:30 AM' },
  // { hour: 7, period: 'AM', time: '7:00 AM' },
  // { hour: 7, period: 'AM', time: '7:30 AM' },
  // { hour: 8, period: 'AM', time: '8:00 AM' },
  // { hour: 8, period: 'AM', time: '8:30 AM' },
  { hour: 9, period: 'AM', time: '9:00 AM' },
  { hour: 9, period: 'AM', time: '9:30 AM' },
  { hour: 10, period: 'AM', time: '10:00 AM' },
  { hour: 10, period: 'AM', time: '10:30 AM' },
  { hour: 11, period: 'AM', time: '11:00 AM' },
  { hour: 11, period: 'AM', time: '11:30 AM' },
  { hour: 12, period: 'PM', time: '12:00 PM' },
  { hour: 12, period: 'PM', time: '12:30 PM' },
  { hour: 1, period: 'PM', time: '1:00 PM' },
  { hour: 1, period: 'PM', time: '1:30 PM' },
  { hour: 2, period: 'PM', time: '2:00 PM' },
  { hour: 2, period: 'PM', time: '2:30 PM' },
  { hour: 3, period: 'PM', time: '3:00 PM' },
  { hour: 3, period: 'PM', time: '3:30 PM' },
  { hour: 4, period: 'PM', time: '4:00 PM' },
  { hour: 4, period: 'PM', time: '4:30 PM' },
  { hour: 5, period: 'PM', time: '5:00 PM' },
  { hour: 5, period: 'PM', time: '5:30 PM' },
  { hour: 6, period: 'PM', time: '6:00 PM' },
  { hour: 6, period: 'PM', time: '6:30 PM' },
  { hour: 7, period: 'PM', time: '7:00 PM' },
  // { hour: 7, period: 'PM', time: '7:30 PM' },
  // { hour: 8, period: 'PM', time: '8:00 PM' },
  // { hour: 8, period: 'PM', time: '8:30 PM' },
  // { hour: 9, period: 'PM', time: '9:00 PM' },
  // { hour: 9, period: 'PM', time: '9:30 PM' },
  // { hour: 10, period: 'PM', time: '10:00 PM' },
  // { hour: 10, period: 'PM', time: '10:30 PM' },
  // { hour: 11, period: 'PM', time: '11:00 PM' },
  // { hour: 11, period: 'PM', time: '11:30 PM' }
];


export const handleRenderMonth = (param: number) => {
  switch (param) {
    case 0:
      return 'Enero';
    case 1:
      return 'Febrero';
    case 2:
      return 'Marzo';
    case 3:
      return 'Abril';
    case 4:
      return 'Mayo';
    case 5:
      return 'Junio';
    case 6:
      return 'Julio';
    case 7:
      return 'Agosto';
    case 8:
      return 'Septiembre';
    case 9:
      return 'Octubre';
    case 10:
      return 'Noviembre';
    case 11:
      return 'Diciembre';
    default:
      return '';
  }
}

export const isSameDay = (date1: Date, date2: Date): boolean => {
  return date1.getFullYear() === date2.getFullYear() &&
    date1.getMonth() === date2.getMonth() &&
    date1.getDate() === date2.getDate();
};

export function convertTo12HourFormat(time: string): string {
  const [hourPart, minutePart] = time.split(':').map(Number);
  const hour = hourPart % 12 || 12; // Convert 0-23 to 1-12 format, 0 becomes 12
  return `${hour}:${minutePart.toString().padStart(2, '0')}`;
}

export function convertTo24HourFormat(time: string): string {
  const [timePart, period] = time.split(' ');
  let [hour, minute] = timePart.split(':').map(Number);

  if (period === 'PM' && hour !== 12) {
    hour += 12;
  } else if (period === 'AM' && hour === 12) {
    hour = 0;
  }

  const hourStr = hour.toString().padStart(2, '0');
  const minuteStr = minute.toString().padStart(2, '0');

  return `${hourStr}${minuteStr}`;
}

export const renderDay = (param: number | undefined) => {


  // if (isNaN(param)) return 'Día:'

  switch (param) {
    case 1:
      return 'Lunes'
    case 2:
      return 'Martes'
    case 3:
      return 'Miércoles'
    case 4:
      return 'Jueves'
    case 5:
      return 'Viernes'
    case 6:
      return 'Sábado'
    case 0:
      return 'Domingo'
    case 7:
      return 'Domingo'

    default:
      return 'Día:'
  }
}

export function formatTo24HourFormat(hour: number, minutes: number, period: string): string {
  if (period === 'PM' && hour !== 12) {
      hour += 12;
  } else if (period === 'AM' && hour === 12) {
      hour = 0;
  }

  const hourStr = hour.toString().padStart(2, '0');
  const minuteStr = minutes.toString().padStart(2, '0');

  return `${hourStr}:${minuteStr}`;
}