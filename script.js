function haversine(lat1, lon1, lat2, lon2) {
    const R = 6371; 
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
              Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
              Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
}

class Graph {
    constructor() {
        this.nodes = new Map();
        this.edges = new Map();
    }

    addNode(id, data) {
        this.nodes.set(id, data);
        if (!this.edges.has(id)) {
            this.edges.set(id, []);
        }
    }

    addEdge(from, to, weight, distance, energyConsumption) {
        this.edges.get(from).push({ to, weight, distance, energyConsumption });
        this.edges.get(to).push({ to: from, weight, distance, energyConsumption });
    }

    dijkstra(start, end, currentBattery, batteryCapacity, minThreshold = 10) {
        const distances = new Map();
        const previous = new Map();
        const batteryAtNode = new Map();
        const visited = new Set();
        const pq = [];

        this.nodes.forEach((_, nodeId) => {
            distances.set(nodeId, Infinity);
            batteryAtNode.set(nodeId, 0);
        });
        distances.set(start, 0);
        batteryAtNode.set(start, currentBattery);
        pq.push({ id: start, distance: 0, battery: currentBattery });

        while (pq.length > 0) {
            pq.sort((a, b) => a.distance - b.distance);
            const current = pq.shift();

            if (visited.has(current.id)) continue;
            visited.add(current.id);

            if (current.id === end) break;

            const currentNode = this.nodes.get(current.id);
            let batteryHere = current.battery;

            if (currentNode.isChargingStation && current.id !== start) {
                batteryHere = Math.min(batteryCapacity * 0.8, batteryCapacity);
            }

            const neighbors = this.edges.get(current.id) || [];
            for (const edge of neighbors) {
                if (visited.has(edge.to)) continue;

                const energyNeeded = edge.energyConsumption;
                const newBattery = batteryHere - energyNeeded;

                if (newBattery < minThreshold && !currentNode.isChargingStation) {
                    continue;
                }

                const newDistance = distances.get(current.id) + edge.weight;

                if (newDistance < distances.get(edge.to)) {
                    distances.set(edge.to, newDistance);
                    previous.set(edge.to, current.id);
                    batteryAtNode.set(edge.to, newBattery);
                    pq.push({ id: edge.to, distance: newDistance, battery: newBattery });
                }
            }
        }

        const path = [];
        let current = end;
        while (current !== undefined) {
            path.unshift(current);
            current = previous.get(current);
        }

        return {
            path: path.length > 1 ? path : [],
            distance: distances.get(end),
            valid: distances.get(end) !== Infinity
        };
    }
}

const map = L.map('map').setView([15.366, 75.124], 12); 
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; OpenStreetMap contributors'
}).addTo(map);

const graph = new Graph();
let userLocation = null;
let userMarker = null;
let routeControl = null;
let currentRoute = null;

const stations = [
    { id: 0, name: 'KLE Tech University', location: 'Vidyanagar, Hubli', latlng: [15.4050, 75.1250], rate: 150, price: 12, ports: 8, type: 'fast' },
    { id: 1, name: 'Unkal Lake', location: 'Unkal, Hubli', latlng: [15.3500, 75.0900], rate: 50, price: 8, ports: 4, type: 'normal' },
    { id: 2, name: 'KIMS Hospital', location: 'Vidyanagar Road, Hubli', latlng: [15.3200, 75.1650], rate: 180, price: 13, ports: 10, type: 'fast' },
    { id: 3, name: 'Urban Oasis Mall', location: 'Gokul Road, Hubli', latlng: [15.4200, 75.0750], rate: 60, price: 9, ports: 5, type: 'normal' },
    { id: 4, name: 'Jubilee Circle', location: 'Old Hubli, Hubli', latlng: [15.2900, 75.1100], rate: 150, price: 12, ports: 7, type: 'fast' },
    { id: 5, name: 'Gokul Road', location: 'Near BVB College, Hubli', latlng: [15.3650, 75.0600], rate: 55, price: 8.5, ports: 4, type: 'normal' },
    { id: 6, name: 'BVB Campus', location: 'Vidyanagar, Hubli', latlng: [15.3850, 75.1750], rate: 120, price: 11, ports: 6, type: 'fast' },
    { id: 7, name: 'Vidyanagar Circle', location: 'Vidyanagar Main Road, Hubli', latlng: [15.3100, 75.0850], rate: 50, price: 8, ports: 3, type: 'normal' },
    { id: 8, name: 'Hosur Cross', location: 'Hosur Road, Hubli', latlng: [15.4500, 75.1600], rate: 120, price: 11, ports: 5, type: 'fast' },
    { id: 9, name: 'Navanagar', location: 'Navanagar Main Road, Hubli', latlng: [15.2800, 75.1550], rate: 55, price: 8.5, ports: 4, type: 'normal' },
    { id: 10, name: 'Rani Chennamma Circle', location: 'CBT Circle, Hubli', latlng: [15.3700, 75.1350], rate: 180, price: 13, ports: 9, type: 'fast' },
    { id: 11, name: 'Lingaraj Nagar', location: 'Near Tunga Hospital, Hubli', latlng: [15.3300, 75.0500], rate: 50, price: 8, ports: 3, type: 'normal' },
    { id: 12, name: 'Old Hubli Market', location: 'Koppikar Road, Hubli', latlng: [15.3000, 75.1800], rate: 150, price: 12, ports: 7, type: 'fast' },
    { id: 13, name: 'Akshay Park', location: 'Akshay Colony, Hubli', latlng: [15.4400, 75.0550], rate: 60, price: 9, ports: 4, type: 'normal' },
    { id: 14, name: 'NH-48 Toll Plaza', location: 'Dharwad Road, Hubli', latlng: [15.4700, 75.1200], rate: 200, price: 14, ports: 12, type: 'fast' }
];

