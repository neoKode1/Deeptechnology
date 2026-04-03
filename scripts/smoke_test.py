#!/usr/bin/env python3
"""Smoke test for POST /api/nimbus/callback"""
import urllib.request
import json
import sys

BASE_URL = sys.argv[1] if len(sys.argv) > 1 else "https://deeptech.varyai.link"
SECRET = "whsec_bSgCXESodgbAuhde9MUdcYYjaio9bk0s"
URL = f"{BASE_URL}/api/nimbus/callback"

VALID_PAYLOAD = {
    "requestId": "sourcing-smoke001",
    "customerName": "Test User",
    "customerEmail": "test@deeptech.com",
    "inquiryType": "Autonomous solutions",
    "summary": "Sourced MiR600 AMR for fulfillment center.",
    "lineItems": [
        {
            "description": "MiR600 Pallet AMR",
            "vendor": "MiR Robotics",
            "vendorUrl": "https://mir-robotics.com",
            "vendorCost": 45000,
            "markup": 0.15,
            "billingCycle": "one_time",
        }
    ],
    "notes": "Automated smoke test.",
}


def post(payload, token):
    data = json.dumps(payload).encode()
    req = urllib.request.Request(
        URL,
        data=data,
        headers={
            "Authorization": f"Bearer {token}",
            "Content-Type": "application/json",
        },
    )
    try:
        resp = urllib.request.urlopen(req, timeout=15)
        return resp.status, resp.read().decode()
    except urllib.error.HTTPError as e:
        return e.code, e.read().decode()


print(f"Target: {URL}\n")

# --- Test 1: valid ---
status, body = post(VALID_PAYLOAD, SECRET)
icon = "✅" if status == 201 else "❌"
print(f"{icon} TEST 1 — valid auth + full payload → HTTP {status}")
print(f"   {body[:200]}")

# --- Test 2: wrong secret ---
status2, body2 = post(VALID_PAYLOAD, "wrong-secret")
icon2 = "✅" if status2 == 401 else "❌"
print(f"\n{icon2} TEST 2 — bad token → HTTP {status2} (expected 401)")

# --- Test 3: missing fields ---
status3, body3 = post({"requestId": "x", "customerName": "Missing"}, SECRET)
icon3 = "✅" if status3 == 400 else "❌"
print(f"\n{icon3} TEST 3 — missing fields → HTTP {status3} (expected 400)")
print(f"   {body3[:200]}")

print("\nDone.")

