const cameras = [
  {
    "id": "cam01",
    "name": "Perempatan UPN 1",
    "group": "Per4tan UPN",
    "src": "https://cctv.jogjaprov.go.id/cctv-proxy/cctv-kominfosleman/Perempatan_UPN1.stream/chunklist_w308346176.m3u8"
  },
  {
    "id": "cam02",
    "name": "Perempatan UPN 2",
    "group": "Per4tan UPN",
    "src": "https://cctv.jogjaprov.go.id/cctv-proxy/cctv-kominfosleman/Perempatan_UPN2.stream/chunklist_w113991672.m3u8"
  },
  {
    "id": "cam03",
    "name": "Seturan Selatan",
    "group": "Per4tan UPN",
    "src": "https://cctv.jogjaprov.go.id/cctv-proxy/atcs/SeturanSelatan.stream/chunklist_w1151894726.m3u8"
  },
  {
    "id": "cam04",
    "name": "Seturan Timur",
    "group": "Per4tan UPN",
    "src": "https://cctv.jogjaprov.go.id/cctv-proxy/atcs/SeturanTimur.stream/chunklist_w1216371851.m3u8"
  },
  {
    "id": "cam05",
    "name": "UPN 3",
    "group": "Per3an Selatan UPN",
    "src": "https://cctv.jogjaprov.go.id/cctv-proxy/cctv-kominfosleman/UPN3.stream/chunklist_w166883926.m3u8"
  },
  {
    "id": "cam06",
    "name": "UPN 1",
    "group": "Per3an Selatan UPN",
    "src": "https://cctv.jogjaprov.go.id/cctv-proxy/cctv-kominfosleman/UPN1.stream/chunklist_w1361325737.m3u8"
  },
  {
    "id": "cam07",
    "name": "UPN 2",
    "group": "Per3an Selatan UPN",
    "src": "https://cctv.jogjaprov.go.id/cctv-proxy/cctv-kominfosleman/UPN2.stream/chunklist_w355424025.m3u8"
  },
  {
    "id": "cam08",
    "name": "Simpang Citroli",
    "group": "Superindo Seturan",
    "src": "https://cctv.jogjaprov.go.id/cctv-proxy/cctv-kominfosleman/SimpangCitroli.stream/chunklist_w861015814.m3u8"
  },
  {
    "id": "cam09",
    "name": "Simpang Seturan 2",
    "group": "Selokan",
    "src": "https://cctv.jogjaprov.go.id/cctv-proxy/cctv-kominfosleman/SimpangSeturan2.stream/chunklist_w228009173.m3u8"
  },
  {
    "id": "cam10",
    "name": "Simpang Perumnas 1",
    "group": "Selokan",
    "src": "https://cctv.jogjaprov.go.id/cctv-proxy/cctv-kominfosleman/SimpangPerumnas1.stream/chunklist_w1814700599.m3u8"
  },
  {
    "id": "cam11",
    "name": "Simpang Perumnas 2",
    "group": "Selokan",
    "src": "https://cctv.jogjaprov.go.id/cctv-proxy/cctv-kominfosleman/SimpangPerumnas2.stream/chunklist_w940203665.m3u8"
  },
  {
    "id": "cam12",
    "name": "Simpang Wahid Hasyim 1",
    "group": "Selokan",
    "src": "https://cctv.jogjaprov.go.id/cctv-proxy/cctv-kominfosleman/SimpangWahidHasyim1.stream/chunklist_w1632887106.m3u8"
  },
  {
    "id": "cam13",
    "name": "Simpang Wahid Hasyim 2",
    "group": "Selokan",
    "src": "https://cctv.jogjaprov.go.id/cctv-proxy/cctv-kominfosleman/SimpangWahidHasyim2.stream/chunklist_w922792285.m3u8"
  },
  {
    "id": "cam14",
    "name": "Simpang Tantular 2",
    "group": "Selokan",
    "src": "https://cctv.jogjaprov.go.id/cctv-proxy/cctv-kominfosleman/SimpangTantular2.stream/chunklist_w28733951.m3u8"
  },
  {
    "id": "cam15",
    "name": "Simpang Tantular 1",
    "group": "Selokan",
    "src": "https://cctv.jogjaprov.go.id/cctv-proxy/cctv-kominfosleman/SimpangTantular1.stream/chunklist_w1094782903.m3u8"
  }
];

const grid = document.getElementById("cameraGrid");
const hlsInstances = {};
let autoCaptureTimer = null;
let autoCaptureEnabled = false;
let autoCaptureTargetId = null;
const AUTO_CAPTURE_INTERVAL_MS = 5000; // 5 detik
const CAPTURE_SCALE = 3; // 3x dari resolusi asli stream supaya hasil download tidak kecil
const CAPTURE_JPEG_QUALITY = 0.98; // kualitas JPG tinggi

