#./bootstrap.sh
export FLASK_APP=./index.py

# Activate the existing virtual environment
source ../search-engine-venv/bin/activate  # On macOS and Linux
# search-engine-venv\Scripts\activate  # On Windows (Command Prompt)
# search-engine-venv\Scripts\Activate.ps1  # On Windows (PowerShell)

# Run the Flask application within the activated virtual environment
flask --debug run -h 0.0.0.0