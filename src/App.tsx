import React, { useState } from 'react';
import { FileUpload } from './components/FileUpload';
import { DataPreview } from './components/DataPreview';
import { SummaryStats } from './components/SummaryStats';
import { CorrelationHeatmap } from './components/CorrelationHeatmap';
import { DistributionPlots } from './components/DistributionPlots';
import { Footer } from './components/Footer';
import { DownloadButton } from './components/DownloadButton';
import { processCSVData } from './utils/dataProcessor';
import { ProcessedData } from './types';

function App() {
  const [processedData, setProcessedData] = useState<ProcessedData | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleDataLoad = async (rawData: any[]) => {
    setIsLoading(true);
    try {
      // Add a small delay to show loading state
      await new Promise(resolve => setTimeout(resolve, 500));
      const processed = processCSVData(rawData);
      setProcessedData(processed);
    } catch (error) {
      console.error('Error processing data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setProcessedData(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-emerald-50">
      <div className="container mx-auto px-4 py-8">
        {!processedData ? (
          <FileUpload onDataLoad={handleDataLoad} isLoading={isLoading} />
        ) : (
          <div className="space-y-8">
            {/* Header */}
            <div className="text-center relative">
              <h1 className="text-4xl font-bold text-gray-900 mb-2">
                Hayat EDA Dashboard - Analysis Results
              </h1>
              <p className="text-xl text-gray-600 mb-4">
                Exploring {processedData.rows.length.toLocaleString()} rows 
                × {processedData.columns.length} columns
              </p>
              <p className="text-sm text-gray-500 mb-4">
                Professional data insights by Faisal Hayat
              </p>
              
              <div className="flex justify-center items-center space-x-4">
                <button
                  onClick={handleReset}
                  className="px-6 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors font-medium"
                >
                  Upload New File
                </button>
                <DownloadButton data={processedData} />
              </div>
            </div>

            {/* Data Overview Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="bg-white rounded-lg shadow p-6 text-center">
                <div className="text-2xl font-bold text-blue-600">
                  {processedData.rows.length.toLocaleString()}
                </div>
                <div className="text-gray-600">Total Rows</div>
              </div>
              <div className="bg-white rounded-lg shadow p-6 text-center">
                <div className="text-2xl font-bold text-emerald-600">
                  {processedData.columns.length}
                </div>
                <div className="text-gray-600">Total Columns</div>
              </div>
              <div className="bg-white rounded-lg shadow p-6 text-center">
                <div className="text-2xl font-bold text-purple-600">
                  {processedData.numericColumns.length}
                </div>
                <div className="text-gray-600">Numeric Columns</div>
              </div>
              <div className="bg-white rounded-lg shadow p-6 text-center">
                <div className="text-2xl font-bold text-orange-600">
                  {processedData.categoricalColumns.length}
                </div>
                <div className="text-gray-600">Categorical Columns</div>
              </div>
            </div>

            {/* Main Analysis Components */}
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
              <div className="space-y-8">
                <DataPreview 
                  data={processedData.rows} 
                  columns={processedData.columns} 
                />
                <SummaryStats stats={processedData.stats} />
              </div>
              
              <div className="space-y-8">
                <CorrelationHeatmap 
                  correlations={processedData.correlations}
                  numericColumns={processedData.numericColumns}
                />
                <DistributionPlots 
                  data={processedData.rows}
                  numericColumns={processedData.numericColumns}
                />
              </div>
            </div>
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
}

export default App;