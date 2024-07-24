import { Appointment } from '@/lib/appointments';
import { create } from 'zustand';

interface CalendarState {
    day: number;
    year: number;
    month: number;
    date: Date;
    view: string;
    activeWeekIndex: number;
    isWeekWithDaysFromAnotherMonth: boolean;
    appointments: { [date: string]: Appointment[] };
    arrayOfAppointments: Appointment[];
    setDay: (day: number) => void;
    setYear: (year: number) => void;
    setMonth: (month: number) => void;
    setDate: (date: Date) => void;
    setView: (view: string) => void;
    setActiveWeekIndex: (i: number) => void;
    setIsWeekWithDaysFromAnotherMonth: (param: boolean) => void;
    setAppointments: (appointmentsByDay: { [date: string]: Appointment[] }) => void;
    setArrayOfAppointments:(param:Appointment[]) => void
}

const useCalendarStore = create<CalendarState>((set) => ({
    day: new Date().getDate(),
    month: new Date().getMonth(),
    year: new Date().getFullYear(),
    date: new Date(),
    view: 'month',
    activeWeekIndex: Math.floor(new Date().getDate() / 7),
    isWeekWithDaysFromAnotherMonth: false,
    appointments: {},
    arrayOfAppointments:[],
    setDay: (day) => set({ day: day }),
    setYear: (year) => set({ year: year }),
    setMonth: (month) => set((state) => {
        const newMonth = (month + 12) % 12;
        let newYear = state.year;
        if (month < 0) {
            newYear--;
        } else if (month > 11) {
            newYear++;
        }
        return { month: newMonth, year: newYear };
    }),
    setDate: (date) => set({ date: date }),
    setView: (view) => set({ view: view }),
    setActiveWeekIndex: (i) => set({ activeWeekIndex: i }),
    setIsWeekWithDaysFromAnotherMonth: (param) => set({ isWeekWithDaysFromAnotherMonth: param }),
    setAppointments: (appointmentsByDay) => set({ appointments: appointmentsByDay }),
    setArrayOfAppointments:(param) => set({arrayOfAppointments:param})
}));

export default useCalendarStore;
