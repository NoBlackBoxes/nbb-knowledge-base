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

!!! note
    For SSH to work, both the Raspberry Pi and your Windows laptop must be connected to the same Wi-Fi network (home Wi‑Fi or phone hotspot).

## 2. Adding Wi‑Fi connections

### 2.1 Adding a phone hotspot

First, scan for available networks:

```bash
sudo nmcli device wifi rescan
nmcli device wifi list
```

Find your phone hotspot in the list (look for your phone's name or the SSID you set).

#### Method 1: Interactive connection (recommended)

```bash
sudo nmcli device wifi connect "SSID_NAME" password "PASSWORD"
```

Replace `SSID_NAME` with your hotspot's name (e.g., `Pixel_4211`) and `PASSWORD` with the hotspot password.

#### Method 2: Add connection profile (for better control)

```bash
sudo nmcli connection add \
  type wifi \
  con-name "YourHotspotName" \
  ifname wlan0 \
  ssid "SSID_NAME" \
  wifi-sec.key-mgmt wpa-psk \
  wifi-sec.psk "PASSWORD"
```

!!! tip
    If you encounter connection issues, see **Section 6: Regulatory domain** - phone hotspots often require setting the regulatory domain first.

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

UCL's current eduroam CAT profile uses PEAP with MSCHAPv2 and validates the authentication server as `eduroam.ucl.ac.uk`.[^ucl-eduroam-cat]
The manual configuration below uses those settings with the operating system's CA trust store.

#### Add eduroam connection (UCL)

Replace `YOUR_UCL_USERNAME@ucl.ac.uk` with your UCL username and `YOUR_PASSWORD` with your password:

```bash
sudo nmcli connection add \
  type wifi \
  con-name eduroam \
  ifname wlan0 \
  ssid eduroam \
  wifi-sec.key-mgmt wpa-eap \
  802-1x.eap peap \
  802-1x.phase2-auth mschapv2 \
  802-1x.identity 'YOUR_UCL_USERNAME@ucl.ac.uk' \
  802-1x.password 'YOUR_PASSWORD' \
  802-1x.domain-match 'eduroam.ucl.ac.uk' \
  802-1x.ca-cert /etc/ssl/certs/ca-certificates.crt
```

**Quoting:**

- **Identity and password:** Use **single quotes** (`'value'`) to prevent shell interpretation of characters such as `$`, spaces, backticks, and backslashes.
- The `@` symbol does not require quoting, but consistently quoting the complete identity is harmless.
- If your password contains a single quote, use the interactive method below instead of placing the password in the command.

**UCL-specific settings:**

- **Identity:** `YOUR_UCL_USERNAME@ucl.ac.uk` (your UCL username with @ucl.ac.uk)
- **Anonymous identity:** The current UCL CAT profile does not set a separate anonymous identity.[^ucl-eduroam-cat]
- **Server name:** `eduroam.ucl.ac.uk`
- **CA certificate:** This manual configuration uses the system trust store (`/etc/ssl/certs/ca-certificates.crt`); the CAT installer instead installs the CA certificate selected by UCL.[^ucl-eduroam-cat]

#### Alternative: Prompt for the password when connecting

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
  802-1x.identity 'YOUR_UCL_USERNAME@ucl.ac.uk' \
  802-1x.domain-match 'eduroam.ucl.ac.uk' \
  802-1x.ca-cert /etc/ssl/certs/ca-certificates.crt

# Connect and enter the missing password when prompted
sudo nmcli --ask connection up eduroam
```

#### Connect to eduroam

```bash
sudo nmcli connection up eduroam
```

#### Set priority (optional)

If you want eduroam to have a specific priority in the auto-connect order:

```bash
sudo nmcli connection modify eduroam connection.autoconnect yes connection.autoconnect-priority 15
```

#### Optional: Change the server-name matching rule

!!! note
    The configuration above already uses the exact server name from UCL's current CAT profile.
    These commands show the available alternatives; the configured domain must match the current UCL authentication-server certificate.
    An incorrect value will prevent eduroam from authenticating.
    Check the current UCL CAT profile before changing it.

To accept the named server and any of its subdomains, use suffix matching:

```bash
sudo nmcli connection modify eduroam 802-1x.domain-match "" 802-1x.domain-suffix-match eduroam.ucl.ac.uk
```

To restore exact matching:

```bash
sudo nmcli connection modify eduroam 802-1x.domain-suffix-match "" 802-1x.domain-match eduroam.ucl.ac.uk
```

Or disable strict certificate verification (less secure, but matches phone setting):

```bash
sudo nmcli connection modify eduroam 802-1x.system-ca-certs yes
sudo nmcli connection modify eduroam 802-1x.ca-cert ""
```

#### Troubleshooting

If connection fails:

1. Verify your credentials are correct (format: `YOUR_UCL_USERNAME@ucl.ac.uk`)
2. Check connection status: `nmcli connection show eduroam`
3. View connection logs: `journalctl -u NetworkManager -f`
4. Verify the CA certificate path: `ls -la /etc/ssl/certs/ca-certificates.crt`
5. Try connecting manually: `sudo nmcli device wifi connect eduroam`

#### SSH access limitation on eduroam

!!! warning
    Direct SSH from your laptop to the Raspberry Pi will **not work** when both devices are connected to eduroam, even if you know the Pi's IP address.
    Eduroam uses **AP isolation** (also called client isolation), which blocks direct client-to-client communication.
    This is a security feature common on institutional networks that prevents devices on the same Wi‑Fi network from communicating directly with each other.

##### Workaround: Use Pi Connect

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

#### Quick reset (removes all Wi-Fi configurations)

!!! danger "Destructive: this deletes every saved Wi-Fi connection"
    Do **not** run this while relying on Wi-Fi for remote access. Restarting
    NetworkManager will disconnect your SSH session, and you may need physical
    access to restore connectivity.

    This removes home Wi-Fi, phone hotspots, eduroam, and every other saved
    network profile. Only use it as a last resort when you are physically
    present or have another access method.

    ```bash
    sudo rm /etc/NetworkManager/system-connections/*
    sudo systemctl restart NetworkManager
    ```

    Afterward, you must re-add all Wi-Fi connections using the methods in
    sections 2.1–2.3.

## 3. Automatic Wi‑Fi switching (NetworkManager)

NetworkManager uses **connection priorities**.[^networkmanager-autoconnect]

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

- If the Pi is disconnected and both networks are available, NetworkManager prefers the profile with the higher priority.
- If the Pi is already connected, the appearance of a higher-priority network does not trigger an automatic switch.
- If the active network becomes unavailable, NetworkManager attempts to connect using the best available eligible profile.

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

Set the WLAN country persistently:

```bash
sudo raspi-config
```

Select **Localisation Options → WLAN Country**, then select the country in which the Pi is being used.[^rpi-wlan-country]
For the United Kingdom, select `GB`.

Verify the current regulatory domain with:

```bash
iw reg get
```

## 7. SSH access: connecting to the Pi

!!! note
    The behaviour below was observed with the networks and client setup used for this guide.
    Hostname resolution and direct connectivity may vary with router configuration, mDNS support, WSL version, and network policy.

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

**Note:** `raspberrypi.local` did not resolve on the home network tested for this guide.
This depends on mDNS support and may work on other home networks.

### 7.2 On phone hotspots

On the phone hotspot tested for this guide, SSH worked from PowerShell and Windows Terminal but not from WSL.
WSL behaviour may vary with its networking mode and version.

#### Best option (mDNS over IPv6)

```powershell
ssh vplattner@raspberrypi.local
```

In the tested setup, this resolved to an IPv6 link‑local address (`fe80::...`) and worked on the hotspot.
Make sure your laptop is connected to the same hotspot as the Pi.

#### IPv4 fallback (when IP is known)

```powershell
ssh vplattner@10.85.82.194
```

**Note:** The unqualified hostname `raspberrypi` did not resolve on the hotspot tested here.
Use `raspberrypi.local` or the Pi's IP address instead.

### 7.3 On eduroam

**Direct SSH was blocked between devices connected to UCL eduroam in the setup tested for this guide.**
This appears to be caused by client isolation, which prevents direct communication between wireless clients.
Use Pi Connect or another tunnel-based access method instead.

**Use Pi Connect instead:**

1. Set up Pi Connect on your Raspberry Pi
2. Access the Pi via Pi Connect's remote shell feature from your laptop
3. Pi Connect routes traffic through a cloud service instead of relying on a direct connection between the devices

**Alternative:** Use your phone hotspot when you need direct SSH access.

**Note:** In the tested UCL eduroam setup, direct SSH remained blocked even when the Pi's IP address was known.
Check the Pi's IP address with `hostname -I`.

### 7.4 WSL limitations

In the setup tested for this guide, WSL worked on **home Wi‑Fi** but not on the **phone hotspot**.
Possible reasons include:

- WSL may be behind a NAT (`172.31.x.x`)
- IPv6 link‑local connectivity may be limited
- Hotspot client-to-client communication may be restricted

**Recommendation:** Use PowerShell for SSH, especially when connecting via phone hotspots.

## 8. Quick reference: what works where

This summary records the behaviour observed in the setup tested for this guide.

**Critical requirement:** For direct local SSH, your laptop and Raspberry Pi must be connected to the same network (home Wi‑Fi or phone hotspot).
Direct SSH was blocked on the tested UCL eduroam network, so use Pi Connect instead.

**On home Wi‑Fi:**

- PowerShell and WSL both work
- Regular hostname (`raspberrypi`) works
- IP address works
- `raspberrypi.local` did not resolve on the tested home network

**On phone hotspots:**

- PowerShell SSH works
- `.local` hostname (IPv6 mDNS) works
- Direct IPv4 SSH works if client‑to‑client traffic is allowed
- WSL SSH did not work in the tested hotspot setup
- Regular hostname did not resolve in the tested hotspot setup

**On eduroam:**

- **Direct SSH was blocked** on the tested UCL eduroam network
- **Use Pi Connect** for remote shell access
- Alternative: Switch to phone hotspot when direct SSH is needed

[^networkmanager-autoconnect]: [NetworkManager, *General connection-profile settings*](https://networkmanager.dev/docs/api/latest/settings-connection.html).
[^rpi-wlan-country]: [Raspberry Pi, *Configuration: Enable wireless networking*](https://www.raspberrypi.com/documentation/computers/configuration.html#enable-wireless-networking).
[^ucl-eduroam-cat]: [GÉANT eduroam CAT, *University College London Linux profile*](https://cat.eduroam.org/user/API.php?action=downloadInstaller&lang=en&profile=157&device=linux&generatedfor=user&openroaming=0).
