import React from 'react';
import { BarChart3, Hash, TrendingUp, Target } from 'lucide-react';
import { ColumnStats } from '../types';

interface SummaryStatsProps {
  stats: ColumnStats[];
}

export const SummaryStats: React.FC<SummaryStatsProps> = ({ stats }) => {
  const formatNumber = (num: number | undefined): string => {
    if (num === undefined) return 'N/A';
    return num.toLocaleString(undefined, { maximumFractionDigits: 4 });
  };

  const getTypeIcon = (type: string) => {
    return type === 'numeric' ? (
      <TrendingUp className="h-4 w-4 text-green-600" />
    ) : (
      <Hash className="h-4 w-4 text-purple-600" />
    );
  };

  const getTypeColor = (type: string) => {
    return type === 'numeric' ? 'bg-green-100 text-green-800' : 'bg-purple-100 text-purple-800';
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <div className="flex items-center space-x-3 mb-6">
        <div className="p-2 bg-emerald-100 rounded-lg">
          <BarChart3 className="h-5 w-5 text-emerald-600" />
        </div>
        <div>
          <h2 className="text-xl font-semibold text-gray-900">Summary Statistics</h2>
          <p className="text-sm text-gray-500">Statistical overview of all columns</p>
        </div>
      </div>

      <div className="grid gap-4">
        {stats.map((stat) => (
          <div
            key={stat.name}
            className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
          >
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center space-x-2">
                {getTypeIcon(stat.type)}
                <h3 className="font-medium text-gray-900">{stat.name}</h3>
              </div>
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getTypeColor(stat.type)}`}>
                {stat.type}
              </span>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
              <div className="flex items-center space-x-2">
                <Target className="h-3 w-3 text-gray-400" />
                <span className="text-gray-600">Count:</span>
                <span className="font-medium">{stat.count.toLocaleString()}</span>
              </div>
              
              <div className="flex items-center space-x-2">
                <Hash className="h-3 w-3 text-gray-400" />
                <span className="text-gray-600">Unique:</span>
                <span className="font-medium">{stat.uniqueCount.toLocaleString()}</span>
              </div>

              <div className="flex items-center space-x-2">
                <div className="h-3 w-3 rounded-full bg-red-400"></div>
                <span className="text-gray-600">Null:</span>
                <span className="font-medium">{stat.nullCount.toLocaleString()}</span>
              </div>

              {stat.type === 'numeric' ? (
                <div className="flex items-center space-x-2">
                  <TrendingUp className="h-3 w-3 text-gray-400" />
                  <span className="text-gray-600">Mean:</span>
                  <span className="font-medium">{formatNumber(stat.mean)}</span>
                </div>
              ) : (
                <div className="flex items-center space-x-2">
                  <div className="h-3 w-3 rounded-full bg-purple-400"></div>
                  <span className="text-gray-600">Mode:</span>
                  <span className="font-medium truncate" title={String(stat.mode)}>
                    {String(stat.mode)}
                  </span>
                </div>
              )}
            </div>

            {stat.type === 'numeric' && (
              <div className="mt-3 pt-3 border-t border-gray-100">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
                  <div>
                    <span className="text-gray-600">Median:</span>
                    <span className="ml-2 font-medium">{formatNumber(stat.median)}</span>
                  </div>
                  <div>
                    <span className="text-gray-600">Std Dev:</span>
                    <span className="ml-2 font-medium">{formatNumber(stat.std)}</span>
                  </div>
                  <div>
                    <span className="text-gray-600">Min:</span>
                    <span className="ml-2 font-medium">{formatNumber(stat.min)}</span>
                  </div>
                  <div>
                    <span className="text-gray-600">Max:</span>
                    <span className="ml-2 font-medium">{formatNumber(stat.max)}</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};