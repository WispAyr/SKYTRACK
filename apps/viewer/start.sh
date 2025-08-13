#!/bin/bash

# DroneVoxelServer Viewer Startup Script
# This script starts the React-based viewer application

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${GREEN}🎨 Starting DroneVoxelServer Viewer...${NC}"

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo -e "${RED}❌ Error: Please run this script from the viewer directory${NC}"
    exit 1
fi

# Check if Node.js is available
if ! command -v node &> /dev/null; then
    echo -e "${RED}❌ Error: Node.js is not installed${NC}"
    echo -e "${YELLOW}💡 Install Node.js from: https://nodejs.org/${NC}"
    exit 1
fi

# Check Node.js version
NODE_VERSION=$(node --version | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 16 ]; then
    echo -e "${RED}❌ Error: Node.js 16+ is required (current: $(node --version))${NC}"
    exit 1
fi

# Check if npm is available
if ! command -v npm &> /dev/null; then
    echo -e "${RED}❌ Error: npm is not installed${NC}"
    exit 1
fi

# Install dependencies if needed
if [ ! -d "node_modules" ]; then
    echo -e "${YELLOW}📦 Installing dependencies...${NC}"
    npm install
fi

# Start the development server
echo -e "${GREEN}🚀 Starting development server...${NC}"
echo -e "${GREEN}📱 Viewer will be available at: http://localhost:3000${NC}"
echo -e "${GREEN}📡 API proxy configured to: http://localhost:8080${NC}"
echo -e "${YELLOW}Press Ctrl+C to stop${NC}"

npm run dev
