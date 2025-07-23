export interface DataRow {
  [key: string]: string | number;
}

export interface ColumnStats {
  name: string;
  type: 'numeric' | 'categorical';
  count: number;
  nullCount: number;
  uniqueCount: number;
  mean?: number;
  median?: number;
  std?: number;
  min?: number;
  max?: number;
  mode?: string | number;
}

export interface CorrelationData {
  [key: string]: {
    [key: string]: number;
  };
}

export interface ProcessedData {
  rows: DataRow[];
  columns: string[];
  numericColumns: string[];
  categoricalColumns: string[];
  stats: ColumnStats[];
  correlations: CorrelationData;
}