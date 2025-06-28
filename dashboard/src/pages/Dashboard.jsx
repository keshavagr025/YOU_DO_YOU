import React, { useState } from "react";
import { Link } from "react-router-dom";
import ApplicationTrendChart from "../components/ApplicationTrendChart";


import { Bar, Doughnut, Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  ArcElement,
  Tooltip,
  Legend,
  LineElement,
  PointElement,
} from "chart.js";
import {
  Briefcase,
  UserCheck,
  TrendingUp,
  Clock,
  // Search,
  Plus,
  Filter,
} from "lucide-react";
import SalaryInsights from "./SalaryInsights";

ChartJS.register(
  BarElement,
  CategoryScale,
  LinearScale,
  ArcElement,
  Tooltip,
  Legend,
  LineElement,
  PointElement
);

const Dashboard = () => {
  const barData = {
    labels: ["Google", "Amazon", "Flipkart", "Adobe", "Zoho"],
    datasets: [
      {
        label: "Frontend",
        data: [12, 9, 5, 7, 4],
        backgroundColor: "rgba(99, 102, 241, 0.8)",
        borderColor: "rgb(99, 102, 241)",
        borderWidth: 2,
        borderRadius: 8,
        borderSkipped: false,
      },
      {
        label: "Backend",
        data: [8, 6, 4, 6, 3],
        backgroundColor: "rgba(16, 185, 129, 0.8)",
        borderColor: "rgb(16, 185, 129)",
        borderWidth: 2,
        borderRadius: 8,
        borderSkipped: false,
      },
      {
        label: "UI/UX",
        data: [4, 3, 2, 5, 2],
        backgroundColor: "rgba(245, 158, 11, 0.8)",
        borderColor: "rgb(245, 158, 11)",
        borderWidth: 2,
        borderRadius: 8,
        borderSkipped: false,
      },
    ],
  };

  const doughnutData = {
    labels: ["Applied", "Interview", "Rejected", "Under Review"],
    datasets: [
      {
        label: "Applications",
        data: [20, 10, 4, 6],
        backgroundColor: [
          "rgba(99, 102, 241, 0.9)",
          "rgba(16, 185, 129, 0.9)",
          "rgba(239, 68, 68, 0.9)",
          "rgba(245, 158, 11, 0.9)",
        ],
        borderColor: [
          "rgb(99, 102, 241)",
          "rgb(16, 185, 129)",
          "rgb(239, 68, 68)",
          "rgb(245, 158, 11)",
        ],
        borderWidth: 3,
        hoverOffset: 8,
      },
    ],
  };

  const [showTooltip, setShowTooltip] = useState(false);

  const lineData = {
    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
    datasets: [
      {
        label: "Applications Sent",
        data: [5, 8, 12, 15, 18, 20],
        borderColor: "rgb(99, 102, 241)",
        backgroundColor: "rgba(99, 102, 241, 0.1)",
        borderWidth: 3,
        fill: true,
        tension: 0.4,
        pointBackgroundColor: "rgb(99, 102, 241)",
        pointBorderColor: "white",
        pointBorderWidth: 3,
        pointRadius: 6,
        pointHoverRadius: 8,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "top",
        labels: {
          usePointStyle: true,
          padding: 20,
          font: { size: 12, weight: "500" },
        },
      },
      tooltip: {
        backgroundColor: "rgba(0, 0, 0, 0.8)",
        titleColor: "white",
        bodyColor: "white",
        cornerRadius: 8,
        padding: 12,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: { color: "rgba(0, 0, 0, 0.05)" },
        ticks: { font: { size: 11 } },
      },
      x: {
        grid: { display: false },
        ticks: { font: { size: 11 } },
      },
    },
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Main Content */}
      <main className="p-8 space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-4xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent mb-2">
              Welcome back
            </h2>
            <p className="text-gray-600">
              {/* Here's your career progress overview */}
            </p>
          </div>
          <div className="flex items-center space-x-4">
            {/* <button className="p-3 rounded-2xl bg-white/80 backdrop-blur-sm shadow-lg border border-white/20 hover:bg-white/90 transition-all duration-200 hover:scale-105">
              <Search size={18} className="text-gray-600" />
            </button> */}
            <div className="relative inline-block">
              {/* Button */}
              <button
                onClick={() => setShowTooltip(!showTooltip)}
                className="p-3 rounded-2xl bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105 active:scale-95"
              >
                <Plus size={18} />
              </button>

              {/* Notification Dropdown */}
              {showTooltip && (
                <div className="absolute top-full mt-3 right-0 w-80 bg-white rounded-xl shadow-2xl border border-gray-200 z-50">
                  <div className="px-5 py-3 border-b text-sm font-semibold text-gray-700">
                    Notifications
                  </div>
                  <ul className="divide-y divide-gray-100 max-h-64 overflow-y-auto">
                    {[
                      {
                        title: "Resume Score Updated",
                        desc: "Your score improved to 85%",
                        icon: "📈",
                        time: "2 mins ago",
                      },
                      {
                        title: "Interview Scheduled",
                        desc: "Google wants to interview you!",
                        icon: "📅",
                        time: "10 mins ago",
                      },
                      {
                        title: "New Job Match",
                        desc: "Amazon - Frontend Developer",
                        icon: "💼",
                        time: "1 hour ago",
                      },
                      {
                        title: "Profile Viewed",
                        desc: "Adobe checked your profile",
                        icon: "👀",
                        time: "Today",
                      },
                    ].map((item, i) => (
                      <li
                        key={i}
                        className="px-5 py-3 hover:bg-gray-50 cursor-pointer transition-all group"
                      >
                        <div className="flex items-start space-x-3">
                          <div className="text-2xl">{item.icon}</div>
                          <div className="flex-1">
                            <p className="font-medium text-sm text-gray-800 group-hover:text-indigo-600">
                              {item.title}
                            </p>
                            <p className="text-xs text-gray-500">{item.desc}</p>
                          </div>
                          <span className="text-[10px] text-gray-400">
                            {item.time}
                          </span>
                        </div>
                      </li>
                    ))}
                  </ul>
                  <div className="text-center text-xs py-3 text-blue-600 hover:underline cursor-pointer font-medium border-t">
                    View All Notifications
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatsCard
            title="Total Applications"
            value="32"
            change="+12%"
            icon={<Briefcase size={24} />}
            color="from-blue-500 to-blue-600"
            bgColor="from-blue-50 to-blue-100"
          />
          <StatsCard
            title="Interviews Scheduled"
            value="5"
            change="+25%"
            icon={<UserCheck size={24} />}
            color="from-green-500 to-green-600"
            bgColor="from-green-50 to-green-100"
          />
          <StatsCard
            title="Response Rate"
            value="68%"
            change="+8%"
            icon={<TrendingUp size={24} />}
            color="from-purple-500 to-purple-600"
            bgColor="from-purple-50 to-purple-100"
          />
          <StatsCard
            title="Avg. Response Time"
            value="3.2 days"
            change="-15%"
            icon={<Clock size={24} />}
            color="from-orange-500 to-orange-600"
            bgColor="from-orange-50 to-orange-100"
          />
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Bar Chart */}
          <div className="bg-white/80 backdrop-blur-sm p-8 rounded-3xl shadow-xl border border-white/20">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-gray-800">
                Hiring Trends by Role
              </h3>
              <Filter
                size={18}
                className="text-gray-400 cursor-pointer hover:text-gray-600"
              />
            </div>
            <div className="h-80">
              <Bar data={barData} options={chartOptions} />
            </div>
          </div>

          {/* Doughnut Chart */}
          <div className="bg-white/90 backdrop-blur-md p-6 md:p-8 rounded-3xl shadow-2xl border border-gray-200 transition-all duration-300 w-full">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-4">
              <h3 className="text-lg md:text-xl font-semibold text-gray-800">
                📂 Application Status
              </h3>
              {/* Status Legend */}
              <div className="flex space-x-2">
                <span
                  className="w-3 h-3 bg-indigo-500 rounded-full"
                  title="Applied"
                ></span>
                <span
                  className="w-3 h-3 bg-green-500 rounded-full"
                  title="Interview"
                ></span>
                <span
                  className="w-3 h-3 bg-red-500 rounded-full"
                  title="Rejected"
                ></span>
                <span
                  className="w-3 h-3 bg-yellow-400 rounded-full"
                  title="Under Review"
                ></span>
              </div>
            </div>

            {/* Doughnut Chart Container */}
            <div className="relative h-72 sm:h-80">
              <Doughnut data={doughnutData} options={chartOptions} />
            </div>
          </div>
        </div>

        {/* Line Chart */}
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-semibold text-gray-800"></h3>
          <div className="flex items-center space-x-2 text-sm text-gray-500">
            <span>Last 6 months</span>
          </div>
        </div>
        <div className="h-100">
          <ApplicationTrendChart />
        </div>

        {/* Recent Activity */}
        <div className="bg-white/70 backdrop-blur-md p-6 md:p-8 rounded-3xl shadow-2xl border border-gray-200 transition-all duration-300 w-full">
          {/* Header */}
         
        </div>
      </main>
    </div>
  );
};

