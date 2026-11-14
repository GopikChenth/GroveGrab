from pathlib import Path
import subprocess
import sys

REQUIREMENTS_FILE = Path(__file__).parent / 'requirements.txt'


def check_python() -> bool:
    version = sys.version_info
    if version.major < 3 or (version.major == 3 and version.minor < 8):
        print(f"Error: Python 3.8+ is required. Found Python {version.major}.{version.minor}")
        return False
    return True


def install_requirements() -> bool:
    if not check_python():
        return False

    if not REQUIREMENTS_FILE.exists():
        print("requirements.txt not found.")
        return False

    print("Checking and installing dependencies from requirements.txt...")
    try:
        subprocess.check_call([
            sys.executable,
            '-m',
            'pip',
            'install',
            '--disable-pip-version-check',
            '-r',
            str(REQUIREMENTS_FILE)
        ])
        print("✓ All dependencies are installed!")
        return True
    except subprocess.CalledProcessError:
        print("✗ Failed to install dependencies")
        return False


if __name__ == '__main__':
    success = install_requirements()
    sys.exit(0 if success else 1)
