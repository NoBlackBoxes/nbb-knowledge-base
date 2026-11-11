---
title: Managing Multiple Wi-Fi Networks on Raspberry Pi
tags:
- technical
- raspberry-pi
- wifi
- networking
- networkmanager
author: viktor
---

# Managing Multiple Wi-Fi Networks on Raspberry Pi

A guide for adding and managing multiple Wi-Fi connections (home Wi‑Fi, phone hotspots, eduroam) on a headless Raspberry Pi, including automatic network switching and SSH access methods for each network type.

**Requirements:** NetworkManager + Raspberry Pi OS / Debian, Windows laptop with PowerShell

## 1. Prerequisites

**Important:** For SSH to work, both the Raspberry Pi and your Windows laptop must be connected to the same Wi-Fi network (home Wi‑Fi or phone hotspot).

## 2. Adding Wi‑Fi connections

### 2.1 Adding a phone hotspot

First, scan for available networks:
```bash
sudo nmcli device wifi rescan
nmcli device wifi list
```

Find your phone hotspot in the list (look for your phone's name or the SSID you set).

**Method 1: Interactive connection (recommended)**
```bash
sudo nmcli device wifi connect "SSID_NAME" password "PASSWORD"
```

Replace `SSID_NAME` with your hotspot's name (e.g., `Pixel_4211`) and `PASSWORD` with the hotspot password.

**Method 2: Add connection profile (for better control)**
```bash
sudo nmcli connection add \
  type wifi \
  con-name "YourHotspotName" \
  ifname wlan0 \
  ssid "SSID_NAME" \
  wifi-sec.key-mgmt wpa-psk \
  wifi-sec.psk "PASSWORD"
```

**Note:** If you encounter connection issues, see **Section 6: Regulatory domain** - phone hotspots often require setting the regulatory domain first.

### 2.2 Adding home Wi‑Fi

Home Wi‑Fi is typically set up during initial Raspberry Pi configuration. If you need to add it manually:

```bash
sudo nmcli device wifi connect "YourWiFiName" password "YourPassword"
```

Or create a connection profile:
```bash
sudo nmcli connection add \
  type wifi \
  con-name "HomeWiFi" \
  ifname wlan0 \
  ssid "YourWiFiName" \
  wifi-sec.key-mgmt wpa-psk \
  wifi-sec.psk "YourPassword"
```

### 2.3 Adding eduroam (WPA2 802.1X)

Eduroam uses WPA2 Enterprise authentication with PEAP/MSCHAPV2. For UCL, use the following configuration.

**Add eduroam connection (UCL)**

Replace `ucqfvpl@ucl.ac.uk` with your UCL username and `YOUR_PASSWORD` with your password:

```bash
sudo nmcli connection add \
  type wifi \
  con-name eduroam \
  ifname wlan0 \
  ssid eduroam \
  wifi-sec.key-mgmt wpa-eap \
  802-1x.eap peap \
  802-1x.phase2-auth mschapv2 \
  802-1x.identity 'ucqfvpl@ucl.ac.uk' \
  802-1x.password 'YOUR_PASSWORD' \
  802-1x.anonymous-identity 'anonymous@ucl.ac.uk' \
  802-1x.ca-cert /etc/ssl/certs/ca-certificates.crt
```

**Quoting:**
- **Identity and password:** Use **single quotes** (`'value'`) to prevent shell interpretation of special characters (@, $, spaces, etc.)
- The `@` symbol in the identity requires quotes
- If your password contains a single quote, escape it: `'pass'\''word'` or use double quotes: `"password"`

**UCL-specific settings:**
- **Identity:** `ucqfvpl@ucl.ac.uk` (your UCL username with @ucl.ac.uk)
- **Anonymous identity:** `anonymous@ucl.ac.uk`
- **CA certificate:** Uses system certificates (`/etc/ssl/certs/ca-certificates.crt`)

**Alternative: Interactive setup (prompts for password)**

If you prefer not to include the password in the command:

```bash
sudo nmcli connection add \
  type wifi \
  con-name eduroam \
  ifname wlan0 \
  ssid eduroam \
  wifi-sec.key-mgmt wpa-eap \
  802-1x.eap peap \
  802-1x.phase2-auth mschapv2 \
  802-1x.identity 'ucqfvpl@ucl.ac.uk' \
  802-1x.anonymous-identity 'anonymous@ucl.ac.uk' \
  802-1x.ca-cert /etc/ssl/certs/ca-certificates.crt

# Then set the password separately (will prompt for it)
sudo nmcli connection modify eduroam 802-1x.password
```

**Connect to eduroam**

```bash
sudo nmcli connection up eduroam
```

**Set priority (optional)**

If you want eduroam to have a specific priority in the auto-connect order:

```bash
sudo nmcli connection modify eduroam connection.autoconnect yes connection.autoconnect-priority 15
```

**Optional: Set server name verification (if certificate verification fails)**

If you encounter certificate verification issues, you can specify the domain to match:

```bash
sudo nmcli connection modify eduroam 802-1x.domain-suffix-match ucl.ac.uk
```

Or use exact domain matching:

```bash
sudo nmcli connection modify eduroam 802-1x.domain-match ucl.ac.uk
```

Or disable strict certificate verification (less secure, but matches phone setting):

```bash
sudo nmcli connection modify eduroam 802-1x.system-ca-certs yes
sudo nmcli connection modify eduroam 802-1x.ca-cert ""
```

**Troubleshooting**

If connection fails:
1. Verify your credentials are correct (format: `ucqfvpl@ucl.ac.uk`)
2. Check connection status: `nmcli connection show eduroam`
3. View connection logs: `journalctl -u NetworkManager -f`
4. Verify the CA certificate path: `ls -la /etc/ssl/certs/ca-certificates.crt`
5. Try connecting manually: `sudo nmcli device wifi connect eduroam`

**SSH access limitation on eduroam**

**Important:** Direct SSH from your laptop to the Raspberry Pi will **not work** when both devices are connected to eduroam, even if you know the Pi's IP address.

**Why:** Eduroam uses **AP isolation** (also called client isolation), which blocks direct client-to-client communication. This is a security feature common on institutional networks that prevents devices on the same Wi‑Fi network from communicating directly with each other.

**Workaround: Use Pi Connect**

Since direct SSH is blocked, you must use **Pi Connect** (or another tunnel/VPN solution) to access your Raspberry Pi remotely:

1. **Set up Pi Connect** on your Raspberry Pi (if not already done)
2. **Access the Pi** via Pi Connect's remote shell feature from your laptop
3. Pi Connect works because it routes traffic through a cloud service, bypassing the AP isolation

**Alternative workarounds:**
- Use your phone hotspot when you need direct SSH access
- Set up a reverse SSH tunnel through a VPS/server accessible from both devices
- Use a VPN that both devices connect to

**Note:** The Pi's eduroam IP address (check with `hostname -I`) is still useful for reference, but you cannot SSH directly to it from another device on eduroam.

### 2.4 Verify connections

After adding connections, verify they're saved:
```bash
nmcli connection show
```

You should see all your saved connections listed.

### 2.5 Removing duplicate connections

If NetworkManager warns about duplicate connections (e.g., multiple profiles with the same name), remove them before creating a new one.

**List all connections:**
```bash
nmcli connection show
```

This shows all saved profiles with their UUIDs. Look for duplicate entries with the same name.

**Delete duplicates by name:**
```bash
nmcli connection delete CONNECTION_NAME
```

If multiple profiles share the same name, repeat the command until all are removed.

**Delete by UUID (more reliable):**
```bash
nmcli connection delete UUID
```

Use the UUID from `nmcli connection show` output. Repeat for each duplicate UUID.

**Verify removal:**
```bash
nmcli connection show
```

Confirm no duplicate entries remain, then recreate the connection using the methods in sections 2.1–2.3.

**Quick reset (removes all Wi-Fi configs):**

⚠️ **CRITICAL WARNING:** This command will **delete ALL saved Wi-Fi connections** on your Raspberry Pi, including home Wi-Fi, phone hotspots, eduroam, and any other saved networks. After running this, your Pi will have **no Wi-Fi connectivity** until you manually re-add every network connection. If you're accessing the Pi remotely via SSH over Wi-Fi, **you will lose connection** and may need physical access to restore Wi-Fi. Only use this as a last resort if you're physically present or have alternative access methods.

```bash
sudo rm /etc/NetworkManager/system-connections/*
sudo systemctl restart NetworkManager
```

**After running this:** You must re-add all Wi-Fi connections from scratch using the methods in sections 2.1–2.3.

## 3. Automatic Wi‑Fi switching (NetworkManager)

NetworkManager uses **connection priorities**.

### List saved connections
```bash
nmcli connection show
```

### Set priorities
Higher number = preferred network.

Example:
```bash
sudo nmcli connection modify Pixel_4211 connection.autoconnect yes connection.autoconnect-priority 20
sudo nmcli connection modify netplan-wlan0-BT-9XCTRN connection.autoconnect yes connection.autoconnect-priority 10
```

Behaviour:
- Hotspot available → Pi switches to hotspot
- Hotspot gone → Pi falls back to home Wi‑Fi

## 4. Manually switching Wi‑Fi (immediate override)

### Switch to hotspot
```bash
sudo nmcli connection up Pixel_4211
```

### Switch to home Wi‑Fi
```bash
sudo nmcli connection up netplan-wlan0-BT-9XCTRN
```

### Reset Wi‑Fi and reconnect by priority
```bash
sudo nmcli device disconnect wlan0
sudo nmcli device connect wlan0
```

## 5. Network inspection and utilities

### Show IP address
```bash
hostname -I
```

### Show detailed Wi‑Fi info
```bash
nmcli device show wlan0
```

### Scan Wi‑Fi networks (root required)
```bash
sudo nmcli device wifi rescan
nmcli device wifi list
```

## 6. Regulatory domain (required for phone hotspots)

Many phone hotspots use **2.4 GHz channel 13**, which is blocked unless the country is set.

Set once:
```bash
sudo iw reg set GB
sudo systemctl restart NetworkManager
```

## 7. SSH access: connecting to the Pi

### 7.1 On home Wi‑Fi

Both **PowerShell and WSL** work on home Wi‑Fi.

#### Using hostname (works in both PowerShell and WSL)
```bash
ssh vplattner@raspberrypi
```

#### Using IP address (works in both PowerShell and WSL)
```bash
ssh vplattner@192.168.1.224
```

**Note:** `.local` hostname does NOT work on home Wi‑Fi.

### 7.2 On phone hotspots

Use **PowerShell or Windows Terminal**. WSL typically fails on phone hotspots.

#### Best option (mDNS over IPv6)
```powershell
ssh vplattner@raspberrypi.local
```

This resolves to an IPv6 link‑local address (`fe80::...`) and works on hotspots. Make sure your laptop is connected to the same hotspot as the Pi.

#### IPv4 fallback (when IP is known)
```powershell
ssh vplattner@10.85.82.194
```

**Note:** Regular hostname (`raspberrypi`) typically does NOT work on hotspots.

### 7.3 On eduroam

**Direct SSH does NOT work** on eduroam due to AP isolation (client-to-client communication is blocked).

**Use Pi Connect instead:**
1. Set up Pi Connect on your Raspberry Pi
2. Access the Pi via Pi Connect's remote shell feature from your laptop
3. Pi Connect routes traffic through a cloud service, bypassing AP isolation

**Alternative:** Use your phone hotspot when you need direct SSH access.

**Note:** Even if you know the Pi's eduroam IP address (check with `hostname -I`), you cannot SSH directly to it from another device on eduroam.

### 7.4 WSL limitations

WSL works on **home Wi‑Fi** but typically fails on **phone hotspots** because:
- WSL is behind a NAT (`172.31.x.x`)
- It cannot reliably reach IPv6 link‑local addresses (commonly used by hotspots)
- Hotspot client-to-client communication may be restricted

**Recommendation:** Use PowerShell for SSH, especially when connecting via phone hotspots.

## 8. Quick reference: what works where

**Critical requirement:** Both your laptop and Raspberry Pi must be connected to the same network (home Wi‑Fi or phone hotspot). **Note:** Direct SSH does not work on eduroam - use Pi Connect instead.

**On home Wi‑Fi:**
- PowerShell and WSL both work
- Regular hostname (`raspberrypi`) works
- IP address works
- `.local` hostname does NOT work

**On phone hotspots:**
- PowerShell SSH works
- `.local` hostname (IPv6 mDNS) works
- Direct IPv4 SSH works if client‑to‑client traffic is allowed
- WSL SSH typically fails
- Regular hostname typically does NOT work

**On eduroam:**
- **Direct SSH does NOT work** (AP isolation blocks client-to-client communication)
- **Use Pi Connect** for remote shell access
- Alternative: Switch to phone hotspot when direct SSH is needed
