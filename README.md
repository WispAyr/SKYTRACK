# DroneVoxelServer

A high-performance, multi-camera drone detection and tracking system that uses 3D voxel projection and self-calibration to detect, localize, and track small UAVs in real-time.

## 🚀 Features

- **Multi-RTP Stream Support**: Handle up to 64 concurrent camera streams
- **3D Voxel Projection**: GPU-accelerated motion energy projection into world-aligned voxel grid
- **Self-Calibration**: Automatic camera calibration without manual surveying
- **Real-time Detection**: <500ms latency from frame to alert
- **Advanced Tracking**: Kalman/IMM filtering with data association
- **Media Server**: Integrated RTP stream management with health monitoring
- **Load Balancing**: Automatic distribution across CPU/GPU resources

## 🏗️ Architecture

```
[Multiple RTP Streams] --> [Media Server Layer] --> [Stream Management] --> [Ingest Nodes] --> [Preproc + Motion] --> [Voxel Projector GPU]
                          \-> [Stream Health]     \-> [Load Balancing]    \-> [Frame Buffer]    \-> [Motion Energy]    \-> [3D Voxel Grid]
[Optional LWIR]         --> [Thermal Preproc] -->/                -> [Fusion + Peaks] -> [Tracker] -> [Classifier]
                                                                                                       |
UI (3D heatmap + map)  <-- WebSocket/REST <-- [API Server] <--- Logs/Telemetry --- Prometheus/Grafana
```

## 📋 Requirements

- **GPU**: NVIDIA RTX 4060/4070+ (RTX 4090 recommended for 16+ streams)
- **OS**: Ubuntu 22.04+ with NVIDIA drivers
- **Network**: High-performance networking for RTP streams
- **Memory**: 16GB+ RAM, 8GB+ GPU memory

## 🚀 Quick Start

### Prerequisites

```bash
# Install system dependencies
sudo apt update
sudo apt install -y build-essential cmake git python3 python3-pip nvidia-cuda-toolkit

# Install Python dependencies
pip3 install poetry
poetry install
```

### Configuration

1. Copy the example configuration:
```bash
cp configs/site.example.yaml configs/site.yaml
cp configs/media-server.example.yaml configs/media-server.yaml
```

2. Edit the configuration files with your camera settings and network configuration.

### Running

```bash
# Start the media server
./scripts/run_media_server.sh

# Start the main application
./scripts/run_dev.sh
```

## 📖 Documentation

- [Full Technical Specification](docs/SPEC.md) - Complete system architecture and implementation details
- [API Documentation](docs/API.md) - REST API and WebSocket endpoints
- [Media Server Guide](docs/MEDIA-SERVER.md) - RTP stream management

## 🔧 Configuration

The system uses YAML configuration files for easy setup:

- **`site.yaml`**: Camera positions, processing parameters, calibration settings
- **`media-server.yaml`**: RTP stream configuration, network settings, performance tuning

## 📊 Performance

- **Scale**: 16×1080p@30fps streams on RTX 4090
- **Latency**: <500ms end-to-end processing
- **Accuracy**: CEP50 ≤ 15m at 1km range
- **Detection**: Pd ≥ 0.85 at FAR ≤ 0.2/min

## 🧪 Testing

```bash
# Run unit tests
poetry run pytest

# Run performance benchmarks
./scripts/bench_voxel.py

# Run synthetic validation
poetry run python tools/synthetic_harness.py
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the Apache License 2.0 - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Built with [GStreamer](https://gstreamer.freedesktop.org/) for media handling
- GPU acceleration with [CUDA](https://developer.nvidia.com/cuda-zone)
- Computer vision with [OpenCV](https://opencv.org/)
- 3D visualization with [deck.gl](https://deck.gl/) and [MapLibre](https://maplibre.org/)

## 📞 Support

For questions and support:
- Create an [issue](https://github.com/yourusername/DroneVoxelServer/issues)
- Check the [documentation](docs/)
- Review the [examples](examples/)

---

**Note**: This is an MVP specification. Production deployment requires additional security, monitoring, and compliance considerations.
