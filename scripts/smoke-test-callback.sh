#!/bin/bash
# Smoke test for POST /api/nimbus/callback
BASE_URL="${1:-https://deeptech.varyai.link}"
SECRET="whsec_bSgCXESodgbAuhde9MUdcYYjaio9bk0s"

echo "=== Testing: valid auth + full payload ==="
curl -s -w "\nHTTP %{http_code}" -X POST "$BASE_URL/api/nimbus/callback" \
  -H "Authorization: Bearer $SECRET" \
  -H "Content-Type: application/json" \
  -d '{"requestId":"sourcing-test001","customerName":"Test User","customerEmail":"test@deeptech.com","inquiryType":"Autonomous solutions","summary":"Sourced MiR600 and LocusBot fleet for fulfillment center.","lineItems":[{"description":"MiR600 Pallet AMR","vendor":"MiR Robotics","vendorUrl":"https://mir-robotics.com","vendorCost":45000,"markup":0.15,"billingCycle":"one_time"},{"description":"LocusBot Fleet (10 units)","vendor":"Locus Robotics","vendorUrl":"https://locusrobotics.com","vendorCost":10000,"markup":0.15,"billingCycle":"monthly"}],"notes":"Smoke test."}'
echo ""

echo ""
echo "=== Testing: bad token should return 401 ==="
curl -s -w "\nHTTP %{http_code}" -X POST "$BASE_URL/api/nimbus/callback" \
  -H "Authorization: Bearer wrong-secret" \
  -H "Content-Type: application/json" \
  -d '{"requestId":"x","customerName":"x","customerEmail":"x@x.com","inquiryType":"x","summary":"x","lineItems":[]}'
echo ""

echo ""
echo "=== Testing: missing required fields should return 400 ==="
curl -s -w "\nHTTP %{http_code}" -X POST "$BASE_URL/api/nimbus/callback" \
  -H "Authorization: Bearer $SECRET" \
  -H "Content-Type: application/json" \
  -d '{"requestId":"sourcing-test002","customerName":"Missing Fields"}'
echo ""

