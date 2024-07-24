'use client'
import React, { useState } from 'react';
import useCalendarStore from '@/store/calendar.store';
import { handleRenderMonth, renderDay } from '@/lib/utils';
import { Button } from './ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { BsTrash3 } from 'react-icons/bs';
import DialogContentView from './dialogContentView';

const CalendarAside = () => {
    const [open, setOpen] = useState<boolean>(false)
    const [isEditing, setIsEditing] = useState<boolean>(false)
    const [idAppo, setIdAppo] = useState<number>(0)
    const [isDeleting, setIsDeleting] = useState<boolean>(false)

    const date = useCalendarStore((state) => state.date);
    const appointments = useCalendarStore(state => state.appointments);
    const dateStr = date.toISOString().split('T')[0];
    const appointmentsOfDay = appointments[dateStr] || [];

    const [selectedName, setSelectedName] = useState<string>('')
    const [selectedTime, setSelectedTime] = useState<string>('')

    const handleEdit = (name: string, time: string, id: number) => {
        setSelectedName(name)
        setSelectedTime(time)
        setIsEditing(true)
        setIdAppo(id)
        setOpen(true)

    }

    const handleDelete = () => {
        setIsDeleting(true)
        setOpen(true)
    }


    return (
        <Dialog open={open}>

            <div className='h-full fixed left-0 top-[75px] p-1 border w-[200px] px-2'>
                <h2 className='w-full text-center mb-4'>
                    {renderDay(date.getDay())} {date.getDate()} de {handleRenderMonth(date.getMonth())}
                </h2>

                {appointmentsOfDay.length > 0 ? (
                    <div className='flex flex-col items-center justify-center gap-4'>
                        {appointmentsOfDay.map((appointment, appointmentIndex) => {
                            if (appointment.id_agenda !== -1) {
                                return (
                                    <div onClick={() => handleEdit(appointment.ape_nom || 'Sin nombre', appointment.hora, appointment.id_agenda)} key={appointmentIndex} className='text-xs flex items-center p-2 font-thin min-h-[30px] bg-[#d6ffff] mb-1 w-full'>
                                        <p className='cursor-pointer flex items-center justify-between w-full gap-2 line-clamp-1'>{appointment.hora} {`${appointment.ape_nom || 'Sin nombre'}`} <span onClick={() => handleDelete()} className='hover:bg-red-600 hover:text-white p-1 cursor-pointer rounded-md transition-all'><BsTrash3 /></span></p>
                                    </div>
                                );
                            }
                            return null;
                        })}
                        <DialogTrigger onClick={() => setOpen(true)} className='bg-slate-200 p-2 rounded-md'>Agenda una nueva</DialogTrigger>
                    </div>
                ) : (
                    <div className='flex flex-col items-center justify-center gap-4'>
                        <p className='text-center text-sm'>No tienes ninguna cita hoy...</p>
                        <DialogTrigger onClick={() => setOpen(true)} className='bg-slate-200 p-2 rounded-md'>Agenda una nueva</DialogTrigger>
                    </div>
                )}

                <DialogContentView 
                open={open} setOpen={setOpen} 
                name={selectedName} time={selectedTime} 
                isEditing={isEditing} setIsEditing={setIsEditing} 
                idAppo={idAppo} 
                isDeleting={isDeleting} setIsDeleting={setIsDeleting}
                setName={setSelectedName} setTime={setSelectedTime}
                />
            </div >
        </Dialog>
    );
};

export default CalendarAside;
