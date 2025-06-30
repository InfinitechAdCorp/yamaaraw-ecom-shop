import ETrikeLoader from "@/components/ui/etrike-loader";

export default function Loading() {
  return (
    <div className="min-h-screen bg-gray-50">
      <section className="bg-gradient-to-br from-orange-500 via-red-500 to-orange-600 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div>
              <div className="mb-4 bg-white/20 rounded-full px-3 py-1 text-sm animate-pulse">
                Admin Dashboard
              </div>
              <div className="h-8 bg-white/20 rounded animate-pulse mb-2 w-64"></div>
              <div className="h-4 bg-white/20 rounded animate-pulse w-48"></div>
            </div>
            <div className="h-10 bg-white/20 rounded animate-pulse w-32"></div>
          </div>
        </div>
      </section>

      <section className="py-8 bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
            <div className="flex flex-col sm:flex-row gap-4 flex-1">
              <div className="h-10 bg-gray-200 rounded animate-pulse flex-1 max-w-md"></div>
              <div className="h-10 bg-gray-200 rounded animate-pulse w-32"></div>
              <div className="h-10 bg-gray-200 rounded animate-pulse w-32"></div>
            </div>
            <div className="flex items-center space-x-2">
              <div className="h-10 bg-gray-200 rounded animate-pulse w-20"></div>
              <div className="h-6 bg-gray-200 rounded animate-pulse w-24"></div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="p-8 text-center">
              <ETrikeLoader />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
