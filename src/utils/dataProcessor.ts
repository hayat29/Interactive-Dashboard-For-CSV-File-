import { DataRow, ColumnStats, CorrelationData, ProcessedData } from '../types';

export const processCSVData = (data: any[]): ProcessedData => {
  if (!data.length) {
    return {
      rows: [],
      columns: [],
      numericColumns: [],
      categoricalColumns: [],
      stats: [],
      correlations: {}
    };
  }

  const columns = Object.keys(data[0]);
  const rows: DataRow[] = data.map(row => {
    const processedRow: DataRow = {};
    columns.forEach(col => {
      const value = row[col];
      if (value === '' || value === null || value === undefined) {
        processedRow[col] = null;
      } else if (!isNaN(Number(value)) && value !== '') {
        processedRow[col] = Number(value);
      } else {
        processedRow[col] = String(value);
      }
    });
    return processedRow;
  });

  const numericColumns: string[] = [];
  const categoricalColumns: string[] = [];

  // Determine column types
  columns.forEach(col => {
    const values = rows.map(row => row[col]).filter(val => val !== null);
    const numericValues = values.filter(val => typeof val === 'number');
    
    if (numericValues.length > values.length * 0.8) {
      numericColumns.push(col);
    } else {
      categoricalColumns.push(col);
    }
  });

  // Calculate statistics
  const stats: ColumnStats[] = columns.map(col => {
    const values = rows.map(row => row[col]);
    const nonNullValues = values.filter(val => val !== null);
    const uniqueValues = [...new Set(nonNullValues)];
    
    const baseStats: ColumnStats = {
      name: col,
      type: numericColumns.includes(col) ? 'numeric' : 'categorical',
      count: nonNullValues.length,
      nullCount: values.length - nonNullValues.length,
      uniqueCount: uniqueValues.length,
    };

    if (numericColumns.includes(col)) {
      const numValues = nonNullValues as number[];
      if (numValues.length > 0) {
        const sorted = [...numValues].sort((a, b) => a - b);
        const sum = numValues.reduce((acc, val) => acc + val, 0);
        const mean = sum / numValues.length;
        
        baseStats.mean = mean;
        baseStats.median = sorted[Math.floor(sorted.length / 2)];
        baseStats.min = Math.min(...numValues);
        baseStats.max = Math.max(...numValues);
        baseStats.std = Math.sqrt(
          numValues.reduce((acc, val) => acc + Math.pow(val - mean, 2), 0) / numValues.length
        );
      }
    } else {
      // Find mode for categorical data
      const frequency: { [key: string]: number } = {};
      nonNullValues.forEach(val => {
        const key = String(val);
        frequency[key] = (frequency[key] || 0) + 1;
      });
      
      let maxCount = 0;
      let mode = '';
      Object.entries(frequency).forEach(([value, count]) => {
        if (count > maxCount) {
          maxCount = count;
          mode = value;
        }
      });
      
      baseStats.mode = mode;
    }

    return baseStats;
  });

  // Calculate correlations for numeric columns
  const correlations: CorrelationData = {};
  numericColumns.forEach(col1 => {
    correlations[col1] = {};
    numericColumns.forEach(col2 => {
      if (col1 === col2) {
        correlations[col1][col2] = 1;
      } else {
        const values1 = rows.map(row => row[col1]).filter(val => val !== null) as number[];
        const values2 = rows.map(row => row[col2]).filter(val => val !== null) as number[];
        
        if (values1.length > 0 && values2.length > 0) {
          correlations[col1][col2] = calculateCorrelation(values1, values2);
        } else {
          correlations[col1][col2] = 0;
        }
      }
    });
  });

  return {
    rows,
    columns,
    numericColumns,
    categoricalColumns,
    stats,
    correlations
  };
};

const calculateCorrelation = (x: number[], y: number[]): number => {
  const n = Math.min(x.length, y.length);
  if (n < 2) return 0;

  const xSlice = x.slice(0, n);
  const ySlice = y.slice(0, n);

  const xMean = xSlice.reduce((a, b) => a + b, 0) / n;
  const yMean = ySlice.reduce((a, b) => a + b, 0) / n;

  let numerator = 0;
  let xVariance = 0;
  let yVariance = 0;

  for (let i = 0; i < n; i++) {
    const xDiff = xSlice[i] - xMean;
    const yDiff = ySlice[i] - yMean;
    
    numerator += xDiff * yDiff;
    xVariance += xDiff * xDiff;
    yVariance += yDiff * yDiff;
  }

  const denominator = Math.sqrt(xVariance * yVariance);
  return denominator === 0 ? 0 : numerator / denominator;
};