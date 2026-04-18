import type { HostAvailabilityData, HostSetupData } from "@/types/user-profile";
import type { BookingData } from "@/types/booking";

export type SlotOption = {
  startTime: string;
  endTime: string;
  bookedSpots: number;
  remainingSpots: number;
  capacity: number;
  disabled: boolean;
};

function timeToMinutes(value: string): number {
  const [hours, minutes] = value.split(":").map(Number);
  return hours * 60 + minutes;
}

function minutesToTime(value: number): string {
  const hours = Math.floor(value / 60);
  const minutes = value % 60;

  return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}`;
}

function slotDurationToMinutes(value: HostSetupData["slotDuration"] | undefined): number {
  switch (value) {
    case "2h":
      return 120;
    case "3h":
      return 180;
    case "4h":
      return 240;
    default:
      return 120;
  }
}

function getWeekdayKey(date: string): string | null {
  const parsed = new Date(`${date}T12:00:00`);

  if (Number.isNaN(parsed.getTime())) {
    return null;
  }

  const day = parsed.getDay();

  switch (day) {
    case 1:
      return "mon";
    case 2:
      return "tue";
    case 3:
      return "wed";
    case 4:
      return "thu";
    case 5:
      return "fri";
    case 6:
      return "sat";
    case 0:
      return "sun";
    default:
      return null;
  }
}

function overlaps(aStart: number, aEnd: number, bStart: number, bEnd: number): boolean {
  return aStart < bEnd && bStart < aEnd;
}

export function getAvailableSlots(params: { date: string; availability?: HostAvailabilityData; setup?: HostSetupData; bookings: BookingData[] }): SlotOption[] {
  const { date, availability, setup, bookings } = params;

  if (!availability?.from || !availability?.to) {
    return [];
  }

  const weekdayKey = getWeekdayKey(date);

  if (!weekdayKey || !availability.days.includes(weekdayKey)) {
    return [];
  }

  const dayStart = timeToMinutes(availability.from);
  const dayEnd = timeToMinutes(availability.to);
  const slotDuration = slotDurationToMinutes(setup?.slotDuration);
  const capacity = Math.max(1, setup?.spots ?? 1);

  if (dayStart >= dayEnd || slotDuration <= 0) {
    return [];
  }

  const relevantBookings = bookings.filter((booking) => booking.date === date && booking.status !== "cancelled");

  const slots: SlotOption[] = [];

  for (let current = dayStart; current + slotDuration <= dayEnd; current += slotDuration) {
    const startTime = minutesToTime(current);
    const endTime = minutesToTime(current + slotDuration);

    const bookedSpots = relevantBookings.reduce((count, booking) => {
      const bookingStart = timeToMinutes(booking.startTime);
      const bookingEnd = timeToMinutes(booking.endTime);

      return overlaps(current, current + slotDuration, bookingStart, bookingEnd) ? count + 1 : count;
    }, 0);

    const remainingSpots = Math.max(0, capacity - bookedSpots);

    slots.push({
      startTime,
      endTime,
      bookedSpots,
      remainingSpots,
      capacity,
      disabled: remainingSpots <= 0,
    });
  }

  return slots;
}
