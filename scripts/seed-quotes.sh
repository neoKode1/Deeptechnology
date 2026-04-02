#!/bin/bash
BASE="http://localhost:3000/api/quotes"

create_and_send() {
  local data="$1"
  local id=$(curl -s -X POST "$BASE" -H "Content-Type: application/json" -d "$data" | python3 -c "import sys,json; print(json.load(sys.stdin)['quote']['id'])")
  curl -s -X PATCH "$BASE/$id" -H "Content-Type: application/json" -d '{"status":"sent"}' | python3 -c "import sys,json; q=json.load(sys.stdin)['quote']; print(f'{q[\"id\"]} | \${q[\"total\"]:,.2f} | {q[\"summary\"]}')"
}

echo "=== DELIVERY BOTS ==="

create_and_send '{"requestId":"req-serve-001","customerName":"Enterprise Client","customerEmail":"procurement@deeptech.com","inquiryType":"Autonomous solutions","summary":"Serve Robotics Gen-3 Delivery Robot — 3-Unit Fleet","lineItems":[{"description":"Serve Robotics Gen-3 Delivery Robot × 3","vendor":"Serve Robotics","vendorUrl":"https://www.serverobotics.com","vendorCost":66900,"markup":0.15,"notes":"Autonomous sidewalk delivery, Uber Eats integrated, ~$22,300/unit"},{"description":"Fleet Management Software — 12mo","vendor":"Serve Robotics","vendorUrl":"https://www.serverobotics.com","vendorCost":7200,"markup":0.15,"notes":"Cloud dashboard, route optimization"},{"description":"Deployment & Route Mapping","vendor":"Serve Robotics","vendorUrl":"https://www.serverobotics.com","vendorCost":3500,"markup":0.15,"notes":"On-site sidewalk mapping and geofencing"}],"notes":"Last-mile food delivery fleet"}'

create_and_send '{"requestId":"req-segway-001","customerName":"Enterprise Client","customerEmail":"procurement@deeptech.com","inquiryType":"Autonomous solutions","summary":"Segway E1 Outdoor Delivery Robot — 2 Units","lineItems":[{"description":"Segway E1 Outdoor Delivery Robot × 2","vendor":"Segway Robotics","vendorUrl":"https://robotics.segway.com/e1","vendorCost":19800,"markup":0.15,"notes":"44kg payload, ROS compatible, Nvidia Jetson, ~$9,900/unit"},{"description":"LiDAR + RTK Navigation Upgrade","vendor":"Segway Robotics","vendorUrl":"https://robotics.segway.com/e1","vendorCost":4200,"markup":0.15,"notes":"Precision autonomous navigation"},{"description":"12-month Support Plan","vendor":"Segway Robotics","vendorUrl":"https://robotics.segway.com/e1","vendorCost":2400,"markup":0.15,"notes":"Remote diagnostics, firmware updates"}],"notes":"Campus delivery — reliable, lower price point"}'

echo ""
echo "=== HUMANOID ROBOTS ==="

create_and_send '{"requestId":"req-unitree-001","customerName":"Enterprise Client","customerEmail":"procurement@deeptech.com","inquiryType":"Autonomous solutions","summary":"Unitree G1 Humanoid Robot — EDU Standard","lineItems":[{"description":"Unitree G1 EDU Standard Humanoid","vendor":"Unitree Robotics","vendorUrl":"https://shop.unitree.com","vendorCost":43500,"markup":0.15,"notes":"127cm, 35kg, 43 DOF, SDK access, ships 2-4 weeks"},{"description":"Spare Battery Pack (72V Li-ion)","vendor":"Unitree Robotics","vendorUrl":"https://shop.unitree.com","vendorCost":1290,"markup":0.15,"notes":"500-cycle rated proprietary pack"},{"description":"Developer Onboarding (40hrs)","vendor":"Deeptech Engineering","vendorUrl":"https://deeptech.com","vendorCost":5000,"markup":0.0,"notes":"C++/Python SDK setup, ROS 2 integration"}],"notes":"Research-grade humanoid for education and R&D"}'