const stationMarkers = [];
let showNormal = true;
let showFast = true;

function createStationMarker(station) {
    const isFast = station.type === 'fast';
    const icon = L.divIcon({
        className: isFast ? 'charging-station-fast' : 'charging-station-normal',
        html: isFast ? '⚡' : '🔌',
        iconSize: [36, 36],
        iconAnchor: [18, 18]
    });
    const marker = L.marker(station.latlng, { icon });
    marker.bindPopup(`
        <div style="font-family: system-ui; min-width: 200px;">
            <b style="color: ${isFast ? '#ff6b00' : '#1976d2'}; font-size: 1.1em;">${station.name}</b><br>
            <div style="color: #666; font-size: 0.85em; margin-top: 4px; margin-bottom: 8px;">📍 ${station.location}</div>
            <div style="margin-top: 8px; font-size: 0.9em;">
                ${isFast ? '⚡' : '🔌'} <b>${isFast ? 'Fast' : 'Normal'} Charging</b><br>
                ⚡ Rate: <b>${station.rate} kW</b><br>
                💰 Price: <b>₹${station.price}/kWh</b><br>
                🔌 Ports: <b>${station.ports} available</b>
            </div>
        </div>
    `);
    return marker;
}

function updateStationVisibility() {
    stationMarkers.forEach(({ marker, station }) => {
        if ((station.type === 'normal' && showNormal) || (station.type === 'fast' && showFast)) {
            marker.addTo(map);
        } else {
            map.removeLayer(marker);
        }
    });
    updateStationCount();
}

function updateStationCount() {
    let count = 0;
    stationMarkers.forEach(({ station }) => {
        if ((station.type === 'normal' && showNormal) || (station.type === 'fast' && showFast)) {
            count++;
        }
    });
    document.getElementById('stationCount').textContent = count;
}

stations.forEach(station => {
    const marker = createStationMarker(station);
    marker.addTo(map);
    stationMarkers.push({ marker, station });
    graph.addNode(station.id, { ...station, isChargingStation: true });
});

const connections = [
    { from: 0, to: 1, traffic: 1.1 },
    { from: 0, to: 3, traffic: 1.2 },
    { from: 0, to: 6, traffic: 1.0 },
    { from: 0, to: 8, traffic: 1.1 },
    { from: 1, to: 2, traffic: 1.1 },
    { from: 1, to: 3, traffic: 1.0 },
    { from: 1, to: 12, traffic: 1.2 },
    { from: 2, to: 4, traffic: 1.0 },
    { from: 2, to: 7, traffic: 1.0 },
    { from: 3, to: 6, traffic: 1.2 },
    { from: 3, to: 8, traffic: 1.1 },
    { from: 3, to: 12, traffic: 1.3 },
    { from: 4, to: 5, traffic: 1.1 },
    { from: 4, to: 9, traffic: 1.2 },
    { from: 4, to: 11, traffic: 1.1 },
    { from: 5, to: 6, traffic: 1.2 },
    { from: 5, to: 7, traffic: 1.0 },
    { from: 5, to: 11, traffic: 1.1 },
    { from: 5, to: 13, traffic: 1.3 },
    { from: 6, to: 7, traffic: 1.1 },
    { from: 6, to: 10, traffic: 1.0 },
    { from: 6, to: 13, traffic: 1.2 },
    { from: 8, to: 14, traffic: 1.0 },
    { from: 9, to: 12, traffic: 1.1 },
    { from: 10, to: 14, traffic: 1.2 },
    { from: 13, to: 14, traffic: 1.1 }
];