function renderCameras(list = cameras) {
  grid.innerHTML = "";

  list.forEach((cam, index) => {
    const card = document.createElement("article");
    card.className = "camera-card";
    card.dataset.group = cam.group;
    card.dataset.id = cam.id;

    card.innerHTML = `
      <span class="live-badge">LIVE</span>
      <div class="card-actions">
        <button class="mini-btn focus-btn" type="button" title="Focus camera">FOCUS</button>
        <button class="mini-btn capture-btn" type="button" title="Capture 1 frame" data-camera-id="${cam.id}">CAPTURE</button>
        <button class="mini-btn auto-one-btn" type="button" title="Auto capture kamera ini setiap 5 detik" data-camera-id="${cam.id}">AUTO 5D</button>
      </div>
      <video class="camera-video" id="${cam.id}" autoplay muted controls playsinline crossorigin="anonymous"></video>
      <div class="cam-label">
        <h2>${String(index + 1).padStart(2, "0")} · ${cam.name}</h2>
        <p>${cam.group}</p>
      </div>
    `;

    grid.appendChild(card);
  });

  list.forEach((cam) => loadHlsVideo(cam.id, cam.src));

  document.querySelectorAll(".focus-btn").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      const card = e.target.closest(".camera-card");
      toggleFocus(card);
    });
  });

  document.querySelectorAll(".capture-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      captureFrame(btn.dataset.cameraId);
    });
  });

  document.querySelectorAll(".auto-one-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      toggleAutoCaptureOne(btn.dataset.cameraId);
    });
  });

  syncAutoCaptureButtonState();
}

function loadHlsVideo(videoId, src) {
  const video = document.getElementById(videoId);
  if (!video || !src) return;

  if (hlsInstances[videoId]) {
    hlsInstances[videoId].destroy();
    delete hlsInstances[videoId];
  }

  video.crossOrigin = "anonymous";
  video.pause();
  video.removeAttribute("src");
  video.load();

  if (window.Hls && Hls.isSupported()) {
    const hls = new Hls({
      enableWorker: true,
      lowLatencyMode: true,
      liveSyncDuration: 2,
      maxLiveSyncPlaybackRate: 1.5
    });

    hls.loadSource(src);
    hls.attachMedia(video);

    hls.on(Hls.Events.MANIFEST_PARSED, () => {
      video.play().catch(() => {
        console.log("Autoplay ditahan browser. Klik play manual.");
      });
    });

    hls.on(Hls.Events.ERROR, (event, data) => {
      console.warn("HLS error:", videoId, data);
    });

    hlsInstances[videoId] = hls;
  } else if (video.canPlayType("application/vnd.apple.mpegurl")) {
    video.src = src;
    video.play().catch(() => {
      console.log("Autoplay ditahan browser. Klik play manual.");
    });
  }
}

function toggleFocus(card) {
  if (!card) return;

  const isFocused = card.classList.contains("focused");

  document.querySelectorAll(".camera-card").forEach((item) => {
    item.classList.remove("focused");
  });

  document.body.classList.remove("focus-mode");

  if (!isFocused) {
    card.classList.add("focused");
    document.body.classList.add("focus-mode");
    showCaptureStatus(`Mode focus aktif: ${getCameraName(card.dataset.id)}. Tombol AUTO 5D di frame ini akan capture kamera ini saja.`);
  }

  syncAutoCaptureButtonState();
}

document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") {
    document.body.classList.remove("focus-mode");
    document.querySelectorAll(".camera-card").forEach((item) => item.classList.remove("focused"));
    syncAutoCaptureButtonState();
  }
});

document.querySelectorAll(".control[data-layout]").forEach((btn) => {
  btn.addEventListener("click", () => {
    document.querySelectorAll(".control[data-layout]").forEach((b) => b.classList.remove("active"));
    btn.classList.add("active");

    grid.className = "camera-grid layout-" + btn.dataset.layout;
  });
});

document.getElementById("fullscreenBtn").addEventListener("click", () => {
  if (!document.fullscreenElement) {
    document.documentElement.requestFullscreen().catch(console.warn);
  } else {
    document.exitFullscreen();
  }
});

document.querySelectorAll(".filter").forEach((btn) => {
  btn.addEventListener("click", () => {
    document.querySelectorAll(".filter").forEach((b) => b.classList.remove("active"));
    btn.classList.add("active");

    const group = btn.dataset.group;
    const filtered = group === "all"
      ? cameras
      : cameras.filter((cam) => cam.group === group);

    renderCameras(filtered);
  });
});


function getCameraName(videoId) {
  const cam = cameras.find((item) => item.id === videoId);
  return cam ? cam.name : videoId;
}

function safeFileName(text) {
  return String(text)
    .toLowerCase()
    .replace(/[^a-z0-9]+/gi, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 60);
}

function getTimeStamp() {
  const now = new Date();
  const pad = (n) => String(n).padStart(2, "0");
  return `${now.getFullYear()}${pad(now.getMonth() + 1)}${pad(now.getDate())}-${pad(now.getHours())}${pad(now.getMinutes())}${pad(now.getSeconds())}`;
}

