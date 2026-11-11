---
title: Flashing Raspberry Pi SD Cards with Prepared NB3 Image
tags:
- work
- course
- nbb
- raspberry-pi
---

# Flashing Raspberry Pi SD Cards with Prepared NB3 Image

This guide walks you through, in order:

1. Downloading and flashing the NB3 image  
2. Getting the Pi online (phone hotspot or classroom routers)  
3. SSH’ing in with the default hostname  
4. Setting the correct hostname `NB3-XX`  
5. Setting Wi‑Fi priority so each Pi prefers **network A** or **network B**  
6. (Optionally) Doing 4–5 with a single interactive script

The image is preconfigured so that after flashing:

- hostname is initially **`NB3`**  
- user: **`student`**, password: **`noblackboxes`**  
- Wi‑Fi connections **`NB3-A`** and **`NB3-B`** both exist with **priority 0** (no preference yet)  
- you can try to reach it as `NB3` (or `NB3.local` if mDNS is working)

---

## 1. Download the prepared image

Download the SD card image from Dropbox and save the `.img` file locally:

<https://www.dropbox.com/scl/fi/j32ixu6x7xdohyz6h8aac/NB3-card.img?rlkey=vleakxqrurnbqcf28aovmek0e&st=8r78y9mq&dl=0>

Example filename:

```
NB3-card.img
```


## 2. Flash the SD card

Use **Balena Etcher**.

Steps:

1. Insert the SD card into your computer.    
2. Open **Balena Etcher**.    
3. Select the downloaded image file.    
4. Select the SD card as the target.    
5. Click **Flash** and wait until it completes.


## 3. What the image contains after flashing

Once the card is flashed (before any customization), the Pi will have:

- hostname: `NB3`  
- user: `student`  
- password: `noblackboxes`  
- Wi‑Fi connections: `NB3-A` and `NB3-B`, both with `connection.autoconnect-priority = 0`  
  - this means it can connect to either A or B once those networks are in range  

You will change the hostname and Wi‑Fi priority in later steps.


## 4. Bring up a Wi‑Fi network (phone hotspot or routers)

For initial setup, you can use either a phone hotspot **or** the classroom routers.

### Option A: Phone hotspot

On your phone, enable a Wi‑Fi hotspot with:

```
SSID: NB3-A
Password: noblackboxes
```


### Option B: Classroom routers

There are two preconfigured routers in the lab:

- **Router A (LBB-01)** — network **A**  
- **Router B (LBB-02)** — network **B**

Router A (`LBB-01`):