connections.forEach(conn => {
    const fromStation = stations[conn.from];
    const toStation = stations[conn.to];
    const distance = haversine(fromStation.latlng[0], fromStation.latlng[1], toStation.latlng[0], toStation.latlng[1]);
    const energyConsumption = distance * 0.2;
    const weight = distance * conn.traffic;
    graph.addEdge(conn.from, conn.to, weight, distance, energyConsumption);
});

map.on('click', function(e) {
    console.log('Map clicked at:', e.latlng); 
    
    if (userMarker) {
        map.removeLayer(userMarker);
        userMarker = null;
    }
    
    userLocation = e.latlng;
    
    const userIcon = L.icon({
        iconUrl: 'data:image/svg+xml;base64,' + btoa(`
            <svg width="40" height="50" xmlns="http://www.w3.org/2000/svg">
                <circle cx="20" cy="18" r="12" fill="#4285f4" stroke="white" stroke-width="3"/>
                <path d="M 20 30 L 14 42 L 20 38 L 26 42 Z" fill="#4285f4" stroke="white" stroke-width="2"/>
            </svg>
        `),
        iconSize: [40, 50],
        iconAnchor: [20, 50],
        popupAnchor: [0, -50]
    });
    
    userMarker = L.marker(userLocation, { icon: userIcon });
    userMarker.addTo(map);
    
    console.log('Marker added:', userMarker); 
    
    document.getElementById('findRouteBtn').disabled = false;
    
    if (routeControl) {
        map.removeControl(routeControl);
        routeControl = null;
    }
    currentRoute = null;
    document.getElementById('routeInfoContainer').innerHTML = '';
});

function findNearestStation(location) {
    let nearest = null;
    let minDist = Infinity;
    stationMarkers.forEach(({ station }) => {
        const isVisible = (station.type === 'normal' && showNormal) || (station.type === 'fast' && showFast);
        if (!isVisible) return;
        
        const dist = haversine(location.lat, location.lng, station.latlng[0], station.latlng[1]);
        if (dist < minDist) {
            minDist = dist;
            nearest = station;
        }
    });
    return nearest;
}

document.getElementById('findRouteBtn').addEventListener('click', () => {
    if (!userLocation) return;

    const nearest = findNearestStation(userLocation);
    
    if (!nearest) {
        alert('No charging stations available with current filters!');
        return;
    }
    
    const distToNearest = haversine(userLocation.lat, userLocation.lng, nearest.latlng[0], nearest.latlng[1]);
    const energyToNearest = distToNearest * 0.2;

    graph.addNode('user', {
        latlng: userLocation,
        name: 'Your Location',
        isChargingStation: false
    });
    graph.addEdge('user', nearest.id, distToNearest, distToNearest, energyToNearest);

    const batteryCapacity = 60;
    const currentBattery = 45;
    const result = graph.dijkstra('user', nearest.id, currentBattery, batteryCapacity);

    if (result.valid) {
        currentRoute = result;
        if (routeControl) {
            map.removeControl(routeControl);
        }
        routeControl = L.Routing.control({
            waypoints: [
                L.latLng(userLocation.lat, userLocation.lng),
                L.latLng(nearest.latlng[0], nearest.latlng[1])
            ],
            router: L.Routing.osrmv1({
                serviceUrl: 'https://router.project-osrm.org/route/v1'
            }),
            lineOptions: {
                styles: [{ color: '#1976d2', weight: 5, opacity: 0.8 }]
            },
            show: false,
            addWaypoints: false,
            draggableWaypoints: false,
            createMarker: function() { return null; }
        }).addTo(map);

        routeControl.on('routesfound', function(e) {
            const route = e.routes[0];
            const actualDistance = route.summary.totalDistance / 1000;
            const actualEnergy = actualDistance * 0.2;
            displayRouteInfo(result, actualDistance, actualEnergy, nearest);
        });

        map.fitBounds(routeControl.getBounds(), { padding: [50, 50] });

    } else {
        alert('No valid route found. Battery insufficient!');
    }

    graph.nodes.delete('user');
    if (graph.edges.has('user')) {
        graph.edges.delete('user');
    }
    stations.forEach(s => {
        if (graph.edges.has(s.id)) {
            graph.edges.get(s.id) = graph.edges.get(s.id).filter(edge => edge.to !== 'user');
        }
    });
});

