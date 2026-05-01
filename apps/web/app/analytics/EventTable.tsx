// app/analytics/EventTable.tsx

export default function EventTable({ events }: { events: any[] }) {
  return (
    <div className="bg-white border rounded-xl overflow-hidden shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-100">
              <th className="p-4 text-xs uppercase text-gray-500 font-bold">Event Name</th>
              <th className="p-4 text-xs uppercase text-gray-500 font-bold">Tickets Sold</th>
              <th className="p-4 text-xs uppercase text-gray-500 font-bold">Base Revenue</th>
              <th className="p-4 text-xs uppercase text-gray-500 font-bold">Actual Revenue</th>
              <th className="p-4 text-xs uppercase text-gray-500 font-bold">Pricing Lift</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {events.map((event) => {
              const baseRev = event.bookedTickets * Number(event.basePrice);
              const actualRev = Number(event.totalRevenue);
              const lift = actualRev - baseRev;
              const liftPercentage = ((lift / baseRev) * 100).toFixed(1);

              return (
                <tr key={event.id} className="hover:bg-gray-50 transition-colors">
                  <td className="p-4">
                    <p className="font-bold text-gray-900">{event.name}</p>
                    <p className="text-xs text-gray-400">{event.id.slice(0, 8)}</p>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{event.bookedTickets}</span>
                      <span className="text-gray-300">/</span>
                      <span className="text-gray-400 text-sm">{event.totalTickets}</span>
                    </div>
                  </td>
                  <td className="p-4 text-gray-600">${baseRev.toLocaleString()}</td>
                  <td className="p-4 font-bold text-gray-900">${actualRev.toLocaleString()}</td>
                  <td className="p-4">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold ${
                      lift >= 0 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                    }`}>
                      {lift >= 0 ? '↑' : '↓'} {liftPercentage}%
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}