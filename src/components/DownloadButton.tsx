import React, { useState } from 'react';
import { Download, FileText, FileSpreadsheet, CheckCircle } from 'lucide-react';
import { ProcessedData } from '../types';
import { downloadCSV, downloadCorrelationCSV, downloadPDF } from '../utils/downloadUtils';

interface DownloadButtonProps {
  data: ProcessedData;
}

export const DownloadButton: React.FC<DownloadButtonProps> = ({ data }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const handleDownload = async (type: 'csv' | 'correlation' | 'pdf') => {
    setIsDownloading(true);
    
    try {
      switch (type) {
        case 'csv':
          downloadCSV(data);
          break;
        case 'correlation':
          downloadCorrelationCSV(data.correlations, data.numericColumns);
          break;
        case 'pdf':
          await downloadPDF(data);
          break;
      }
      
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
    } catch (error) {
      console.error('Download failed:', error);
    } finally {
      setIsDownloading(false);
      setIsOpen(false);
    }
  };

  return (
    <div className="relative">
      {/* Success Toast */}
      {showSuccess && (
        <div className="fixed top-4 right-4 bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg flex items-center space-x-2 z-50 animate-fade-in">
          <CheckCircle className="h-4 w-4" />
          <span>Download completed successfully!</span>
        </div>
      )}

      {/* Download Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        disabled={isDownloading}
        className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <Download className="h-4 w-4" />
        <span>{isDownloading ? 'Downloading...' : 'Download Insights'}</span>
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-lg border border-gray-200 z-40">
          <div className="p-2">
            <div className="text-sm font-medium text-gray-700 px-3 py-2 border-b border-gray-100">
              Export Options
            </div>
            
            <button
              onClick={() => handleDownload('csv')}
              className="w-full flex items-center space-x-3 px-3 py-2 text-left hover:bg-gray-50 rounded-md transition-colors"
            >
              <FileSpreadsheet className="h-4 w-4 text-green-600" />
              <div>
                <div className="font-medium text-gray-900">Summary Statistics (CSV)</div>
                <div className="text-xs text-gray-500">All column statistics and metrics</div>
              </div>
            </button>

            {data.numericColumns.length >= 2 && (
              <button
                onClick={() => handleDownload('correlation')}
                className="w-full flex items-center space-x-3 px-3 py-2 text-left hover:bg-gray-50 rounded-md transition-colors"
              >
                <FileSpreadsheet className="h-4 w-4 text-orange-600" />
                <div>
                  <div className="font-medium text-gray-900">Correlation Matrix (CSV)</div>
                  <div className="text-xs text-gray-500">Numeric variable correlations</div>
                </div>
              </button>
            )}

            <button
              onClick={() => handleDownload('pdf')}
              className="w-full flex items-center space-x-3 px-3 py-2 text-left hover:bg-gray-50 rounded-md transition-colors"
            >
              <FileText className="h-4 w-4 text-red-600" />
              <div>
                <div className="font-medium text-gray-900">Complete Report (PDF)</div>
                <div className="text-xs text-gray-500">Full analysis summary report</div>
              </div>
            </button>
          </div>
        </div>
      )}

      {/* Backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-30" 
          onClick={() => setIsOpen(false)}
        />
      )}
    </div>
  );
};