import { z } from 'zod';

export interface Appointment {
    id_agenda: number;
    id_paciente: number | null;
    fecha: string;
    hora: string;
    ape_nom: string | null;
}

const appointmentSchema = z.object({
    id_agenda: z.number(),
    id_paciente: z.number().nullable(),
    fecha: z.string(),
    hora: z.string(),
    ape_nom: z.string().nullable(),
});

// Ajusta el esquema para que acepte un arreglo de citas
const appointmentsSchema = z.array(appointmentSchema);

export const getAppointments = async () => {
    try {
        const res = await fetch('https://my-json-server.typicode.com/juanpernu/bilog-fe-challenge/schedule');

        if (!res.ok) {
            throw new Error(`Error ${res.status}: ${res.statusText}`);
        }

        const data = await res.json();
        appointmentsSchema.parse(data); // Validar el arreglo de citas
        return {
            success: true,
            data,
        };
    } catch (error) {
        console.error('Error:', error);
        return { error: error };
    }
}

export interface AppointmentByDay {
    [date: string]: Appointment[];
}

export function organizeAppointmentsByDay(appointments: Appointment[]): AppointmentByDay {
    const appointmentsByDay: AppointmentByDay = {};

    appointments?.forEach((appointment) => {
        const date = appointment.fecha.split('T')[0];
        if (!appointmentsByDay[date]) {
            appointmentsByDay[date] = [];
        }
        appointmentsByDay[date].push(appointment);
    });

    return appointmentsByDay;
}