const StatsCard = ({ title, value, change, icon, color, bgColor }) => (
  <div
    className="bg-gradient-to-br ${bgColor} p-6 rounded-3xl shadow-lg border border-white/20 hover:shadow-xl transition-all duration-300 hover:scale-105 group"
  >
    <div className="flex items-center justify-between mb-4">
      <div
        className="p-3 rounded-2xl bg-gradient-to-r ${color} text-white shadow-lg group-hover:scale-110 transition-transform duration-300"
      >
        {icon}
      </div>
      <div
        className={`text-sm font-medium px-3 py-1 rounded-full ${
          change.startsWith("+")
            ? "text-green-600 bg-green-100"
            : "text-red-600 bg-red-100"
        }`}
      >
        {change}
      </div>
    </div>
    <div>
      <p className="text-sm text-gray-600 mb-1">{title}</p>
      <h3 className="text-3xl font-bold text-gray-800">{value}</h3>
    </div>
  </div>
);

const ActivityItem = ({ company, position, status, time, statusColor }) => (
  <div className="flex items-center justify-between p-4 rounded-2xl bg-gray-50/50 hover:bg-white/50 transition-all duration-200 border border-gray-100/50">
    <div className="flex items-center space-x-4">
      <div className="w-12 h-12 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center text-white font-bold text-lg">
        {company[0]}
      </div>
      <div>
        <h4 className="font-medium text-gray-800">{company}</h4>
        <p className="text-sm text-gray-600">{position}</p>
      </div>
    </div>
    <div className="text-right">
      <span
        className="px-3 py-1 rounded-full text-xs font-medium ${statusColor}"
      >
        {status}
      </span>
      <p className="text-xs text-gray-500 mt-1">{time}</p>
    </div>
  </div>
);

export default Dashboard;