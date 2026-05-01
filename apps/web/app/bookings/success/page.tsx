export default async function SuccessPage({
  searchParams,
}: {
  searchParams: { id: string };
}) {
  const bookingRes = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/bookings/${searchParams.id}`,
  );
  const booking = await bookingRes.json();

  const eventRes = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/events/${booking.eventId}`,
  );
  const event = await eventRes.json();

  const priceDiff = Number(event.currentPrice) - Number(booking.pricePaid);

  return (
    <div className="max-w-md mx-auto py-12">
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 text-green-600 rounded-full mb-4">
          <svg
            className="w-8 h-8"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M5 13l4 4L19 7"
            />
          </svg>
        </div>
        <h1 className="text-2xl font-bold">Booking Confirmed!</h1>
      </div>

      <div className="bg-white border rounded-2xl shadow-sm overflow-hidden">
        <div className="p-6 bg-gray-50 border-b">
          <p className="text-sm text-gray-500">Event</p>
          <p className="font-bold text-lg">{event.name}</p>
        </div>

        <div className="p-6 space-y-4">
          <div className="flex justify-between">
            <span className="text-gray-600">Price You Paid</span>
            <span className="font-bold">${booking.pricePaid}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Current Market Price</span>
            <span className="font-bold">${event.currentPrice}</span>
          </div>

          {priceDiff > 0 && (
            <div className="p-3 bg-blue-50 text-blue-700 rounded-lg text-sm font-medium flex justify-between">
              <span>You saved by booking early!</span>
              <span>+${priceDiff.toFixed(2)}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
