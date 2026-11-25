document.addEventListener("DOMContentLoaded", () => {
  // 1. Synchronized 4-up Hero Motion-Transfer Videos
  const transferVids = Array.from(document.querySelectorAll(".js-transfer-vid"));
  const toggleBtn = document.getElementById("transfer-toggle");
  const replayBtn = document.getElementById("transfer-replay");
  let transferPlaying = true;

  function syncAndPlayTransfer(reset = false) {
    transferVids.forEach((v) => {
      if (reset) v.currentTime = 0;
      const p = v.play();
      if (p && typeof p.catch === "function") p.catch(() => {});
    });
    transferPlaying = true;
    if (toggleBtn) toggleBtn.textContent = "Pause";
  }

  if (transferVids.length > 0) {
    // Keep all 4 clips locked to the master clip on each loop
    const master = transferVids[0];
    master.addEventListener("ended", () => {
      syncAndPlayTransfer(true);
    });
    syncAndPlayTransfer(true);

    if (toggleBtn) {
      toggleBtn.addEventListener("click", () => {
        if (transferPlaying) {
          transferVids.forEach((v) => v.pause());
          transferPlaying = false;
          toggleBtn.textContent = "Play";
        } else {
          const t = master.currentTime;
          transferVids.forEach((v) => {
            v.currentTime = t;
            const p = v.play();
            if (p && typeof p.catch === "function") p.catch(() => {});
          });
          transferPlaying = true;
          toggleBtn.textContent = "Pause";
        }
      });
    }

    if (replayBtn) {
      replayBtn.addEventListener("click", () => {
        syncAndPlayTransfer(true);
      });
    }
  }

  // 2. Four visual factors: Figure 1 ("All four"), or the robot clip beside the clip with one factor outlined
  const factorData = {
    1: {
      title: "① Agent state",
      color: "#2563eb",
      text: "The arm's physical pose changes with its action: the change a latent action should explain."
    },
    2: {
      title: "② Non-agent change",
      color: "#cc4125",
      text: "Content that is revealed, moves or shakes without being the agent, such as the pepper uncovered by the arm. It can introduce transition information unrelated to the action."
    },
    3: {
      title: "③ Static background",
      color: "#64748b",
      text: "Scene content that stays the same in both frames. It can obscure the physical-state changes needed to infer the action."
    },
    4: {
      title: "④ Agent appearance",
      color: "#b8860b",
      text: "The arm keeps its colors and materials as it moves. Like the static background, it can obscure the physical-state changes needed to infer the action."
    }
  };

  const factorAll = document.getElementById("factor-all");
  const factorClips = document.getElementById("factor-clips");
  const origFactorVid = document.getElementById("factor-orig-vid");
  const highFactorVid = document.getElementById("factor-high-vid");
  const factorLabel = document.getElementById("factor-high-label");
  const factorText = document.getElementById("factor-text");
  const factorTabs = Array.from(document.querySelectorAll(".js-factor-tab"));

  function playFactorPair(from) {
    [origFactorVid, highFactorVid].forEach((v) => {
      v.currentTime = from;
      const p = v.play();
      if (p && typeof p.catch === "function") p.catch(() => {});
    });
  }

  if (factorAll && factorClips && origFactorVid && highFactorVid) {
    origFactorVid.addEventListener("ended", () => playFactorPair(0));

    factorTabs.forEach((btn) => {
      btn.addEventListener("click", () => {
        const info = factorData[btn.dataset.factor];
        factorTabs.forEach((b) => b.classList.toggle("is-active", b === btn));
        factorAll.hidden = Boolean(info);
        factorClips.hidden = !info;
        if (!info) {
          origFactorVid.pause();
          highFactorVid.pause();
          return;
        }
        factorLabel.textContent = info.title;
        factorText.textContent = info.text;
        factorText.style.borderLeftColor = info.color;
        const from = origFactorVid.currentTime || 0;
        highFactorVid.poster = `assets/factor-${btn.dataset.factor}.jpg`;
        highFactorVid.src = `assets/factor-${btn.dataset.factor}.mp4`;
        playFactorPair(from);
      });
    });
  }

  // 3. Generic pill tab groups (benchmark suites, cross-context examples)
  document.querySelectorAll("[data-tab-group]").forEach((group) => {
    const groupName = group.dataset.tabGroup;
    const buttons = Array.from(group.querySelectorAll("[data-tab-target]"));
    const panels = Array.from(document.querySelectorAll(`[data-tab-panel="${groupName}"]`));

    buttons.forEach((btn) => {
      btn.addEventListener("click", () => {
        const targetId = btn.dataset.tabTarget;
        buttons.forEach((b) => b.classList.toggle("is-active", b === btn));
        panels.forEach((panel) => {
          panel.classList.toggle("hidden", panel.id !== targetId);
        });
      });
    });
  });

  // 4. Real-Video Interactive Bar Charts (Table 4: Quantized z_q vs Continuous z)
  const realVideoData = {
    zq: {
      datasets: [
        {
          name: "Bridge V2",
          rows: [
            ["UniVLA, fine-tuned", 0.75],
            ["+ Seq-ΔREPA", 0.67],
            ["+ Optical-flow", 0.71],
            ["+ CoMo", 0.71],
            ["+ MaskLAM", 0.76],
            ["+ Agent-State LAM", 0.50, true]
          ]
        },
        {
          name: "UR5",
          rows: [
            ["UniVLA, fine-tuned", 0.42],
            ["+ Seq-ΔREPA", 0.31],
            ["+ Optical-flow", 0.34],
            ["+ CoMo", 0.52],
            ["+ MaskLAM", 0.54],
            ["+ Agent-State LAM", 0.28, true]
          ]
        },
        {
          name: "Jaco Play",
          rows: [
            ["UniVLA, fine-tuned", 0.57],
            ["+ Seq-ΔREPA", 0.58],
            ["+ Optical-flow", 0.50],
            ["+ CoMo", 0.56],
            ["+ MaskLAM", 0.56],
            ["+ Agent-State LAM", 0.40, true]
          ]
        },
        {
          name: "Taco Play",
          rows: [
            ["UniVLA, fine-tuned", 0.84],
            ["+ Seq-ΔREPA", 0.83],
            ["+ Optical-flow", 0.77],
            ["+ CoMo", 0.83],
            ["+ MaskLAM", 0.86],
            ["+ Agent-State LAM", 0.69, true]
          ]
        },
        {
          name: "RT-1",
          rows: [
            ["UniVLA, fine-tuned", 0.71],
            ["+ Seq-ΔREPA", 0.74],
            ["+ Optical-flow", 0.64],
            ["+ CoMo", 0.73],
            ["+ MaskLAM", 0.71],
            ["+ Agent-State LAM", 0.57, true]
          ]
        },
        {
          name: "IRASim",
          rows: [
            ["UniVLA, fine-tuned", 0.67],
            ["+ Seq-ΔREPA", 0.66],
            ["+ Optical-flow", 0.75],
            ["+ CoMo", 0.61],
            ["+ MaskLAM", 0.67],
            ["+ Agent-State LAM", 0.41, true]
          ]
        }
      ]
    },
    z: {
      datasets: [
        {
          name: "Bridge V2",
          rows: [
            ["UniVLA, fine-tuned", 0.59],
            ["+ Seq-ΔREPA", 0.35],
            ["+ Optical-flow", 0.42],
            ["+ CoMo", 0.49],
            ["+ MaskLAM", 0.54],
            ["+ Agent-State LAM", 0.33, true]
          ]
        },
        {
          name: "UR5",
          rows: [
            ["UniVLA, fine-tuned", 0.25],
            ["+ Seq-ΔREPA", 0.10],
            ["+ Optical-flow", 0.15],
            ["+ CoMo", 0.24],
            ["+ MaskLAM", 0.28],
            ["+ Agent-State LAM", 0.12, true]
          ]
        },
        {
          name: "Jaco Play",
          rows: [
            ["UniVLA, fine-tuned", 0.45],
            ["+ Seq-ΔREPA", 0.26],
            ["+ Optical-flow", 0.33],
            ["+ CoMo", 0.38],
            ["+ MaskLAM", 0.39],
            ["+ Agent-State LAM", 0.26, true]
          ]
        },
        {
          name: "Taco Play",
          rows: [
            ["UniVLA, fine-tuned", 0.73],
            ["+ Seq-ΔREPA", 0.55],
            ["+ Optical-flow", 0.61],
            ["+ CoMo", 0.69],
            ["+ MaskLAM", 0.70],
            ["+ Agent-State LAM", 0.43, true]
          ]
        },
        {
          name: "RT-1",
          rows: [
            ["UniVLA, fine-tuned", 0.57],
            ["+ Seq-ΔREPA", 0.44],
            ["+ Optical-flow", 0.47],
            ["+ CoMo", 0.56],
            ["+ MaskLAM", 0.55],
            ["+ Agent-State LAM", 0.40, true]
          ]
        },
        {
          name: "IRASim",
          rows: [
            ["UniVLA, fine-tuned", 0.58],
            ["+ Seq-ΔREPA", 0.42],
            ["+ Optical-flow", 0.48],
            ["+ CoMo", 0.49],
            ["+ MaskLAM", 0.52],
            ["+ Agent-State LAM", 0.30, true]
          ]
        }
      ]
    }
  };

  const barContainer = document.getElementById("rv-bar-grid");
  const latentBtns = Array.from(document.querySelectorAll(".js-latent-btn"));

  // one card per dataset or task; bars scaled to the largest value of the card
  function renderBarGrid(container, datasets) {
    if (!container) return;
    container.innerHTML = datasets
      .map((ds) => {
        const maxVal = Math.max(...ds.rows.map((r) => r[1]));
        const rowsHtml = ds.rows
          .map(([label, val, isAsl]) => {
            const pct = Math.round((val / maxVal) * 100);
            return `<div class="mini-row ${isAsl ? "is-asl" : ""}">
              <span class="mini-label" title="${label}">${label}</span>
              <div class="mini-track"><div class="mini-fill" style="width:${pct}%"></div></div>
              <span class="mini-val">${val.toFixed(2)}</span>
            </div>`;
          })
          .join("");
        return `<div class="bar-card">
          <div class="bar-card-head">
            <span class="bar-card-title">${ds.name}</span>
          </div>
          ${rowsHtml}
        </div>`;
      })
      .join("");
  }

  function renderRealVideoBars(mode) {
    if (realVideoData[mode]) renderBarGrid(barContainer, realVideoData[mode].datasets);
  }

  // DCS (Table 1), one view per stage; LAPO and the references trained with labels are left to the paper.
  // values[task][row]: tasks hopper, cheetah, walker, humanoid; rows in DCS_ROWS order
  const DCS_TASKS = ["hopper-hop", "cheetah-run", "walker-run", "humanoid-walk"];
  const DCS_ROWS = ["MaskLAM", "LAOM", "+ Seq-ΔREPA", "+ Optical-flow", "+ CoMo", "Agent-State LAM"];
  const DCS_STAGES = {
    s1: {
      text: "Action error (↓ lower is better): test error of a linear probe mapping the latent actions to the true actions.",
      values: [[2.41, 2.7, 3.16, 2.35, 2.12, 1.14], [2.02, 2.47, 2.45, 2.32, 2.07, 1.01], [5.23, 5.49, 7.1, 3.06, 4.18, 2.37], [0.22, 0.15, 0.14, 0.14, 0.14, 0.11]]
    },
    s2: {
      text: "Return (↑ higher is better): normalized return of a policy cloned on latent actions, with an action decoder trained on all available action labels.",
      values: [[0.35, 0.28, 0.2, 0.3, 0.21, 0.53], [0.71, 0.4, 0.37, 0.56, 0.52, 0.9], [0.79, 0.49, 0.33, 0.65, 0.56, 0.81], [0.2, 0.19, 0.17, 0.06, 0.08, 0.22]]
    },
    s3: {
      text: "Return (↑ higher is better): return of the same policy with a decoder trained on only 32 labeled trajectories.",
      values: [[0.15, 0.11, 0.08, 0.15, 0.14, 0.37], [0.55, 0.44, 0.42, 0.49, 0.54, 0.67], [0.09, 0.12, 0.06, 0.17, 0.06, 0.36], [0.03, 0.03, 0.03, 0.02, 0.04, 0.06]]
    }
  };
  const dcsGrid = document.getElementById("dcs-bar-grid");
  const dcsSubtitle = document.getElementById("dcs-stage-subtitle");
  const dcsStageBtns = Array.from(document.querySelectorAll(".js-dcs-stage"));
  function renderDcs(stage) {
    const s = DCS_STAGES[stage];
    renderBarGrid(dcsGrid, DCS_TASKS.map((name, k) => ({ name, rows: DCS_ROWS.map((r, i) => [r, s.values[k][i], i === DCS_ROWS.length - 1]) })));
    if (dcsSubtitle) dcsSubtitle.textContent = s.text;
  }
  renderDcs("s1");
  dcsStageBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      dcsStageBtns.forEach((b) => b.classList.toggle("is-active", b === btn));
      renderDcs(btn.dataset.stage);
    });
  });

  renderRealVideoBars("zq");
  latentBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      latentBtns.forEach((b) => b.classList.toggle("is-active", b === btn));
      renderRealVideoBars(btn.dataset.latent);
    });
  });

  // 5. DCS pose retrieval: per task, the source clip and each model's nearest gallery frame at every step, in sync
  //    (assets/retrieval/<task>/<column>.mp4, poster <column>.jpg)
  const poseBtns = Array.from(document.querySelectorAll(".js-pose-btn"));
  const POSE_COLS = ["source", "laom_a", "laom_b", "asl_a", "asl_b"];
  const poseVids = POSE_COLS.map((c) => document.getElementById(`dcs-pose-${c}`));
  const posePlay = document.getElementById("pose-play");
  const poseReplay = document.getElementById("pose-replay");
  // all clips of a group can play, or 4 s have passed (a stalled load must not keep the group paused; play() then
  // starts it, and the restart at the end of each loop brings the group back in sync)
  const whenReady = (videos) =>
    Promise.race([
      Promise.all(videos.map((v) => (v.readyState >= 3 ? null : new Promise((r) => v.addEventListener("canplay", r, { once: true }))))),
      new Promise((r) => setTimeout(r, 4000))
    ]);
  // the button follows this flag, not the videos' paused state, which is also true while a new task's clips load
  let posePlaying = true;
  const poseButton = () => {
    if (posePlay) posePlay.textContent = posePlaying ? "Pause" : "Play";
  };
  function poseStart() {
    posePlaying = true;
    poseButton();
    whenReady(poseVids).then(() => {
      if (posePlaying) playInSync(poseVids, true);
    });
  }
  if (poseVids.every(Boolean)) {
    poseVids[0].addEventListener("ended", () => {
      if (posePlaying) playInSync(poseVids, true);
    });
    poseStart();
    poseBtns.forEach((btn) => {
      btn.addEventListener("click", () => {
        const task = btn.dataset.poseTask;
        poseBtns.forEach((b) => b.classList.toggle("is-active", b === btn));
        POSE_COLS.forEach((c, i) => {
          poseVids[i].poster = `assets/retrieval/${task}/${c}.jpg`;
          poseVids[i].src = `assets/retrieval/${task}/${c}.mp4`;
        });
        poseStart();
      });
    });
    if (posePlay)
      posePlay.addEventListener("click", () => {
        posePlaying = !posePlaying;
        if (posePlaying) playInSync(poseVids, false);
        else poseVids.forEach((v) => v.pause());
        poseButton();
      });
    if (poseReplay) poseReplay.addEventListener("click", () => poseStart());
  }

  // 5b. Real-robot arm-state retrieval: per dataset, the supplementary figure's query episode and, at every frame, the
  //     frame each model retrieves, in sync (assets/rv_retrieval/<dataset>/<column>.mp4, poster <column>.jpg)
  const RV_COLS = ["source", "host", "asl"];
  const rvVids = RV_COLS.map((c) => document.getElementById(`rv-vid-${c}`));
  const rvTabs = Array.from(document.querySelectorAll("#rv-tabs .pill-tab"));
  const rvPlay = document.getElementById("rv-play");
  const rvReplay = document.getElementById("rv-replay");
  let rvPlaying = true;
  const rvButton = () => {
    if (rvPlay) rvPlay.textContent = rvPlaying ? "Pause" : "Play";
  };
  function rvStart() {
    rvPlaying = true;
    rvButton();
    whenReady(rvVids).then(() => {
      if (rvPlaying) playInSync(rvVids, true);
    });
  }
  if (rvVids.every(Boolean)) {
    rvVids[0].addEventListener("ended", () => {
      if (rvPlaying) playInSync(rvVids, true);
    });
    rvStart();
    rvTabs.forEach((b) =>
      b.addEventListener("click", () => {
        const key = b.dataset.rv;
        rvTabs.forEach((x) => x.classList.toggle("is-active", x === b));
        RV_COLS.forEach((c, i) => {
          rvVids[i].poster = `assets/rv_retrieval/${key}/${c}.jpg`;
          rvVids[i].src = `assets/rv_retrieval/${key}/${c}.mp4`;
        });
        rvStart();
      })
    );
    if (rvPlay)
      rvPlay.addEventListener("click", () => {
        rvPlaying = !rvPlaying;
        if (rvPlaying) playInSync(rvVids, false);
        else rvVids.forEach((v) => v.pause());
        rvButton();
      });
    if (rvReplay) rvReplay.addEventListener("click", () => rvStart());
  }

  // 7. Overview video chapter buttons
  const overviewVid = document.querySelector(".overview-video-card video");
  document.querySelectorAll(".chapter-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      if (!overviewVid) return;
      overviewVid.currentTime = parseFloat(btn.dataset.seek || "0");
      const p = overviewVid.play();
      if (p && typeof p.catch === "function") p.catch(() => {});
    });
  });

  // 8. Same-clip rollouts: the eight clips of a test clip played in sync, otherwise the paper figure
  // assets/clips.json lists the clip sets that are present: {"rollouts": [...], "transfer_examples": [...]}
  const clipManifest = fetch("assets/clips.json")
    .then((r) => (r.ok ? r.json() : {}))
    .catch(() => ({}));
  async function hasClips(group, name) {
    const m = await clipManifest;
    return Array.isArray(m[group]) && m[group].includes(name);
  }

  function playInSync(videos, reset) {
    const t = reset ? 0 : videos[0].currentTime;
    videos.forEach((v) => {
      v.currentTime = t;
      const p = v.play();
      if (p && typeof p.catch === "function") p.catch(() => {});
    });
  }

  const ROLLOUT_ROWS = [
    ["real", "Real video", "ref"],
    ["true", "True actions (upper bound)", "ref"],
    ["univla_ft", "UniVLA, fine-tuned", ""],
    ["seq_drepa", "+ Seq-ΔREPA", ""],
    ["flow", "+ optical-flow target", ""],
    ["como", "+ CoMo", ""],
    ["masklam", "+ MaskLAM", ""],
    ["agent_state_lam", "+ Agent-State LAM", "asl"]
  ];
  const ROLLOUT_CLIPS = {
    irasim_318: {
      aspect: "4 / 3",
      figure: "assets/supp-wm-irasim.jpg",
      alt: "Figure S5: same-clip world-model prediction on IRASim",
      caption:
        "<strong>IRASim, frozen Cosmos-Predict2.</strong> True actions and Agent-State LAM move the arm from the bowl to the cloth as in the real video, whereas the baselines stop before reaching the cloth (Figure S5)."
    },
    bridge_352: {
      aspect: "1 / 1",
      figure: "assets/supp-wm-bridge.jpg",
      alt: "Figure S6: same-clip world-model prediction on Bridge",
      caption:
        "<strong>Bridge, frozen Cosmos 3.</strong> True actions and Agent-State LAM move the arm to the pepper on the green cloth as in the real video, whereas the baselines remain to the left of the cloth (Figure S6)."
    },
    rt1_18: {
      aspect: "5 / 4",
      figure: "assets/supp-wm-rt1.jpg",
      alt: "Figure S7: same-clip world-model prediction on RT-1",
      caption:
        "<strong>RT-1, frozen Cosmos 3.</strong> True actions and Agent-State LAM move the arm to the can on the counter as in the real video; the optical-flow-target variant also reaches the can, whereas the remaining baselines stop at the right edge of the counter (Figure S7)."
    }
  };
  const rGrid = document.getElementById("rollout-grid");
  const rToolbar = document.getElementById("rollout-toolbar");
  const rPlay = document.getElementById("rollout-play");
  const rReplay = document.getElementById("rollout-replay");
  const rCaption = document.getElementById("rollout-caption");
  const rTabs = Array.from(document.querySelectorAll("#rollout-clip-tabs .pill-tab"));
  let rClip = "irasim_318";
  let rVideos = [];

  async function rBuild() {
    if (!rGrid) return;
    const clip = rClip;
    const c = ROLLOUT_CLIPS[clip];
    const hasVideo = await hasClips("rollouts", clip);
    if (clip !== rClip) return;
    rCaption.innerHTML = c.caption;
    if (rToolbar) rToolbar.hidden = !hasVideo;
    if (!hasVideo) {
      // clips not yet in assets/rollouts/: the paper figure
      rVideos = [];
      rGrid.innerHTML = `<img class="rollout-figure" src="${c.figure}" alt="${c.alt}">`;
      return;
    }
    rGrid.innerHTML = ROLLOUT_ROWS.map(([key, label, kind]) =>
      `<figure class="rollout-tile ${kind ? "is-" + kind : ""}">
        <div class="rollout-img" style="aspect-ratio:${c.aspect}">
          <video muted playsinline preload="auto" poster="assets/rollouts/${clip}/${key}_0.jpg" src="assets/rollouts/${clip}/${key}.mp4" aria-label="${label}"></video>
        </div>
        <figcaption>${label}</figcaption>
      </figure>`
    ).join("");
    rVideos = Array.from(rGrid.querySelectorAll("video"));
    rVideos[0].addEventListener("ended", () => playInSync(rVideos, true));
    playInSync(rVideos, true);
    if (rPlay) rPlay.textContent = "Pause";
  }

  if (rGrid) {
    rBuild();
    rPlay.addEventListener("click", () => {
      if (!rVideos.length) return;
      if (rVideos[0].paused) {
        playInSync(rVideos, false);
        rPlay.textContent = "Pause";
      } else {
        rVideos.forEach((v) => v.pause());
        rPlay.textContent = "Play";
      }
    });
    rReplay.addEventListener("click", () => {
      if (!rVideos.length) return;
      playInSync(rVideos, true);
      rPlay.textContent = "Pause";
    });
    rTabs.forEach((b) =>
      b.addEventListener("click", () => {
        rTabs.forEach((x) => x.classList.toggle("is-active", x === b));
        rClip = b.dataset.clip;
        rBuild();
      })
    );
  }

  // 9. Cross-context transfer examples: clips in sync when assets/transfer_examples/<example>/ holds them,
  //    otherwise the figure
  const TRANSFER_ROWS = [
    ["univla_ft", "UniVLA, fine-tuned"],
    ["seq_drepa", "+ Seq-ΔREPA"],
    ["flow", "+ optical-flow target"],
    ["como", "+ CoMo"],
    ["masklam", "+ MaskLAM"],
    ["agent_state_lam", "+ Agent-State LAM", "asl"]
  ];
  document.querySelectorAll(".js-transfer-example").forEach(async (box) => {
    const dir = `assets/transfer_examples/${box.dataset.example}`;
    if (!(await hasClips("transfer_examples", box.dataset.example))) return;
    const tile = (title, media, kind) => `<div class="video-tile${kind ? " is-" + kind : ""}">
        <div class="tile-header"><span class="tile-title">${title}</span></div>
        <div class="video-frame">${media}</div>
      </div>`;
    const vid = (name) => `<video muted playsinline preload="auto" src="${dir}/${name}.mp4"></video>`;
    box.innerHTML =
      tile("Video A · source motion", vid("source")) +
      tile("Video B · initial frame", `<img src="${dir}/initial.jpg" alt="First frame of video B">`) +
      TRANSFER_ROWS.map(([key, label, kind]) => tile(label, vid(key), kind)).join("");
    box.hidden = false;
    const fig = box.parentElement.querySelector(".js-transfer-figure");
    if (fig) fig.hidden = true;
    const videos = Array.from(box.querySelectorAll("video"));
    videos[0].addEventListener("ended", () => playInSync(videos, true));
    playInSync(videos, true);
  });

  // 6. Copy BibTeX Button
  const copyBtn = document.getElementById("copy-bibtex");
  const bibtexBlock = document.getElementById("bibtex-code");
  if (copyBtn && bibtexBlock) {
    copyBtn.addEventListener("click", async () => {
      try {
        await navigator.clipboard.writeText(bibtexBlock.textContent.trim());
        const prev = copyBtn.textContent;
        copyBtn.textContent = "Copied!";
        setTimeout(() => {
          copyBtn.textContent = prev;
        }, 1800);
      } catch (_) {}
    });
  }
});
