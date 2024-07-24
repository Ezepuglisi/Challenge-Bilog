'use client'
import { Month } from '@/lib/calendarLibrary'
import { handleRenderMonth, isSameDay } from '@/lib/utils'
import useCalendarStore from '@/store/calendar.store'
import React, { useEffect, useState } from 'react'

interface Props {
    year: number,
    month: Month
    days: string[]
}

const Calendar = ({ year, month, days }: Props) => {

    const [monthOfThisCalendar, setMonthOfThisCalendar] = useState<String>('')
    const date = useCalendarStore(state => state.date)
    const setDate = useCalendarStore(state => state.setDate)
    const setYear = useCalendarStore(state => state.setYear)
    const setMonth = useCalendarStore(state => state.setMonth)
    const setDay = useCalendarStore(state => state.setDay)
    const setActiveWeekIndex = useCalendarStore(state => state.setActiveWeekIndex)
    const setView = useCalendarStore(state => state.setView)

    const handleInitialOfDays = (day: string) => {
        switch (day) {
            case 'Domingo':
                return 'D'
            case 'Lunes':
                return 'L'
            case 'Martes':
                return 'M'
            case 'Miercoles':
                return 'X'
            case 'Jueves':
                return 'J'
            case 'Viernes':
                return 'V'
            case 'Sabado':
                return 'S'
        }
    }

    useEffect(() => {
        if (month) {
            const indexMonth = month[1][0]?.date.getMonth()
            setMonthOfThisCalendar(handleRenderMonth(indexMonth))
        }
    }, [])


    const handleSelectDay = (numberOfDay: Date) => {
        const month = numberOfDay.getMonth()
        const year = numberOfDay.getFullYear()
        const day = numberOfDay.getDay()

        setDate(numberOfDay)
        setYear(year)
        setMonth(month)
        setDay(day)
        setActiveWeekIndex(Math.floor(numberOfDay.getDate() / 7))
        // setView('day')
    }




    return (
        <div className='border rounded-md p-4 min-w-[200px]'>
            <h2 className='px-2 mb-2'>{monthOfThisCalendar}</h2>
            <div className='flex gap-2 mb-2'>
                {days.map((d, i) => {
                    return <p key={i} className='text-sm w-full text-center min-w-[30px]'>{handleInitialOfDays(d)}</p>
                })}
            </div>
            <div>
                {
                    month?.map((week, weekindex) => {
                        return (
                            <div key={weekindex} className='flex gap-2 mb-2'>
                                {week.map((day, dayindex) => {
                                    return <p
                                        key={dayindex}
                                        className={`${!day.isCurrentMonth && 'text-slate-400'} ${isSameDay(day.date, date || new Date()) && 'bg-slate-300'} cursor-pointer transition-all text-sm w-full flex items-center justify-center min-w-[30px] min-h-[30px] rounded-full hover:bg-gray-200`}
                                        onClick={() => handleSelectDay(day.date)}
                                        >
                                        {day.date.getDate()}
                                    </p>
                                })}
                            </div>)
                    })
                }
            </div>
        </div>
    )
}

export default Calendar