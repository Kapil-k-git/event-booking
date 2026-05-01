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

          <div className="relative bg-white rounded-3xl shadow-2xl border border-slate-100 p-8 overflow-hidden">
            {/* Background Decorative Gradients */}
            <div className="absolute -top-10 -right-10 w-40 h-40 bg-blue-100 rounded-full blur-3xl opacity-60" />
            <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-indigo-100 rounded-full blur-3xl opacity-60" />

            <div className="relative z-10">
              <div className="mb-8">
                <p className="inline-flex rounded-full bg-slate-100 px-4 py-2 text-sm font-semibold text-slate-700 mb-4">
                  Trusted by 50K+ Event Goers
                </p>

                <h3 className="text-3xl font-extrabold text-slate-900 leading-tight">
                  Your gateway to premium live experiences
                </h3>

                <p className="mt-4 text-slate-600 leading-relaxed">
                  Seamlessly discover, book, and manage tickets for concerts,
                  conferences, sports, and exclusive events.
                </p>
              </div>

              {/* Dashboard Mockup */}
              <div className="rounded-3xl border border-slate-200 bg-slate-50 p-5 shadow-inner">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="font-bold text-slate-900">
                    Upcoming Reservations
                  </h4>
                  <span className="text-sm text-blue-600 font-semibold">
                    Live Updates
                  </span>
                </div>

                <div className="space-y-4">
                  <div className="bg-white rounded-2xl p-4 shadow-sm flex items-center justify-between">
                    <div>
                      <p className="font-semibold text-slate-900">
                        Summer Music Festival
                      </p>
                      <p className="text-sm text-slate-500">Mumbai • Aug 18</p>
                    </div>
                    <span className="text-sm font-bold text-green-600 bg-green-50 px-3 py-1 rounded-full">
                      Confirmed
                    </span>
                  </div>

                  <div className="bg-white rounded-2xl p-4 shadow-sm flex items-center justify-between">
                    <div>
                      <p className="font-semibold text-slate-900">
                        Tech Expo 2026
                      </p>
                      <p className="text-sm text-slate-500">
                        Bangalore • Sep 02
                      </p>
                    </div>
                    <span className="text-sm font-bold text-orange-600 bg-orange-50 px-3 py-1 rounded-full">
                      Selling Fast
                    </span>
                  </div>

                  <div className="bg-linear-to-r from-blue-600 to-indigo-600 rounded-2xl p-5 text-white shadow-lg">
                    <p className="text-sm uppercase tracking-widest font-semibold text-blue-100">
                      Dynamic Pricing Active
                    </p>
                    <p className="text-3xl font-extrabold mt-2">
                      Best Seats Available
                    </p>
                    <p className="mt-2 text-blue-100 text-sm">
                      Secure your tickets before prices rise.
                    </p>
                  </div>
                </div>
              </div>
            </div>
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
                <Link href="/events">
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
                </Link>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
