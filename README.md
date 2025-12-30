<div align="center">

# ⚡ OptiCharge – Smart EV Charging Station Finder

An intelligent web application to find the optimal EV charging station and route

[Overview](#overview) •
[Features](#features) •
[Demo](#demo-workflow) •
[Technology Stack](#technology-stack) •
[Installation](#installation) •
[Usage](#usage) •
[Architecture](#architecture) •
[Algorithm](#algorithm-details) •
[Configuration](#configuration)

</div>

---


## 🌟 Overview

**OptiCharge** is a smart, interactive EV charging station finder. It helps electric vehicle users locate nearby charging stations and calculate the most efficient route based on:

- 📏 **Distance**
- 🚦 **Traffic conditions**
- 🔋 **Battery level**
- ⚡ **Energy consumption**
- 🏎️ **Charging station type** (Fast / Normal)

The application uses **Leaflet.js** for real-time mapping and **Dijkstra's Algorithm** to ensure optimal route selection.

---

## ✨ Features

### 🗺️ Interactive Map
- Powered by **OpenStreetMap** + **Leaflet.js**
- Click anywhere on the map to set your current location
- Custom icons for:
  - ⚡ Fast Charging Stations
  - 🔌 Normal Charging Stations
  - 📍 User Location
- Route visualization using **Leaflet Routing Machine**

### 🔋 Smart EV Logic
- **Battery capacity:** 60 kWh
- **Current charge:** 45 kWh
- **Energy consumption:** 0.2 kWh/km
- **Minimum safety reserve:** 10 kWh
- Automatically checks if the route is battery-feasible

### 🎯 Optimal Route Calculation
- Uses **Dijkstra's Algorithm**
- Edge weights depend on:
  - Haversine distance
  - Traffic multiplier (1.0 – 1.3)
  - Energy consumption
- Automatically selects the nearest available charging station

### 📊 Charging Station Information
Each station displays:
- Name & location
- Charging type (Fast / Normal)
- Charging rate (kW)
- Price per kWh (₹)
- Available ports
- Estimated charging time (80%)
- Approximate charging cost

### 🎨 Filters & UI
- Toggle **Fast** and **Normal** charging stations
- Dynamic station count
- Scrollable station list
- Click station card → center map & open popup
- Fully responsive (Desktop, Tablet & Mobile)

---

## 🎥 Demo Workflow

1. 🌐 Load the application
2. 📍 Click on the map to set your location
3. 🔍 Click **"Find Optimal Route"**
4. 📊 View the calculated route & statistics
5. 🚗 Navigate to the charging station ⚡

---

## 🛠️ Technology Stack

### Frontend
- **HTML5** – Page structure
- **CSS3** – Responsive UI, animations, gradients
- **JavaScript (ES6)** – Logic & algorithms

### Libraries

| Library | Purpose |
|---------|---------|
| Leaflet.js | Interactive maps |
| Leaflet Routing Machine | Route visualization |
| OpenStreetMap | Map tiles |
| OSRM API | Road routing |

---

## 💻 Installation

### Prerequisites
- Modern web browser
- No backend required ✅

### Steps

1. **Clone the repository**
```bash
git clone https://github.com/yourusername/opticharge.git
cd opticharge
```

2. **Project Structure**
```
opticharge/
│
├── index.html
├── styles.css
├── script.js
└── README.md
```

3. **Run the App**

**Option 1: Direct**
- Open `index.html` in your browser

**Option 2: Local Server (Recommended)**
```bash
python -m http.server 8000
# Open http://localhost:8000
```

---

## 📖 Usage

### Set Your Location
1. Click anywhere on the map
2. A 📍 marker appears
3. **"Find Optimal Route"** button becomes active

### Find Optimal Route
1. Click **Find Optimal Route**
2. App:
   - Finds nearest visible station
   - Checks battery feasibility
   - Runs Dijkstra's algorithm
   - Draws route on the map
   - Displays route stats

### Reset
- Click **Reset Map**
- Clears route & user marker
- Returns map to Hubli center

---

## 🏗️ Architecture

```
┌──────────────────────────────┐
│        User Interface        │
│ (HTML + CSS + Leaflet Map)   │
└───────────────┬──────────────┘
                │
     ┌──────────┴──────────┐
     │                     │
┌─────────────┐     ┌──────────────┐
│ Map Module  │     │ Graph Module │
│ (Leaflet)   │     │ (Dijkstra)   │
└─────┬───────┘     └──────┬───────┘
      │                    │
      └──────── Data Layer ─┘
         (Charging Stations)
```

---

## 🧮 Algorithm Details

### Dijkstra's Algorithm

**Goal:**  
Find the shortest and battery-safe route from the user location to a charging station.

**Constraints:**
- Energy consumption = distance × 0.2
- Minimum battery reserve = 10 kWh
- Charging stations recharge vehicle to 80% capacity

**Time Complexity:**  
`O((V + E) log V)`

### Distance Calculation

Uses **Haversine Formula:**

```
d = 2R × atan2(√a, √(1−a))
```

Where `R = 6371 km`

---

## ⚙️ Configuration

### Vehicle Parameters (`script.js`)
```javascript
const batteryCapacity = 60;
const currentBattery = 45;
const energyPerKm = 0.2;
const minBatteryThreshold = 10;
```

### Add a Charging Station
```javascript
{
  id: 15,
  name: "New Station",
  location: "Hubli",
  latlng: [15.xx, 75.xx],
  rate: 150,
  price: 12,
  ports: 6,
  type: "fast"
}
```

---
<div align="center">
Made with ⚡ for a sustainable future
</div>
