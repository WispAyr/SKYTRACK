
# DroneVoxelServer — Full Technical Specification (with Self‑Calibration & Media Server)

**Version:** 0.2 (Enhanced RTP & Media Server)  
**Owner:** You (Cursor workspace)  
**Goal:** Passive, multi-camera server that detects, 3D‑localizes, and tracks small UAVs (and flags birds) by projecting *per‑pixel motion energy* into a world‑aligned voxel grid; includes **self‑calibration** to recover/maintain camera intrinsics, extrinsics, and time offsets without manual surveying. **Enhanced for multiple RTP streams with integrated media server capabilities.**

---

## 1) Problem Statement & Non‑Goals

### 1.1 Problem
Detect, localize, and track drones (and other aerial movers) using arrays of low‑cost cameras in real time, **without active emissions**. Images are noisy, may be low‑resolution, and cameras may drift or be moved slightly; GPS/PTP time sync may be imperfect. **System must handle multiple concurrent RTP streams with varying bitrates, resolutions, and network conditions.**

### 1.2 Non‑Goals (MVP)
- Person/vehicle identification (privacy scope).  
- Long-range target recognition (make/model).  
- Flight ID or RF interception.  
- Full ATC integration (provide hooks only).
- **Non-Goals for Media Server:**
  - Live video streaming to external clients
  - Video recording/archival beyond evidence clips
  - Video transcoding or format conversion

---

## 2) System Overview

```
[Multiple RTP Streams] --> [Media Server Layer] --> [Stream Management] --> [Ingest Nodes] --> [Preproc + Motion] --> [Voxel Projector GPU]
                          \-> [Stream Health]     \-> [Load Balancing]    \-> [Frame Buffer]    \-> [Motion Energy]    \-> [3D Voxel Grid]
[Optional LWIR]         --> [Thermal Preproc] -->/                -> [Fusion + Peaks] -> [Tracker] -> [Classifier]
                                                                                                       |
UI (3D heatmap + map)  <-- WebSocket/REST <-- [API Server] <--- Logs/Telemetry --- Prometheus/Grafana
```

- **Media Server Layer:** Handles multiple RTP streams, connection management, stream health monitoring
- **Stream Management:** Load balancing, frame buffering, stream synchronization
- **Ingest Nodes:** Decode frames, timestamp, and push to message bus.  
- **Preprocessing:** Denoise, grayscale, frame differencing/optical‑flow magnitude → **motion energy**.  
- **Voxel Projector (GPU):** Ray‑march motion energy along back‑projected rays into a **sparse voxel grid**.  
- **Fusion + Peaks:** Spatio‑temporal accumulation → 3D non‑max suppression → peaks as detections.  
- **Tracker:** Kalman/IMM filter in ENU frame with data association (Hungarian).  
- **Classifier:** Rule‑based + (optional) tiny 1D CNN over kinematics.  
- **Self‑Calibration:** Continuous intrinsics/extrinsics/time‑offset refinement via SfM + epipolar geometry + skyline/star‑field alignment + online bundle adjustment.  
- **API/UI:** WebSocket streams, REST endpoints, React viewer, evidence clips.

---

## 3) Media Server Architecture & RTP Stream Handling

### 3.1 Media Server Components

#### 3.1.1 Stream Manager
- **Connection Pool:** Manages multiple concurrent RTP connections with configurable timeouts
- **Load Balancing:** Distributes streams across available ingest nodes based on CPU/GPU utilization
- **Failover:** Automatic stream reconnection with exponential backoff and health monitoring
- **Stream Registry:** Dynamic registration/deregistration of camera streams

#### 3.1.2 RTP Stream Handler
- **Protocol Support:** RTP over UDP, RTP over TCP, RTSP, and WebRTC (optional)
- **Codec Support:** H.264, H.265, MJPEG, with automatic codec detection
- **Network Adaptation:** Automatic bitrate adaptation based on network conditions
- **Jitter Buffer:** Configurable jitter buffer (50-200ms) with packet loss concealment

#### 3.1.3 Stream Health Monitoring
- **Metrics Collection:**
  - Packet loss rate per stream
  - Jitter statistics (min/max/mean)
  - Frame drop rate
  - Network latency
  - Stream bitrate and resolution
- **Health Scoring:** Composite health score (0-100) based on multiple metrics
- **Alerting:** Webhook notifications for stream health degradation

### 3.2 Multi-Stream Synchronization

#### 3.2.1 Temporal Alignment
- **PTP Integration:** Hardware timestamp extraction from RTP packets when available
- **Software Timestamping:** Fallback to system clock with drift compensation
- **Frame-Level Sync:** Align frames across streams within configurable tolerance (default: ±16ms)