document.getElementById('resetBtn').addEventListener('click', () => {
    if (userMarker) {
        map.removeLayer(userMarker);
        userMarker = null;
    }
    if (routeControl) {
        map.removeControl(routeControl);
        routeControl = null;
    }
    userLocation = null;
    currentRoute = null;
    document.getElementById('findRouteBtn').disabled = true;
    document.getElementById('routeInfoContainer').innerHTML = '';
    map.setView([15.366, 75.124], 12);
});

document.getElementById('showNormal').addEventListener('change', (e) => {
    showNormal = e.target.checked;
    updateStationVisibility();
});

document.getElementById('showFast').addEventListener('change', (e) => {
    showFast = e.target.checked;
    updateStationVisibility();
});

function displayRouteInfo(route, totalDistance, totalEnergy, targetStation) {
    const container = document.getElementById('routeInfoContainer');
    
    let pathHTML = '';
    route.path.forEach((nodeId, index) => {
        const node = nodeId === 'user' 
            ? { name: 'Your Location' }
            : stations.find(s => s.id === nodeId);
        
        const icon = nodeId === 'user' ? '📍' : (node.type === 'fast' ? '⚡' : '🔌');
        
        pathHTML += `
            <div class="route-step">
                ${index + 1}. ${node.name} ${icon}
            </div>
        `;
    });

    const chargingTime = targetStation.type === 'fast' 
        ? (15 * 60 / targetStation.rate).toFixed(0)
        : (15 * 60 / targetStation.rate).toFixed(0);

    container.innerHTML = `
        <div class="path-found-banner">✅ Route Calculated!</div>
        <div class="route-info">
            <h3>📍 Route to ${targetStation.name}</h3>
            <div class="route-stat">
                <span>Distance:</span>
                <span>${totalDistance.toFixed(2)} km</span>
            </div>
            <div class="route-stat">
                <span>Energy Required:</span>
                <span>${totalEnergy.toFixed(2)} kWh</span>
            </div>
            <div class="route-stat">
                <span>Charging Type:</span>
                <span>${targetStation.type === 'fast' ? '⚡ Fast' : '🔌 Normal'}</span>
            </div>
            <div class="route-stat">
                <span>Charging Rate:</span>
                <span>${targetStation.rate} kW</span>
            </div>
            <div class="route-stat">
                <span>Est. Charge Time:</span>
                <span>~${chargingTime} min (80%)</span>
            </div>
            <div class="route-stat">
                <span>Cost:</span>
                <span>₹${(15 * targetStation.price).toFixed(2)}</span>
            </div>
            <div class="route-path">
                <strong>📍 Route Path:</strong>
                ${pathHTML}
            </div>
        </div>
    `;
}

function populateStationList() {
    const stationList = document.getElementById('stationList');
    stationList.innerHTML = '';

    stations.forEach(station => {
        const item = document.createElement('div');
        item.className = `station-item ${station.type}`;
        
        const typeBadge = station.type === 'fast' 
            ? '<span class="type-badge fast-badge">FAST</span>'
            : '<span class="type-badge normal-badge">NORMAL</span>';
        
        item.innerHTML = `
            <h4>${station.name}${typeBadge}</h4>
            <div class="station-detail">📍 ${station.location}</div>
            <div class="station-detail">⚡ Rate: ${station.rate} kW</div>
            <div class="station-detail">💰 Price: ₹${station.price}/kWh</div>
            <div class="station-detail">🔌 Ports: ${station.ports} available</div>
        `;
        
        item.addEventListener('click', () => {
            map.setView(station.latlng, 15);
            stationMarkers.find(sm => sm.station.id === station.id).marker.openPopup();
        });
        
        stationList.appendChild(item);
    });
}

populateStationList();
updateStationCount();