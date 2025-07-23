import React, { useEffect, useRef } from 'react';
import { Activity, Info } from 'lucide-react';
import { Chart as ChartJS, CategoryScale, LinearScale, Title, Tooltip, Legend } from 'chart.js';
import { CorrelationData } from '../types';

ChartJS.register(CategoryScale, LinearScale, Title, Tooltip, Legend);

interface CorrelationHeatmapProps {
  correlations: CorrelationData;
  numericColumns: string[];
}

export const CorrelationHeatmap: React.FC<CorrelationHeatmapProps> = ({ 
  correlations, 
  numericColumns 
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!canvasRef.current || numericColumns.length < 2) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const size = Math.min(500, window.innerWidth - 100);
    canvas.width = size;
    canvas.height = size;

    const cellSize = size / numericColumns.length;
    
    // Clear canvas
    ctx.clearRect(0, 0, size, size);

    // Draw heatmap
    numericColumns.forEach((col1, i) => {
      numericColumns.forEach((col2, j) => {
        const correlation = correlations[col1]?.[col2] || 0;
        const intensity = Math.abs(correlation);
        const isPositive = correlation >= 0;
        
        // Color based on correlation
        const red = isPositive ? 255 - Math.floor(intensity * 128) : 255;
        const green = isPositive ? 255 - Math.floor(intensity * 128) : 255 - Math.floor(intensity * 255);
        const blue = isPositive ? 255 : 255 - Math.floor(intensity * 128);
        
        ctx.fillStyle = `rgb(${red}, ${green}, ${blue})`;
        ctx.fillRect(i * cellSize, j * cellSize, cellSize, cellSize);
        
        // Draw correlation value
        ctx.fillStyle = intensity > 0.5 ? 'white' : 'black';
        ctx.font = `${Math.max(10, cellSize / 4)}px Arial`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(
          correlation.toFixed(2),
          i * cellSize + cellSize / 2,
          j * cellSize + cellSize / 2
        );
      });
    });

    // Draw grid lines
    ctx.strokeStyle = '#ddd';
    ctx.lineWidth = 1;
    for (let i = 0; i <= numericColumns.length; i++) {
      ctx.beginPath();
      ctx.moveTo(i * cellSize, 0);
      ctx.lineTo(i * cellSize, size);
      ctx.stroke();
      
      ctx.beginPath();
      ctx.moveTo(0, i * cellSize);
      ctx.lineTo(size, i * cellSize);
      ctx.stroke();
    }

  }, [correlations, numericColumns]);

  if (numericColumns.length < 2) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="flex items-center space-x-3 mb-6">
          <div className="p-2 bg-orange-100 rounded-lg">
            <Activity className="h-5 w-5 text-orange-600" />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-gray-900">Correlation Heatmap</h2>
            <p className="text-sm text-gray-500">Correlations between numeric variables</p>
          </div>
        </div>
        
        <div className="text-center py-8">
          <Info className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600">
            Need at least 2 numeric columns to show correlations
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <div className="flex items-center space-x-3 mb-6">
        <div className="p-2 bg-orange-100 rounded-lg">
          <Activity className="h-5 w-5 text-orange-600" />
        </div>
        <div>
          <h2 className="text-xl font-semibold text-gray-900">Correlation Heatmap</h2>
          <p className="text-sm text-gray-500">
            Correlations between {numericColumns.length} numeric variables
          </p>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        <div className="flex-1">
          <canvas
            ref={canvasRef}
            className="border border-gray-200 rounded-lg max-w-full h-auto"
          />
        </div>
        
        <div className="lg:w-64">
          <h3 className="font-medium text-gray-900 mb-3">Legend</h3>
          <div className="space-y-2 text-sm">
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 bg-red-200 border border-gray-300"></div>
              <span>Strong Negative (-1.0 to -0.7)</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 bg-red-100 border border-gray-300"></div>
              <span>Moderate Negative (-0.7 to -0.3)</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 bg-gray-100 border border-gray-300"></div>
              <span>Weak (-0.3 to 0.3)</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 bg-blue-100 border border-gray-300"></div>
              <span>Moderate Positive (0.3 to 0.7)</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 bg-blue-200 border border-gray-300"></div>
              <span>Strong Positive (0.7 to 1.0)</span>
            </div>
          </div>
          
          <div className="mt-4 p-3 bg-gray-50 rounded-lg">
            <h4 className="font-medium text-gray-900 mb-2">Variables</h4>
            <div className="space-y-1 text-xs">
              {numericColumns.map((col, index) => (
                <div key={col} className="flex items-center space-x-2">
                  <span className="w-4 text-center font-mono">{index + 1}</span>
                  <span className="truncate" title={col}>{col}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};