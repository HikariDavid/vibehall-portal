// PolyMind Intelligence Portal
// Live data engine connecting to PolyMind production API

const API_BASE = "https://polymind-production-c405.up.railway.app";

async function updateDashboard() {
    try {
        // 1. Accuracy Report (FREE endpoint — populates hero stats AND developer section)
        const accResp = await fetch(`${API_BASE}/accuracy-report`);
        if (accResp.ok) {
            const acc = await accResp.json();

            // Hero stats
            const accEl = document.getElementById('system-accuracy');
            if (acc.resolved_signals > 0) {
                accEl.innerText = `${Math.round(acc.current_accuracy * 100)}%`;
            } else {
                accEl.innerText = "TRACKING";
                accEl.style.fontSize = "1.2rem";
            }

            const statusEl = document.getElementById('engine-status');
            if (acc.status === "STABLE") {
                statusEl.innerText = "STABLE";
                statusEl.style.color = "#00ff88";
            } else {
                statusEl.innerText = "BETA";
                statusEl.style.color = "#FFD700";
            }

            // Network badge
            const netEl = document.getElementById('network-status');
            netEl.innerText = "OPERATIONAL";
            netEl.style.color = "#00ff88";

            // Developer section — Live Accuracy Block
            const accStatus = document.getElementById('acc-status');
            const accTotal = document.getElementById('acc-total');
            const accResolved = document.getElementById('acc-resolved');
            const accRate = document.getElementById('acc-rate');

            if (accStatus) accStatus.innerText = acc.status || "BETA_TRACKING";
            if (accTotal) accTotal.innerText = acc.total_signals || acc.total_signals_logged || "0";
            if (accResolved) accResolved.innerText = acc.resolved || acc.resolved_signals || "0";
            if (accRate) {
                if (acc.resolved_signals > 0) {
                    accRate.innerText = `${Math.round(acc.current_accuracy * 100)}%`;
                    accRate.style.color = "#00ff88";
                } else {
                    accRate.innerText = "TRACKING (Building)";
                    accRate.style.color = "#FFD700";
                }
            }
        }

        // 2. Live feed ticker
        const tickerEl = document.getElementById('ticker-content');
        if (tickerEl) {
            tickerEl.innerHTML = `<span>&#9989; Engine connected &mdash; Monitoring Polymarket CLOB in real-time via WebSocket. Signals are being automatically logged and verified.</span>`;
        }

        document.getElementById('total-markets').innerText = "20+";

    } catch (error) {
        console.error("PolyMind Dashboard:", error);
        const netEl = document.getElementById('network-status');
        if (netEl) { netEl.innerText = "CONNECTING..."; netEl.style.color = "#FFD700"; }
    }
}

// Boot
updateDashboard();

// Refresh every 60 seconds
setInterval(updateDashboard, 60000);

// Copy quick-start code to clipboard
function copyQuickStart() {
    const code = document.getElementById('quickstart-code').innerText;
    navigator.clipboard.writeText(code).then(() => {
        const btn = document.getElementById('copy-btn');
        btn.innerText = '✅ Copied!';
        btn.classList.add('copied');
        setTimeout(() => {
            btn.innerText = '📋 Copy';
            btn.classList.remove('copied');
        }, 2000);
    });
}
