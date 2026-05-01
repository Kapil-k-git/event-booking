"use server";
import { redirect } from "next/navigation";

export async function createBooking(formData: FormData) {
  const payload = {
    eventId: formData.get("eventId"),
    userEmail: formData.get("email"),
    quantity: Number(formData.get("quantity")),
  };

  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/bookings`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const error = await res.json();
    return { error: error.message };
  }

  const booking = await res.json();
  redirect(`/bookings/success?id=${booking.id}`);
}
