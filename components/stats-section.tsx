const stats = [
  { number: "10M+", label: "Users Worldwide" },
  { number: "99.9%", label: "Uptime Guarantee" },
  { number: "150+", label: "Countries Served" },
  { number: "24/7", label: "Expert Support" },
]

export function StatsSection() {
  return (
    <section className="py-20 bg-gradient-to-r from-blue-600 to-sky-500">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <div key={index} className="text-center">
              <div className="text-4xl lg:text-5xl font-bold text-white mb-2">{stat.number}</div>
              <div className="text-blue-100 text-lg">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
