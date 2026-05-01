export default function Loading() {
  return (
    <div className="space-y-8">
      <div className="h-10 w-48 skeleton rounded-lg mb-8" />
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="border rounded-xl p-5 bg-white space-y-4">
            <div className="h-6 w-3/4 skeleton rounded" />
            <div className="h-4 w-1/2 skeleton rounded" />
            <div className="space-y-2 pt-4">
              <div className="h-10 w-full skeleton rounded-lg" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
