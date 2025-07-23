import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { TrendingUp, Info } from 'lucide-react';
import { DataRow } from '../types';

interface DistributionPlotsProps {
  data: DataRow[];
  numericColumns: string[];
}

export const DistributionPlots: React.FC<DistributionPlotsProps> = ({ 
  data, 
  numericColumns 
}) => {
  const createHistogramData = (column: string) => {
    const values = data
      .map(row => row[column])
      .filter(val => val !== null && typeof val === 'number') as number[];
    
    if (values.length === 0) return [];

    const min = Math.min(...values);
    const max = Math.max(...values);
    const bins = Math.min(20, Math.max(5, Math.ceil(Math.sqrt(values.length))));
    const binWidth = (max - min) / bins;

    const histogram = Array.from({ length: bins }, (_, i) => ({
      range: `${(min + i * binWidth).toFixed(2)}-${(min + (i + 1) * binWidth).toFixed(2)}`,
      count: 0,
      midpoint: min + (i + 0.5) * binWidth
    }));

    values.forEach(value => {
      const binIndex = Math.min(Math.floor((value - min) / binWidth), bins - 1);
      histogram[binIndex].count++;
    });

    return histogram;
  };

  if (numericColumns.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="flex items-center space-x-3 mb-6">
          <div className="p-2 bg-purple-100 rounded-lg">
            <TrendingUp className="h-5 w-5 text-purple-600" />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-gray-900">Distribution Plots</h2>
            <p className="text-sm text-gray-500">Histograms for numeric variables</p>
          </div>
        </div>
        
        <div className="text-center py-8">
          <Info className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600">
            No numeric columns found for distribution analysis
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <div className="flex items-center space-x-3 mb-6">
        <div className="p-2 bg-purple-100 rounded-lg">
          <TrendingUp className="h-5 w-5 text-purple-600" />
        </div>
        <div>
          <h2 className="text-xl font-semibold text-gray-900">Distribution Plots</h2>
          <p className="text-sm text-gray-500">
            Histograms for {numericColumns.length} numeric variables
          </p>
        </div>
      </div>

      <div className="grid gap-8">
        {numericColumns.slice(0, 6).map((column) => {
          const histogramData = createHistogramData(column);
          
          return (
            <div key={column} className="border border-gray-200 rounded-lg p-4">
              <h3 className="font-medium text-gray-900 mb-4">{column}</h3>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={histogramData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis 
                      dataKey="range" 
                      angle={-45}
                      textAnchor="end"
                      height={80}
                      fontSize={12}
                    />
                    <YAxis />
                    <Tooltip 
                      formatter={(value: any) => [value, 'Count']}
                      labelFormatter={(label: string) => `Range: ${label}`}
                    />
                    <Bar 
                      dataKey="count" 
                      fill="#3B82F6" 
                      radius={[2, 2, 0, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          );
        })}
        
        {numericColumns.length > 6 && (
          <div className="text-center py-4 text-gray-500">
            <p>Showing first 6 distributions. Upload contains {numericColumns.length} numeric columns.</p>
          </div>
        )}
      </div>
    </div>
  );
};