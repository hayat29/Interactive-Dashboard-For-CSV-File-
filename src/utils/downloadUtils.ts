import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { saveAs } from 'file-saver';
import { ProcessedData } from '../types';

export const downloadCSV = (data: ProcessedData) => {
  // Create summary statistics CSV
  const statsData = data.stats.map(stat => ({
    Column: stat.name,
    Type: stat.type,
    Count: stat.count,
    'Null Count': stat.nullCount,
    'Unique Count': stat.uniqueCount,
    Mean: stat.mean?.toFixed(4) || 'N/A',
    Median: stat.median?.toFixed(4) || 'N/A',
    'Std Dev': stat.std?.toFixed(4) || 'N/A',
    Min: stat.min?.toFixed(4) || 'N/A',
    Max: stat.max?.toFixed(4) || 'N/A',
    Mode: stat.mode || 'N/A'
  }));

  // Convert to CSV format
  const headers = Object.keys(statsData[0]);
  const csvContent = [
    headers.join(','),
    ...statsData.map(row => 
      headers.map(header => {
        const value = row[header as keyof typeof row];
        return typeof value === 'string' && value.includes(',') 
          ? `"${value}"` 
          : value;
      }).join(',')
    )
  ].join('\n');

  // Create and download file
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  saveAs(blob, `hayat-eda-insights-${new Date().toISOString().split('T')[0]}.csv`);
};

export const downloadCorrelationCSV = (correlations: any, numericColumns: string[]) => {
  if (numericColumns.length < 2) return;

  // Create correlation matrix CSV
  const headers = ['Variable', ...numericColumns];
  const csvContent = [
    headers.join(','),
    ...numericColumns.map(col1 => 
      [col1, ...numericColumns.map(col2 => 
        correlations[col1]?.[col2]?.toFixed(4) || '0'
      )].join(',')
    )
  ].join('\n');

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  saveAs(blob, `hayat-correlation-matrix-${new Date().toISOString().split('T')[0]}.csv`);
};

export const downloadPDF = async (data: ProcessedData) => {
  const pdf = new jsPDF('p', 'mm', 'a4');
  const pageWidth = pdf.internal.pageSize.getWidth();
  const pageHeight = pdf.internal.pageSize.getHeight();
  let yPosition = 20;

  // Title
  pdf.setFontSize(20);
  pdf.setFont('helvetica', 'bold');
  pdf.text('Hayat Interactive EDA Dashboard - Analysis Report', pageWidth / 2, yPosition, { align: 'center' });
  
  yPosition += 15;
  pdf.setFontSize(12);
  pdf.setFont('helvetica', 'normal');
  pdf.text(`Generated on: ${new Date().toLocaleDateString()}`, pageWidth / 2, yPosition, { align: 'center' });
  pdf.text(`Dataset: ${data.rows.length.toLocaleString()} rows × ${data.columns.length} columns`, pageWidth / 2, yPosition + 5, { align: 'center' });

  yPosition += 20;

  // Dataset Overview
  pdf.setFontSize(16);
  pdf.setFont('helvetica', 'bold');
  pdf.text('Dataset Overview', 20, yPosition);
  yPosition += 10;

  pdf.setFontSize(10);
  pdf.setFont('helvetica', 'normal');
  const overviewData = [
    `Total Rows: ${data.rows.length.toLocaleString()}`,
    `Total Columns: ${data.columns.length}`,
    `Numeric Columns: ${data.numericColumns.length}`,
    `Categorical Columns: ${data.categoricalColumns.length}`
  ];

  overviewData.forEach(item => {
    pdf.text(item, 25, yPosition);
    yPosition += 6;
  });

  yPosition += 10;

  // Summary Statistics
  pdf.setFontSize(16);
  pdf.setFont('helvetica', 'bold');
  pdf.text('Summary Statistics', 20, yPosition);
  yPosition += 10;

  pdf.setFontSize(8);
  pdf.setFont('helvetica', 'normal');

  // Table headers
  const headers = ['Column', 'Type', 'Count', 'Null', 'Unique', 'Mean/Mode'];
  const colWidths = [35, 20, 20, 15, 20, 25];
  let xPosition = 20;

  pdf.setFont('helvetica', 'bold');
  headers.forEach((header, i) => {
    pdf.text(header, xPosition, yPosition);
    xPosition += colWidths[i];
  });
  yPosition += 6;

  pdf.setFont('helvetica', 'normal');
  data.stats.slice(0, 15).forEach(stat => {
    if (yPosition > pageHeight - 30) {
      pdf.addPage();
      yPosition = 20;
    }

    xPosition = 20;
    const rowData = [
      stat.name.length > 15 ? stat.name.substring(0, 15) + '...' : stat.name,
      stat.type,
      stat.count.toString(),
      stat.nullCount.toString(),
      stat.uniqueCount.toString(),
      stat.type === 'numeric' 
        ? (stat.mean?.toFixed(2) || 'N/A')
        : (stat.mode?.toString().substring(0, 10) || 'N/A')
    ];

    rowData.forEach((data, i) => {
      pdf.text(data, xPosition, yPosition);
      xPosition += colWidths[i];
    });
    yPosition += 5;
  });

  // Correlation Matrix (if available)
  if (data.numericColumns.length >= 2) {
    yPosition += 15;
    if (yPosition > pageHeight - 50) {
      pdf.addPage();
      yPosition = 20;
    }

    pdf.setFontSize(16);
    pdf.setFont('helvetica', 'bold');
    pdf.text('Correlation Matrix', 20, yPosition);
    yPosition += 10;

    pdf.setFontSize(8);
    pdf.setFont('helvetica', 'normal');

    const numCols = Math.min(data.numericColumns.length, 6);
    const corrColWidth = 25;
    
    // Headers
    xPosition = 45;
    pdf.setFont('helvetica', 'bold');
    data.numericColumns.slice(0, numCols).forEach(col => {
      const shortCol = col.length > 8 ? col.substring(0, 8) + '..' : col;
      pdf.text(shortCol, xPosition, yPosition);
      xPosition += corrColWidth;
    });
    yPosition += 6;

    // Matrix data
    pdf.setFont('helvetica', 'normal');
    data.numericColumns.slice(0, numCols).forEach(col1 => {
      if (yPosition > pageHeight - 20) {
        pdf.addPage();
        yPosition = 20;
      }

      const shortCol1 = col1.length > 12 ? col1.substring(0, 12) + '..' : col1;
      pdf.text(shortCol1, 20, yPosition);
      
      xPosition = 45;
      data.numericColumns.slice(0, numCols).forEach(col2 => {
        const corr = data.correlations[col1]?.[col2] || 0;
        pdf.text(corr.toFixed(2), xPosition, yPosition);
        xPosition += corrColWidth;
      });
      yPosition += 5;
    });
  }

  // Footer
  const totalPages = pdf.internal.pages.length - 1;
  for (let i = 1; i <= totalPages; i++) {
    pdf.setPage(i);
    pdf.setFontSize(8);
    pdf.setFont('helvetica', 'normal');
    pdf.text(`Created by Faisal Hayat | Hayat Interactive EDA Dashboard | Page ${i} of ${totalPages}`, 
      pageWidth / 2, pageHeight - 10, { align: 'center' });
  }

  // Save the PDF
  pdf.save(`hayat-eda-report-${new Date().toISOString().split('T')[0]}.pdf`);
};