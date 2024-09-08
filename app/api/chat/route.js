const express = require('express');
const router = express.Router();

export async function POST(request) {
    try {
        // Parse the request body
        const body = await request.json();
        const tableData = body;

        // Validation
        if (!tableData || !tableData.columns || !tableData.dataTypes || !tableData.rows) {
            return new Response(JSON.stringify({ error: "Invalid table data" }), { status: 400 });
        }

        console.log("Received table data:", tableData);

        return new Response(JSON.stringify({ message: "Data received successfully" }), { status: 200 });
    } catch (error) {

        return new Response(JSON.stringify({ error: "An error occurred" }), { status: 500 });
    }
}
