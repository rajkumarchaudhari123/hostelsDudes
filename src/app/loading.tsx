export default function Loading() {
  return (
    <div className="min-h-screen bg-slate-50 pt-16">
      {/* Navbar skeleton */}
      <div className="fixed top-0 left-0 right-0 h-16 bg-white border-b border-slate-100 z-50 flex items-center px-8">
        <div className="skeleton h-8 w-32 rounded-xl" />
        <div className="flex-1" />
        <div className="skeleton h-8 w-64 rounded-xl" />
      </div>

      {/* Content skeleton */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="skeleton h-8 w-56 rounded-xl mb-8" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="bg-white rounded-2xl overflow-hidden border border-slate-100">
              <div className="skeleton h-48 w-full" />
              <div className="p-4 space-y-3">
                <div className="skeleton h-4 w-3/4 rounded" />
                <div className="skeleton h-3 w-1/2 rounded" />
                <div className="flex gap-2">
                  <div className="skeleton h-6 w-12 rounded-full" />
                  <div className="skeleton h-6 w-12 rounded-full" />
                  <div className="skeleton h-6 w-12 rounded-full" />
                </div>
                <div className="skeleton h-8 w-24 rounded-xl mt-2" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
