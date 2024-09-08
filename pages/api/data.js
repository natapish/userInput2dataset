export default async function handler(req, res) {
    if (req.method === 'POST') {
        try {
            const { columns, dataTypes, rows } = req.body;

            // Transform data into dataset format
            const transformedData = rows.map(row => {
                const rowData = {};
                columns.forEach((col, index) => {
                    rowData[col] = row[index];
                });
                return rowData;
            });

            console.log("Transformed Data:", transformedData)

            res.status(200).json({ message: 'Table data received successfully!' });
        } catch (error) {
            res.status(500).json({ message: 'An error occurred while processing the data.' });
        }
    } else {
        res.setHeader('Allow', ['POST']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}
