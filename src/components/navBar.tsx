'use client'
import React, { useEffect, useState } from 'react'
import { Button } from './ui/button'
import useCalendarStore from '@/store/calendar.store'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select'
import { handleRenderMonth } from '@/lib/utils'

const NavBar = () => {
    const day = useCalendarStore((state) => state.day);
    const setDay = useCalendarStore((state) => state.setDay);
    const year = useCalendarStore((state) => state.year);
    const setYear = useCalendarStore((state) => state.setYear);
    const month = useCalendarStore((state) => state.month);
    const setMonth = useCalendarStore((state) => state.setMonth);
    const date = useCalendarStore((state) => state.date);
    const setDate = useCalendarStore((state) => state.setDate);
    const view = useCalendarStore((state) => state.view);
    const setView = useCalendarStore((state) => state.setView);

    const activeWeekIndex = useCalendarStore((state) => state.activeWeekIndex);
    const setActiveWeekIndex = useCalendarStore((state) => state.setActiveWeekIndex);
    const isWeekWithDaysFromAnotherMonth = useCalendarStore((state) => state.isWeekWithDaysFromAnotherMonth);

    const [valuePlaceholder, setValuePlaceholder] = useState<string>('')

    const handlePlaceHolder = (view:string) => {
        switch (view) {
            case 'month':
                return 'Mes'
            case 'year':
                return 'Año'
            case 'day':
                return 'Día'
            case 'week':
                return 'Semana'
            default:
                return 'Mes'
        }
    }

    const handleNext = () => {
        if (view == 'month') {
            setMonth(month + 1);
            return;
        }

        if (view == 'week') {
            if (activeWeekIndex == 4) {
                setMonth(month + 1);
                isWeekWithDaysFromAnotherMonth ? setActiveWeekIndex(1) : setActiveWeekIndex(0);
                return;
            } else {
                setActiveWeekIndex(activeWeekIndex + 1);
                return;
            }
        }

        if (view == 'year') {
            setYear(year + 1);
            return;
        }

        if (view == 'day') {
            const newDate = new Date(date);
            const lastDayOfMonth = new Date(year, month, 0).getDate(); // Último día del mes actual
    
            if (newDate.getDate() === lastDayOfMonth) {
                if (month === 12) {
                    // Si es 31 de diciembre, cambiar al 1 de enero del año siguiente
                    newDate.setFullYear(year + 1);
                    newDate.setMonth(0); // Enero
                    newDate.setDate(1);
                    setYear(year + 1);
                    setMonth(1);
                } else {
                    // Cambiar al primer día del mes siguiente
                    newDate.setMonth(month); // Mes siguiente
                    newDate.setDate(1);
                    setMonth(month + 1);
                }
                setDate(newDate);
            } else {
                newDate.setDate(newDate.getDate() + 1);
                setDate(newDate);
            }
        }
    }

    const handlePrevious = () => {
        if (view == 'month') {
            setMonth(month - 1);
            return;
        }

        if (view == 'week') {
            if (activeWeekIndex == 0) {
                setMonth(month - 1);
                isWeekWithDaysFromAnotherMonth ? setActiveWeekIndex(3) : setActiveWeekIndex(4);
                return;
            } else {
                setActiveWeekIndex(activeWeekIndex - 1);
                return;
            }
        }

        if (view == 'year') {
            setYear(year - 1);
            return;
        }

        if (view == 'day') {
            const newDate = new Date(date);

            if (newDate.getDate() === 1) {
                if (month === 1) {
                    // Si es 1 de enero, cambiar al 31 de diciembre del año anterior
                    newDate.setFullYear(year - 1);
                    newDate.setMonth(11); // Diciembre
                    newDate.setDate(31);
                    setYear(year - 1);
                    setMonth(12);
                } else {
                    // Cambiar al último día del mes anterior
                    newDate.setMonth(month - 2); // Mes anterior
                    newDate.setDate(0); // Último día del mes anterior
                    setMonth(month - 1);
                }
                setDate(newDate);
            } else {
                newDate.setDate(newDate.getDate() - 1);
                setDate(newDate);
            }
        }
    }

    const handleWeekWithDaysFromAnotherMonth = () => {
        const monthActive = handleRenderMonth(month);
        const previousMonth = handleRenderMonth(month - 1);
        const nextMonth = handleRenderMonth(month + 1);

        if (activeWeekIndex > 0) {
            return `${monthActive} - ${nextMonth} ${year}`;
        } else {
            return `${previousMonth} - ${monthActive} ${year}`;
        }
    }

    useEffect(() => {
        const newview = handlePlaceHolder(view)
        setValuePlaceholder(newview)
    }, [view])

    return (
        <nav className="fixed h-[75px] w-full p-4 border-b shadow-md flex items-center px-8 mb-2 bg-white">
            <div className='w-full flex items-center gap-2'>
                {view === 'month' && (
                    <>
                        <Button className='p-4' variant={'ghost'} onClick={handlePrevious}>
                            {'<'}
                        </Button>
                        <Button className='p-4' variant={'ghost'} onClick={handleNext}>
                            {'>'}
                        </Button>
                        <p className='p-4 font-medium text-lg'>{handleRenderMonth(month)} {year}</p>
                    </>
                )}

                {view === 'week' && (
                    <>
                        <Button className='p-4' variant={'ghost'} onClick={handlePrevious}>
                            {'<'}
                        </Button>
                        <Button className='p-4' variant={'ghost'} onClick={handleNext}>
                            {'>'}
                        </Button>
                        <p className='p-4 font-medium text-lg'>{isWeekWithDaysFromAnotherMonth ? handleWeekWithDaysFromAnotherMonth() : `${handleRenderMonth(month)} ${year}`}</p>
                    </>
                )}

                {view === 'day' && (
                    <>
                        <Button className='p-4' variant={'ghost'} onClick={handlePrevious}>
                            {'<'}
                        </Button>
                        <Button className='p-4' variant={'ghost'} onClick={handleNext}>
                            {'>'}
                        </Button>
                        <p className='p-4 font-medium text-lg'>{handleRenderMonth(month)} {date.getDate()}, {year}</p>
                    </>
                )}

                {view === 'year' && (
                    <>
                        <Button className='p-4' variant={'ghost'} onClick={handlePrevious}>
                            {'<'}
                        </Button>
                        <Button className='p-4' variant={'ghost'} onClick={handleNext}>
                            {'>'}
                        </Button>
                        <p className='p-4 font-medium text-lg'>{year}</p>
                    </>
                )}
            </div>
            <Select onValueChange={(value)=> {setView(value), setValuePlaceholder(value)}}>
                <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder={valuePlaceholder} />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="day">Día</SelectItem>
                    <SelectItem value="week">Semana</SelectItem>
                    <SelectItem value="month">Mes</SelectItem>
                    <SelectItem value="year">Año</SelectItem>
                </SelectContent>
            </Select>
        </nav>
    )
}

export default NavBar
