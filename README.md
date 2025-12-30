# ⚡ OptiCharge - Smart EV Charging Station Finder

<div align="center">

![OptiCharge Banner](https://img.shields.io/badge/OptiCharge-EV%20Charging%20Solution-blue?style=for-the-badge&logo=electric-vehicle)

**An intelligent web application for finding optimal EV charging routes in Hubli, Karnataka**

[![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=flat&logo=html5&logoColor=white)](https://developer.mozilla.org/en-US/docs/Web/HTML)
[![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=flat&logo=css3&logoColor=white)](https://developer.mozilla.org/en-US/docs/Web/CSS)
[![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=flat&logo=javascript&logoColor=black)](https://developer.mozilla.org/en-US/docs/Web/JavaScript)
[![Leaflet](https://img.shields.io/badge/Leaflet-199900?style=flat&logo=leaflet&logoColor=white)](https://leafletjs.com/)

[Features](#-features) • [Demo](#-demo) • [Installation](#-installation) • [Usage](#-usage) • [Architecture](#-architecture) • [Contributing](#-contributing)

</div>

---

## 📋 Table of Contents

- [Overview](#-overview)
- [Features](#-features)
- [Demo](#-demo)
- [Technology Stack](#-technology-stack)
- [Installation](#-installation)
- [Usage](#-usage)
- [Project Architecture](#-architecture)
- [Algorithm Details](#-algorithm-details)
- [API Reference](#-api-reference)
- [Configuration](#-configuration)
- [Future Enhancements](#-future-enhancements)
- [Contributing](#-contributing)
- [License](#-license)
- [Contact](#-contact)

---

## 🌟 Overview

**OptiCharge** is a sophisticated web-based application designed to help electric vehicle (EV) owners in Hubli, Karnataka, locate the nearest and most efficient charging stations. Using advanced pathfinding algorithms and real-time mapping, OptiCharge calculates optimal routes while considering factors like battery capacity, charging speed, traffic conditions, and energy consumption.

### Why OptiCharge?

- **Smart Route Planning**: Dijkstra's algorithm ensures you reach the nearest charging station efficiently
- **Battery-Aware Navigation**: Considers your current battery level and vehicle range
- **Real-Time Visualization**: Interactive map with custom markers and route highlighting
- **Comprehensive Station Data**: Displays charging rates, prices, and port availability
- **User-Friendly Interface**: Modern, responsive design with intuitive controls

---

## ✨ Features

### 🗺️ Interactive Mapping
- **OpenStreetMap Integration**: High-quality, interactive map powered by Leaflet.js
- **Custom Markers**: Distinct icons for fast charging (⚡), normal charging (🔌), and user location (📍)
- **Click-to-Set Location**: Simply click anywhere on the map to set your starting point
- **Route Visualization**: Clear, highlighted paths from your location to the optimal charging station

### 🔋 Smart Charging Logic
- **Battery Management**: Tracks current battery level (45 kWh / 75%) and estimated range
- **Energy Consumption Calculation**: Estimates energy usage based on distance (0.2 kWh/km)
- **Charging Station Types**: 
  - **Fast Charging**: 120-200 kW (10-15 min for 80% charge)
  - **Normal Charging**: 50-60 kW (30-45 min for 80% charge)

### 🎯 Optimal Route Finding
- **Dijkstra's Algorithm**: Finds the shortest path considering:
  - Distance between stations
  - Traffic conditions (multiplier: 1.0-1.3x)
  - Energy consumption
  - Battery constraints
- **Multi-Node Graph**: 15 charging stations interconnected with 26 edges
- **Safety Threshold**: Ensures minimum 10 kWh battery reserve

### 📊 Station Information
Each charging station displays:
- Name and location
- Charging type (Fast/Normal)
- Charging rate (kW)
- Price per kWh (₹8-14)
- Available ports (3-12)
- Estimated charging time
- Total charging cost

### 🎨 Filter & Search
- **Type Filters**: Toggle between fast and normal charging stations
- **Dynamic Count**: Real-time station count based on active filters
- **Station List**: Scrollable sidebar with all available stations
- **Click-to-Navigate**: Select stations from list to view on map

### 📱 Responsive Design
- **Desktop Optimized**: Full-screen map with sidebar navigation
- **Tablet Compatible**: Adjusted layout for medium screens
- **Mobile Friendly**: Stacked layout for screens under 968px

---

## 🎥 Demo

### Interface Preview

```
┌─────────────────────────────────────────────────────────┐
│  ⚡ OptiCharge - Smart EV Charging Station Finder       │
├─────────────────────┬───────────────────────────────────┤
│                     │  🚗 Vehicle Status                 │
│                     │  Battery: 60 kWh                   │
│                     │  Current: 45 kWh (75%)             │
│   Interactive Map   │  Range: 225 km                     │
│   with Stations     │                                    │
│   & User Marker     │  ⚙️ Filter Stations                │
│                     │  □ Normal Charging                 │
│                     │  □ Fast Charging                   │
│                     │                                    │
│                     │  [🔍 Find Optimal Route]           │
│                     │  [🔄 Reset Map]                    │
│                     │                                    │
│                     │  ⚡ Available Stations (15)        │
│                     │  └─ Station List...                │
└─────────────────────┴───────────────────────────────────┘
```

### Workflow

1. **Open Application** → Map loads centered on Hubli (15.366°N, 75.124°E)
2. **Click Map** → Set your current location (blue pin marker appears)
3. **Click "Find Optimal Route"** → Algorithm calculates best charging station
4. **View Route** → Blue line shows path, stats display in sidebar
5. **Navigate** → Follow the optimized route to your charging destination

---

## 🛠️ Technology Stack

### Frontend
- **HTML5**: Semantic markup and structure
- **CSS3**: 
  - Flexbox & Grid layouts
  - Custom animations and transitions
  - Gradient backgrounds
  - Responsive media queries
- **JavaScript (ES6+)**:
  - Object-oriented programming
  - Event-driven architecture
  - Async operations

### Libraries & Frameworks
| Library | Version | Purpose |
|---------|---------|---------|
| [Leaflet.js](https://leafletjs.com/) | 1.9.4 | Interactive map rendering |
| [Leaflet Routing Machine](https://www.liedman.net/leaflet-routing-machine/) | Latest | Route calculation and visualization |
| [OpenStreetMap](https://www.openstreetmap.org/) | - | Map tile provider |
| [OSRM](http://project-osrm.org/) | v1 | Routing service API |

### Algorithms
- **Dijkstra's Algorithm**: Shortest path finding with weighted edges
- **Haversine Formula**: Great-circle distance calculation between coordinates

---

## 💻 Installation

### Prerequisites
- Modern web browser (Chrome, Firefox, Safari, Edge)
- Text editor or IDE (VS Code, Sublime Text, etc.)
- Basic understanding of HTML/CSS/JavaScript

### Quick Start

1. **Clone the repository**
```bash
git clone https://github.com/yourusername/opticharge.git
cd opticharge
```

2. **Project structure**
```
opticharge/
│
├── index.html          # Main HTML file
├── styles.css          # Stylesheet
├── script.js           # JavaScript logic
└── README.md          # Documentation
```

3. **Launch the application**

**Option A: Direct Browser**
```bash
# Simply open index.html in your browser
open index.html  # macOS
start index.html # Windows
xdg-open index.html # Linux
```

**Option B: Local Server (Recommended)**
```bash
# Python 3
python -m http.server 8000

# Python 2
python -m SimpleHTTPServer 8000

# Node.js (if you have http-server installed)
npx http-server

# Then navigate to http://localhost:8000
```

---

## 📖 Usage

### Basic Workflow

#### 1. Setting Your Location
```javascript
// Click anywhere on the map
map.on('click', function(e) {
    userLocation = e.latlng; // Captures latitude and longitude
    // User marker is automatically placed
});
```

#### 2. Finding Optimal Route
```javascript
// Click "Find Optimal Route" button
// Algorithm executes:
1. Finds nearest visible charging station
2. Calculates haversine distance
3. Runs Dijkstra's algorithm
4. Displays route on map
5. Shows detailed statistics
```

#### 3. Viewing Station Details
- **Click station markers** on map for popup information
- **Click station items** in sidebar to center map on that station
- Filter stations using checkboxes

### Advanced Features

#### Customizing Vehicle Parameters
```javascript
// In script.js, modify these constants:
const batteryCapacity = 60;    // Total capacity in kWh
const currentBattery = 45;     // Current charge in kWh
const energyConsumption = 0.2; // kWh per km
```

#### Adding New Stations
```javascript
// Add to stations array in script.js:
{
    id: 15,
    name: 'New Station Name',
    location: 'Address',
    latlng: [latitude, longitude],
    rate: 150,        // Charging rate in kW
    price: 12,        // Price per kWh in ₹
    ports: 8,         // Number of charging ports
    type: 'fast'      // 'fast' or 'normal'
}
```

#### Creating Station Connections
```javascript
// Define traffic-weighted edges:
connections.push({
    from: 0,           // Station ID
    to: 1,             // Connected station ID
    traffic: 1.2       // Traffic multiplier (1.0-1.3)
});
```

---

## 🏗️ Architecture

### System Design

```
┌─────────────────────────────────────────────────────┐
│                   User Interface                     │
│  (HTML + CSS + Interactive Map)                      │
└───────────────────┬─────────────────────────────────┘
                    │
        ┌───────────┴───────────┐
        │                       │
        ▼                       ▼
┌───────────────┐      ┌──────────────────┐
│  Map Module   │      │  Graph Module    │
│  (Leaflet.js) │      │  (Dijkstra's)    │
└───────┬───────┘      └────────┬─────────┘
        │                       │
        │    ┌─────────────┐   │
        └────┤  Data Layer ├───┘
             │  (Stations) │
             └─────────────┘
```

### Component Breakdown

#### 1. **Graph Class** (`script.js`)
Implements a weighted directed graph for pathfinding.

```javascript
class Graph {
    constructor() {
        this.nodes = new Map();  // Stores station data
        this.edges = new Map();  // Stores connections
    }
    
    addNode(id, data) { /* ... */ }
    addEdge(from, to, weight, distance, energyConsumption) { /* ... */ }
    dijkstra(start, end, currentBattery, batteryCapacity) { /* ... */ }
}
```

**Key Methods:**
- `addNode()`: Registers charging stations as graph nodes
- `addEdge()`: Creates bidirectional connections between stations
- `dijkstra()`: Finds optimal path considering battery constraints

#### 2. **Haversine Distance Calculator**
Calculates great-circle distance between two GPS coordinates.

```javascript
function haversine(lat1, lon1, lat2, lon2) {
    const R = 6371; // Earth's radius in km
    // Returns distance in kilometers
}
```

**Formula:**
```
a = sin²(Δφ/2) + cos φ1 × cos φ2 × sin²(Δλ/2)
c = 2 × atan2(√a, √(1−a))
d = R × c
```

#### 3. **Map Management**
Handles all Leaflet.js interactions.

```javascript
// Map initialization
const map = L.map('map').setView([15.366, 75.124], 13);

// Custom marker creation
function createStationMarker(station) {
    const icon = L.divIcon({
        className: station.type === 'fast' ? 'charging-station-fast' : 'charging-station-normal',
        html: station.type === 'fast' ? '⚡' : '🔌',
        iconSize: [36, 36]
    });
    return L.marker(station.latlng, { icon });
}
```

#### 4. **Route Visualization**
Uses Leaflet Routing Machine for path display.

```javascript
routeControl = L.Routing.control({
    waypoints: [userLocation, stationLocation],
    router: L.Routing.osrmv1({
        serviceUrl: 'https://router.project-osrm.org/route/v1'
    }),
    lineOptions: {
        styles: [{ color: '#1976d2', weight: 5, opacity: 0.8 }]
    }
}).addTo(map);
```

---

## 🧮 Algorithm Details

### Dijkstra's Algorithm Implementation

**Purpose**: Find the shortest path from user location to nearest charging station.

**Constraints**:
- Must maintain minimum battery threshold (10 kWh)
- Accounts for energy consumption (0.2 kWh/km)
- Considers traffic multipliers (1.0-1.3x)
- Simulates charging at stations (recharge to 80%)

**Pseudocode**:
```
function dijkstra(start, end, currentBattery):
    Initialize distances to infinity
    Set distance[start] = 0
    Set battery[start] = currentBattery
    
    while unvisited nodes exist:
        current = node with minimum distance
        
        if current is charging station:
            battery = min(capacity * 0.8, capacity)
        
        for each neighbor of current:
            newBattery = battery - energyToNeighbor
            
            if newBattery < threshold:
                skip this neighbor
            
            newDistance = distance[current] + edge.weight
            
            if newDistance < distance[neighbor]:
                distance[neighbor] = newDistance
                previous[neighbor] = current
                battery[neighbor] = newBattery
    
    return path from start to end
```

**Complexity**:
- **Time**: O((V + E) log V) with priority queue
- **Space**: O(V) for storing distances and paths
- **V**: Number of vertices (charging stations)
- **E**: Number of edges (connections)

### Weight Calculation

Each edge weight combines:

```javascript
weight = distance × trafficMultiplier

// Example:
// Distance: 2.5 km
// Traffic: 1.2x (moderate traffic)
// Weight: 2.5 × 1.2 = 3.0
```

**Traffic Levels**:
- `1.0`: Free-flowing traffic
- `1.1`: Light traffic
- `1.2`: Moderate traffic
- `1.3`: Heavy traffic

---

## 🔌 API Reference

### External APIs

#### OpenStreetMap Tile API
```
https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png
```
- **Purpose**: Provides map tiles for rendering
- **Rate Limit**: Fair usage policy
- **Attribution**: Required in UI

#### OSRM Routing API
```
https://router.project-osrm.org/route/v1/driving/{coordinates}
```
- **Purpose**: Calculates actual road routes
- **Parameters**: 
  - `coordinates`: Semicolon-separated lng,lat pairs
  - `overview`: Route geometry detail level
  - `steps`: Turn-by-turn instructions

### Internal Functions

#### `haversine(lat1, lon1, lat2, lon2)`
Calculates distance between two points.

**Parameters**:
- `lat1, lon1`: First coordinate pair (degrees)
- `lat2, lon2`: Second coordinate pair (degrees)

**Returns**: `number` - Distance in kilometers

---

#### `createStationMarker(station)`
Creates custom Leaflet marker for charging stations.

**Parameters**:
- `station`: Station object with properties (id, name, latlng, type, etc.)

**Returns**: `L.Marker` - Leaflet marker instance

---

#### `findNearestStation(location)`
Finds closest visible charging station to given location.

**Parameters**:
- `location`: Object with `lat` and `lng` properties

**Returns**: `Object` - Nearest station object or `null`

---

#### `displayRouteInfo(route, distance, energy, station)`
Displays calculated route statistics in sidebar.

**Parameters**:
- `route`: Route object from Dijkstra's algorithm
- `distance`: Total distance in km
- `energy`: Required energy in kWh
- `station`: Target charging station object

---

## ⚙️ Configuration

### Customizable Parameters

#### Vehicle Settings
```javascript
// Battery configuration
const batteryCapacity = 60;      // Total capacity (kWh)
const currentBattery = 45;       // Current charge (kWh)
const currentChargePercent = 75; // Charge percentage
const estimatedRange = 225;      // Range in km

// Energy consumption
const energyPerKm = 0.2;         // kWh per kilometer

// Safety thresholds
const minBatteryThreshold = 10;  // Minimum reserve (kWh)
const chargeToPercent = 0.8;     // Target charge level (80%)
```

#### Map Settings
```javascript
// Initial view
const initialCenter = [15.366, 75.124]; // Hubli coordinates
const initialZoom = 13;

// Marker sizes
const stationIconSize = [36, 36];
const userIconSize = [40, 50];

// Route styling
const routeColor = '#1976d2';
const routeWeight = 5;
const routeOpacity = 0.8;
```

#### Station Network
```javascript
// Add/modify stations in the stations array
// Each station requires:
{
    id: <unique_number>,
    name: '<station_name>',
    location: '<address>',
    latlng: [<latitude>, <longitude>],
    rate: <charging_rate_kW>,
    price: <price_per_kWh>,
    ports: <available_ports>,
    type: 'fast' | 'normal'
}
```

---
