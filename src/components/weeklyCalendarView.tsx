import React, { useEffect, useState } from 'react';
import { convertTo12HourFormat, convertTo24HourFormat, formatTo24HourFormat, hoursInDay, isSameDay } from '@/lib/utils';
import { Appointment } from '@/lib/appointments';
import useCalendarStore from '@/store/calendar.store';
import { Dialog } from './ui/dialog';
import DialogContentView from './dialogContentView';

interface HourSlot {
    hour: number;
    period: string;
    time: string;
}

interface Day {
    date: Date;
}

interface WeeklyCalendarViewProps {
    activeWeek: Day[];
    appointmentsByDay: { [date: string]: Appointment[] };
}

const getHourIndex = (hour: string, hoursInDay: HourSlot[]): number | null => {
    const [hourPart, minutePart] = hour.split(':');
    const hourNumber = parseInt(hourPart);
    const minuteNumber = parseInt(minutePart);

    return hoursInDay.findIndex(
        (slot) => slot.hour === hourNumber && slot.period === (hour.includes('AM') ? 'AM' : 'PM') && slot.time.endsWith(`${minuteNumber < 30 ? '00' : '30'} ${slot.period}`)
    );
};

const WeeklyCalendarView: React.FC<WeeklyCalendarViewProps> = ({ activeWeek, appointmentsByDay }) => {
    const [open, setOpen] = useState<boolean>(false);
    const [isEditing, setIsEditing] = useState<boolean>(false)
    const [timeSelected, setTimeSelected] = useState<string>('');
    const [nameSelected, setNameSelected] = useState<string>('');
    const [idAppo, setIdAppo] = useState<number>(0)
    const date = useCalendarStore(state => state.date)
    const setDate = useCalendarStore(state => state.setDate)


    const handleOpenModal = (hour: string, period: string, appointments: Appointment[], day: Date) => {
        const hourFormated = hour.split(' ')[0]

        if((Number(convertTo24HourFormat(hour)) > 1830) || (Number(convertTo24HourFormat(hour)) <= 930)){
            return
        }


        const hours = Number(hourFormated.split(':')[0])
        const minutes = Number(hourFormated.split(':')[1])

        const hoursFinal = formatTo24HourFormat(hours, minutes, period)

        const appointmentFocus = appointments && appointments?.find(appo => convertTo12HourFormat(appo.hora) == hourFormated)

        if (isSameDay(day, date)) {

            if (!appointmentFocus) {
                setNameSelected('')
                setTimeSelected(hoursFinal)
                setIsEditing(false)
                setOpen(true)
                return
            }

            if (appointmentFocus?.id_agenda !== -1) {
                setTimeSelected(hoursFinal)
                setNameSelected(appointmentFocus?.ape_nom || '')
                setIsEditing(true)
                setIdAppo(appointmentFocus.id_agenda)
                setOpen(true)

            } else {
                setNameSelected('')
                setTimeSelected(hoursFinal)
                setOpen(true)
            }
        } else {

            if (!appointmentFocus) {
                setNameSelected('')
                setTimeSelected(hoursFinal)
                setDate(day)
                setIsEditing(false)
                setOpen(true)
                return
            }

            if (appointmentFocus?.id_agenda !== -1) {
                setTimeSelected(hoursFinal)
                setNameSelected(appointmentFocus?.ape_nom || '')
                setDate(day)
                setIsEditing(true)
                setIdAppo(appointmentFocus.id_agenda)
                setOpen(true)

            } else {
                setNameSelected('')
                setTimeSelected(hoursFinal)
                setDate(day)
                setOpen(true)
            }
        }
    }


    useEffect(() => {
        if(!open){
            setTimeSelected('')
            setNameSelected('')
        }
    }, [open])

    return (
        <Dialog open={open}>
            <div className='w-full'>
                <div className='flex m-2 w-full'>
                    {activeWeek?.map((day, dayIndex) => {
                        return (
                            <div
                                key={dayIndex}
                                className={`day w-full flex justify-center items-center transition-all`}
                            >
                                <h2 className='text-sm'>{day.date.toLocaleDateString('es-ES', { weekday: 'long' })} - {day.date.getDate()}</h2>
                            </div>
                        );
                    })}
                </div>

                <div className='flex'>
                    <div>
                        {hoursInDay.map((hour, index) => (
                            <div key={index} className='w-full min-h-[45px] cursor-pointer hover:bg-[#d6ffff]'>
                                <p className='text-[8px] font-thin min-w-[40px]'>
                                    {hour.time}
                                </p>
                            </div>
                        ))}
                    </div>
                    <div className='flex w-full'>
                        {activeWeek?.map((day, dayIndex) => {
                            const dateStr = day.date.toISOString().split('T')[0];
                            const appointments = appointmentsByDay[dateStr] || [];
                            return (
                                <div
                                    key={dayIndex}
                                    className='day w-full flex flex-col justify-center items-center transition-all'
                                >
                                    <div className='w-full'>
                                        {hoursInDay.map((hour, hourIndex) => {
                                            return (
                                                <div
                                                    key={hourIndex}
                                                    className={`w-full border-t border-r min-h-[45px] cursor-pointer hover:bg-[#d6ffff] ${Number(convertTo24HourFormat(hour.time)) > 1830 ? 'bg-slate-100 cursor-not-allowed hover:bg-red-200' : (Number(convertTo24HourFormat(hour.time)) < 1000 ? 'bg-slate-100 cursor-not-allowed hover:bg-red-200' : '')}`}
                                                    onClick={() => handleOpenModal(hour.time, hour.period, appointments, day.date)}
                                                >
                                                    {appointments
                                                        .filter(appointment => {
                                                            const [appointmentHour, appointmentMinutes] = appointment.hora.split(':');
                                                            let appointmentPeriod = 'AM';
                                                            let hourNumber = parseInt(appointmentHour, 10);

                                                            if (hourNumber >= 12) {
                                                                appointmentPeriod = 'PM';
                                                                if (hourNumber > 12) {
                                                                    hourNumber -= 12;
                                                                }
                                                            } else if (hourNumber === 0) {
                                                                hourNumber = 12; // Midnight case
                                                            }

                                                            const formattedAppointmentHour = `${hourNumber}:${appointmentMinutes} ${appointmentPeriod}`;
                                                            return getHourIndex(formattedAppointmentHour, hoursInDay) === hourIndex;
                                                        })
                                                        .map((appointment, appointmentIndex) => {
                                                            if (appointment.id_agenda !== -1) {
                                                                return (
                                                                    <p key={appointmentIndex} className='text-xs h-[44px] font-thin h-full bg-[#d6ffff]'>
                                                                        {`${appointment.ape_nom || 'Sin nombre'}`}
                                                                    </p>
                                                                )
                                                            }
                                                        })}

                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>

            <DialogContentView
            open={open} setOpen={setOpen} 
            isEditing={isEditing} isDeleting={false} 
            time={timeSelected} setTime={setTimeSelected}
            name={nameSelected} setName={setNameSelected}
            idAppo={idAppo} setIdAppo={setIdAppo} />
        </Dialog>
    );
};

export default WeeklyCalendarView;
