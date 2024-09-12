"use client";
import { Button, Grid, TextField, Typography } from "@mui/material";
import { useEffect, useMemo, useState } from "react";
import { useTable } from "react-table";

export default function Home() {
  const [columns, setColumns] = useState([""]); // Columns
  const [dataValues, setDataValues] = useState([[]]); // Array of rows
  const [responseMessage, setResponseMessage] = useState("");
  const [tableData, setTableData] = useState([]); // User input transformed to data for dataset conversion

  // Function to infer data types for each data value
  const inferDataTypes = (dataValues) => {
    if (dataValues.length === 0 || dataValues[0].length === 0) return [];

    // Create a 2D array for storing the inferred data types
    const inferredTypes = dataValues.map((row) =>
      row.map((value) => {
        if (value === null || value === undefined || value === "")
          return "string";
        if (!isNaN(value)) return value.includes(".") ? "float" : "integer";
        if (!isNaN(Date.parse(value))) return "date";
        if (value === "true" || value === "false") return "boolean";
        return "string";
      })
    );

    return inferredTypes;
  };

  // Handle changes in the column values and data values

  const handleColumnChange = (index, value) => {
    const newColumns = [...columns];
    newColumns[index] = value;
    setColumns(newColumns);
  };

  const handleDataValueChange = (rowIndex, colIndex, value) => {
    const newDataValues = [...dataValues];
    if (!newDataValues[rowIndex]) {
      newDataValues[rowIndex] = [];
    }
    // Infer data types based on data values
    newDataValues[rowIndex][colIndex] = value;
    setDataValues(newDataValues);
    const inferredTypes = inferDataTypes(newDataValues);
    console.log("Inferred Data Types:", inferredTypes);
  };

  // Add a new row for dataValues
  const addRow = () => {
    const newDataValues = [...dataValues];
    const newRow = new Array(columns.length).fill("");
    newDataValues.push(newRow);
    setDataValues(newDataValues);
  };

  // Automatically infer data types internally based on data values
  useEffect(() => {
    const inferredTypes = inferDataTypes(dataValues);
    console.log("Inferred Data Types:", inferredTypes);
  }, [dataValues]);

  // Sent data structure
  const sendTableData = async () => {
    const tableData = {
      columns,
      rows: dataValues,
    };

    try {
      const response = await fetch("/api/data", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(tableData),
      });

      const result = await response.json();
      if (response.ok) {
        setResponseMessage(result.message);
        // result.data contains the processed rows and set transformed data for visualization
        setTableData(result.data || []);
      } else {
        setResponseMessage(result.error || "An error occurred");
      }
    } catch (error) {
      setResponseMessage("An error occurred");
      console.error("Error sending data:", error);
    }
  };

  // React-table: transform input to data table (visualize)
  const columnsForTable = useMemo(() => {
    return columns
      .filter((col) => col)
      .map((col) => ({
        Header: col,
        accessor: col,
      }));
  }, [columns]);

  const transformedData = useMemo(() => {
    return dataValues.map((row) =>
      row.reduce((acc, value, colIndex) => {
        acc[columns[colIndex]] = value;
        return acc;
      }, {})
    );
  }, [dataValues, columns]);

  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } =
    useTable({
      columns: columnsForTable,
      data: transformedData,
    });

  // Export table data to CSV
  const handleExportCSV = () => {
    const csvRows = [];

    csvRows.push(columns.join(","));

    dataValues.forEach((row) => {
      const csvRow = row.join(",");
      csvRows.push(csvRow);
    });

    const csvString = csvRows.join("\n");
    const blob = new Blob([csvString], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);

    // Create a link and trigger the download
    const a = document.createElement("a");
    a.setAttribute("hidden", "");
    a.setAttribute("href", url);
    a.setAttribute("download", "table_data.csv");
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <Grid container spacing={3} padding={2}>
      <Grid item xs={12}>
        <Typography variant="h4">Table Data Input</Typography>
      </Grid>

      <Grid item xs={12}>
        <Typography variant="h6">Columns</Typography>
        {columns.map((col, index) => (
          <TextField
            key={index}
            label={`Column ${index + 1}`}
            value={col}
            onChange={(e) => handleColumnChange(index, e.target.value)}
            fullWidth
            margin="normal"
          />
        ))}
        <Button
          variant="contained"
          onClick={() => setColumns([...columns, ""])}
        >
          Add Column
        </Button>
      </Grid>

      <Grid item xs={12}>
        <Typography variant="h6">Data Values</Typography>
        {dataValues.map((row, rowIndex) => (
          <Grid container spacing={2} key={rowIndex}>
            {columns.map((col, colIndex) => (
              <Grid item xs={12} sm={6} md={4} key={colIndex}>
                <TextField
                  label={`Value for ${col}`}
                  value={row[colIndex] || ""}
                  onChange={(e) =>
                    handleDataValueChange(rowIndex, colIndex, e.target.value)
                  }
                  fullWidth
                  margin="normal"
                />
              </Grid>
            ))}
          </Grid>
        ))}
        <Button variant="contained" onClick={addRow}>
          Add Row
        </Button>
      </Grid>

      <Grid item xs={12}>
        <Button variant="contained" onClick={sendTableData}>
          Send Information to Research Institution
        </Button>
        <Button
          variant="contained"
          onClick={handleExportCSV}
          style={{ marginLeft: "16px" }}
        >
          Export CSV
        </Button>
      </Grid>

      {responseMessage && (
        <Grid item xs={12}>
          <Typography variant="h6">Response</Typography>
          <Typography>{responseMessage}</Typography>
        </Grid>
      )}

      {/* Display Table Data */}
      <Grid item xs={12}>
        <Typography variant="h6">Table Data Visualization</Typography>
        <table
          {...getTableProps()}
          style={{ border: "1px solid black", width: "100%" }}
        >
          <thead>
            {headerGroups.map((headerGroup) => (
              <tr {...headerGroup.getHeaderGroupProps()}>
                {headerGroup.headers.map((column) => (
                  <th
                    {...column.getHeaderProps()}
                    style={{ border: "1px solid black", padding: "8px" }}
                  >
                    {column.render("Header")}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody {...getTableBodyProps()}>
            {rows.map((row) => {
              prepareRow(row);
              return (
                <tr {...row.getRowProps()}>
                  {row.cells.map((cell) => (
                    <td
                      {...cell.getCellProps()}
                      style={{ border: "1px solid black", padding: "8px" }}
                    >
                      {cell.render("Cell")}
                    </td>
                  ))}
                </tr>
              );
            })}
          </tbody>
        </table>
      </Grid>
    </Grid>
  );
}
