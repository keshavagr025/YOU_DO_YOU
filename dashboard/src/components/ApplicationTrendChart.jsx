import React from 'react';
import { Line } from 'recharts';
import { LineChart, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { TrendingUp, Calendar, Users } from 'lucide-react';

const ApplicationTrendChart = () => {
  // Realistic application data over 6 months
  const applicationData = [
    { month: 'Jan', applications: 245, interviews: 89, offers: 23 },
    { month: 'Feb', applications: 312, interviews: 124, offers: 31 },
    { month: 'Mar', applications: 428, interviews: 167, offers: 45 },
    { month: 'Apr', applications: 391, interviews: 156, offers: 38 },
    { month: 'May', applications: 523, interviews: 201, offers: 52 },
    { month: 'Jun', applications: 467, interviews: 189, offers: 48 }
  ];

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white/95 backdrop-blur-sm p-4 rounded-xl shadow-lg border border-gray-200">
          <p className="font-semibold text-gray-800 mb-2">${label} 2024</p>
          {payload.map((entry, index) => (
            <p key={index} className="text-sm flex items-center gap-2">
              <div 
                className="w-3 h-3 rounded-full" 
                style={{ backgroundColor: entry.color }}
              />
              <span className="capitalize">{entry.dataKey}:</span>
              <span className="font-semibold">{entry.value}</span>
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-gradient-to-br from-white/90 to-blue-50/80 backdrop-blur-sm p-8 rounded-3xl shadow-2xl border-2 border-white/30 hover:shadow-3xl transition-all duration-500"
>
      {/* Header Section */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-500/10 rounded-xl">
            <TrendingUp className="w-6 h-6 text-blue-600" />
          </div>
          <div>
            <h3 className="text-2xl font-bold text-gray-800 mb-1">
              Application Analytics
            </h3>
            <p className="text-gray-500 text-sm">Track your job search progress</p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 px-3 py-2 bg-green-50 rounded-lg">
            <Calendar className="w-4 h-4 text-green-600" />
            <span className="text-sm font-medium text-green-700">Last 6 months</span>
          </div>
          <div className="flex items-center gap-2 px-3 py-2 bg-blue-50 rounded-lg">
            <Users className="w-4 h-4 text-blue-600" />
            <span className="text-sm font-medium text-blue-700">2,366 Total</span>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        <div className="bg-white/60 backdrop-blur-sm p-4 rounded-2xl border border-white/40">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 mb-1">Applications</p>
              <p className="text-2xl font-bold text-blue-600">2,366</p>
            </div>
            <div className="w-2 h-12 bg-gradient-to-t from-blue-400 to-blue-600 rounded-full"></div>
          </div>
          <p className="text-xs text-green-600 font-medium mt-2">+12% from last period</p>
        </div>
        
        <div className="bg-white/60 backdrop-blur-sm p-4 rounded-2xl border border-white/40">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 mb-1">Interviews</p>
              <p className="text-2xl font-bold text-purple-600">926</p>
            </div>
            <div className="w-2 h-12 bg-gradient-to-t from-purple-400 to-purple-600 rounded-full"></div>
          </div>
          <p className="text-xs text-green-600 font-medium mt-2">+8% from last period</p>
        </div>
        
        <div className="bg-white/60 backdrop-blur-sm p-4 rounded-2xl border border-white/40">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 mb-1">Offers</p>
              <p className="text-2xl font-bold text-emerald-600">237</p>
            </div>
            <div className="w-2 h-12 bg-gradient-to-t from-emerald-400 to-emerald-600 rounded-full"></div>
          </div>
          <p className="text-xs text-green-600 font-medium mt-2">+15% from last period</p>
        </div>
      </div>

      {/* Chart Section */}
      <div className="bg-white/40 backdrop-blur-sm rounded-2xl p-6 border border-white/30">
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={applicationData} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
              <defs>
                <linearGradient id="applicationsGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#3B82F6" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="interviewsGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#8B5CF6" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#8B5CF6" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="offersGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10B981" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#10B981" stopOpacity={0}/>
                </linearGradient>
              </defs>
              
              <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" opacity={0.6} />
              <XAxis 
                dataKey="month" 
                axisLine={false}
                tickLine={false}
                tick={{ fill: '#6B7280', fontSize: 12, fontWeight: 500 }}
              />
              <YAxis 
                axisLine={false}
                tickLine={false}
                tick={{ fill: '#6B7280', fontSize: 12, fontWeight: 500 }}
              />
              <Tooltip content={<CustomTooltip />} />
              
              <Line
                type="monotone"
                dataKey="applications"
                stroke="#3B82F6"
                strokeWidth={3}
                dot={{ fill: '#3B82F6', strokeWidth: 2, r: 6 }}
                activeDot={{ r: 8, stroke: '#3B82F6', strokeWidth: 2, fill: '#ffffff' }}
                fill="url(#applicationsGradient)"
              />
              <Line
                type="monotone"
                dataKey="interviews"
                stroke="#8B5CF6"
                strokeWidth={3}
                dot={{ fill: '#8B5CF6', strokeWidth: 2, r: 6 }}
                activeDot={{ r: 8, stroke: '#8B5CF6', strokeWidth: 2, fill: '#ffffff' }}
                fill="url(#interviewsGradient)"
              />
              <Line
                type="monotone"
                dataKey="offers"
                stroke="#10B981"
                strokeWidth={3}
                dot={{ fill: '#10B981', strokeWidth: 2, r: 6 }}
                activeDot={{ r: 8, stroke: '#10B981', strokeWidth: 2, fill: '#ffffff' }}
                fill="url(#offersGradient)"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
        
        {/* Legend */}
        <div className="flex justify-center gap-8 mt-6">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-blue-500 rounded-full"></div>
            <span className="text-sm font-medium text-gray-700">Applications</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-purple-500 rounded-full"></div>
            <span className="text-sm font-medium text-gray-700">Interviews</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-emerald-500 rounded-full"></div>
            <span className="text-sm font-medium text-gray-700">Offers</span>
          </div>
        </div>
      </div>
      
      {/* Bottom Insights */}
      <div className="mt-6 p-4 bg-gradient-to-r from-blue-50/80 to-purple-50/80 rounded-2xl border border-white/30">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-500/10 rounded-lg">
            <TrendingUp className="w-5 h-5 text-blue-600" />
          </div>
          <div>
            <p className="text-sm font-semibold text-gray-800">Key Insight</p>
            <p className="text-xs text-gray-600">Your conversion rate from applications to offers is 10% - above industry average of 7%</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ApplicationTrendChart;