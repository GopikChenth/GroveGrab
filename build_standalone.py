import os
from pathlib import Path
import shutil
import PyInstaller.__main__

PROJECT_ROOT = Path(__file__).parent
BACKEND_DIR = PROJECT_ROOT / "Backend"
CLIENT_DIST = PROJECT_ROOT / "Client" / "dist"
DISTRIBUTION_DIR = PROJECT_ROOT / "Distribution"

if DISTRIBUTION_DIR.exists():
    shutil.rmtree(DISTRIBUTION_DIR)
DISTRIBUTION_DIR.mkdir(exist_ok=True)

if not CLIENT_DIST.exists():
    print("ERROR: Frontend not built. Run 'npm run build' in Client folder first.")
    exit(1)

pyinstaller_args = [
    str(BACKEND_DIR / "app.py"),
    "--name=GroveGrab",
    "--onefile",
    "--noconsole",
    f"--distpath={DISTRIBUTION_DIR}",
    f"--workpath={PROJECT_ROOT / 'build'}",
    f"--specpath={PROJECT_ROOT}",
    f"--add-data={CLIENT_DIST}{os.pathsep}frontend",
    "--hidden-import=flask",
    "--hidden-import=flask_cors",
    "--hidden-import=spotdl",
    "--hidden-import=spotdl.utils",
    "--hidden-import=spotdl.download",
    "--hidden-import=spotdl.providers",
    "--hidden-import=spotdl.providers.audio",
    "--hidden-import=spotdl.providers.lyrics",
    "--hidden-import=mutagen",
    "--hidden-import=yt_dlp",
    "--collect-all=flask",
    "--collect-all=flask_cors",
    "--collect-all=spotdl",
    "--collect-all=yt_dlp",
    "--noconfirm",
]

PyInstaller.__main__.run(pyinstaller_args)
