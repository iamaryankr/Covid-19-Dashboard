## 🚀 Features

- **Global Summary**:  
  - Total Cases  
  - Active Cases  
  - Recovered  
  - Deaths  
  - Vaccinated  

- **Top 5 Pie Chart**:  
  - Visualize each of the five worst‑hit countries’ share of total cases  

- **Country List**:  
  - Searchable & filterable by name  
  - Sorted by total cases  
  - Top 5 countries highlighted  

- **Country Detail View**:  
  - Top‑line stats cards (Total, Active, Recovered, Deaths, Vaccinated)  
  - Toggle between Chart and Table views  
  - Cumulative Line Chart (cases, recoveries, deaths)  
  - Daily New Cases Bar Chart  

- **Dark Mode**:  
  - Defaults to dark  
  - Toggleable via button  
  - Preference persists in `localStorage`  

- **Auto‑Refresh**:  
  - Manual “Refresh” button  
  - Auto‑poll every 5 minutes  

- **API‑Source Switcher**:  
  - Local JSON backend  
  - [disease.sh](https://disease.sh) public API  


## ⚙️ Setup Instructions

## 1. Clone the repository

```bash
git clone https://github.com/<your‑username>/covid-dashboard.git
cd covid-dashboard

## 2. Backend (Express + sample data)

cd backend
npm install
npm run dev
-API available at http://localhost:5000/api


## 2. Frontend (React + Tailwind + Recharts)

cd ../frontend
npm install
npm start


## 📸 Screenshots

### 🌍 Dashboard Home

![Home Page](./frontend/public/screenshots/home.png)

### 📋 Country List + Search

![Country List](./frontend/public/screenshots/country-list.png)

### 📈 Detail View – Charts

![Charts View](./frontend/public/screenshots/chart-view.png)

### 🧾 Detail View – Table

![Table View](./frontend/public/screenshots/table-view.png)

### 🧾 Detail View – Pie Chart of top 5 

![Table View](./frontend/public/screenshots/pie-chart.png)


