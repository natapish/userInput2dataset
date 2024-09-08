'use client';
import React, { useState, useMemo } from 'react';
import { TextField, Button, Grid, Typography } from '@mui/material';
import { useTable } from 'react-table';

export default function Home() {
    const [columns, setColumns] = useState(['']); //column
    const [dataTypes, setDataTypes] = useState(['']); //data type
    const [dataValues, setDataValues] = useState([[]]); //(array of rows)
    const [responseMessage, setResponseMessage] = useState('');
    const [tableData, setTableData] = useState([]); // user input transformed to data for dataset conversion 

    const handleColumnChange = (index, value) => {
        const newColumns = [...columns];
        newColumns[index] = value;
        setColumns(newColumns);
    };

    const handleDataTypeChange = (index, value) => {
        const newDataTypes = [...dataTypes];
        newDataTypes[index] = value;
        setDataTypes(newDataTypes);
    };

    const handleDataValueChange = (rowIndex, colIndex, value) => {
        const newDataValues = [...dataValues];
        if (!newDataValues[rowIndex]) {
            newDataValues[rowIndex] = [];
        }
        newDataValues[rowIndex][colIndex] = value;
        setDataValues(newDataValues);
    };

    const sendTableData = async () => {
        // Prepare data to be sent
        const tableData = {
            columns,
            dataTypes,
            rows: dataValues,
        };

        try {
            const response = await fetch('/api/data', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(tableData),
            });

            const result = await response.json();
            if (response.ok) {
                setResponseMessage(result.message);
                // Result.data contains the processed rows and set transformed data for visualization
                setTableData(result.data || []);
            } else {
                setResponseMessage(result.error || 'An error occurred');
            }
        } catch (error) {
            setResponseMessage('An error occurred');
            console.error('Error sending data:', error);
        }
    };

    // React-table- transform input to data table (visualize)
    const columnsForTable = useMemo(() => {
        return columns
            .filter(col => col)
            .map(col => ({
                Header: col,
                accessor: col,
            }));
    }, [columns]);

    const transformedData = useMemo(() => {
        return dataValues.map(row =>
            row.reduce((acc, value, colIndex) => {
                acc[columns[colIndex]] = value;
                return acc;
            }, {})
        );
    }, [dataValues, columns]);

    const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } = useTable({
        columns: columnsForTable,
        data: transformedData,
    });
      // Export table data to CSV
    const handleExportCSV = () => {
      const csvRows = [];

      csvRows.push(columns.join(','));

      dataValues.forEach(row => {
          const csvRow = row.join(',');
          csvRows.push(csvRow);
      });

      // Create a CSV Blob
      const csvString = csvRows.join('\n');
      const blob = new Blob([csvString], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);

      // Create a link and trigger the download
      const a = document.createElement('a');
      a.setAttribute('hidden', '');
      a.setAttribute('href', url);
      a.setAttribute('download', 'table_data.csv');
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
                <Button variant="contained" onClick={() => setColumns([...columns, ''])}>
                    Add Column
                </Button>
            </Grid>

            <Grid item xs={12}>
                <Typography variant="h6">Data Types</Typography>
                {dataTypes.map((type, index) => (
                    <TextField
                        key={index}
                        label={`Type for Column ${index + 1}`}
                        value={type}
                        onChange={(e) => handleDataTypeChange(index, e.target.value)}
                        fullWidth
                        margin="normal"
                    />
                ))}
                <Button variant="contained" onClick={() => setDataTypes([...dataTypes, ''])}>
                    Add Data Type
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
                                    value={row[colIndex] || ''}
                                    onChange={(e) => handleDataValueChange(rowIndex, colIndex, e.target.value)}
                                    fullWidth
                                    margin="normal"
                                />
                            </Grid>
                        ))}
                    </Grid>
                ))}
                <Button variant="contained" onClick={() => setDataValues([...dataValues, new Array(columns.length).fill('')])}>
                    Add Row
                </Button>
            </Grid>

            <Grid item xs={12}>
                <Button variant="contained" onClick={sendTableData}>
                    Send Information to Research Instituion
                </Button>
                <Button variant="contained" onClick={handleExportCSV} style={{ marginLeft: '16px' }}>
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
                <table {...getTableProps()} style={{ border: '1px solid black', width: '100%' }}>
                    <thead>
                        {headerGroups.map(headerGroup => (
                            <tr {...headerGroup.getHeaderGroupProps()}>
                                {headerGroup.headers.map(column => (
                                    <th {...column.getHeaderProps()} style={{ border: '1px solid black', padding: '8px' }}>
                                        {column.render('Header')}
                                    </th>
                                ))}
                            </tr>
                        ))}
                    </thead>
                    <tbody {...getTableBodyProps()}>
                        {rows.map(row => {
                            prepareRow(row);
                            return (
                                <tr {...row.getRowProps()}>
                                    {row.cells.map(cell => (
                                        <td {...cell.getCellProps()} style={{ border: '1px solid black', padding: '8px' }}>
                                            {cell.render('Cell')}
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