#### 3.2.2 Stream Coordination
- **Master Stream:** Designated primary stream for timing reference
- **Slave Streams:** Automatically synchronized to master stream timing
- **Dynamic Rebalancing:** Automatic master stream selection based on health metrics

### 3.3 Performance Optimization

#### 3.3.1 Memory Management
- **Frame Pools:** Pre-allocated frame buffers to minimize memory allocation overhead
- **Circular Buffers:** Efficient frame storage with automatic overwrite policies
- **GPU Memory:** Unified memory management for frame transfer to GPU processing pipeline

#### 3.3.2 CPU/GPU Utilization
- **Load Distribution:** Automatic distribution of streams across available CPU cores
- **GPU Batching:** Batch processing of frames from multiple streams for optimal GPU utilization
- **Pipeline Parallelism:** Overlap frame decoding, preprocessing, and GPU processing

---

## 4) Enhanced Configuration for Multi-Stream

### 4.1 Media Server Configuration

```yaml
media_server:
  # Stream Management
  max_concurrent_streams: 16
  connection_timeout_ms: 5000
  reconnect_attempts: 3
  reconnect_backoff_ms: [1000, 2000, 5000]
  
  # Load Balancing
  load_balancing:
    strategy: "least_loaded"  # "round_robin", "least_loaded", "weighted"
    health_check_interval_ms: 1000
    health_threshold: 70  # Minimum health score for active processing
    
  # Network Configuration
  network:
    bind_address: "0.0.0.0"
    rtp_port_range: [50000, 50100]
    max_packet_size: 1500
    jitter_buffer_ms: 100
    enable_nagle: false
    
  # Performance Tuning
  performance:
    frame_pool_size: 1000
    max_frame_age_ms: 5000
    enable_gpu_memory_pool: true
    gpu_memory_pool_size_mb: 2048

# Enhanced Camera Configuration
cameras:
  - id: cam01
    rtsp: "rtsp://user:pass@10.0.0.11/stream1"
    rtp_config:
      protocol: "rtp_udp"  # "rtp_udp", "rtp_tcp", "rtsp", "webrtc"
      port: 50001
      ssrc: 12345
      payload_type: 96  # H.264
      bitrate_kbps: 2048
      resolution: [1920, 1080]
      fps: 30
      priority: "high"  # "high", "medium", "low"
    network_qos:
      dscp: 46  # Expedited Forwarding
      enable_rtcp: true
      rtcp_interval_ms: 1000
    approx_pose: {enu: [0,0,6], yaw: 90, pitch: -5, roll: 0}
    intrinsics_guess: {fx: 1200, fy: 1200, cx: 960, cy: 540, k1: 0.0, k2: 0.0}
    rolling_shutter: {line_us: 20, direction: "down"}
    use_for_calib: true
    
  - id: cam02
    rtsp: "rtsp://user:pass@10.0.0.12/stream1"
    rtp_config:
      protocol: "rtp_udp"
      port: 50002
      ssrc: 12346
      payload_type: 96
      bitrate_kbps: 4096
      resolution: [3840, 2160]  # 4K
      fps: 25
      priority: "high"
    network_qos:
      dscp: 46
      enable_rtcp: true
      rtcp_interval_ms: 1000
    approx_pose: {enu: [120,0,6], yaw: -90, pitch: -4, roll: 0}
    use_for_calib: true

# Stream Processing Configuration
stream_processing:
  # Frame Buffer Management
  frame_buffer:
    max_frames_per_stream: 300  # 10 seconds at 30fps
    frame_timeout_ms: 5000
    enable_frame_skipping: true
    max_skip_frames: 3
    
  # Quality Adaptation
  quality_adaptation:
    enable_auto_bitrate: true
    min_bitrate_kbps: 512
    max_bitrate_kbps: 8192
    adaptation_threshold: 0.8  # Trigger adaptation at 80% packet loss
    
  # Synchronization
  synchronization:
    max_timing_offset_ms: 16
    sync_check_interval_ms: 100
    enable_ptp: true
    ptp_priority: 128
```

### 4.2 Stream Health Monitoring Configuration

```yaml
monitoring:
  stream_health:
    metrics:
      - packet_loss_rate
      - jitter_ms
      - frame_drop_rate
      - network_latency_ms
      - stream_bitrate_kbps
      - resolution_changes
      - codec_switches
      
    thresholds:
      packet_loss_rate: 0.05  # 5%
      jitter_ms: 50
      frame_drop_rate: 0.1    # 10%
      network_latency_ms: 200
      
    alerting:
      webhook_url: "https://webhook.site/your-endpoint"
      email_notifications: false
      slack_webhook: ""
      
  performance:
    cpu_utilization_threshold: 0.8
    gpu_utilization_threshold: 0.9
    memory_utilization_threshold: 0.85
    frame_processing_latency_ms: 100
```

