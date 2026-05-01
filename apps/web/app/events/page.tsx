"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { Event } from "../../types/event";

export default function EventListPage() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [locationTerm, setLocationTerm] = useState("");

  useEffect(() => {
    async function fetchEvents() {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/events`, {
          cache: "no-store",
        });

        if (!res.ok) {
          throw new Error("Failed to fetch events");
        }

        const data = await res.json();
        setEvents(data);
      } catch (error) {
        console.error("Error fetching events:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchEvents();
  }, []);

  const filteredEvents = useMemo(() => {
    return events.filter((event) => {
      const matchesSearch =
        event.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        event.description.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesLocation = event.venue
        .toLowerCase()
        .includes(locationTerm.toLowerCase());

      return matchesSearch && matchesLocation;
    });
  }, [events, searchTerm, locationTerm]);

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-50 via-white to-blue-50">
      <div className="max-w-7xl mx-auto px-8 py-16">
        {/* Hero Section */}
        <div className="mb-14">
          <p className="inline-flex rounded-full bg-blue-100 px-4 py-2 text-sm font-semibold text-blue-700 mb-4">
            Discover Live Experiences
          </p>

          <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight text-slate-900 leading-tight">
            Upcoming
            <span className="text-blue-600"> Events</span>
          </h1>

          <p className="mt-4 text-lg text-slate-600 max-w-2xl">
            Explore concerts, sports, conferences, and unforgettable events
            happening near you.
          </p>
        </div>

        {/* Search / Filter Bar */}
        <div className="bg-white rounded-3xl border border-slate-100 shadow-lg p-4 md:p-6 mb-14">
          <div className="grid md:grid-cols-3 gap-4">
            <input
              type="text"
              placeholder="Search events"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full rounded-2xl border border-slate-200 px-4 py-3 focus:ring-2 focus:ring-blue-500 outline-none"
            />
            <input
              type="text"
              placeholder="Location"
              value={locationTerm}
              onChange={(e) => setLocationTerm(e.target.value)}
              className="w-full rounded-2xl border border-slate-200 px-4 py-3 focus:ring-2 focus:ring-blue-500 outline-none"
            />
            <button
              type="button"
              className="rounded-2xl bg-slate-900 text-white font-semibold py-3 hover:bg-slate-800 transition-all"
            >
              {filteredEvents.length} Events Found
            </button>
          </div>
        </div>

        {/* Loading State */}
        {loading ? (
          <div className="text-center py-24">
            <p className="text-slate-500 text-lg font-medium">
              Loading events...
            </p>
          </div>
        ) : (
          <>
            {/* Events Grid */}
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3 auto-rows-fr">
              {filteredEvents.map((event: Event) => {
                const ticketsLeft = event.totalTickets - event.bookedTickets;
                const soldPercentage =
                  (event.bookedTickets / event.totalTickets) * 100;

                return (
                  <Link key={event.id} href={`/events/${event.id}`}>
                    <div className="group h-full bg-white rounded-3xl border border-slate-100 shadow-md hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 overflow-hidden cursor-pointer">
                      <div className="h-52 bg-linear-to-br from-blue-500 via-indigo-500 to-purple-600 relative">
                        <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-md rounded-xl px-3 py-1 text-sm font-bold text-slate-900">
                          {new Date(event.eventDate).toLocaleDateString()}
                        </div>

                        <div className="absolute bottom-4 left-4 right-4">
                          <span className="inline-flex bg-black/30 text-white text-xs font-semibold px-3 py-1 rounded-full backdrop-blur-md">
                            {ticketsLeft} tickets left
                          </span>
                        </div>
                      </div>

                      <div className="p-6 flex flex-col flex-1">
                        <h2 className="text-2xl font-bold text-slate-900 group-hover:text-blue-600 transition-colors line-clamp-2">
                          {event.name}
                        </h2>

                        <p className="mt-2 text-slate-600 text-sm line-clamp-2">
                          {event.description}
                        </p>

                        <div className="mt-4 flex items-center gap-2 text-slate-500 text-sm">
                          <span>📍</span>
                          <span className="truncate">{event.venue}</span>
                        </div>

                        <div className="mt-5">
                          <div className="flex justify-between text-xs font-semibold text-slate-500 mb-2">
                            <span>Availability</span>
                            <span>{Math.round(soldPercentage)}% booked</span>
                          </div>

                          <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-linear-to-r from-blue-500 to-indigo-600 rounded-full"
                              style={{ width: `${soldPercentage}%` }}
                            />
                          </div>
                        </div>

                        <div className="mt-auto pt-6 flex items-end justify-between">
                          <div>
                            <p className="text-xs uppercase tracking-widest font-bold text-slate-400">
                              Starting From
                            </p>
                            <p className="text-3xl font-extrabold text-blue-600">
                              ${event.currentPrice}
                            </p>
                          </div>

                          <button className="rounded-2xl bg-blue-600 px-5 py-3 text-white font-semibold hover:bg-blue-700 transition-all shadow-md">
                            Book Now
                          </button>
                        </div>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>

            {/* Empty State */}
            {filteredEvents.length === 0 && (
              <div className="text-center py-24">
                <div className="bg-white rounded-3xl border border-dashed border-slate-200 p-12 max-w-2xl mx-auto">
                  <h3 className="text-2xl font-bold text-slate-900">
                    No matching events found
                  </h3>
                  <p className="mt-3 text-slate-500">
                    Try adjusting your search terms or location.
                  </p>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
