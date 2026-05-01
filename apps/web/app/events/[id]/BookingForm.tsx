"use client";

import { useState, useEffect } from "react";
import { createBooking } from "./actions";

interface BookingFormProps {
  eventId: string;
  initialPrice: string;
  initialRemaining: number;
}

export default function BookingForm({
  eventId,
  initialPrice,
  initialRemaining,
}: BookingFormProps) {
  const [price, setPrice] = useState(initialPrice);
  const [remaining, setRemaining] = useState(initialRemaining);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const interval = setInterval(async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/events/${eventId}`,
        );
        const data = await res.json();
        setPrice(data.currentPrice);
        setRemaining(data.totalTickets - data.bookedTickets);
      } catch (err) {
        console.error("Failed to poll price updates", err);
      }
    }, 30000);

    return () => clearInterval(interval);
  }, [eventId]);

  async function handleSubmit(formData: FormData) {
    setLoading(true);
    setError(null);

    formData.append("quantity", quantity.toString());
    formData.append("eventId", eventId);

    const result = await createBooking(formData);
    if (result?.error) {
      setError(result.error);
      setLoading(false);
    }
  }

  return (
    <form action={handleSubmit} className="space-y-6">
      <div>
        <p className="text-sm uppercase tracking-widest font-bold text-slate-400 mb-2">
          Current Ticket Price
        </p>
        <p className="text-4xl font-extrabold text-blue-600">
          ${(Number(price) * quantity).toFixed(2)}
        </p>
        <p className="text-sm text-slate-500 mt-1">
          {remaining} tickets available
        </p>
      </div>

      <div>
        <label className="block text-sm font-semibold text-slate-700 mb-2">
          Email Address
        </label>
        <input
          required
          type="email"
          name="email"
          placeholder="you@example.com"
          className="w-full rounded-2xl border border-slate-200 p-4 focus:ring-2 focus:ring-blue-500 outline-none"
        />
      </div>

      <div>
        <label className="block text-sm font-semibold text-slate-700 mb-3">
          Quantity
        </label>

        <div className="flex items-center justify-between rounded-2xl border border-slate-200 p-3 bg-slate-50">
          <button
            type="button"
            onClick={() => setQuantity(Math.max(1, quantity - 1))}
            className="w-12 h-12 rounded-full bg-white shadow-sm text-xl font-bold hover:bg-slate-100 transition-all"
          >
            -
          </button>

          <span className="text-2xl font-bold text-slate-900">{quantity}</span>

          <button
            type="button"
            onClick={() => setQuantity(Math.min(remaining, quantity + 1))}
            className="w-12 h-12 rounded-full bg-white shadow-sm text-xl font-bold hover:bg-slate-100 transition-all"
          >
            +
          </button>
        </div>
      </div>

      {error && (
        <div className="p-4 rounded-2xl bg-red-50 text-red-600 border border-red-100 text-sm font-medium">
          {error}
        </div>
      )}

      <button
        disabled={loading || remaining <= 0}
        type="submit"
        className="w-full rounded-2xl bg-blue-600 text-white py-4 text-lg font-bold hover:bg-blue-700 disabled:bg-slate-300 transition-all shadow-lg"
      >
        {loading
          ? "Processing..."
          : remaining > 0
            ? "Reserve Tickets"
            : "Sold Out"}
      </button>

      <div className="pt-4 border-t text-sm text-slate-500 space-y-2">
        <p>✓ Secure checkout</p>
        <p>✓ Instant booking confirmation</p>
        <p>✓ Dynamic pricing may update</p>
      </div>
    </form>
  );
}