---

## 5) Enhanced APIs for Stream Management

### 5.1 Stream Management REST APIs

```json
// Stream Status
GET /api/v1/streams
Response: {
  "streams": [
    {
      "id": "cam01",
      "status": "active",
      "health_score": 95,
      "metrics": {
        "packet_loss_rate": 0.01,
        "jitter_ms": 12,
        "frame_drop_rate": 0.02,
        "network_latency_ms": 45,
        "current_bitrate_kbps": 2048,
        "current_resolution": [1920, 1080],
        "current_fps": 30
      },
      "uptime_seconds": 86400,
      "last_frame_timestamp": "2024-01-15T10:30:00Z"
    }
  ]
}

// Stream Control
POST /api/v1/streams/{id}/start
POST /api/v1/streams/{id}/stop
POST /api/v1/streams/{id}/restart
POST /api/v1/streams/{id}/configure

// Stream Configuration Update
POST /api/v1/streams/{id}/configure
Body: {
  "rtp_config": {
    "bitrate_kbps": 4096,
    "resolution": [3840, 2160],
    "fps": 25
  }
}

// Load Balancing
GET /api/v1/streams/load-balancing/status
POST /api/v1/streams/load-balancing/rebalance
```

### 5.2 WebSocket Stream Health Updates

```json
// WebSocket Topic: /ws/stream-health
{
  "stream_id": "cam01",
  "timestamp": "2024-01-15T10:30:00Z",
  "health_score": 95,
  "metrics": {
    "packet_loss_rate": 0.01,
    "jitter_ms": 12,
    "frame_drop_rate": 0.02,
    "network_latency_ms": 45
  },
  "alerts": []
}
```

---

## 6) Enhanced Performance Targets

### 6.1 Multi-Stream Performance

- **Scale:** 16 cams @ 1080p × 30 fps → real‑time on single RTX 4090
- **Scale:** 32 cams @ 720p × 15 fps → real‑time on single RTX 4090
- **Scale:** 64 cams @ 480p × 10 fps → real‑time on single RTX 4090
- **Latency (glass‑to‑alert):** < 500 ms (Enhanced), goal < 200 ms
- **Stream Management:** Support up to 64 concurrent RTP streams
- **Network Efficiency:** < 1% packet loss tolerance, < 50ms jitter tolerance

### 6.2 Resource Utilization

- **CPU:** < 80% utilization under full load
- **GPU:** < 90% utilization under full load
- **Memory:** < 85% utilization under full load
- **Network:** Efficient bandwidth usage with automatic quality adaptation

---

## 7) Enhanced File/Repo Layout

```
drone-voxel-server/
├─ apps/
│  ├─ api-server/           # FastAPI/Express REST + WS
│  ├─ viewer/               # React + deck.gl + MapLibre
│  ├─ media-server/         # RTP stream management + health monitoring
│  └─ tools/                # CLI tools (calibration, clips, benchmarks)
├─ core/
│  ├─ media/                # Media server core components
│  │  ├─ stream-manager/    # Stream connection + load balancing
│  │  ├─ rtp-handler/       # RTP protocol handling
│  │  ├─ health-monitor/    # Stream health metrics
│  │  └─ sync-manager/      # Multi-stream synchronization
│  ├─ ingest/               # GStreamer/FFmpeg readers, PTP/GPS time
│  ├─ preprocess/           # denoise, differencing, optical flow magnitude
│  ├─ voxel/                # CUDA/wgpu voxel projector (DDA, atomics)
│  ├─ fusion/               # temporal window, 3D NMS, thresholds
│  ├─ tracking/             # Kalman/IMM, Hungarian, smoothing
│  ├─ classify/             # rules + (optional) tiny CNN
│  └─ calib/                # self-calibration (SfM, BA, time offsets, skyline/star-field)
├─ configs/
│  ├─ site.example.yaml
│  ├─ media-server.example.yaml
│  └─ zones.example.geojson
├─ data/
│  └─ samples/
├─ docs/
│  ├─ SPEC.md               # this file
│  ├─ API.md
│  └─ MEDIA-SERVER.md       # Media server specific documentation
├─ scripts/
│  ├─ run_dev.sh
│  ├─ run_media_server.sh
│  └─ bench_voxel.py
└─ CMakeLists.txt / pyproject.toml / package.json (depending on stack)
```

---

## 8) Enhanced Milestones (Cursor Tasks)

