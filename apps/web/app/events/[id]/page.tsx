import BookingForm from "./BookingForm";

async function getEventDetails(id: string) {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/events/${id}`, {
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error("Failed to fetch event details");
  }

  return res.json();
}

export default async function EventDetailPage(props: {
  params: Promise<{ id: string }>;
}) {
  const params = await props.params;
  const eventId = params.id;
  const event = await getEventDetails(eventId);

  const remainingTickets = event.totalTickets - event.bookedTickets;
  const soldPercentage = (event.bookedTickets / event.totalTickets) * 100;

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-50 via-white to-blue-50 pb-24">
      {/* Hero Banner */}
      <div className="h-105 bg-linear-to-br from-blue-600 via-indigo-600 to-purple-700 relative overflow-hidden">
        <div className="absolute inset-0 bg-black/20" />

        <div className="max-w-7xl mx-auto px-8 h-full flex flex-col justify-end pb-16 relative z-10 text-white">
          <div className="inline-flex bg-white/20 backdrop-blur-md rounded-full px-4 py-2 text-sm font-semibold mb-6 w-fit">
            {remainingTickets} Tickets Remaining
          </div>

          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight max-w-4xl leading-tight">
            {event.name}
          </h1>

          <p className="mt-4 text-xl text-blue-100 max-w-3xl">
            {event.venue} • {new Date(event.eventDate).toLocaleDateString()}
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-8 py-16 relative z-20">
        <div className="grid lg:grid-cols-3 gap-10">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Overview */}
            <div className="bg-white rounded-3xl shadow-xl border border-slate-100 p-8">
              <h2 className="text-2xl font-bold text-slate-900 mb-4">
                About This Event
              </h2>
              <p className="text-slate-600 leading-relaxed text-lg">
                {event.description}
              </p>
            </div>

            {/* Pricing Transparency */}
            <div className="bg-white rounded-3xl shadow-xl border border-slate-100 p-8">
              <h3 className="text-2xl font-bold mb-6 text-slate-900">
                Pricing Breakdown
              </h3>

              <div className="space-y-4">
                <div className="flex justify-between text-slate-600 text-lg">
                  <span>Base Ticket Price</span>
                  <span>${event.basePrice}</span>
                </div>

                <div className="flex justify-between text-slate-600 text-lg">
                  <span>Dynamic Market Adjustment</span>
                  <span>
                    +$
                    {(
                      Number(event.currentPrice) - Number(event.basePrice)
                    ).toFixed(2)}
                  </span>
                </div>

                <div className="pt-4 border-t flex justify-between font-extrabold text-3xl text-blue-600">
                  <span>Current Price</span>
                  <span>${event.currentPrice}</span>
                </div>
              </div>
            </div>

            {/* Availability */}
            <div className="bg-white rounded-3xl shadow-xl border border-slate-100 p-8">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-2xl font-bold text-slate-900">
                  Ticket Availability
                </h3>
                <span className="text-sm font-semibold text-slate-500">
                  {Math.round(soldPercentage)}% Sold
                </span>
              </div>

              <div className="w-full h-4 bg-slate-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-linear-to-r from-blue-500 to-indigo-600 rounded-full"
                  style={{ width: `${soldPercentage}%` }}
                />
              </div>

              <p className="mt-4 text-slate-600 text-lg">
                <span className="font-bold text-slate-900">
                  {remainingTickets}
                </span>{" "}
                tickets remaining out of {event.totalTickets}
              </p>
            </div>
          </div>

          {/* Booking Sidebar */}
          <div className="lg:sticky lg:top-24 h-fit">
            <div className="bg-white rounded-3xl shadow-2xl border border-slate-100 p-8">
              <BookingForm
                eventId={event.id}
                initialPrice={event.currentPrice}
                initialRemaining={remainingTickets}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
