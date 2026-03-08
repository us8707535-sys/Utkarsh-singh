require("dotenv").config();
const express = require("express");
const cors = require("cors");
const path = require("path");
const { exec } = require("child_process");
const { 
    generateCircuitDesign, 
    queryPCBKnowledge, 
    recommendComponents, 
    performDRC, 
    parseDatasheet 
} = require("./llm-utils");

const app = express();
app.use(cors());
app.use(express.json({ limit: "10mb" }));

// ===================================================================
// ALLEGRO X -- AUTONOMOUS CIRCUIT KNOWLEDGE ENGINE (LLM Edition)
// Uses OpenAI GPT-4 for Generative PCB Design
// ===================================================================

// --- SERVE FRONTEND (index.html) on root ---
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "index_llm.html"));
});

// --- HEALTH CHECK ---
app.get(["/health", "/api/health"], (req, res) => {
    res.json({
        status: "healthy",
        service: "Allegro X LLM Edition",
        api_available: !!process.env.OPENAI_API_KEY,
        timestamp: new Date().toISOString()
    });
});

// --- CIRCUIT DESIGN GENERATION (LLM-powered) ---
app.post(["/generate", "/api/generate"], async (req, res) => {
    const prompt = (req.body && req.body.prompt) || "";
    console.log(`[API] Circuit Design Request: '${prompt}'`);
    
    if (!prompt.trim()) {
        return res.status(400).json({ 
            success: false, 
            error: "Prompt cannot be empty" 
        });
    }

    try {
        const result = await generateCircuitDesign(prompt);
        
        if (result.success) {
            // Extract circuit details from LLM output
            const circuit = result.circuit;
            return res.json({
                success: true,
                method: "llm-generated",
                circuit_name: circuit.circuit_name || "Generated Circuit",
                description: circuit.description || "",
                components: circuit.components || [],
                nets: circuit.nets || [],
                power_pins: circuit.power_pins || [],
                notes: circuit.notes || "",
                component_count: (circuit.components || []).length,
                net_count: (circuit.nets || []).length,
                timestamp: new Date().toISOString()
            });
        } else {
            return res.status(500).json({
                success: false,
                error: result.error || "Failed to generate circuit design"
            });
        }
    } catch (error) {
        console.error(`[API Error] Circuit generation failed:`, error.message);
        res.status(500).json({
            success: false,
            error: "LLM circuit generation failed: " + error.message
        });
    }
});

// --- PCB KNOWLEDGE Q&A (LLM-powered) ---
app.post(["/ask", "/api/ask"], async (req, res) => {
    const query = (req.body && req.body.query) || "";
    console.log(`[API] PCB Knowledge Query: '${query}'`);
    
    if (!query.trim()) {
        return res.status(400).json({ 
            success: false, 
            error: "Query cannot be empty" 
        });
    }

    try {
        const result = await queryPCBKnowledge(query);
        
        if (result.success) {
            return res.json({
                success: true,
                method: "llm-knowledge",
                question: result.question,
                answer: result.answer,
                timestamp: new Date().toISOString()
            });
        } else {
            return res.status(500).json({
                success: false,
                error: result.error || "Failed to answer query"
            });
        }
    } catch (error) {
        console.error(`[API Error] Knowledge query failed:`, error.message);
        res.status(500).json({
            success: false,
            error: "LLM knowledge query failed: " + error.message
        });
    }
});

// --- COMPONENT SELECTION (LLM-powered) ---
app.post(["/recommend-components", "/api/recommend-components"], async (req, res) => {
    const requirements = (req.body && req.body.requirements) || "";
    console.log(`[API] Component Recommendation: '${requirements}'`);
    
    if (!requirements.trim()) {
        return res.status(400).json({ 
            success: false, 
            error: "Requirements cannot be empty" 
        });
    }

    try {
        const result = await recommendComponents(requirements);
        
        if (result.success) {
            return res.json({
                success: true,
                method: "llm-recommendations",
                requirements: result.requirements,
                recommendations: result.recommendations,
                timestamp: new Date().toISOString()
            });
        } else {
            return res.status(500).json({
                success: false,
                error: result.error || "Failed to generate recommendations"
            });
        }
    } catch (error) {
        console.error(`[API Error] Component recommendation failed:`, error.message);
        res.status(500).json({
            success: false,
            error: "LLM component recommendation failed: " + error.message
        });
    }
});

