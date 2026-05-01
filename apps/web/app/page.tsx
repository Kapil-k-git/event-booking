import Link from "next/link";

export default function Home() {
  const featuredEvents = [
    {
      title: "Summer Music Festival",
      date: "Aug 18, 2026",
      location: "Mumbai",
      price: "From $49",
    },
    {
      title: "Startup & Tech Expo",
      date: "Sep 02, 2026",
      location: "Bangalore",
      price: "From $29",
    },
    {
      title: "Championship Finals",
      date: "Oct 11, 2026",
      location: "Delhi",
      price: "From $79",
    },
  ];

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-50 via-white to-blue-50 text-slate-900">
      <main>
        <section className="max-w-7xl mx-auto px-8 py-24 grid lg:grid-cols-2 gap-16 items-center">
          <div>
            <p className="inline-flex rounded-full bg-blue-100 px-4 py-2 text-sm font-semibold text-blue-700 mb-6">
              Premium Event Booking Platform
            </p>

            <h2 className="text-5xl md:text-6xl font-extrabold tracking-tight leading-tight text-slate-900">
              Book unforgettable
              <span className="text-blue-600"> experiences</span>
            </h2>

            <p className="mt-6 text-lg text-slate-600 max-w-xl leading-relaxed">
              Discover concerts, conferences, sports, and exclusive live events
              — all in one seamless booking experience.
            </p>

            <div className="mt-10 flex flex-wrap gap-4">
              <Link
                href="/events"
                className="rounded-2xl bg-blue-600 px-8 py-4 text-white font-semibold shadow-lg hover:bg-blue-700 transition-all"
              >
                Explore Events
              </Link>
              <Link
                href="/my-bookings"
                className="rounded-2xl border border-slate-300 px-8 py-4 font-semibold text-slate-700 hover:bg-slate-100 transition-all"
              >
                View My Bookings
              </Link>
            </div>
          </div>

          <div className="bg-white rounded-3xl shadow-2xl border border-slate-100 p-8">
            <h3 className="text-xl font-bold mb-6">Find your next event</h3>

            <form className="space-y-4">
              <input
                type="text"
                placeholder="Search events, artists, or venues"
                className="w-full rounded-2xl border border-slate-200 p-4 focus:ring-2 focus:ring-blue-500 outline-none"
              />
              <input
                type="text"
                placeholder="Location"
                className="w-full rounded-2xl border border-slate-200 p-4 focus:ring-2 focus:ring-blue-500 outline-none"
              />
              <button
                type="submit"
                className="w-full rounded-2xl bg-slate-900 text-white py-4 font-semibold hover:bg-slate-800 transition-all"
              >
                Search Events
              </button>
            </form>
          </div>
        </section>

        <section id="events" className="max-w-7xl mx-auto px-8 py-20">
          <div className="flex items-center justify-between mb-10">
            <div>
              <h3 className="text-3xl font-bold tracking-tight">
                Featured Events
              </h3>
              <p className="text-slate-600 mt-2">
                Handpicked experiences trending right now.
              </p>
            </div>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredEvents.map((event) => (
              <div
                key={event.title}
                className="group bg-white rounded-3xl border border-slate-100 shadow-md hover:shadow-2xl transition-all overflow-hidden"
              >
                <div className="h-48 bg-linear-to-br from-blue-500 to-indigo-600" />
                <div className="p-6">
                  <h4 className="text-xl font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                    {event.title}
                  </h4>
                  <p className="mt-2 text-slate-600">{event.date}</p>
                  <p className="text-slate-500">{event.location}</p>

                  <div className="mt-6 flex items-center justify-between">
                    <span className="font-bold text-lg text-slate-900">
                      {event.price}
                    </span>
                    <button className="rounded-xl bg-blue-600 px-4 py-2 text-white font-medium hover:bg-blue-700 transition-all">
                      Book Now
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="bg-slate-900 text-white py-24 mt-20">
          <div className="max-w-7xl mx-auto px-8 grid md:grid-cols-3 gap-10">
            <div>
              <h4 className="text-xl font-bold mb-3">Secure Payments</h4>
              <p className="text-slate-300">
                Trusted checkout with safe transactions and instant
                confirmations.
              </p>
            </div>
            <div>
              <h4 className="text-xl font-bold mb-3">Instant Access</h4>
              <p className="text-slate-300">
                Manage tickets and bookings easily from any device.
              </p>
            </div>
            <div>
              <h4 className="text-xl font-bold mb-3">Curated Events</h4>
              <p className="text-slate-300">
                From concerts to conferences, discover premium experiences.
              </p>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
