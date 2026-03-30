import React, { useState } from 'react';
import {
  BarChart, Bar, LineChart, Line, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';
import { BarChart2, TrendingUp, PieChart as PieIcon, Table } from 'lucide-react';

const COLORS = ['#4f46e5', '#06b6d4', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#14b8a6'];

function formatYAxis(value) {
  if (value >= 1_000_000) return `£${(value / 1_000_000).toFixed(1)}M`;
  if (value >= 1_000) return `£${(value / 1_000).toFixed(0)}K`;
  return value;
}

function formatTooltipValue(value, name) {
  if (typeof value === 'number' && value > 1000) {
    return [`£${value.toLocaleString()}`, name];
  }
  return [value, name];
}

function BarChartView({ data, xKey, yKeys = ['value'] }) {
  return (
    <ResponsiveContainer width="100%" height={260}>
      <BarChart data={data} margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
        <XAxis dataKey={xKey} tick={{ fontSize: 12, fill: '#6b7280' }} />
        <YAxis tickFormatter={formatYAxis} tick={{ fontSize: 12, fill: '#6b7280' }} />
        <Tooltip formatter={formatTooltipValue} contentStyle={{ borderRadius: '8px', border: '1px solid #e5e7eb' }} />
        {yKeys.length > 1 && <Legend />}
        {yKeys.map((key, i) => (
          <Bar key={key} dataKey={key} fill={COLORS[i % COLORS.length]} radius={[4, 4, 0, 0]} />
        ))}
      </BarChart>
    </ResponsiveContainer>
  );
}

function LineChartView({ data, xKey, yKeys = ['value'] }) {
  return (
    <ResponsiveContainer width="100%" height={260}>
      <LineChart data={data} margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
        <XAxis dataKey={xKey} tick={{ fontSize: 12, fill: '#6b7280' }} />
        <YAxis tickFormatter={formatYAxis} tick={{ fontSize: 12, fill: '#6b7280' }} />
        <Tooltip formatter={formatTooltipValue} contentStyle={{ borderRadius: '8px', border: '1px solid #e5e7eb' }} />
        {yKeys.length > 1 && <Legend />}
        {yKeys.map((key, i) => (
          <Line key={key} type="monotone" dataKey={key} stroke={COLORS[i % COLORS.length]} strokeWidth={2} dot={{ r: 4 }} activeDot={{ r: 6 }} />
        ))}
      </LineChart>
    </ResponsiveContainer>
  );
}

function PieChartView({ data }) {
  const total = data.reduce((s, d) => s + (d.value || 0), 0);
  return (
    <ResponsiveContainer width="100%" height={260}>
      <PieChart>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          innerRadius={60}
          outerRadius={100}
          paddingAngle={3}
          dataKey="value"
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip
          formatter={(value, name) => [`£${value.toLocaleString()} (${((value / total) * 100).toFixed(1)}%)`, name]}
          contentStyle={{ borderRadius: '8px', border: '1px solid #e5e7eb' }}
        />
        <Legend />
      </PieChart>
    </ResponsiveContainer>
  );
}

function TableView({ columns, rows }) {
  return (
    <div className="overflow-x-auto rounded-lg border border-gray-200 mt-2">
      <table className="w-full text-sm">
        <thead>
          <tr className="bg-gray-50">
            {columns.map((col, i) => (
              <th key={i} className="text-left px-4 py-3 font-semibold text-gray-600 border-b border-gray-200">{col}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, ri) => (
            <tr key={ri} className="hover:bg-gray-50 transition-colors">
              {row.map((cell, ci) => (
                <td key={ci} className="px-4 py-3 text-gray-700 border-b border-gray-100 last:border-0">{cell}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function KPIView({ value, change, trend }) {
  const trendColor = trend === 'up' ? 'text-green-600' : trend === 'down' ? 'text-red-600' : 'text-gray-500';
  const trendArrow = trend === 'up' ? '↑' : trend === 'down' ? '↓' : '→';
  return (
    <div className="flex items-center gap-6 py-4 px-6 bg-indigo-50 rounded-xl">
      <div className="text-4xl font-bold text-gray-900">{value}</div>
      {change && (
        <div className={`text-xl font-semibold ${trendColor}`}>
          {trendArrow} {change}
        </div>
      )}
    </div>
  );
}

export default function ChartRenderer({ chartType: initialChartType, chartData }) {
  const [activeType, setActiveType] = useState(initialChartType);

  if (!chartData) return null;

  const isKpi = initialChartType === 'kpi';
  const hasData = chartData.data && Array.isArray(chartData.data) && chartData.data.length > 0;
  const isTable = chartData.columns && chartData.rows;

  const typeButtons = [
    { type: 'bar', icon: BarChart2, label: 'Bar' },
    { type: 'line', icon: TrendingUp, label: 'Line' },
    { type: 'pie', icon: PieIcon, label: 'Pie' },
    { type: 'table', icon: Table, label: 'Table' },
  ];

  const renderChart = () => {
    if (isKpi) return <KPIView {...chartData} />;
    if (isTable || activeType === 'table') {
      if (isTable) return <TableView {...chartData} />;
      if (hasData) {
        const cols = Object.keys(chartData.data[0]);
        const rows = chartData.data.map(d => cols.map(k => d[k]));
        return <TableView columns={cols} rows={rows} />;
      }
    }
    if (!hasData) return null;
    const xKey = chartData.xKey || 'name';
    const yKeys = chartData.yKeys || ['value'];
    switch (activeType) {
      case 'line': return <LineChartView data={chartData.data} xKey={xKey} yKeys={yKeys} />;
      case 'pie': return <PieChartView data={chartData.data} />;
      default: return <BarChartView data={chartData.data} xKey={xKey} yKeys={yKeys} />;
    }
  };

  return (
    <div className="mt-4 p-4 bg-white rounded-xl border border-gray-200 shadow-sm">
      {renderChart()}
      {!isKpi && hasData && (
        <div className="flex gap-1 mt-3 pt-3 border-t border-gray-100">
          {typeButtons.map(({ type, icon: Icon, label }) => (
            <button
              key={type}
              onClick={() => setActiveType(type)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                activeType === type
                  ? 'bg-indigo-100 text-indigo-700'
                  : 'text-gray-500 hover:bg-gray-100 hover:text-gray-700'
              }`}
            >
              <Icon size={13} />
              {label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
