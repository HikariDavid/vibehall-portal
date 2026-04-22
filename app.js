// PolyMind Intelligence Portal
// Dynamic integration with PolyMind AI backend

const API_BASE = "https://polymind-production.up.railway.app";

async function updateStats() {
    try {
        // 1. Fetch Accuracy Report
        const accuracyResp = await fetch(`${API_BASE}/accuracy-report`);
        if (accuracyResp.ok) {
            const data = await accuracyResp.json();

            // Update Accuracy Stat
            const accuracyVal = document.getElementById('system-accuracy');
            if (data.resolved_signals > 0) {
                accuracyVal.innerText = `${Math.round(data.current_accuracy * 100)}%`;
            } else {
                accuracyVal.innerText = "TRACKING";
                accuracyVal.style.fontSize = "1.2rem";
            }

            // Update Network Status
            const statusEl = document.getElementById('network-status');
            statusEl.innerText = data.status || "BETA_TRACKING";
            if (data.status === "BETA_TRACKING") {
                statusEl.style.color = "#FFD700"; // Gold color for Beta
            }
        }

        // 2. Fetch Hot Markets for Ticker
        const marketResp = await fetch(`${API_BASE}/markets/hot?limit=10`);
        if (marketResp.ok) {
            const data = await marketResp.json();

            // Update Total Markets
            if (data.count) {
                document.getElementById('total-markets').innerText = data.count.toString().padStart(2, '0');
            }

            // Update Scrolling Ticker
            const ticker = document.querySelector('.ticker-data');
            if (data.markets && data.markets.length > 0) {
                const topMarkets = data.markets.slice(0, 3);
                ticker.innerHTML = topMarkets.map(m =>
                    `<span>🔥 <strong>${m.question}</strong> | Volume: $${Math.round(m.volume_24h).toLocaleString()}</span>`
                ).join(' <span class="separator">|</span> ');
            }
        }
    } catch (error) {
        console.error("PolyMind Intelligence Feed Offline:", error);
        const statusEl = document.getElementById('network-status');
        if (statusEl) {
            statusEl.innerText = "OFFLINE";
            statusEl.style.color = "#FF3131";
        }
    }
}

// Initial update
updateStats();

// Refresh every 30 seconds
setInterval(updateStats, 30000);
