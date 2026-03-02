const express = require("express");
const cors = require("cors");
const path = require("path");
const { exec } = require("child_process");
const { CIRCUIT_TEMPLATES, PCB_KNOWLEDGE, fuzzyMatch, knowledgeSearch } = require("./pcb_data");

const app = express();
app.use(cors());
app.use(express.json());

// ===================================================================
// ALLEGRO X -- AUTONOMOUS CIRCUIT KNOWLEDGE ENGINE v4.0 (Node.js)
// Serves both Frontend (index.html) + Backend API in one process
// ===================================================================

// --- SERVE FRONTEND (index.html) on root ---
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "index.html"));
});

// --- API ENDPOINTS (support both /generate and /api/generate) ---
app.post(["/generate", "/api/generate"], (req, res) => {
    const prompt = (req.body && req.body.prompt) || "";
    console.log(`Allegro X AI: Received prompt - '${prompt}'`);
    const { key, score } = fuzzyMatch(prompt);
    if (key && score > 0) {
        const tmpl = CIRCUIT_TEMPLATES[key];
        console.log(`  -> Matched template: ${key} (score: ${score})`);
        return res.json({
            success: true, autonomous: true, template_id: key,
            description: tmpl.description, components: tmpl.components,
            nets: tmpl.nets, component_count: tmpl.components.length,
            net_count: tmpl.nets.length,
        });
    }
    res.json({ success: false, message: `Could not match '${prompt}' to a known circuit. Try: '555 timer', 'LED blinker', '5V power supply', etc.` });
});

app.get(["/templates", "/api/templates"], (req, res) => {
    const presets = [];
    for (const [key, tmpl] of Object.entries(CIRCUIT_TEMPLATES)) {
        const desc = tmpl.description;
        const name = desc.includes(" - ") ? desc.split(" - ")[0].trim() : desc;
        presets.push({ id: key, name, description: desc, component_count: tmpl.components.length });
    }
    res.json(presets);
});

app.get(["/knowledge", "/api/knowledge"], (req, res) => {
    const result = {};
    for (const [catKey, category] of Object.entries(PCB_KNOWLEDGE)) {
        const entries = [];
        for (const [ek, e] of Object.entries(category.entries)) {
            const entry = { id: ek, name: e.name, info: e.info };
            if (e.specs) entry.specs = e.specs;
            entries.push(entry);
        }
        result[catKey] = { title: category.title, entries };
    }
    res.json(result);
});

app.post(["/ask", "/api/ask"], (req, res) => {
    const query = (req.body && req.body.query) || "";
    console.log(`Allegro X Knowledge: Query - '${query}'`);
    const { entry, category, score } = knowledgeSearch(query);
    if (entry && score > 0) {
        console.log(`  -> Knowledge match: ${entry.name} (score: ${score})`);
        const resp = { success: true, category, topic: entry.name, answer: entry.info };
        if (entry.specs) resp.specs = entry.specs;
        return res.json(resp);
    }
    res.json({ success: false, message: `No knowledge match for '${query}'. Try asking about: FR-4, HDI, reflow soldering, IPC classes, etc.` });
});

// --- START SERVER + AUTO-OPEN BROWSER ---
const PORT = 5000;
app.listen(PORT, () => {
    const totalKnowledge = Object.values(PCB_KNOWLEDGE).reduce((sum, c) => sum + Object.keys(c.entries).length, 0);
    console.log("===========================================================");
    console.log("  ALLEGRO X -- Autonomous Circuit Knowledge Engine v4.0");
    console.log(`  Loaded ${Object.keys(CIRCUIT_TEMPLATES).length} circuit templates`);
    console.log(`  Loaded ${totalKnowledge} PCB knowledge entries`);
    console.log(`  Frontend + Backend running at: http://localhost:${PORT}`);
    console.log("===========================================================");

    // Auto-open browser (Windows)
    exec(`start http://localhost:${PORT}`);
});
