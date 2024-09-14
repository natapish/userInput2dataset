# FlexiFormat 🚀

FlexiFormat is a Next.js-based web application that allows users to easily transform and format data. It provides an intuitive interface for inputting, visualizing, and exporting data in various formats.

## ✨ Features

- 📊 Dynamic column and row creation
- 🧠 Data type inference
- 📁 CSV export functionality
- 📈 Real-time data visualization
- 📱 Responsive design with animated UI elements
- 🤖 RAG-powered intelligent data entry assistance

## 🚀 Getting Started

### Prerequisites

- Node.js (version 14 or later)
- npm or yarn

### Installation

1. Clone the repository:

   ```
   git clone https://github.com/your-username/flexiformat.git
   cd flexiformat
   ```

2. Install dependencies:

   ```
   npm install
   ```

   or

   ```
   yarn install
   ```

3. Run the development server:

   ```
   npm run dev
   ```

   or

   ```
   yarn dev
   ```

4. Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## 🏗️ Project Structure

- `app/`: Contains the main application pages and API routes
- `components/`: Reusable React components
- `lib/`: Utility functions
- `public/`: Static assets

## 🔑 Key Components

### Convert Page

The main data conversion interface is located in `app/convert/page.js`. This component handles:

- Column and row management
- Data type inference
- CSV export
- Data visualization

### Homepage

The landing page component is in `components/homepage.jsx`.

## 🤖 RAG-Powered Intelligent Data Entry

FlexiFormat incorporates a Retrieval-Augmented Generation (RAG) system to enhance the user experience when entering data. This feature helps users fill in values more efficiently and consistently. For example:

- If a user adds a column titled "Age", the system will infer and suggest the unit "yrs old" for entries.
- When a column for "Height" is created, the system will intelligently suggest formats like "feet and inches".

This RAG system is trained on a diverse dataset of common data entry patterns and can adapt to various domains, making data input more intuitive and reducing errors.

### How it works

1. 🔍 As users create new columns, the RAG system analyzes the column names and context.
2. 💡 Based on this analysis, it suggests appropriate formats or units for the data.
3. ⚡ As users enter values, the system provides real-time suggestions and auto-completions.
4. 📚 The system learns from user interactions, continuously improving its suggestions over time.

This feature not only speeds up data entry but also helps maintain consistency across large datasets.

## 🎨 Styling

The project uses Tailwind CSS for styling. Global styles are defined in `app/globals.css`.

## 🛠️ API Routes

Data processing is handled by the API route in `pages/api/data.js`.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is licensed under the MIT License.