// --- DESIGN RULE CHECK (LLM-powered) ---
app.post(["/drc", "/api/drc"], async (req, res) => {
    const circuit = req.body;
    console.log(`[API] Design Rule Check requested`);
    
    if (!circuit || !circuit.components) {
        return res.status(400).json({ 
            success: false, 
            error: "Invalid circuit data" 
        });
    }

    try {
        const result = await performDRC(circuit);
        
        if (result.success) {
            return res.json({
                success: true,
                method: "llm-drc",
                circuit_name: result.circuit_name,
                analysis: result.analysis,
                timestamp: new Date().toISOString()
            });
        } else {
            return res.status(500).json({
                success: false,
                error: result.error || "DRC analysis failed"
            });
        }
    } catch (error) {
        console.error(`[API Error] DRC analysis failed:`, error.message);
        res.status(500).json({
            success: false,
            error: "LLM DRC analysis failed: " + error.message
        });
    }
});

// --- DATASHEET PARSING (LLM-powered) ---
app.post(["/parse-datasheet", "/api/parse-datasheet"], async (req, res) => {
    const datastringInput = (req.body && req.body.content) || "";
    console.log(`[API] Datasheet Parsing requested`);
    
    if (!datastringInput.trim()) {
        return res.status(400).json({ 
            success: false, 
            error: "Datasheet content cannot be empty" 
        });
    }

    try {
        const result = await parseDatasheet(datastringInput);
        
        if (result.success) {
            return res.json({
                success: true,
                method: "llm-parser",
                parsed_info: result.parsed_info,
                timestamp: new Date().toISOString()
            });
        } else {
            return res.status(500).json({
                success: false,
                error: result.error || "Datasheet parsing failed"
            });
        }
    } catch (error) {
        console.error(`[API Error] Datasheet parsing failed:`, error.message);
        res.status(500).json({
            success: false,
            error: "LLM datasheet parsing failed: " + error.message
        });
    }
});

// --- API DOCUMENTATION ---
app.get(["/docs", "/api/docs"], (req, res) => {
    res.json({
        service: "Allegro X - LLM-Powered PCB Design Engine",
        version: "2.0.0",
        endpoints: {
            "POST /api/generate": {
                description: "Generate a PCB circuit design from natural language",
                body: { prompt: "Design a 5V regulator with 7805" },
                returns: { circuit_name: "", components: [], nets: [] }
            },
            "POST /api/ask": {
                description: "Query PCB design knowledge and best practices",
                body: { query: "What is reflow soldering?" },
                returns: { question: "", answer: "" }
            },
            "POST /api/recommend-components": {
                description: "Get component recommendations based on requirements",
                body: { requirements: "High-speed USB switch with low power" },
                returns: { requirements: "", recommendations: "" }
            },
            "POST /api/drc": {
                description: "Perform design rule check on a circuit",
                body: { components: [], nets: [] },
                returns: { circuit_name: "", analysis: "" }
            },
            "POST /api/parse-datasheet": {
                description: "Parse and extract information from datasheet text",
                body: { content: "Datasheet text content" },
                returns: { parsed_info: "" }
            },
            "GET /api/health": {
                description: "Check API health status",
                returns: { status: "", api_available: true }
            }
        }
    });
});

// --- ERROR HANDLING ---
app.use((err, req, res, next) => {
    console.error("[Error]", err.message);
    res.status(500).json({
        success: false,
        error: "Internal server error: " + err.message
    });
});

// --- START SERVER ---
const PORT = process.env.SERVER_PORT || 5000;
app.listen(PORT, () => {
    const apiStatus = process.env.OPENAI_API_KEY ? "✓ CONFIGURED" : "✗ NOT SET";
    console.log("===========================================================");
    console.log("  ALLEGRO X -- Circuit Knowledge Engine (LLM Edition)");
    console.log("===========================================================");
    console.log(`  OpenAI API Key: ${apiStatus}`);
    console.log(`  Model: ${process.env.OPENAI_MODEL || "gpt-4-turbo-preview"}`);
    console.log(`  Server: http://localhost:${PORT}`);
    console.log(`  Docs: http://localhost:${PORT}/api/docs`);
    console.log("===========================================================");
    
    // Auto-open browser on Windows
    if (process.platform === "win32") {
        exec(`start http://localhost:${PORT}`);
    }
});
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
