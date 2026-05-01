export default function Loading() {
  return (
    <div className="grid md:grid-cols-3 gap-10">
      <div className="md:col-span-2 space-y-6">
        <div>
          <div className="h-12 w-2/3 skeleton rounded-lg mb-2" />
          <div className="h-6 w-1/3 skeleton rounded" />
        </div>
        <div className="h-64 w-full skeleton rounded-xl shadow-sm" />
      </div>

      <div className="h-100 w-full skeleton rounded-xl shadow-sm sticky top-24" />
    </div>
  );
}
