// ===================================================================
// ALLEGRO X -- Vercel Serverless API (LLM Edition)
// Uses OpenAI GPT-4 for all PCB generation and knowledge queries
// ===================================================================

require("dotenv").config();

const { 
    generateCircuitDesign, 
    queryPCBKnowledge, 
    recommendComponents, 
    performDRC, 
    parseDatasheet 
} = require("../llm-utils");

// ===================================================================
// CORS & REQUEST HANDLING
// ===================================================================

function setCorsHeaders(res) {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "GET,POST,OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type");
}

// ===================================================================
// MAIN HANDLER
// ===================================================================

module.exports = async (req, res) => {
    setCorsHeaders(res);

    if (req.method === "OPTIONS") {
        return res.status(200).end();
    }

    const url = req.url.split("?")[0].replace(/\/+$/, "");

    // --- HEALTH CHECK ---
    if (url.endsWith("/health") && req.method === "GET") {
        return res.status(200).json({
            status: "healthy",
            service: "Allegro X LLM API",
            timestamp: new Date().toISOString()
        });
    }

    // --- CIRCUIT DESIGN GENERATION ---
    if (url.endsWith("/generate") && req.method === "POST") {
        try {
            const prompt = (req.body && req.body.prompt) || "";
            
            if (!prompt.trim()) {
                return res.status(400).json({ 
                    success: false, 
                    error: "Prompt cannot be empty" 
                });
            }

            const result = await generateCircuitDesign(prompt);
            
            if (result.success) {
                const circuit = result.circuit;
                return res.status(200).json({
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
                    error: result.error || "Failed to generate circuit"
                });
            }
        } catch (error) {
            console.error("Circuit generation error:", error);
            return res.status(500).json({
                success: false,
                error: "Circuit generation failed: " + error.message
            });
        }
    }

    // --- PCB KNOWLEDGE Q&A ---
    if (url.endsWith("/ask") && req.method === "POST") {
        try {
            const query = (req.body && req.body.query) || "";
            
            if (!query.trim()) {
                return res.status(400).json({ 
                    success: false, 
                    error: "Query cannot be empty" 
                });
            }

            const result = await queryPCBKnowledge(query);
            
            if (result.success) {
                return res.status(200).json({
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
            console.error("Knowledge query error:", error);
            return res.status(500).json({
                success: false,
                error: "Knowledge query failed: " + error.message
            });
        }
    }

    // --- COMPONENT RECOMMENDATION ---
    if (url.endsWith("/recommend-components") && req.method === "POST") {
        try {
            const requirements = (req.body && req.body.requirements) || "";
            
            if (!requirements.trim()) {
                return res.status(400).json({ 
                    success: false, 
                    error: "Requirements cannot be empty" 
                });
            }

            const result = await recommendComponents(requirements);
            
            if (result.success) {
                return res.status(200).json({
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
            console.error("Component recommendation error:", error);
            return res.status(500).json({
                success: false,
                error: "Component recommendation failed: " + error.message
            });
        }
    }

    // --- DESIGN RULE CHECK ---
    if (url.endsWith("/drc") && req.method === "POST") {
        try {
            const circuit = req.body;
            
            if (!circuit || !circuit.components) {
                return res.status(400).json({ 
                    success: false, 
                    error: "Invalid circuit data" 
                });
            }

            const result = await performDRC(circuit);
            
            if (result.success) {
                return res.status(200).json({
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
            console.error("DRC analysis error:", error);
            return res.status(500).json({
                success: false,
                error: "DRC analysis failed: " + error.message
            });
        }
    }

    // --- DATASHEET PARSING ---
    if (url.endsWith("/parse-datasheet") && req.method === "POST") {
        try {
            const datastringInput = (req.body && req.body.content) || "";
            
            if (!datastringInput.trim()) {
                return res.status(400).json({ 
                    success: false, 
                    error: "Datasheet content cannot be empty" 
                });
            }

            const result = await parseDatasheet(datastringInput);
            
            if (result.success) {
                return res.status(200).json({
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
            console.error("Datasheet parsing error:", error);
            return res.status(500).json({
                success: false,
                error: "Datasheet parsing failed: " + error.message
            });
        }
    }

    // --- API DOCUMENTATION ---
    if (url.endsWith("/docs") && req.method === "GET") {
        return res.status(200).json({
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
                    returns: { status: "healthy" }
                }
            }
        });
    }

    return res.status(404).json({ 
        error: "Not found", 
        url: url,
        available: ["/api/generate", "/api/ask", "/api/recommend-components", "/api/drc", "/api/parse-datasheet", "/api/health", "/api/docs"]
    });
};
