
import CalendarGrid from "@/components/calendarGrid";
import { getAppointments } from "@/lib/appointments";

export default async function Home() {

  const appointments = await getAppointments()

  return (
    <main className="ml-[200px] mt-[80px] h-full overflow-y-auto py-1 px-4">
      <CalendarGrid 
      citas={appointments.data}
      />
    </main>
  );
}
