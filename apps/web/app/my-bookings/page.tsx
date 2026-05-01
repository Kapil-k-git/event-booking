export default async function MyBookingsPage(props: {
  searchParams: Promise<{ email?: string }>;
}) {
  const searchParams = await props.searchParams;
  const email = searchParams.email;

  let bookings = [];
  let searched = false;

  if (email) {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/bookings?email=${encodeURIComponent(email)}`,
      { cache: "no-store" },
    );

    if (res.ok) {
      bookings = await res.json();
      searched = true;
    }
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-50 via-white to-blue-50 py-16">
      <div className="max-w-6xl mx-auto px-8">
        {/* Hero Header */}
        <div className="mb-14">
          <p className="inline-flex rounded-full bg-blue-100 px-4 py-2 text-sm font-semibold text-blue-700 mb-4">
            Manage Your Reservations
          </p>

          <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight text-slate-900 leading-tight">
            My
            <span className="text-blue-600"> Bookings</span>
          </h1>

          <p className="mt-4 text-lg text-slate-600 max-w-2xl">
            Access your tickets, view purchase history, and stay updated on your
            upcoming events.
          </p>
        </div>

        {/* Search Section */}
        <div className="bg-white rounded-3xl border border-slate-100 shadow-xl p-6 md:p-8 mb-14">
          <form
            action="/my-bookings"
            method="GET"
            className="grid md:grid-cols-4 gap-4 items-center"
          >
            <div className="md:col-span-3">
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Booking Email
              </label>
              <input
                name="email"
                type="email"
                required
                placeholder="Enter your booking email"
                className="w-full rounded-2xl border border-slate-200 p-4 focus:ring-2 focus:ring-blue-500 outline-none"
                defaultValue={email}
              />
            </div>

            <button
              type="submit"
              className="w-full rounded-2xl bg-slate-900 text-white py-4 font-semibold hover:bg-slate-800 transition-all mt-7"
            >
              Search Bookings
            </button>
          </form>
        </div>

        {/* Bookings Results */}
        <div className="space-y-6">
          {bookings.map((b: any) => (
            <div
              key={b.id}
              className="group bg-white rounded-3xl border border-slate-100 shadow-md hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 overflow-hidden"
            >
              <div className="grid md:grid-cols-4 gap-6 p-8 items-center">
                {/* Event Visual */}
                <div className="h-36 rounded-3xl bg-linear-to-br from-blue-500 via-indigo-500 to-purple-600 relative overflow-hidden">
                  <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-md rounded-xl px-3 py-1 text-sm font-bold text-slate-900">
                    {new Date(b.createdAt).toLocaleDateString()}
                  </div>
                </div>

                {/* Booking Details */}
                <div className="md:col-span-2">
                  <h3 className="text-2xl font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                    {b.event?.name || "Event"}
                  </h3>

                  <p className="mt-2 text-slate-500">
                    Booked on{" "}
                    <span className="font-medium text-slate-700">
                      {new Date(b.createdAt).toLocaleDateString()}
                    </span>
                  </p>

                  <div className="mt-4 flex flex-wrap gap-3">
                    <span className="text-sm font-bold bg-blue-50 text-blue-700 px-4 py-2 rounded-xl">
                      {b.quantity} Ticket{b.quantity > 1 ? "s" : ""}
                    </span>

                    <span className="text-sm font-bold bg-green-50 text-green-700 px-4 py-2 rounded-xl">
                      Confirmed
                    </span>
                  </div>
                </div>

                {/* Payment Summary */}
                <div className="text-left md:text-right">
                  <p className="text-xs uppercase tracking-widest font-bold text-slate-400 mb-2">
                    Total Paid
                  </p>

                  <p className="text-4xl font-extrabold text-blue-600">
                    ${(Number(b.pricePaid) * b.quantity).toFixed(2)}
                  </p>

                  <p className="mt-2 text-sm text-slate-500">
                    ${Number(b.pricePaid).toFixed(2)} per ticket
                  </p>
                </div>
              </div>
            </div>
          ))}

          {/* Empty State */}
          {searched && bookings.length === 0 && (
            <div className="text-center py-24">
              <div className="bg-white rounded-3xl border border-dashed border-slate-200 p-12 max-w-3xl mx-auto shadow-sm">
                <h3 className="text-3xl font-bold text-slate-900">
                  No bookings found
                </h3>

                <p className="mt-4 text-slate-500 text-lg">
                  We couldn&apos;t find any bookings for{" "}
                  <span className="font-semibold text-slate-700">{email}</span>
                </p>

                <p className="mt-2 text-slate-400">
                  Double-check your email address or try another one.
                </p>
              </div>
            </div>
          )}

          {/* Initial Empty State */}
          {!searched && (
            <div className="text-center py-24">
              <div className="bg-white rounded-3xl border border-slate-100 p-12 max-w-3xl mx-auto shadow-sm">
                <h3 className="text-3xl font-bold text-slate-900">
                  Search your bookings
                </h3>

                <p className="mt-4 text-slate-500 text-lg">
                  Enter your booking email above to access your event tickets
                  and purchase history.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
