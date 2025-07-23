# 📊 Interactive EDA Dashboard for CSV Files

Welcome to the **Interactive EDA Dashboard**, a modern, intuitive web application that enables users to upload CSV datasets and instantly explore their data through comprehensive Exploratory Data Analysis (EDA). Designed for analysts, data scientists, and students, this lightweight tool transforms raw data into insightful visualizations with ease and elegance.

---

## 🔥 Live Demo

👉 [Open the Dashboard](https://tangerine-syrniki-c124bc.netlify.app)

You can claim and transfer this project to your own Netlify account using this link:
[Claim Netlify Site](https://app.netlify.com/claim?utm_source=bolt#eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJjbGllbnRfaWQiOiI1aDZmZEstVktNTXZuRjNiRlZUaktfU2JKVGgzNlNfMjJheTlpTHhVX0Q4Iiwic2Vzc2lvbl9pZCI6IjUzMTUzOTcyOjYyODg5MDgiLCJpYXQiOjE3NTMzMDAxNzd9.IyAF7EnOgZHTpJDNPmPXspfk7qkQ3nEIaSvuuQf4FYQ)

---

## 🚀 Features

* 📂 **CSV Upload** – Drag-and-drop or browse to upload your CSV files.
* 👀 **Data Preview** – View tabular previews with pagination and column sorting.
* 📊 **Summary Statistics** – Get instant stats: mean, median, nulls, unique values.
* 🔥 **Correlation Heatmap** – Interactive heatmap for numeric variable correlations.
* 📈 **Distribution Plots** – Visualize distributions of numerical columns via histograms.
* 📥 **Download Insights** – Export summary statistics, correlation matrix, and full PDF reports.
* 🌐 **Responsive UI** – Clean, adaptive design for desktop and mobile.
* ⚡ **Real-time Processing** – Fast rendering and interactivity powered by Vite + React.

---

## 🎨 UI/UX Design

* 💎 **Color Theme**: Professional Blue (#3B82F6) and Emerald Green (#10B981)
* 📐 **Layout**: Card-based layout with soft shadows and rounded corners
* 🎭 **Animations**: Smooth transitions and hover interactions
* 📱 **Responsive**: Fully optimized for all devices

---

## 📁 Project Structure

```
├── public/
├── src/
│   ├── components/
│   │   ├── FileUpload.tsx
│   │   ├── DataPreview.tsx
│   │   ├── SummaryStats.tsx
│   │   ├── CorrelationHeatmap.tsx
│   │   ├── DistributionPlots.tsx
│   │   ├── DownloadButton.tsx
│   ├── utils/
│   │   ├── dataProcessor.ts
│   │   ├── downloadUtils.ts
│   ├── types/
│   │   └── index.ts
│   ├── App.tsx
│   └── index.css
├── package.json
├── vite.config.ts
└── index.html
```

---

## 🛠️ Tech Stack

* **Frontend**: React + TypeScript + Vite
* **Data Parsing**: PapaParse
* **Charts & Visualizations**: Chart.js, Recharts
* **PDF & File Exports**: jsPDF, html2canvas, FileSaver.js

---

## 🧪 Installation & Running Locally

```bash
# Clone the repository
git clone https://github.com/your-username/eda-dashboard.git
cd eda-dashboard

# Install dependencies
npm install

# Run the development server
npm run dev

# Build for production
npx vite build
```

---

## 📤 Deployment

This app is fully deployable on Netlify. To deploy:

1. Run `npx vite build`
2. Drag the `/dist` folder to Netlify, or use the Netlify CLI:

```bash
netlify deploy --prod
```

---

## 📌 Customization Tips

* **Change Branding**: Update title and metadata in `index.html` and `App.tsx`
* **Modify Color Scheme**: Edit `index.css` or use Tailwind/custom CSS
* **Add More Plots**: Extend `DistributionPlots.tsx` with additional chart types (e.g., box plots, KDE)
* **Enhance Export**: Use `reportlab` (if integrating a backend) for complex PDF formats

---

## ✍️ Author

**Faisal Hayat**
📧 Email: Faishal8960@gmail.com
---

## ❤️ Acknowledgements

Thanks to the open-source tools and libraries that made this dashboard possible:

* [React](https://reactjs.org)
* [Vite](https://vitejs.dev)
* [Chart.js](https://www.chartjs.org/)
* [PapaParse](https://www.papaparse.com/)
* [jsPDF](https://github.com/parallax/jsPDF)
* [Netlify](https://www.netlify.com)

---

## 🙌 Contributing

Pull requests are welcome! For major changes, please open an issue first to discuss what you would like to change.
