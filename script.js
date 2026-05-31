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

function renderCameras(list = cameras) {
  grid.innerHTML = "";

  list.forEach((cam, index) => {
    const card = document.createElement("article");
    card.className = "camera-card";
    card.dataset.group = cam.group;
    card.dataset.id = cam.id;

    card.innerHTML = `
      <span class="live-badge">LIVE</span>
      <button class="focus-btn" type="button" title="Focus camera">FOCUS</button>
      <video class="camera-video" id="${cam.id}" autoplay muted controls playsinline></video>
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
}

function loadHlsVideo(videoId, src) {
  const video = document.getElementById(videoId);
  if (!video || !src) return;

  if (hlsInstances[videoId]) {
    hlsInstances[videoId].destroy();
    delete hlsInstances[videoId];
  }

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
  }
}

document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") {
    document.body.classList.remove("focus-mode");
    document.querySelectorAll(".camera-card").forEach((item) => item.classList.remove("focused"));
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

renderCameras();
