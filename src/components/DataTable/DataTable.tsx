import React, { useEffect, useState } from "react";
import { useTable } from "react-table";
import "./DataTable_styles.css";

interface DataTableProps {
  currencyId: string;
}

interface HistoricData {
  date: string;
  high: string;
  low: string;
}

interface DailyTrendData {
  date: string;
  open: number;
  close: number;
  difference: string;
}

const fetchHistoricData = async (currencyId: string) => {
  const response = await fetch(
    `http://67.205.189.142:8000/historic-data/${currencyId}`
  );
  const data = await response.json();
  return data;
};

const formatDate = (dateStr: string) => {
  const date = new Date(dateStr);
  return date
    .toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "2-digit",
    })
    .replace(/\s+/g, "-");
};

const DataTable: React.FC<DataTableProps> = ({ currencyId }) => {
  const [historicData, setHistoricData] = useState<any[]>([]);
  const [dailyTrendData, setDailyTrendData] = useState<any[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const data = await fetchHistoricData(currencyId);
      const timeSeries = data["Time Series FX (Daily)"];

      const historicData: HistoricData[] = [];
      const dailyTrendData: DailyTrendData[] = [];

      for (const date in timeSeries) {
        const dailyData = timeSeries[date];

        const formattedDate = formatDate(date); // Aplicar formatDate a la fecha

        historicData.push({
          date: formattedDate,
          high: dailyData["2. high"],
          low: dailyData["3. low"],
        });

        const open = parseFloat(dailyData["1. open"]);
        const close = parseFloat(dailyData["4. close"]);

        dailyTrendData.push({
          date: formattedDate,
          open,
          close,
          difference: (close - open).toFixed(4),
        });
      }

      setHistoricData(historicData);
      setDailyTrendData(dailyTrendData);
    };

    fetchData();
  }, [currencyId]);

  // Tabla 1 - Precios históricos
  const historicColumns = React.useMemo(
    () => [
      {
        Header: "Date",
        accessor: "date",
      },
      {
        Header: "High",
        accessor: "high",
      },
      {
        Header: "Low",
        accessor: "low",
      },
    ],
    []
  );

  // Tabla 2 - Tendencia diaria
  const dailyTrendColumns = React.useMemo(
    () => [
      {
        Header: "Date",
        accessor: "date",
      },
      {
        Header: "Open",
        accessor: "open",
      },
      {
        Header: "Close",
        accessor: "close",
      },
      {
        Header: "Difference",
        accessor: "difference",
        Cell: ({ value }: { value: string }) => (
          <span style={{ color: parseFloat(value) >= 0 ? "green" : "red" }}>
            {value}
          </span>
        ),
      },
    ],
    []
  );

  const renderTable = (columns: any, data: any, title: string) => {
    const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } =
      useTable({ columns, data });

    return (
      <div className="table-wrapper">
        <h2>{title}</h2>
        <table {...getTableProps()} className="table-header">
          <thead>
            {headerGroups.map((headerGroup) => (
              <tr {...headerGroup.getHeaderGroupProps()}>
                {headerGroup.headers.map((column) => (
                  <th
                    {...column.getHeaderProps()}
                    className={`${column.id} th`}
                  >
                    {column.render("Header")}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
        </table>
        <div className="table-body">
          <table {...getTableProps()} className="table-inner">
            <tbody {...getTableBodyProps()}>
              {rows.map((row) => {
                prepareRow(row);
                return (
                  <tr {...row.getRowProps()}>
                    {row.cells.map((cell) => {
                      return (
                        <td
                          {...cell.getCellProps()}
                          className={cell.column.id} // Agregado para agregar clases en base al id de la columna
                          style={{
                            padding: "10px",
                            border: "solid 1px gray",
                            background: "black",
                            color: "white",
                          }}
                        >
                          {cell.render("Cell")}
                        </td>
                      );
                    })}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    );
  };

  return (
    <div className="table-container">
      {renderTable(historicColumns, historicData, "Historic Prices")}
      {renderTable(dailyTrendColumns, dailyTrendData, "Daily Trend")}
    </div>
  );
};

export default DataTable;
