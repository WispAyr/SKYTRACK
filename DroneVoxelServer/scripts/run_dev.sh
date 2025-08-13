#!/bin/bash

# DroneVoxelServer Development Startup Script
# This script starts the main application in development mode

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${GREEN}🚀 Starting DroneVoxelServer in development mode...${NC}"

# Check if we're in the right directory
if [ ! -f "README.md" ]; then
    echo -e "${RED}❌ Error: Please run this script from the DroneVoxelServer root directory${NC}"
    exit 1
fi

# Check if Python is available
if ! command -v python3 &> /dev/null; then
    echo -e "${RED}❌ Error: Python 3 is not installed${NC}"
    exit 1
fi

# Check if Poetry is available
if ! command -v poetry &> /dev/null; then
    echo -e "${YELLOW}⚠️  Warning: Poetry not found, installing...${NC}"
    curl -sSL https://install.python-poetry.org | python3 -
    export PATH="$HOME/.local/bin:$PATH"
fi

# Install dependencies if needed
if [ ! -d ".venv" ]; then
    echo -e "${YELLOW}📦 Installing dependencies...${NC}"
    poetry install
fi

# Check if configuration files exist
if [ ! -f "configs/site.yaml" ]; then
    echo -e "${YELLOW}⚠️  Warning: configs/site.yaml not found, copying from example...${NC}"
    cp configs/site.example.yaml configs/site.yaml
    echo -e "${YELLOW}⚠️  Please edit configs/site.yaml with your camera settings${NC}"
fi

if [ ! -f "configs/media-server.yaml" ]; then
    echo -e "${YELLOW}⚠️  Warning: configs/media-server.yaml not found, copying from example...${NC}"
    cp configs/media-server.example.yaml configs/media-server.yaml
    echo -e "${YELLOW}⚠️  Please edit configs/media-server.yaml with your media server settings${NC}"
fi

# Check for GPU
if command -v nvidia-smi &> /dev/null; then
    echo -e "${GREEN}✅ NVIDIA GPU detected${NC}"
    nvidia-smi --query-gpu=name,memory.total --format=csv,noheader,nounits
else
    echo -e "${YELLOW}⚠️  Warning: No NVIDIA GPU detected. Performance will be limited.${NC}"
fi

# Start the application
echo -e "${GREEN}🚀 Starting DroneVoxelServer...${NC}"
echo -e "${GREEN}📡 API will be available at: http://localhost:8080${NC}"
echo -e "${GREEN}📊 Health check: http://localhost:8080/health${NC}"
echo -e "${GREEN}📖 API docs: http://localhost:8080/docs${NC}"
echo -e "${YELLOW}Press Ctrl+C to stop${NC}"

# Activate virtual environment and start
poetry run python -m apps.api_server.main
