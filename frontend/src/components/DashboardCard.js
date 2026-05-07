function DashboardCard({
  title,
  value,
  color,
  icon,
}) {
  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-6 shadow-lg hover:-translate-y-1 hover:border-zinc-700 transition duration-300">

      {/* Top Section */}
      <div className="flex items-center justify-between">

        <h2 className="text-gray-400 text-sm font-medium">
          {title}
        </h2>

        <div className="text-3xl">
          {icon}
        </div>

      </div>

      {/* Value */}
      <h1 className={`text-4xl font-bold mt-6 ${color}`}>
        {value}
      </h1>

    </div>
  );
}

export default DashboardCard;