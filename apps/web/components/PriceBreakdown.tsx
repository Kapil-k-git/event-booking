// components/PriceBreakdown.tsx
export function PriceBreakdown({ basePrice, adjustments }: { basePrice: number, adjustments: any[] }) {
  return (
    <div className="space-y-2 text-sm">
      <div className="flex justify-between text-gray-500">
        <span>Starting Price</span>
        <span>${basePrice}</span>
      </div>
      {adjustments.map((adj, index) => (
        <div key={index} className="flex justify-between text-blue-600">
          <span>{adj.ruleName}</span>
          <span>{adj.value > 0 ? `+${adj.value}` : adj.value}</span>
        </div>
      ))}
    </div>
  );
}