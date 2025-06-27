import React, { useEffect, useState } from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, LineElement, PointElement, Tooltip } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, LineElement, PointElement, Tooltip);

const StatCard = ({ title, value, icon: Icon, change, changeType, color = 'blue', sparklineData }) => {
  const [animatedData, setAnimatedData] = useState(sparklineData || []);

  useEffect(() => {
    const interval = setInterval(() => {
      setAnimatedData(prev => {
        const next = [...prev.slice(1), prev[prev.length - 1] + Math.round(Math.random() * 3 - 1)];
        return next;
      });
    }, 1500);
    return () => clearInterval(interval);
  }, []);

  const sparklineOptions = {
    responsive: true,
    elements: { point: { radius: 0 } },
    plugins: { legend: { display: false }, tooltip: { enabled: false } },
    scales: { x: { display: false }, y: { display: false } }
  };

  const sparklineChartData = {
    labels: animatedData.map((_, i) => i),
    datasets: [{
      data: animatedData,
      borderColor: color.includes('red') ? '#DC2626' : '#3B82F6',
      backgroundColor: 'transparent',
      tension: 0.4
    }]
  };

  const colorClasses = {
    blue: 'from-blue-100 to-blue-300 text-blue-700',
    green: 'from-green-100 to-green-300 text-green-700',
    purple: 'from-purple-100 to-purple-300 text-purple-700',
    orange: 'from-orange-100 to-orange-300 text-orange-700',
    red: 'from-red-100 to-red-300 text-red-700'
  };

  const bgGradient = colorClasses[color] || colorClasses.blue;

  return (
    <div className="bg-white/70 backdrop-blur-md border border-gray-200 p-6 rounded-2xl hover:shadow-lg transition duration-300">
      <div className="flex items-center justify-between mb-3">
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-3xl font-extrabold text-gray-900 mt-1 mb-1">{value}</p>
          {change && (
            <div className={`flex items-center gap-1 text-sm ${
              changeType === 'positive' ? 'text-green-600' : 
              changeType === 'negative' ? 'text-red-600' : 'text-gray-500'
            }`}>
              {changeType === 'positive' && <TrendingUp size={16} />}
              {changeType === 'negative' && <TrendingDown size={16} />}
              <span className="font-semibold">{change}</span>
            </div>
          )}
        </div>

        <div className="ml-4 p-3 rounded-full bg-gradient-to-br ${bgGradient} shadow-inner">
          <Icon size={24} />
        </div>
      </div>

      {/* Sparkline Chart */}
      <div className="h-14 mt-2">
        <Line data={sparklineChartData} options={sparklineOptions} />
      </div>
    </div>
  );
};

export default StatCard;