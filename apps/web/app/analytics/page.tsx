import { BarChart3, Users, Ticket, DollarSign } from "lucide-react";
import EventTable from "./EventTable";

// Fetching both summary and detailed data
async function getAnalyticsData() {
  const [summaryRes, detailedRes] = await Promise.all([
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/analytics/summary`, { cache: 'no-store' }),
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/analytics/detailed`, { cache: 'no-store' })
  ]);

  return {
    summary: await summaryRes.json(),
    detailed: await detailedRes.json()
  };
}

export default async function AnalyticsPage() {
  const { summary, detailed } = await getAnalyticsData();

  const cards = [
    { 
        name: 'Total Revenue', 
        value: `$${Number(summary.totalRevenue).toLocaleString()}`, 
        icon: DollarSign, 
        color: 'text-green-600' 
    },
    { 
        name: 'Tickets Sold', 
        value: summary.totalTicketsSold, 
        icon: Ticket, 
        color: 'text-blue-600' 
    },
    { 
        name: 'Active Events', 
        value: summary.activeEvents, 
        icon: BarChart3, 
        color: 'text-purple-600' 
    },
    { 
        name: 'Platform Users', 
        value: summary.platformUsers, 
        icon: Users, 
        color: 'text-orange-600' 
    },
  ];

  return (
    <div className="space-y-10">
      {/* Header Section */}
      <div>
        <h1 className="text-3xl font-black tracking-tight text-gray-900">Executive Dashboard</h1>
        <p className="text-gray-500 mt-1">Real-time platform performance and pricing lift metrics.</p>
      </div>

      {/* 1. Summary Cards Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {cards.map((item) => (
          <div key={item.name} className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <div className={`p-2 rounded-lg bg-gray-50`}>
                <item.icon className={`h-6 w-6 ${item.color}`} />
              </div>
            </div>
            <p className="text-sm text-gray-500 font-medium uppercase tracking-wider">{item.name}</p>
            <p className="text-3xl font-bold mt-1">{item.value}</p>
          </div>
        ))}
      </div>

      {/* 2. Detailed Performance Table Section */}
      <section className="space-y-4">
        <div className="flex justify-between items-end">
          <div>
            <h2 className="text-xl font-bold text-gray-900">Event Performance</h2>
            <p className="text-sm text-gray-500">Comparison of base revenue vs. dynamic pricing revenue.</p>
          </div>
          <button className="px-4 py-2 text-sm font-bold text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors">
            Export Report
          </button>
        </div>

        {/* Using the EventTable component we defined previously */}
        <EventTable events={detailed.events} />
      </section>
    </div>
  );
}