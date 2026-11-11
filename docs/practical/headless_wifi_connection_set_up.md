---
title: Headless Wi-Fi Setup for Raspberry Pi
tags:
- technical
- raspberry-pi
- wifi
- setup
- headless
- cloud-init
author: viktor
---
# Headless Wi-Fi Setup for Raspberry Pi

A guide for setting up Wi-Fi and SSH on a Raspberry Pi without a monitor or keyboard, using the Raspberry Pi Imager's initial configuration feature.

## The problem

When using Raspberry Pi Imager's "Edit settings" to configure Wi-Fi and SSH during installation, the initial configuration files (`user-data` and `network-config`) are processed by **cloud-init during the first boot**.

On current Raspberry Pi OS (Trixie), `network-config` is used by cloud-init to generate a persistent **Netplan** configuration. Netplan then configures NetworkManager, which manages the actual Wi-Fi connection.

Because the cloud-init configuration is intended for initial provisioning, it is important to make sure these files are correct **before the Pi is booted for the first time**.

**Solution:** After installing the OS, eject the SD card, re-insert it, and manually check or replace the configuration files before putting the SD card into the Raspberry Pi for its first boot.

This also gives us a known, reproducible Wi-Fi configuration for headless Pis rather than relying entirely on the configuration generated automatically by Raspberry Pi Imager.

## Prerequisites

- Raspberry Pi with SD card
- Computer with SD card reader
- Raspberry Pi Imager
- Wi-Fi network name (SSID) and password

## Step-by-step instructions

### 1. Initial installation

1. Use **Raspberry Pi Imager** to write Raspberry Pi OS to your SD card
2. Use the "Edit settings" feature to configure:
   - Wi-Fi network and password
   - SSH enablement
   - User account and password
3. Write the image to the SD card

### 2. Eject and re-insert SD card

**Important:** After the image is written:

1. **Eject the SD card** from your computer
2. **Re-insert the SD card** (this ensures the filesystem is properly mounted)
3. Navigate to the `boot` partition on the SD card

**Do not boot the Raspberry Pi yet.** The configuration should be checked or replaced before the first boot.

### 3. Locate configuration files

On the `boot` partition, you should find:

- `user-data` (or `user-data.txt`) - cloud-init configuration
- `network-config` - network configuration file

### 4. Replace configuration files

Manually create or replace the configuration files with the correct content (see sections below).

### 5. Eject and boot

