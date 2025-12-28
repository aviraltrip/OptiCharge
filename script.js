
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

const map = L.map('map').setView([15.366, 75.124], 15); 
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);

const graph = new Graph();
let userLocation = null;
let userMarker = null;
let routeControl = null;
let currentRoute = null;

const stations = [
    { id: 0, name: 'KLE Tech EV Hub (North)', latlng: [15.3750, 75.1250], rate: 100, price: 10, ports: 6 },
    { id: 1, name: 'McDrive Fast Charge (East)', latlng: [15.3650, 75.1300], rate: 75, price: 9, ports: 4 },
    { id: 2, name: 'Hans Hotel Power Point (South-East)', latlng: [15.3580, 75.1280], rate: 150, price: 12, ports: 8 },
    { id: 3, name: 'Cricket Ground Eco Station (North-East)', latlng: [15.3720, 75.1320], rate: 50, price: 8, ports: 3 },
    { id: 4, name: 'Lemon Tree Green Charge (South)', latlng: [15.3550, 75.1220], rate: 120, price: 11, ports: 5 },
    { id: 5, name: 'ALLEN Campus Bolt (West)', latlng: [15.3620, 75.1150], rate: 80, price: 9.5, ports: 4 },
    { id: 6, name: 'BVB Campus Charge (North-West)', latlng: [15.3700, 75.1180], rate: 90, price: 9.5, ports: 5 },
    { id: 7, name: 'Vidyanavana Eco Charge (South-West)', latlng: [15.3580, 75.1180], rate: 60, price: 8.5, ports: 3 },
    { id: 8, name: 'Philips Light Hub Power (Central-West)', latlng: [15.3660, 75.1100], rate: 110, price: 10.5, ports: 4 },
    { id: 9, name: 'KV Raj Nagar Charge (East-Central)', latlng: [15.3680, 75.1350], rate: 70, price: 9, ports: 4 }
];

const stationMarkers = [];
stations.forEach(station => {
    const icon = L.divIcon({
        className: 'charging-station',
        html: '⚡',
        iconSize: [40, 40],
        iconAnchor: [20, 20]
    });
    const marker = L.marker(station.latlng, { icon }).addTo(map);
    marker.bindPopup(`
        <b>${station.name}</b><br>
        ⚡ Rate: ${station.rate} kW<br>
        💰 Price: ₹${station.price}/kWh<br>
        🔌 Ports: ${station.ports} available
    `);
    stationMarkers.push({ marker, station });
});

stations.forEach(station => {
    graph.addNode(station.id, { ...station, isChargingStation: true });
});

const connections = [
    { from: 0, to: 6, traffic: 1.0 },
    { from: 0, to: 3, traffic: 1.2 },
    { from: 1, to: 3, traffic: 1.1 },
    { from: 1, to: 9, traffic: 1.3 },
    { from: 2, to: 4, traffic: 1.0 },
    { from: 2, to: 7, traffic: 1.2 },
    { from: 3, to: 9, traffic: 1.0 },
    { from: 4, to: 7, traffic: 1.1 },
    { from: 5, to: 7, traffic: 1.2 },
    { from: 5, to: 8, traffic: 1.1 },
    { from: 6, to: 0, traffic: 1.0 },
    { from: 6, to: 8, traffic: 1.3 },
    { from: 8, to: 5, traffic: 1.1 },
    { from: 9, to: 1, traffic: 1.0 },
    { from: 9, to: 3, traffic: 1.1 }
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
    if (userMarker) {
        map.removeLayer(userMarker);
    }
    userLocation = e.latlng;
    const userIcon = L.divIcon({
        className: 'user-marker',
        html: '📍',
        iconSize: [35, 35],
        iconAnchor: [17.5, 17.5]
    });
    userMarker = L.marker(userLocation, { icon: userIcon }).addTo(map);
    document.getElementById('findRouteBtn').disabled = false;
    if (routeControl) {
        map.removeControl(routeControl);
        routeControl = null;
    }
    currentRoute = null;
});

function findNearestStation(location) {
    let nearest = null;
    let minDist = Infinity;
    stations.forEach(station => {
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
                styles: [{ color: '#0277BD', weight: 6, dashArray: '10, 5' }]
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
            displayRouteInfo(result, actualDistance, actualEnergy);
        });

        map.fitBounds(routeControl.getBounds());

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
    map.setView([15.366, 75.124], 15);
});

function displayRouteInfo(route, totalDistance, totalEnergy) {
    const container = document.getElementById('routeInfoContainer');
    
    let pathHTML = '';
    route.path.forEach((nodeId, index) => {
        const node = nodeId === 'user' 
            ? { name: 'Your Location' }
            : stations.find(s => s.id === nodeId);
        
        pathHTML += `
            <div class="route-step">
                ${index + 1}. ${node.name}
                ${node.isChargingStation ? ' ⚡' : ''}
            </div>
        `;
    });

    container.innerHTML = `
        <div class="path-found-banner">✅ Path Found! ⚡</div>
        <div class="route-info">
            <h3>Optimal Route Details</h3>
            <div class="route-stat">
                <span>Distance:</span>
                <span>${totalDistance.toFixed(2)} km</span>
            </div>
            <div class="route-stat">
                <span>Energy Required:</span>
                <span>${totalEnergy.toFixed(2)} kWh</span>
            </div>
            <div class="route-stat">
                <span>Algorithm Cost:</span>
                <span>${route.distance.toFixed(2)} units</span>
            </div>
            <div class="route-stat">
                <span>Stations on Route:</span>
                <span>${route.path.filter(id => id !== 'user').length}</span>
            </div>
            <div class="route-path">
                <strong>Route Path:</strong>
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
        item.className = 'station-item';
        item.innerHTML = `
            <h4>${station.name}</h4>
            <div class="station-detail">⚡ Rate: ${station.rate} kW</div>
            <div class="station-detail">💰 Price: ₹${station.price}/kWh</div>
            <div class="station-detail">🔌 Ports: ${station.ports} available</div>
        `;
        stationList.appendChild(item);
    });
}

populateStationList();