create_and_send '{"requestId":"req-neo-001","customerName":"Enterprise Client","customerEmail":"procurement@deeptech.com","inquiryType":"Autonomous solutions","summary":"1X NEO Humanoid Robot — Early Access","lineItems":[{"description":"1X NEO Humanoid Robot — Early Access","vendor":"1X Technologies","vendorUrl":"https://1x.tech/order","vendorCost":20000,"markup":0.15,"notes":"180cm full-size humanoid, priority 2026 delivery"},{"description":"Extended Warranty — 24 months","vendor":"1X Technologies","vendorUrl":"https://1x.tech","vendorCost":2400,"markup":0.15,"notes":"Firmware updates, mechanical servicing, parts"}],"notes":"Consumer/commercial humanoid — hospitality, retail"}'

echo ""
echo "=== AERIAL DRONES ==="

create_and_send '{"requestId":"req-m400-001","customerName":"Enterprise Client","customerEmail":"procurement@deeptech.com","inquiryType":"Autonomous solutions","summary":"DJI Matrice 400 — Full Inspection Kit","lineItems":[{"description":"DJI Matrice 400 Enterprise Drone","vendor":"DJI Enterprise","vendorUrl":"https://store.dji.com","vendorCost":10450,"markup":0.15,"notes":"59-min flight, 6kg payload, IP55"},{"description":"Zenmuse H30T Thermal/Zoom Payload","vendor":"DJI Enterprise","vendorUrl":"https://store.dji.com","vendorCost":8900,"markup":0.15,"notes":"Wide + zoom + thermal + laser rangefinder"},{"description":"TB100 Battery × 2","vendor":"DJI Enterprise","vendorUrl":"https://store.dji.com","vendorCost":3784,"markup":0.15,"notes":"Hot-swappable, $1,892 each"},{"description":"DJI Care Enterprise Plus — 1yr","vendor":"DJI Enterprise","vendorUrl":"https://store.dji.com","vendorCost":1200,"markup":0.15,"notes":"Crash/water coverage, 2 replacements"}],"notes":"Heavy-lift inspection — infrastructure, energy, public safety"}'

create_and_send '{"requestId":"req-skydio-001","customerName":"Enterprise Client","customerEmail":"procurement@deeptech.com","inquiryType":"Autonomous solutions","summary":"Skydio X10 Autonomous Drone — Dual Kit","lineItems":[{"description":"Skydio X10 Enterprise × 2","vendor":"Skydio","vendorUrl":"https://www.skydio.com","vendorCost":34600,"markup":0.15,"notes":"AI autonomy, 40-min flight, IP55, ~$17,300/unit"},{"description":"Skydio Dock — Charging Station","vendor":"Skydio","vendorUrl":"https://www.skydio.com","vendorCost":12000,"markup":0.15,"notes":"Remote launch/land, weatherproof"},{"description":"Skydio Cloud — 12mo License","vendor":"Skydio","vendorUrl":"https://www.skydio.com","vendorCost":4800,"markup":0.15,"notes":"Fleet management, 3D scans, analytics"}],"notes":"American-made autonomous drone — inspection, security"}'

create_and_send '{"requestId":"req-mavic3e-001","customerName":"Enterprise Client","customerEmail":"procurement@deeptech.com","inquiryType":"Autonomous solutions","summary":"DJI Mavic 3 Enterprise — Compact Drone Kit","lineItems":[{"description":"DJI Mavic 3E Thermal Edition","vendor":"DJI Enterprise","vendorUrl":"https://www.dji.com/mavic-3-enterprise","vendorCost":4509,"markup":0.15,"notes":"56× zoom, thermal, 45-min flight"},{"description":"RC Pro Enterprise Controller","vendor":"DJI Enterprise","vendorUrl":"https://www.dji.com","vendorCost":1199,"markup":0.15,"notes":"5.5-inch screen, O3 transmission"},{"description":"Fly More Kit (3 batteries + hub + case)","vendor":"DJI Enterprise","vendorUrl":"https://www.dji.com","vendorCost":899,"markup":0.15,"notes":"3× flight capacity for field ops"}],"notes":"Budget enterprise drone — mapping, inspection, survey"}'

echo ""
echo "=== ALL QUOTES CREATED AND SET TO SENT ==="