function captureFrame(videoId) {
  const video = document.getElementById(videoId);
  if (!video) return;

  if (video.readyState < 2 || video.videoWidth === 0 || video.videoHeight === 0) {
    showCaptureStatus(`Video ${getCameraName(videoId)} belum siap dicapture. Tunggu live tampil dulu.`);
    return;
  }

  try {
    const canvas = document.createElement("canvas");
    const sourceWidth = video.videoWidth;
    const sourceHeight = video.videoHeight;
    const outputWidth = Math.round(sourceWidth * CAPTURE_SCALE);
    const outputHeight = Math.round(sourceHeight * CAPTURE_SCALE);

    canvas.width = outputWidth;
    canvas.height = outputHeight;

    const ctx = canvas.getContext("2d");
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = "high";
    ctx.drawImage(video, 0, 0, outputWidth, outputHeight);

    canvas.toBlob((blob) => {
      if (!blob) {
        showCaptureStatus("Capture gagal: blob kosong.");
        return;
      }

      const cameraName = safeFileName(getCameraName(videoId));
      const fileName = `capture-HD-${cameraName}-${getTimeStamp()}-${canvas.width}x${canvas.height}.jpg`;
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      link.remove();
      URL.revokeObjectURL(url);

      showCaptureStatus(`Berhasil capture HD: ${fileName}. Resolusi output ${canvas.width} x ${canvas.height}px.`);
    }, "image/jpeg", CAPTURE_JPEG_QUALITY);
  } catch (error) {
    console.error(error);
    showCaptureStatus("Capture gagal. Kemungkinan stream CCTV memblokir canvas/CORS. Solusi stabil: pakai backend FFmpeg.");
  }
}

function getFocusedCameraId() {
  const focusedCard = document.querySelector(".camera-card.focused");
  return focusedCard ? focusedCard.dataset.id : null;
}

function captureVisibleCameras() {
  const focusedCameraId = getFocusedCameraId();

  if (focusedCameraId) {
    captureFrame(focusedCameraId);
    return;
  }

  const videos = document.querySelectorAll(".camera-video");
  videos.forEach((video, index) => {
    setTimeout(() => captureFrame(video.id), index * 700);
  });
}

function captureAutoTarget() {
  const targetId = autoCaptureTargetId || getFocusedCameraId();

  if (targetId) {
    captureFrame(targetId);
    return;
  }

  captureVisibleCameras();
}

function stopAutoCapture(message = "Auto capture dimatikan.") {
  autoCaptureEnabled = false;
  autoCaptureTargetId = null;
  clearInterval(autoCaptureTimer);
  autoCaptureTimer = null;
  syncAutoCaptureButtonState();
  showCaptureStatus(message);
}

function syncAutoCaptureButtonState() {
  const globalBtn = document.getElementById("autoCaptureBtn");
  if (globalBtn) {
    globalBtn.classList.toggle("active", autoCaptureEnabled);
    globalBtn.textContent = autoCaptureEnabled
      ? (autoCaptureTargetId ? "AUTO FOCUS: ON" : "AUTO CAPTURE: ON")
      : "AUTO CAPTURE: OFF";
  }

  document.querySelectorAll(".auto-one-btn").forEach((btn) => {
    const isActive = autoCaptureEnabled && autoCaptureTargetId === btn.dataset.cameraId;
    btn.classList.toggle("active", isActive);
    btn.textContent = isActive ? "AUTO ON" : "AUTO 5D";
  });
}

function toggleAutoCaptureOne(videoId) {
  if (autoCaptureEnabled && autoCaptureTargetId === videoId) {
    stopAutoCapture(`Auto capture untuk ${getCameraName(videoId)} dimatikan.`);
    return;
  }

  autoCaptureEnabled = true;
  autoCaptureTargetId = videoId;
  clearInterval(autoCaptureTimer);
  syncAutoCaptureButtonState();
  showCaptureStatus(`Auto capture fokus aktif: ${getCameraName(videoId)} akan dicapture setiap 5 detik.`);
  captureFrame(videoId);
  autoCaptureTimer = setInterval(captureAutoTarget, AUTO_CAPTURE_INTERVAL_MS);
}

function showCaptureStatus(message) {
  const status = document.getElementById("captureStatus");
  if (status) status.textContent = message;
}

const captureAllBtn = document.getElementById("captureAllBtn");
if (captureAllBtn) {
  captureAllBtn.addEventListener("click", captureVisibleCameras);
}

const autoCaptureBtn = document.getElementById("autoCaptureBtn");
if (autoCaptureBtn) {
  autoCaptureBtn.addEventListener("click", () => {
    if (autoCaptureEnabled) {
      stopAutoCapture();
      return;
    }

    
    const focusedCameraId = getFocusedCameraId();
    autoCaptureEnabled = true;
    autoCaptureTargetId = focusedCameraId || null;
    clearInterval(autoCaptureTimer);
    syncAutoCaptureButtonState();

    if (focusedCameraId) {
      showCaptureStatus(`Auto capture fokus aktif: hanya ${getCameraName(focusedCameraId)} yang dicapture setiap 5 detik.`);
    } else {
      showCaptureStatus("Auto capture HD aktif: belum ada frame focus, jadi semua CCTV yang tampil akan dicapture setiap 5 detik.");
    }

    captureAutoTarget();
    autoCaptureTimer = setInterval(captureAutoTarget, AUTO_CAPTURE_INTERVAL_MS);
  });
}

renderCameras();
