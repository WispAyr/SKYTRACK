#!/bin/bash

# DroneVoxelServer Media Server Startup Script
# This script starts the media server component for RTP stream management

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${GREEN}📡 Starting DroneVoxelServer Media Server...${NC}"

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
if [ ! -f "configs/media-server.yaml" ]; then
    echo -e "${YELLOW}⚠️  Warning: configs/media-server.yaml not found, copying from example...${NC}"
    cp configs/media-server.example.yaml configs/media-server.yaml
    echo -e "${YELLOW}⚠️  Please edit configs/media-server.yaml with your media server settings${NC}"
fi

# Check for required system dependencies
echo -e "${YELLOW}🔍 Checking system dependencies...${NC}"

# Check for GStreamer
if ! command -v gst-launch-1.0 &> /dev/null; then
    echo -e "${RED}❌ Error: GStreamer is not installed${NC}"
    echo -e "${YELLOW}💡 Install with: sudo apt install gstreamer1.0-tools gstreamer1.0-plugins-base gstreamer1.0-plugins-good${NC}"
    exit 1
fi

# Check for FFmpeg
if ! command -v ffmpeg &> /dev/null; then
    echo -e "${YELLOW}⚠️  Warning: FFmpeg not found, installing...${NC}"
    sudo apt update && sudo apt install -y ffmpeg
fi

# Check network configuration
echo -e "${YELLOW}🌐 Checking network configuration...${NC}"

# Check if ports are available
PORT_START=50000
PORT_END=50100

for port in $(seq $PORT_START $PORT_END); do
    if lsof -Pi :$port -sTCP:LISTEN -t >/dev/null 2>&1; then
        echo -e "${YELLOW}⚠️  Warning: Port $port is already in use${NC}"
    fi
done

# Check for GPU
if command -v nvidia-smi &> /dev/null; then
    echo -e "${GREEN}✅ NVIDIA GPU detected${NC}"
    nvidia-smi --query-gpu=name,memory.total --format=csv,noheader,nounits
else
    echo -e "${YELLOW}⚠️  Warning: No NVIDIA GPU detected. Performance will be limited.${NC}"
fi

# Start the media server
echo -e "${GREEN}📡 Starting Media Server...${NC}"
echo -e "${GREEN}🌐 RTP ports: $PORT_START-$PORT_END${NC}"
echo -e "${GREEN}📊 Health check: http://localhost:8081/health${NC}"
echo -e "${GREEN}📖 API docs: http://localhost:8081/docs${NC}"
echo -e "${YELLOW}Press Ctrl+C to stop${NC}"

# Activate virtual environment and start
poetry run python -m apps.media_server.main
