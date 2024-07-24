'use client'
import { generateCalendar, generateYearCalendar, Month, Week } from '@/lib/calendarLibrary';
import React, { useEffect, useState } from 'react';
import '../css/days.css'
import useCalendarStore from '@/store/calendar.store';
import Calendar from './calendar';
import { Appointment, organizeAppointmentsByDay } from '@/lib/appointments';
import WeeklyCalendarView from './weeklyCalendarView';
import DailyCalendarView from './dailyCalendarView';
import MonthlyCalendarView from './monthlyCalendarView';

interface CalendarProps {
  citas: Appointment[]
}

const CalendarGrid: React.FC<CalendarProps> = ({ citas }) => {

  //states
  const [appointmentsByDay, setAppointmentsByDay] = useState<{ [date: string]: Appointment[] }>({});


  //variables
  const view = useCalendarStore(state => state.view)
  const date = useCalendarStore(state => state.date)
  const appointments = useCalendarStore(state => state.appointments)
  const activeWeekIndex = useCalendarStore(state => state.activeWeekIndex)
  const year = useCalendarStore(state => state.year)
  const month = useCalendarStore(state => state.month)
  const arrayOfAppointments = useCalendarStore(state => state.arrayOfAppointments);

  //sets
  const setIsWeekWithDaysFromAnotherMonth = useCalendarStore(state => state.setIsWeekWithDaysFromAnotherMonth)
  const setAppointments = useCalendarStore(state => state.setAppointments)
  const setArrayOfAppointments = useCalendarStore(state => state.setArrayOfAppointments);


  const calendar: Week[] = generateCalendar(year, month);
  const yearCalendar: Month[] = generateYearCalendar(year);
  const days: string[] = ['Domingo', 'Lunes', 'Martes', 'Miercoles', 'Jueves', 'Viernes', 'Sabado']
  const [activeWeek, setActiveWeek] = useState(calendar[activeWeekIndex])



  useEffect(() => {
    const param = activeWeek?.find((day) => day.isCurrentMonth == false)

    if (param) {
      setIsWeekWithDaysFromAnotherMonth(true)
    } else {
      setIsWeekWithDaysFromAnotherMonth(false)
    }
  }, [activeWeek])


  useEffect(() => {
    const appo = citas;
    setArrayOfAppointments(appo)
    const organizedAppointments = organizeAppointmentsByDay(appo);
    setAppointmentsByDay(organizedAppointments);
    setAppointments(organizedAppointments)

  }, [citas])


  useEffect(() => {

    const organizedAppointments = organizeAppointmentsByDay(arrayOfAppointments);
    setAppointmentsByDay(organizedAppointments);


  }, [appointments])


  useEffect(() => {
    setActiveWeek(calendar[activeWeekIndex])
  }, [activeWeekIndex])


  return (
    <div className="calendar w-full">

      {
        view == 'month' &&
        <MonthlyCalendarView
        calendar={calendar}
        days={days}
        appointmentsByDay={appointmentsByDay}
        />
      }

      {view == 'week' &&
        <WeeklyCalendarView
          activeWeek={activeWeek}
          appointmentsByDay={appointmentsByDay}
        />

      }

      {
        view == 'day' &&
        <DailyCalendarView
          selectedDate={date}
          appointmentsByDay={appointmentsByDay}
        />
      }
      {
        view == 'year' &&
        <div className='w-full flex flex-wrap gap-4 justify-center'>
          {yearCalendar.map((m, index) => (
            <Calendar
              year={year}
              month={m}
              days={days}
              key={index}
            />
          ))
          }
        </div>
      }


    </div>
  );
};

export default CalendarGrid;