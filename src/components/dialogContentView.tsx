'use client'
import { useEffect, useState } from "react";
import { DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select"
import useCalendarStore from "@/store/calendar.store";
import { Button } from "./ui/button";
import { organizeAppointmentsByDay } from "@/lib/appointments";

interface Props {
    open: boolean;
    setOpen: (param: boolean) => void;
    name?: string;
    setName?: (param: string) => void;
    time?: string;
    setTime?: (param: string) => void;
    isEditing: boolean;
    setIsEditing?: (param: boolean) => void;
    idAppo?: number;
    setIdAppo?: (param: number) => void;
    isDeleting: boolean;
    setIsDeleting?: (param: boolean) => void;
}

const DialogContentView = (props: Props) => {

    const {
        open,
        setOpen,
        name,
        time,
        isEditing,
        idAppo,
        setIsEditing,
        setIdAppo,
        isDeleting,
        setIsDeleting,
        setName,
        setTime
    } = props

    const [newAppointmentTime, setNewAppointmentTime] = useState<string>('');
    const [newAppointmentName, setNewAppointmentName] = useState<string>('');
    const appointments = useCalendarStore(state => state.appointments)
    const date = useCalendarStore((state) => state.date);
    const setAppointments = useCalendarStore(state => state.setAppointments);
    const arrayOfAppointments = useCalendarStore(state => state.arrayOfAppointments);
    const setArrayOfAppointments = useCalendarStore(state => state.setArrayOfAppointments);


    useEffect(() => {

        if (time && time !== '') {
            setNewAppointmentTime(time)
        }

        if (name && name !== '') {
            setNewAppointmentName(name)
        }
    }, [time, name])

    const dateStr = date.toISOString().split('T')[0];
    const appointmentsOfDay = appointments[dateStr] || [];

    const generateTimeSlots = () => {
        const timeSlots = [];
        for (let hour = 10; hour < 19; hour++) {
            timeSlots.push(`${hour < 10 ? '0' : ''}${hour}:00`);
            timeSlots.push(`${hour < 10 ? '0' : ''}${hour}:30`);
        }
        return timeSlots;
    };

    const availableTimeSlots = generateTimeSlots().filter(slot => {
        return !appointmentsOfDay.some(appointment => appointment.hora === slot);
    });

    const allTimeSlots = generateTimeSlots()

    const handleSaveAppointment = () => {

        if (!newAppointmentTime || !newAppointmentName) {
            alert('Por favor selecciona un horario e ingresa un nombre.');
            return;
        }

        const newAppointment = {
            id_agenda: Math.random(),
            id_paciente: null,
            fecha: dateStr,
            hora: newAppointmentTime,
            ape_nom: newAppointmentName,
        };

        const updatedAppointments = {
            ...appointments,
            [dateStr]: [...appointmentsOfDay, newAppointment],
        };

        const appoArray = arrayOfAppointments
        appoArray.push(newAppointment)
        setArrayOfAppointments(appoArray)

        setAppointments(updatedAppointments);
        setNewAppointmentTime('');
        setNewAppointmentName('');
        setOpen(false)
    };

    const handleEditAppointment = () => {
        if (!newAppointmentTime || !newAppointmentName) {
            alert('Por favor selecciona un horario e ingresa un nombre.');
            return;
        }

        const appointmentsWithoutThisAppointment = arrayOfAppointments.filter(appo => appo.id_agenda !== idAppo)

        const newAppointment = {
            id_agenda: Math.random(),
            id_paciente: null,
            fecha: dateStr,
            hora: newAppointmentTime,
            ape_nom: newAppointmentName,
        };
        appointmentsWithoutThisAppointment.push(newAppointment)
        const organizedAppointments = organizeAppointmentsByDay(appointmentsWithoutThisAppointment);

        setAppointments(organizedAppointments)
        setArrayOfAppointments(appointmentsWithoutThisAppointment)

        setNewAppointmentTime('');
        setNewAppointmentName('');
        setOpen(false)
        setIsEditing && setIsEditing(false)
        setIdAppo && setIdAppo(0)
        setName && setName('')
        setTime && setTime('')
    }

    const handleDelete = () => {

        const appointmentsWithoutThisAppointment = arrayOfAppointments.filter(appo => appo.id_agenda !== idAppo)
        const organizedAppointments = organizeAppointmentsByDay(appointmentsWithoutThisAppointment);
        setAppointments(organizedAppointments)
        setArrayOfAppointments(appointmentsWithoutThisAppointment)
        setIdAppo && setIdAppo(0)
        setIsDeleting && setIsDeleting(false)
        setOpen(false)

    }

    const handleCancel = () => {
        setIsEditing && setIsEditing(false)
        setIdAppo && setIdAppo(0)
        setIsDeleting && setIsDeleting(false)
        setName && setName('')
        setTime && setTime('')
        setOpen(false)
    }



    return (
        <>
            {isDeleting ?
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>¿Deseas cancelar esta cita?</DialogTitle>
                    </DialogHeader>

                    <DialogDescription>
                        Esta acción es irreversible.
                    </DialogDescription>
                    <div className="flex justify-end gap-3">

                        <Button variant={'outline'} onClick={() => { handleCancel() }}>
                            No
                        </Button>
                        <Button variant={'destructive'} onClick={() => handleDelete()}>
                            Si
                        </Button>

                    </div>
                </DialogContent>
                :
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Nueva cita</DialogTitle>
                    </DialogHeader>

                    <DialogDescription>
                        Agenda o modifica tu cita
                    </DialogDescription>
                    <div>
                        <Select onValueChange={setNewAppointmentTime}>
                            <SelectTrigger className="w-[250px]">
                                <SelectValue placeholder={newAppointmentTime ? (newAppointmentTime !== '' ? newAppointmentTime : 'Selecciona un horario') : 'Selecciona un horario'} />
                            </SelectTrigger>
                            <SelectContent>
                                {isEditing ?
                                    allTimeSlots.map((timeSlot, index) => (
                                        <SelectItem key={index} value={timeSlot}>{timeSlot}</SelectItem>
                                    ))
                                    :
                                    availableTimeSlots.map((timeSlot, index) => (
                                        <SelectItem key={index} value={timeSlot}>{timeSlot}</SelectItem>
                                    ))
                                }
                            </SelectContent>
                        </Select>
                        <input
                            type="text"
                            placeholder="Nombre"
                            value={newAppointmentName}
                            onChange={(e) => setNewAppointmentName(e.target.value)}
                            className="w-full mt-2 p-2 border"
                        />

                        <div className="flex w-full gap-3 justify-end my-2">
                            <Button variant={'destructive'} onClick={() => { setOpen(false), setNewAppointmentTime(''), setNewAppointmentName(''); }}>
                                Cancelar
                            </Button>
                            <Button variant={'outline'} onClick={isEditing ? handleEditAppointment : handleSaveAppointment}>
                                Guardar
                            </Button>
                        </div>
                    </div>
                </DialogContent>

            }

        </>

    )
}

export default DialogContentView