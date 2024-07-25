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

interface DailyCalendarViewProps {
    selectedDate: Date;
    appointmentsByDay: { [date: string]: Appointment[] };
}

const getHourIndex = (hour: string, hoursInDay: HourSlot[]): number | null => {
    const [hourPart, minutesPart] = hour.split(':');
    const period = parseInt(hourPart) >= 12 ? 'PM' : 'AM';
    const formattedHour = parseInt(hourPart) % 12 || 12; // Convert 0-23 to 1-12 format
    const time = `${formattedHour}:${minutesPart} ${period}`;

    return hoursInDay.findIndex(
        (slot) => slot.time === time
    );
};

const DailyCalendarView: React.FC<DailyCalendarViewProps> = ({ selectedDate, appointmentsByDay }) => {
    const dateStr = selectedDate.toISOString().split('T')[0];
    const appointments = appointmentsByDay[dateStr] || [];

    const [open, setOpen] = useState<boolean>(false);
    const [isEditing, setIsEditing] = useState<boolean>(false);
    const [timeSelected, setTimeSelected] = useState<string>('');
    const [nameSelected, setNameSelected] = useState<string>('')
    const [idAppo, setIdAppo]= useState<number>(0)
    const date = useCalendarStore(state => state.date)
    const setDate = useCalendarStore(state => state.setDate)


    const handleOpenModal = (hour: string, period: string, appointments: Appointment[], day: Date) => {
        if((Number(convertTo24HourFormat(hour)) > 1830) || (Number(convertTo24HourFormat(hour)) <= 930)){
            return
        }
        const hourFormated = hour.split(' ')[0]

        const hours = Number(hourFormated.split(':')[0])
        const minutes = Number(hourFormated.split(':')[1])

        const hoursFinal = formatTo24HourFormat(hours, minutes, period)

        const appointmentFocus = appointments && appointments?.find(appo => convertTo12HourFormat(appo.hora) == hourFormated)


        if(!appointmentFocus){
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
            setIsEditing(false)
            setOpen(true)

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
                <div className='flex'>
                    <div>
                        {hoursInDay.map((hour, index) => (
                            <div key={index} className='w-full min-h-[35px] min-w-[50px] cursor-pointer hover:bg-[#d6ffff]'>
                                <p className='text-[9px] font-thin'>
                                    {hour.time}
                                </p>
                            </div>
                        ))}
                    </div>
                    <div className='flex w-full'>
                        <div className='w-full'>
                            {hoursInDay.map((hour, hourIndex) => {
                                return (
                                    <div
                                        key={hourIndex}
                                        className={`w-full p-1 border-t border-r min-h-[35px] cursor-pointer hover:bg-[#d6ffff] flex flex-col transition-all ${Number(convertTo24HourFormat(hour.time)) > 1830 ? 'bg-slate-100 cursor-not-allowed hover:bg-red-200' : (Number(convertTo24HourFormat(hour.time)) < 1000 ? 'bg-slate-100 cursor-not-allowed hover:bg-red-200' : '')}`}
                                        onClick={() => handleOpenModal(hour.time, hour.period, appointments, date)}
                                    >
                                        {appointments
                                            .filter(appointment => {
                                                const [appointmentHour, appointmentMinutes] = appointment.hora.split(':');
                                                const formattedAppointmentHour = `${appointmentHour}:${appointmentMinutes}`;
                                                return getHourIndex(formattedAppointmentHour, hoursInDay) === hourIndex;
                                            })
                                            .map((appointment, appointmentIndex) => {
                                                if (appointment.id_agenda !== -1) {
                                                    return (
                                                        <div key={appointmentIndex} className='text-xs flex items-center p-2 font-thin min-h-[30px] bg-[#d6ffff]'>
                                                            <p>{`${appointment.ape_nom || 'Sin nombre'}`}</p>
                                                        </div>
                                                    );
                                                }
                                            })}

                                    </div>
                                );
                            })}
                        </div>
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

export default DailyCalendarView;