- router IP: `192.168.1.1`  
- router password: `n0bl@ckb0xes` (the 0's are zeros)  
- SSID (5 GHz): `LBB-A`  
- SSID (2.4 GHz): `NB3-A`  
- Wi‑Fi password: `noblackboxes`

Router B (`LBB-02`):

- router IP: `192.168.2.1`  
- router password: `n0bl@ckb0xes` (the 0's are zeros)  
- SSID (5 GHz): `LBB-B`  
- SSID (2.4 GHz): `NB3-B`  
- Wi‑Fi password: `noblackboxes`

You can use **either A or B** for initial setup.


## 5. Boot the Pi with the new card

1. Safely remove the SD card from your computer.    
2. Insert it into the Raspberry Pi.    
3. Power on the Pi.

The Pi will boot with the default hostname:

```
NB3
```

As soon as it sees `NB3-A` or `NB3-B` (phone hotspot or router), it will connect to one of them (no preference yet, both priorities are 0).


## 6. SSH into the Pi using the default hostname

On your laptop (connected to the same network / hotspot), try:

```bash
ssh student@NB3
```

If mDNS is working on your system, you can also try:

```bash
ssh student@NB3.local
```

If this works, you are in. If it fails, see **Troubleshooting** at the end to find the IP address.


## 7. Set the hostname for this rig (NB3-XX)

Each Pi should have a unique hostname like:

```
NB3-01
NB3-02
NB3-03
...
NB3-15
```

### 7.1 Set the hostname

Pick the rig number you want (e.g. `01`) and run:

```bash
sudo hostnamectl set-hostname NB3-01
```

Replace `01` with the correct number for that Pi.


### 7.2 Update the `/etc/hosts` file

Open the hosts file:

```bash
sudo nano /etc/hosts
```

Find the line:

```
127.0.1.1   NB3
```

and change it to:

```
127.0.1.1   NB3-01
```

Again, replace `01` with the correct number.

Save and exit (`Ctrl+O`, `Enter`, `Ctrl+X` in nano).


### 7.3 Reboot and verify

Reboot to apply the hostname change:

```bash
sudo reboot
```

SSH again using the new hostname (for example):

```bash
ssh student@NB3-01
```

To further verify, run:

```bash
hostname
```

Expected output:

```text
NB3-01
```


## 8. Set Wi‑Fi network priority (NB3-A vs NB3-B)

Some Pis should prefer **network A (NB3-A)**, others should prefer **network B (NB3-B)**.  
By default, both connections have priority `0`, so the Pi can attach to either.

You control this using NetworkManager connection priorities.

### Example: make NB3-B preferred

1. **Raise NB3-B priority**:

   ```bash
   sudo nmcli connection modify NB3-B connection.autoconnect-priority 100
   ```

2. (Optional) **Lower NB3-A priority** so B clearly wins:

   ```bash
   sudo nmcli connection modify NB3-A connection.autoconnect-priority 0
   ```

3. **Confirm the result**:

   ```bash
   nmcli -f NAME,AUTOCONNECT,AUTOCONNECT-PRIORITY connection
   ```

Check that `NB3-B` now has a higher `AUTOCONNECT-PRIORITY` than `NB3-A` for that Pi.

Use the opposite priorities if you want the Pi to prefer **NB3-A** instead.


## 9. (Optional) Interactive setup script

Instead of doing hostname and Wi‑Fi priority manually, you can use this script.

It will:

- ask which network to prefer (**A** → `NB3-A`, **B** → `NB3-B`)  
- ask for the host number  
- set Wi‑Fi priority for the chosen network  
- set the hostname to `NB3-XX` and update `/etc/hosts`

You can paste this directly into a terminal on the Pi, or save it as `nb3_setup.sh` and run `bash nb3_setup.sh`:

```bash
#!/usr/bin/env bash
set -euo pipefail

read -rp "Select network for this Pi (A/B): " NET
NET=${NET^^}  # uppercase

if [[ "$NET" != "A" && "$NET" != "B" ]]; then
  echo "Invalid network. Please enter A or B." >&2
  exit 1
fi

SSID="NB3-$NET"

read -rp "Enter host number (1-99): " NUM

if ! [[ "$NUM" =~ ^[0-9]+$ ]]; then
  echo "Host number must be a number (1-99)." >&2
  exit 1
fi

if (( NUM < 1 || NUM > 99 )); then
  echo "Host number must be between 1 and 99." >&2
  exit 1
fi

printf -v NUM_PAD "%02d" "$NUM"
HOSTNAME="NB3-$NUM_PAD"

echo
echo "Setting Wi-Fi priority so $SSID is preferred..."
sudo nmcli connection modify "$SSID" connection.autoconnect-priority 100

OTHER_SSID=$([[ "$NET" == "A" ]] && echo "NB3-B" || echo "NB3-A")
sudo nmcli connection modify "$OTHER_SSID" connection.autoconnect-priority 0 || true

echo
echo "Current connection priorities:"
nmcli -f NAME,AUTOCONNECT,AUTOCONNECT-PRIORITY connection

echo
echo "Setting hostname to $HOSTNAME ..."
sudo hostnamectl set-hostname "$HOSTNAME"

echo "Updating /etc/hosts ..."
sudo sed -i -E "s/^(127\.0\.1\.1[[:space:]]+).*/\1$HOSTNAME/" /etc/hosts

echo
echo "Done."
echo "New hostname:"
hostname
```


## 10. Result

Each flashed card will end up with a unique hostname:

```
NB3-01
NB3-02
NB3-03
...
NB3-15
```

and a clear preference for **either** `NB3-A` **or** `NB3-B`, depending on how you configured it.

You can then connect easily with, for example:

```bash
ssh student@NB3-07
```

or, if mDNS is working:

```bash
ssh student@NB3-07.local
```

or directly via IP if needed.


## Troubleshooting: hostname does not resolve

If `ssh student@NB3` or `ssh student@NB3-XX` fails (hostname doesn’t resolve), you can find the Pi by scanning the network and then SSH’ing by IP.

### 1. Find the IP address

From your laptop, scan the network to find the Pi.

Example on Windows PowerShell:

```powershell
nmap -sn 10.186.146.0/24
```

Look for the device labeled:

```
Raspberry Pi (Trading)
```

Example output:

```
10.186.146.194  Raspberry Pi (Trading)
```

Use that IP in the next step.


### 2. SSH using the IP address

Once you know the IP address, connect with:

```bash
ssh student@10.186.146.194
```

Log in with:

- user: `student`  
- password: `noblackboxes`
