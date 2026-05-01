export default async function MyBookingsPage(props: {
  searchParams: Promise<{ email?: string }>;
}) {
  // Await the searchParams before accessing properties
  const searchParams = await props.searchParams;
  const email = searchParams.email;

  let bookings = [];
  let searched = false;

  if (email) {
    // encodeURIComponent handles special characters in emails like '+'
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/bookings?email=${encodeURIComponent(email)}`,
      { cache: "no-store" },
    );

    if (res.ok) {
      bookings = await res.json();
      searched = true;
    }
  }

  console.log("Rendering my-bookings page");
console.log("Email:", email);

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold mb-6 text-gray-900">My Tickets</h1>

      <form action="/my-bookings" method="GET" className="mb-10 flex gap-2">
        <input
          name="email"
          type="email"
          required
          placeholder="Enter your booking email"
          className="border p-3 rounded-xl flex-1 focus:ring-2 focus:ring-blue-500 outline-none border-gray-200"
          defaultValue={email}
        />
        <button className="bg-blue-600 text-white px-6 py-2 rounded-xl font-bold hover:bg-blue-700 transition-colors">
          Search
        </button>
      </form>

      <div className="space-y-4">
        {bookings.map((b: any) => (
          <div
            key={b.id}
            className="border bg-white p-5 rounded-2xl shadow-sm flex justify-between items-center border-gray-100"
          >
            <div>
              <h3 className="font-bold text-lg text-gray-900">
                {b.event?.name || "Event"}
              </h3>
              <p className="text-gray-500 text-sm">
                Booked on {new Date(b.createdAt).toLocaleDateString()}
              </p>
              <div className="mt-2">
                <span className="text-xs font-bold bg-blue-50 text-blue-700 px-2 py-1 rounded-lg">
                  {b.quantity} Ticket{b.quantity > 1 ? "s" : ""}
                </span>
              </div>
            </div>
            <div className="text-right">
              <p className="text-xs text-gray-400 uppercase tracking-widest font-bold">
                Total Paid
              </p>
              <p className="text-2xl font-black text-gray-900">
                ${(Number(b.pricePaid) * b.quantity).toFixed(2)}
              </p>
            </div>
          </div>
        ))}

        {searched && bookings.length === 0 && (
          <div className="text-center py-20 bg-gray-50 rounded-3xl border border-dashed border-gray-200">
            <p className="text-gray-500 font-medium">
              No bookings found for &quot;{email}&quot;
            </p>
            <p className="text-sm text-gray-400">
              Check the spelling or try a different email.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
