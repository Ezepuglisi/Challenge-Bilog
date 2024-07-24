import { Appointment } from "@/lib/appointments"
import { Week } from "@/lib/calendarLibrary"
import { isSameDay } from "@/lib/utils"
import useCalendarStore from "@/store/calendar.store"
import { Dialog } from "./ui/dialog"
import DialogContentView from "./dialogContentView"
import { useState } from "react"


interface Props {
    calendar: Week[]
    days: string[]
    appointmentsByDay: { [date: string]: Appointment[] }
}


const MonthlyCalendarView = (props: Props) => {

    const { calendar, days, appointmentsByDay } = props
    const date = useCalendarStore(state => state.date)
    const setDate = useCalendarStore(state => state.setDate)
    const setYear = useCalendarStore(state => state.setYear)
    const setMonth = useCalendarStore(state => state.setMonth)
    const setDay = useCalendarStore(state => state.setDay)
    const setActiveWeekIndex = useCalendarStore(state => state.setActiveWeekIndex)
    const [open, setOpen] = useState<boolean>(false)

    const handleSelectDay = (numberOfDay: Date) => {
        const month = numberOfDay.getMonth()
        const year = numberOfDay.getFullYear()
        const day = numberOfDay.getDay()

        setDate(numberOfDay)
        setYear(year)
        setMonth(month)
        setDay(day)
        setActiveWeekIndex(Math.floor(numberOfDay.getDate() / 7))
    }

    return (
        <Dialog open={open}>
            <div className='flex w-full justify-around'>
                {days.map((day) => {
                    return <div key={day} className={`w-full justify-center border`}>
                        <p className='text-center'>{day}</p>
                    </div>
                })}
            </div>
            {calendar.map((week, weekIndex) => (
                <div onClick={() => setOpen(true)} key={weekIndex} className="week flex w-full justify-around">
                    {week.map((day, dayIndex) => {
                        const dateStr = day.date.toISOString().split('T')[0];
                        const appo = appointmentsByDay[dateStr] || [];
                        return (
                            <div
                                key={dayIndex}
                                className={`day ${day.isCurrentMonth ? 'current-month' : 'other-month'} w-full flex flex-col items-start overflow-y-auto h-[150px] border cursor-pointer hover:bg-[#d6ffff] transition-all`}
                                onClick={() => handleSelectDay(day.date)}
                            >
                                <p className={`${isSameDay(day.date, date) && 'bg-[#d6ffff]'} ml-1 px-2`}>{day.date.getDate()}</p>
                                {appo.map((appointment, appointmentIndex) => {
                                    if (appointment.id_agenda !== -1) {
                                        return (
                                            <div key={appointmentIndex} className="appointment">
                                                <p>
                                                    <span className='text-[9px] font-light'>{appointment.hora}</span> - <span className='text-[9px] font-light'>{appointment.ape_nom || 'Sin nombre'}</span>
                                                </p>
                                            </div>
                                        )
                                    }
                                })}
                            </div>)
                    }
                    )}
                </div>
            ))}

            <DialogContentView isEditing={false} open={open} setOpen={setOpen} isDeleting={false} />
        </Dialog>

    )
}

export default MonthlyCalendarView