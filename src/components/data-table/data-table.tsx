import type { YearData } from '../../types';
import { formatNumber } from '../../utils/format-utils';
import { useMemo, memo } from 'react';

import styles from './data-table.module.css';

type DataTableProps = {
  data: YearData[];
  year: number;
  columns: string[];
};

export const DataTable = memo(({ data, year, columns }: DataTableProps) => {
  const record = useMemo(() => {
    return data.find((dataItem) => dataItem.year === year);
  }, [data, year]);

  const tableRows = useMemo(() => {
    if (!record) {
      return [];
    }

    return columns.map((column) => {
      const label = column.replace(/_/g, ' ').toUpperCase();
      const value = formatNumber(record[column as keyof YearData] as number | undefined, {
        maximumFractionDigits: 2,
      });

      return {
        column,
        label,
        value,
      };
    });
  }, [columns, record]);

  if (!record) {
    return <div className={styles.noData}>No data available for year {year}</div>;
  }

  return (
    <table className={styles.table}>
      <tbody>
        {tableRows.map(({ column, label, value }) => (
          <tr key={column} className={styles.row}>
            <td className={styles.labelCell}>{label}</td>
            <td className={styles.valueCell}>{value}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
});

DataTable.displayName = 'DataTable';
