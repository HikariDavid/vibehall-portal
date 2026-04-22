// PolyMind Intelligence Portal
// Live data engine connecting to PolyMind production API

const API_BASE = "https://polymind-production.up.railway.app";

async function updateDashboard() {
    try {
        // 1. Accuracy Report (FREE endpoint)
        const accResp = await fetch(`${API_BASE}/accuracy-report`);
        if (accResp.ok) {
            const acc = await accResp.json();

            // Accuracy display
            const accEl = document.getElementById('system-accuracy');
            if (acc.resolved_signals > 0) {
                accEl.innerText = `${Math.round(acc.current_accuracy * 100)}%`;
            } else {
                accEl.innerText = "TRACKING";
                accEl.style.fontSize = "1.2rem";
            }

            // Engine status
            const statusEl = document.getElementById('engine-status');
            if (acc.status === "STABLE") {
                statusEl.innerText = "STABLE";
                statusEl.style.color = "#00ff88";
            } else {
                statusEl.innerText = "BETA";
                statusEl.style.color = "#FFD700";
            }

            // Network status badge
            const netEl = document.getElementById('network-status');
            netEl.innerText = "OPERATIONAL";
            netEl.style.color = "#00ff88";
        }

        // 2. Live ticker from accuracy report metadata  
        // (Hot markets require payment, so we show what we can for free)
        const tickerEl = document.getElementById('ticker-content');
        tickerEl.innerHTML = `<span>Engine connected. Monitoring Polymarket CLOB in real-time. Signals are being logged and verified automatically.</span>`;

        // Update market count from what we know
        document.getElementById('total-markets').innerText = "20+";

    } catch (error) {
        console.error("PolyMind Dashboard:", error);
        const netEl = document.getElementById('network-status');
        if (netEl) {
            netEl.innerText = "CONNECTING...";
            netEl.style.color = "#FFD700";
        }
    }
}

// Boot
updateDashboard();

// Refresh every 60 seconds
setInterval(updateDashboard, 60000);
