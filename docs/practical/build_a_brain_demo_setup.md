---
title: Build a Brain Demo Setup
tags:
- work
- course
- nbb
- raspberry-pi
---

# Build a brain demo setup (fresh card)


This guide is for running the Look project on the NB3 (Raspberry Pi) through VS Code Remote SSH.

## 0) Connect to the NB3 with VS Code Remote SSH

1. On your laptop/desktop, open VS Code.
2. Use Remote SSH to connect to your NB3 (Raspberry Pi).
3. Open the folder: `~/NoBlackBoxes/LastBlackBox`
4. Open a terminal **inside that VS Code Remote window**.

**Why:** all commands below must run on the NB3, not on your local computer.

## 1) Open the repo in terminal
  

```bash
cd ~/NoBlackBoxes/LastBlackBox
```

  
**Why:** all project commands assume this root folder.

## 2) Confirm clean Git state

```bash
git status
```

Expected: `nothing to commit, working tree clean`

**Why:** ensures a known baseline.

## 3) Run Sync twice (from inside VS Code terminal on NB3)


```bash
Sync
Sync
```

  
**Why:** the first run may only pull the newer `sync.sh`; the second run executes that newer script and applies the Python path fix automatically.

## 4) Close and reopen terminal

Open a new terminal, then:

```bash
cd ~/NoBlackBoxes/LastBlackBox
```

  **Why:** reloads shell environment from startup files.

  
## 5) Confirm environment loaded
  

```bash
echo "$LBB"
type Sync
which python
python -V
```

  
Expected:
 
- `LBB` points to `~/NoBlackBoxes/LastBlackBox`
- `Sync` exists as alias/script
- Python points to `_tmp/LBB/bin/python`

## 6) Validate required Python imports


```bash
python - <<'PY'
import LBB.config
import NB3.Vision.camera
print("Environment imports OK")
PY
```

  
If this succeeds, continue to Step 7.

If it fails after two `Sync` runs:

1. Run `Sync` one more time.
2. Open a fresh terminal and return to the repo root.
3. Re-run the import test in Step 6.

  If it still fails, stop here and troubleshoot the Python environment before continuing.

  ## 7) Check serial device
  

```bash
PORTS=$(ls /dev/ttyUSB* /dev/ttyACM* 2>/dev/null || true)
if [ -n "$PORTS" ]; then
echo "$PORTS"
else
echo "No serial device found"
fi
```
  

**Why:** `look.py` needs serial hardware.

## 8) Run demo


```bash
cd ~/NoBlackBoxes/LastBlackBox/boxes/intelligence/NPU/look-NB3
python look.py
```

  
## Sync script comparison (old vs newer)

Use this section only as reference when diagnosing `Sync` behavior during transitions.

Key differences:

- **Invocation:** old uses `#!/bin/bash`; newer uses `#!/bin/bash -i`.
- **Python path fix:** old does not create `local.pth`; newer writes `libs` path into venv `site-packages/local.pth`.
- **Shell config copied:** old copies `.bash_aliases`; newer copies custom `.bashrc`.
- **Why two runs can help:** if first run starts with old script, it can pull the newer script; second run executes newer logic.

Old local version (`course/versions/buildabrain/_resources/demo-NB3/sync.sh`):


```bash
#!/bin/bash
set -eu

# Sync "The Last Black Box" GitHub repo
echo "Syncing LBB Git Repo..."
git -C ${LBB} pull

# Copy .bash_aliases to home directory
echo "Copying .bash_aliases..."
cp ${LBB}/course/versions/buildabrain/_resources/demo-NB3/.bash_aliases ${HOME}/.

# Sourcing .bashrc
echo "Sourcing .bashrc..."
source ${HOME}/.bashrc

echo "Sync Complete."
```

  
Newer remote version:
 

```bash
#!/bin/bash -i
set -eu

# Sync "The Last Black Box" GitHub repo
echo "Syncing LBB Git Repo..."
git -C ${LBB} pull

# Get the current Python version (into an environment variable that can be used by Linux)
PYTHON_VERSION=$(python -c 'import sys; print(".".join(map(str, sys.version_info[:2])))')

echo "Python version is $PYTHON_VERSION"

# Insert the local libraries path (libs) into (>) a *.pth file contained in your LBB virtual environment
echo "$HOME/NoBlackBoxes/LastBlackBox/libs" > "$HOME/NoBlackBoxes/LastBlackBox/_tmp/LBB/lib/python${PYTHON_VERSION}/site-packages/local.pth"

echo "LastBlackBox python libraries (libs) folder added to search path (as local.pth)"

# Copy custom .bashrc to home directory
echo "Copying custom .bashrc..."
cp ${LBB}/course/versions/buildabrain/_resources/demo-NB3/.bashrc ${HOME}/.

# Sourcing .bashrc
echo "Sourcing .bashrc..."
source ${HOME}/.bashrc
echo "Sync Complete."
```

  
## Related course docs

- Setup VS Code folder: `course/versions/buildabrain/_resources/setup-vscode.md`
- SSH with VS Code: `course/versions/buildabrain/_resources/ssh-with-vscode.md`
- Demo projects: `course/versions/buildabrain/_resources/demo-projects.md`