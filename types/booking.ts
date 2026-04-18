export type BookingStatus = "pending" | "confirmed" | "cancelled";

export type BookingData = {
  id: string;
  hostId: string;
  hostName: string;
  guestUid: string;
  guestName: string;
  guestEmail: string;
  date: string;
  startTime: string;
  endTime: string;
  notes: string | null;
  status: BookingStatus;
  createdAt: string;
  updatedAt: string;
};
