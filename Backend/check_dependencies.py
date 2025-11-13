"""
Check and install Python dependencies for GroveGrab
This script ensures all required packages are installed
"""
import subprocess
import sys
import os

REQUIRED_PACKAGES = [
    'flask==3.1.0',
    'flask-cors==5.0.0',
    'spotdl==4.2.8',
    'requests==2.32.3',
]

def check_python():
    """Check if Python is available"""
    try:
        version = sys.version_info
        if version.major < 3 or (version.major == 3 and version.minor < 8):
            print(f"Error: Python 3.8+ is required. You have Python {version.major}.{version.minor}")
            return False
        print(f"✓ Python {version.major}.{version.minor}.{version.micro} detected")
        return True
    except Exception as e:
        print(f"Error checking Python: {e}")
        return False

def install_package(package):
    """Install a single package"""
    try:
        print(f"Installing {package}...")
        subprocess.check_call([
            sys.executable, 
            '-m', 
            'pip', 
            'install', 
            '--quiet',
            '--disable-pip-version-check',
            package
        ])
        print(f"✓ {package} installed")
        return True
    except subprocess.CalledProcessError:
        print(f"✗ Failed to install {package}")
        return False

def check_and_install():
    """Check and install all required packages"""
    if not check_python():
        return False
    
    print("\nChecking required packages...")
    
    all_installed = True
    for package in REQUIRED_PACKAGES:
        package_name = package.split('==')[0]
        try:
            __import__(package_name.replace('-', '_'))
            print(f"✓ {package_name} is installed")
        except ImportError:
            print(f"✗ {package_name} not found")
            if not install_package(package):
                all_installed = False
    
    if all_installed:
        print("\n✓ All dependencies are installed!")
        return True
    else:
        print("\n✗ Some dependencies failed to install")
        return False

if __name__ == '__main__':
    success = check_and_install()
    sys.exit(0 if success else 1)