1. Safely eject the SD card
2. Insert it into your Raspberry Pi
3. Power on the Pi
4. Wait for it to connect to Wi-Fi (LED indicators or check your router's connected devices)

During the first boot, cloud-init processes the configuration and creates the persistent system configuration.

## Configuration files

### Network configuration file

**Filename:** `network-config`

**Location:** On the `boot` partition

**Purpose:** Configures Wi-Fi using a Netplan-compatible configuration. Cloud-init processes this during initial provisioning, and Netplan provides the persistent network configuration used by NetworkManager.

```yaml
# This file contains a netplan-compatible configuration which cloud-init
# applies during initial provisioning.
#
# YAML is whitespace sensitive. Use spaces only.

network:
  version: 2

  wifis:
    renderer: NetworkManager

    wlan0:
      dhcp4: true                 # Automatically obtain IP address from router
      optional: true              # Allow boot to continue if Wi-Fi is unavailable
      regulatory-domain: GB       # Country code for Wi-Fi channels

      access-points:
        "NB3-A":                   # Wi-Fi network name (SSID)
          password: "noblackboxes" # Wi-Fi password
```

**Key settings explained:**

- `renderer: NetworkManager` - Tells Netplan to use NetworkManager to manage the Wi-Fi connection
- `dhcp4: true` - Automatically obtains an IP address from your router
- `optional: true` - Allows the Pi to finish booting even if Wi-Fi is temporarily unavailable
- `regulatory-domain: GB` - Sets the country code, which determines which Wi-Fi channels are allowed
- `access-points` - Lists Wi-Fi networks and their passwords

Using `optional: true` is preferable for a headless Pi. If the access point is temporarily unavailable, the Pi can still complete boot and NetworkManager can connect when the network becomes available again.

**To customize:**

- Replace `"NB3-A"` with your Wi-Fi network name (SSID)
- Replace `"noblackboxes"` with your Wi-Fi password
- Change `GB` to your country code (e.g., `US`, `DE`, `FR`)

### User data configuration file

**Location:** `user-data` (or `user-data.txt`) on the `boot` partition

**Purpose:** Cloud-init configuration file that sets up the user account, SSH access, and installs required packages on first boot.

```yaml
#cloud-config

# Set the hostname of the Raspberry Pi
hostname: NB3-100

# Ensure /etc/hosts is automatically updated with the hostname
manage_etc_hosts: true

# Enable SSH password authentication (needed for first login)
ssh_pwauth: true

# Create a user account
users:
  - name: student                 # Username
    gecos: student                # Full name/comment field
    sudo: ALL=(ALL) NOPASSWD:ALL  # Allow sudo without password
    shell: /bin/bash              # Default shell
    lock_passwd: false            # Ensure account is not locked

# Set plaintext password (cloud-init will hash it internally)
chpasswd:
  expire: false                   # Do not force password change on first login
  list:
    - student:noblackboxes        # username:password

# Install packages during first boot
packages:
  - openssh-server                # Ensure SSH server is installed

# Commands executed at the end of the cloud-init process
runcmd:
  - systemctl enable ssh          # Enable SSH service at boot
  - systemctl start ssh           # Start SSH service immediately
```


!!! info "Important"
     The first line **must** be exactly `#cloud-config` (no spaces before it). This is a special directive that tells cloud-init to process the file. Without it, cloud-init will ignore the configuration.


**Key settings explained:**

- `#cloud-config` - **REQUIRED** directive (must be the first line)
- `ssh_pwauth: true` - Allows password authentication for SSH
- `users:` - Creates a new user account with sudo privileges
  - `sudo: ALL=(ALL) NOPASSWD:ALL` - Grants full sudo access without requiring a password
  - `lock_passwd: false` - Keeps the account unlocked
- `chpasswd:` - Sets the user's password
- `packages:` - Lists packages to install during first boot
- `runcmd:` - Commands to run after package installation
  - Enables and starts the SSH service so you can connect immediately

**To customize:**

- Replace `student` with your desired username
- Replace `noblackboxes` with your desired password
- Change `NB3-100` to the required hostname
- Adjust sudo permissions if needed

## Troubleshooting

### Pi doesn't connect to Wi-Fi

1. **Check the network configuration file:**
   - Verify the SSID (network name) is exactly correct, including capitalization
   - Verify the password is correct
   - Ensure YAML indentation is correct (use spaces, not tabs)
2. **Check regulatory domain:**
   - Some Wi-Fi channels require the correct country code
   - Change `regulatory-domain: GB` to your country code if needed
3. **Verify file location:**
   - Ensure files are on the `boot` partition
   - Check that filenames are correct (`network-config` and `user-data`)

### SSH doesn't work

1. **Verify SSH is enabled:**
   - Check that `ssh_pwauth: true` is in `user-data`
   - Ensure `openssh-server` is in the packages list
   - Verify `runcmd` includes SSH enable/start commands
2. **Check user account:**
   - Verify username and password in `user-data` are correct
   - Ensure `lock_passwd: false` is set
3. **Find the Pi's IP address:**
   - Check your router's connected devices list
   - Use network scanning tools
   - Try connecting via hostname if your network supports it

### Configuration not applied

Cloud-init uses these files for **initial provisioning**. Do not assume that a failed Wi-Fi connection means cloud-init will treat the next boot as another first boot.

Therefore, make sure `network-config` and `user-data` are correct **before the Raspberry Pi is booted for the first time**.

If the Pi has already completed its initial provisioning, changing these files on the boot partition may not cause them to be processed again. In that case you may need to:

- Re-image the SD card, or
- Manually modify the existing system configuration

## Why this works

On current Raspberry Pi OS (Trixie), the network configuration follows approximately this chain:

```text
network-config
      ↓
  cloud-init
      ↓
   Netplan
      ↓
NetworkManager
      ↓
    Wi-Fi
```

`network-config` is used during initial provisioning to create the system's Netplan configuration.

Netplan then acts as the persistent source of the network configuration, while NetworkManager manages the actual Wi-Fi connection.

This is important because NetworkManager may generate runtime connection information under `/run/NetworkManager/`. Files under `/run` are temporary, but the persistent Netplan configuration allows the NetworkManager configuration to be regenerated when required.

This means the Pi does not depend on the original `network-config` file being re-read every time it boots.

For a headless Pi, the resulting behaviour should be:

1. The Wi-Fi SSID and password are configured during initial provisioning
2. The network configuration persists across reboots
3. If Wi-Fi is temporarily unavailable, the Pi can still complete boot
4. NetworkManager can reconnect when the Wi-Fi network becomes available again
5. A temporary Wi-Fi interruption should not require manually entering the password again

The important step is therefore to ensure that the configuration files are correct **before the first boot**, rather than relying on them being processed again after the Pi has already been provisioned.