- **M1 (Media Server Foundation, 4 days):** RTP stream handling, connection management, health monitoring
- **M2 (Multi-Stream Ingest, 3 days):** Stream synchronization, load balancing, frame buffering
- **M3 (Ingest+Motion, 3 days):** GStreamer readers, frame differencing, motion masks, unit tests
- **M4 (GPU Voxel MVP, 4 days):** CUDA projector with hashed grid + 3D NMS; bench script
- **M5 (Self‑Calib v1, 6 days):** ORB features, pairwise F/E, initial SfM, BA (Ceres/g2o), ENU anchoring
- **M6 (Time Sync Estimator, 2 days):** Δt optimizer via voxel sharpness / trajectory xcorr; beacon support
- **M7 (Tracker+API, 3 days):** Kalman + Hungarian, REST/WS, JSON schemas
- **M8 (Viewer, 3 days):** React 3D heatmap slices + map; overlay tracks
- **M9 (Validation Pack, 4 days):** Synthetic harness, metrics, CLI tools
- **M10 (Performance Optimization, 3 days):** Multi-stream optimization, load testing, tuning

---

## 9) Enhanced Acceptance Criteria (MVP)

- **Media Server:** Successfully manages 16 concurrent RTP streams with < 1% packet loss and < 50ms jitter
- **Multi-Stream Sync:** Maintains frame synchronization across streams within ±16ms tolerance
- **Load Balancing:** Automatically distributes streams across available resources with < 80% CPU/GPU utilization
- **Cold‑start self‑calibration:** Converges on a 4‑cam rig with no surveyed data to reprojection RMSE ≤ 2.5 px within 10 min
- **Time offset estimation:** Within ±5 ms (no PTP) on moving‑target scenes
- **Detection Performance:** Detects a DJI‑class quad at 1 km with ≥0.85 Pd and FAR ≤ 0.2/min, CEP50 ≤ 15 m, with 4 cams on 100–150 m baselines
- **Performance:** Sustains ≥30 fps end‑to‑end on RTX 4090 with 16×1080p streams

---

## 10) Enhanced Implementation Choices

- **Languages:** C++17/20 for core + CUDA; Python glue/tooling; TypeScript for API/UI
- **Media Libraries:** GStreamer, FFmpeg, Live555 (for RTP), WebRTC (optional)
- **Libs:** OpenCV, Ceres‑Solver/g2o, Eigen, Protobuf/FlatBuffers (optional), FastAPI/Express, React + deck.gl + MapLibre
- **Build:** CMake + vcpkg (C++), Poetry (py tooling), pnpm (web)
- **OS:** Ubuntu 22.04+ with NVIDIA drivers; supports headless
- **Network:** High-performance networking with DPDK support (optional)

---

## 11) Enhanced Example End‑to‑End Flow (Pseudo)

```python
# Media Server Layer
stream_manager = MediaStreamManager(config)
stream_manager.start_all_streams()

# Multi-Stream Processing
while running:
    # Collect frames from all active streams
    frame_batch = stream_manager.get_synchronized_frames()
    
    # Process frame batch
    for stream_id, frames in frame_batch.items():
        if stream_manager.is_stream_healthy(stream_id):
            bg = preprocess.temporal_median(frames)
            motion = preprocess.motion_energy(frames, bg)
            
            # Add to processing pipeline
            processing_queue.put((stream_id, motion, frames))
    
    # GPU Processing
    if processing_queue.size() >= batch_size:
        batch = processing_queue.get_batch()
        V = voxel.clear_window()
        
        for stream_id, motion, frames in batch:
            rays = calib.backproject(stream_id, motion.pixels_above_eps())
            voxel.accumulate(V, rays, motion.weights)
        
        peaks = fusion.nms3d(V, thresh=stats.mean_sigma(4.0), min_support=(3,4))
        tracks = tracking.update(peaks, t=now())
        
        # Update calibration
        calib.update_online(batch, peaks)
        
        # Publish results
        api.publish(tracks, peaks, V_slices)
    
    # Stream Health Monitoring
    stream_manager.update_health_metrics()
    if stream_manager.has_health_alerts():
        alert_manager.send_alerts(stream_manager.get_health_alerts())
```

---

## 12) Enhanced Security & Network Considerations

### 12.1 Network Security
- **RTP Encryption:** Optional SRTP support for encrypted streams
- **Authentication:** Stream-level authentication with API keys or certificates
- **Network Isolation:** VLAN support for camera networks
- **DDoS Protection:** Rate limiting and connection throttling

### 12.2 Stream Privacy
- **Frame Masking:** Automatic masking of privacy-sensitive areas
- **Access Control:** Role-based access to stream health and configuration
- **Audit Logging:** Complete audit trail of stream configuration changes

---

*End of Enhanced SPEC v0.2*
