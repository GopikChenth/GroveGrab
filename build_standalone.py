"""
Build standalone GroveGrab executable with embedded frontend
"""
import PyInstaller.__main__
import os
import shutil
from pathlib import Path

# Get project root
PROJECT_ROOT = Path(__file__).parent
BACKEND_DIR = PROJECT_ROOT / "Backend"
CLIENT_DIST = PROJECT_ROOT / "Client" / "dist"
DISTRIBUTION_DIR = PROJECT_ROOT / "Distribution"

# Clear Distribution folder
if DISTRIBUTION_DIR.exists():
    shutil.rmtree(DISTRIBUTION_DIR)
DISTRIBUTION_DIR.mkdir(exist_ok=True)

print("Building GroveGrab standalone executable...")
print(f"Project root: {PROJECT_ROOT}")
print(f"Backend: {BACKEND_DIR}")
print(f"Frontend dist: {CLIENT_DIST}")
print(f"Output: {DISTRIBUTION_DIR}")

# Ensure frontend is built
if not CLIENT_DIST.exists():
    print("ERROR: Frontend not built. Please run 'npm run build' in Client folder first.")
    exit(1)

# PyInstaller arguments
pyinstaller_args = [
    str(BACKEND_DIR / "standalone.py"),  # Main script
    "--name=GroveGrab",  # Name of executable
    "--onefile",  # Single executable
    "--noconsole",  # No console window
    f"--distpath={DISTRIBUTION_DIR}",  # Output directory
    f"--workpath={PROJECT_ROOT / 'build'}",  # Working directory
    f"--specpath={PROJECT_ROOT}",  # Spec file location
    
    # Add frontend files
    f"--add-data={CLIENT_DIST};frontend",
    
    # Add Backend files
    f"--add-data={BACKEND_DIR / 'download_manager.py'};.",
    f"--add-data={BACKEND_DIR / 'config.json'};.",
    
    # Hidden imports for Flask and dependencies
    "--hidden-import=flask",
    "--hidden-import=flask_cors",
    "--hidden-import=spotdl",
    "--hidden-import=spotdl.utils",
    "--hidden-import=spotdl.download",
    "--hidden-import=spotdl.providers",
    "--hidden-import=spotdl.providers.audio",
    "--hidden-import=spotdl.providers.lyrics",
    "--hidden-import=engineio.async_drivers.threading",
    "--hidden-import=werkzeug",
    "--hidden-import=jinja2",
    "--hidden-import=click",
    "--hidden-import=mutagen",
    "--hidden-import=requests",
    "--hidden-import=yt_dlp",
    
    # Collect all from these packages
    "--collect-all=flask",
    "--collect-all=flask_cors",
    "--collect-all=spotdl",
    "--collect-all=yt_dlp",
    
    # Icon (if exists)
    # "--icon=path/to/icon.ico",
    
    # No confirm
    "--noconfirm",
]

print("\nRunning PyInstaller...")
PyInstaller.__main__.run(pyinstaller_args)

print(f"\n✓ Build complete! Executable: {DISTRIBUTION_DIR / 'GroveGrab.exe'}")
print(f"✓ You can now run the application from: {DISTRIBUTION_DIR}")
