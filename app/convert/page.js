"use client";

import { Button } from "@/components/ui/button";
import { UserAvatar } from "@/components/UserAvatar";
import { motion } from "framer-motion";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { useTable } from "react-table";

export default function Convert() {
  const [columns, setColumns] = useState([""]);
  const [dataValues, setDataValues] = useState([[]]);
  const [responseMessage, setResponseMessage] = useState("");
  const [tableData, setTableData] = useState([]);
  const router = useRouter();

  const handleSignOut = () => {
    router.push("/");
  };

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

  // Add these functions after the existing state declarations

  const deleteColumn = (index) => {
    const newColumns = columns.filter((_, i) => i !== index);
    setColumns(newColumns);

    const newDataValues = dataValues.map((row) =>
      row.filter((_, i) => i !== index)
    );
    setDataValues(newDataValues);
  };

  const deleteRow = (index) => {
    const newDataValues = dataValues.filter((_, i) => i !== index);
    setDataValues(newDataValues);
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white overflow-hidden font-sans">
      <nav className="absolute top-0 left-0 right-0 z-50 flex justify-between items-center p-6 bg-transparent">
        <div className="text-xl font-semibold text-gray-300 hover:text-white transition-colors duration-300">
          <Link
            href="/home"
            className="text-gray-300 hover:text-white transition-colors duration-300"
          >
            FlexiFormat
          </Link>
        </div>
        <UserAvatar />
      </nav>
      <main className="relative z-10 pt-20 px-6">
        <h1 className="text-4xl font-bold mb-8 text-center">Data Conversion</h1>
      </main>
      <motion.div
        className="fixed w-[40vw] h-[40vw] bg-purple-500 rounded-full filter blur-3xl opacity-10 top-0 left-0 z-0"
        animate={{
          x: [0, 100, 0],
          y: [0, 100, 0],
        }}
        transition={{ repeat: Infinity, duration: 20, ease: "linear" }}
      />
      <motion.div
        className="fixed w-[40vw] h-[40vw] bg-blue-500 rounded-full filter blur-3xl opacity-10 bottom-0 right-0 z-0"
        animate={{
          x: [0, -100, 0],
          y: [0, -100, 0],
        }}
        transition={{ repeat: Infinity, duration: 25, ease: "linear" }}
      />
      <div className="relative z-10 container mx-auto px-4 py-12 pt-24">
        <motion.h1
          className="text-5xl font-bold mb-8 text-center bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-blue-500"
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          Data Conversion
        </motion.h1>

        <motion.div
          className="bg-gray-800 rounded-lg p-6 mb-8 shadow-lg"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <h2 className="text-2xl font-semibold mb-4">Columns</h2>
          {columns.map((col, index) => (
            <div key={index} className="flex items-center mb-2">
              <input
                className="bg-gray-700 text-white rounded px-3 py-2 w-full mr-2"
                placeholder={`Column ${index + 1}`}
                value={col}
                onChange={(e) => handleColumnChange(index, e.target.value)}
              />
              <Button
                onClick={() => deleteColumn(index)}
                className="bg-gradient-to-r from-purple-500 to-blue-500 hover:from-red-600 text-white rounded-full w-7 h-7 flex items-center justify-center align-middle focus:outline-none"
                size="sm"
              >
                X
              </Button>
            </div>
          ))}
          <Button
            onClick={() => setColumns([...columns, ""])}
            className="mt-2 bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600"
          >
            Add Column
          </Button>
        </motion.div>

        <motion.div
          className="bg-gray-800 rounded-lg p-6 mb-8 shadow-lg"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <h2 className="text-2xl font-semibold mb-4">Data Values</h2>
          {dataValues.map((row, rowIndex) => (
            <div key={rowIndex} className="mb-4">
              {columns.map((col, colIndex) => (
                <input
                  key={colIndex}
                  className="bg-gray-700 text-white rounded px-3 py-2 mb-2 w-full"
                  placeholder={`Value for ${col}`}
                  value={row[colIndex] || ""}
                  onChange={(e) =>
                    handleDataValueChange(rowIndex, colIndex, e.target.value)
                  }
                />
              ))}
              <Button
                onClick={() => deleteRow(rowIndex)}
                className="bg-red-500 hover:bg-red-600 mt-2"
                size="sm"
              >
                Delete Row
              </Button>
            </div>
          ))}
          <Button
            onClick={addRow}
            className="mt-2 bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600"
          >
            Add Row
          </Button>
        </motion.div>

        <div className="flex justify-center space-x-4">
          <Button
            onClick={sendTableData}
            className="bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600"
          >
            Send Information
          </Button>
          <Button
            onClick={handleExportCSV}
            className="bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600"
          >
            Export CSV
          </Button>
        </div>

        {responseMessage && (
          <motion.div
            className="mt-8 p-4 bg-gray-800 rounded-lg"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-2xl font-semibold mb-2">Response</h2>
            <p>{responseMessage}</p>
          </motion.div>
        )}

        <motion.div
          className="mt-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <h2 className="text-2xl font-semibold mb-4">
            Table Data Visualization
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full bg-gray-800 rounded-lg overflow-hidden">
              <thead>
                {headerGroups.map((headerGroup, i) => (
                  <tr
                    {...headerGroup.getHeaderGroupProps()}
                    key={`header-group-${i}`}
                  >
                    {headerGroup.headers.map((column, j) => (
                      <th
                        {...column.getHeaderProps()}
                        className="px-4 py-2 text-left text-gray-300 border-b border-gray-700"
                        key={`header-${i}-${j}`}
                      >
                        {column.render("Header")}
                      </th>
                    ))}
                  </tr>
                ))}
              </thead>
              <tbody {...getTableBodyProps()}>
                {rows.map((row, i) => {
                  prepareRow(row);
                  return (
                    <tr {...row.getRowProps()} key={`row-${i}`}>
                      {row.cells.map((cell, j) => (
                        <td
                          {...cell.getCellProps()}
                          className="px-4 py-2 border-b border-gray-700"
                          key={`cell-${i}-${j}`}
                        >
                          {cell.render("Cell")}
                        </td>
                      ))}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
