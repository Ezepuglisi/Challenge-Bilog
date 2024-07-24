export interface Day {
    date: Date;
    isCurrentMonth: boolean;
}

export type Week = Day[];
export type Month = Week[];

export function generateCalendar(year: number, month: number): Week[] {
    const firstDayOfMonth = new Date(year, month, 1);
    const lastDayOfMonth = new Date(year, month + 1, 0);

    const firstDayOfWeek = firstDayOfMonth.getDay();
    const lastDayOfWeek = lastDayOfMonth.getDay();

    const daysInMonth = lastDayOfMonth.getDate();
    const daysInPrevMonth = new Date(year, month, 0).getDate();

    const calendar: Week[] = [];
    let week: Week = [];

    for (let i = firstDayOfWeek - 1; i >= 0; i--) {
        const date = new Date(year, month - 1, daysInPrevMonth - i);
        week.push({ date, isCurrentMonth: false });
    }

    for (let day = 1; day <= daysInMonth; day++) {
        const date = new Date(year, month, day);
        week.push({ date, isCurrentMonth: true });

        if (week.length === 7) {
            calendar.push(week);
            week = [];
        }
    }

    for (let i = 1; week.length < 7; i++) {
        const date = new Date(year, month + 1, i);
        week.push({ date, isCurrentMonth: false });
    }

    calendar.push(week);

    return calendar;
}

export function generateYearCalendar(year: number): Month[] {
    const yearCalendar: Month[] = [];
    for (let month = 0; month < 12; month++) {
      const monthCalendar = generateCalendar(year, month);
      yearCalendar.push(monthCalendar);
    }
    return yearCalendar;
  }