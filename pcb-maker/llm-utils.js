// ===================================================================
// LLM UTILITIES -- OpenAI Integration for PCB Design
// Allegro X -- Autonomous Circuit Knowledge Engine (LLM Edition)
// ===================================================================

const https = require("https");

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
const OPENAI_MODEL = "gpt-4-turbo-preview"; // or "gpt-3.5-turbo" for faster/cheaper inference

// ===================================================================
// SYSTEM PROMPTS FOR LLM
// ===================================================================

const SYSTEM_PROMPTS = {
    circuit_designer: `You are Allegro X, an expert PCB and circuit design AI assistant. 
Your role is to generate accurate PCB circuit designs from natural language descriptions.

RESPONSE FORMAT: Return ONLY valid JSON (no markdown, no explanation) with this structure:
{
  "circuit_name": "Circuit Name",
  "description": "Brief description of the circuit",
  "components": [
    {"ref": "U1", "type": "ic", "label": "NE555", "value": "", "footprint": "DIP-8"},
    {"ref": "R1", "type": "resistor", "label": "1k", "value": "1k", "footprint": "0805"}
  ],
  "nets": [
    ["J1.1", "R1.1", "U1.2"],
    ["R1.2", "U1.3", "GND"]
  ],
  "power_pins": [{"pin": "U1.8", "voltage": "5V"}],
  "notes": "Any design notes or considerations"
}

DESIGN RULES:
- Always include proper power and ground connections
- Use standard component values
- Include decoupling capacitors near ICs
- Reference designators must be unique (U1, U2 for ICs; R1, R2 for resistors; etc.)
- Common component types: ic, resistor, capacitor, diode, led, transistor, connector, inductor
- Footprints: DIP-8, SOT-23, 0805, 0603, 1206, 2.54mm_pitch_header, etc.`,

    pcb_knowledge: `You are Allegro X PCB knowledge assistant. You provide expert advice on:
- PCB materials (FR-4, Polyimide, PTFE)
- Manufacturing processes (Reflow soldering, Hand soldering, Wave soldering)
- Design standards (IPC-A-610, IPC-2221)
- EMI/EMC considerations
- Thermal management
- Signal integrity

Answer concisely and technically. Provide practical, actionable advice.`,

    component_selector: `You are a component selection expert for PCB design. 
When asked to recommend components, consider:
- Application requirements
- Power dissipation
- Frequency range
- Environmental conditions
- Cost and availability
- Recommended vendors (TI, NXP, ST, Infineon, etc.)

Provide specific part numbers and brief reasoning.`,

    drc_assistant: `You are a Design Rule Check (DRC) assistant for PCB design.
When analyzing circuits, check for:
- Missing decoupling capacitors
- Improper trace width for current
- Signal integrity issues
- Thermal hotspots
- EMI/EMC concerns
- Component spacing violations

Provide constructive feedback with suggested fixes.`,

    datasheet_parser: `You are a datasheet interpretation expert.
Extract and explain:
- Pin configurations
- Electrical specifications
- Recommended operating conditions
- Application circuits
- Package information

Format responses clearly with tables where appropriate.`
};

// ===================================================================
// OPENAI API CALL FUNCTION
// ===================================================================

function callOpenAI(userMessage, systemPrompt = SYSTEM_PROMPTS.circuit_designer) {
    return new Promise((resolve, reject) => {
        if (!OPENAI_API_KEY) {
            reject(new Error("OPENAI_API_KEY environment variable is not set"));
            return;
        }

        const requestData = JSON.stringify({
            model: OPENAI_MODEL,
            messages: [
                { role: "system", content: systemPrompt },
                { role: "user", content: userMessage }
            ],
            temperature: 0.3, // Lower for consistent outputs
            max_tokens: 2048,
            top_p: 0.9
        });

        const options = {
            hostname: "api.openai.com",
            path: "/v1/chat/completions",
            method: "POST",
            headers: {
                "Authorization": `Bearer ${OPENAI_API_KEY}`,
                "Content-Type": "application/json",
                "Content-Length": Buffer.byteLength(requestData)
            }
        };

        const req = https.request(options, (res) => {
            let data = "";

            res.on("data", (chunk) => {
                data += chunk;
            });

            res.on("end", () => {
                try {
                    const response = JSON.parse(data);
                    if (response.choices && response.choices[0] && response.choices[0].message) {
                        resolve(response.choices[0].message.content);
                    } else if (response.error) {
                        reject(new Error(`OpenAI API Error: ${response.error.message}`));
                    } else {
                        reject(new Error("Unexpected response format from OpenAI"));
                    }
                } catch (error) {
                    reject(new Error(`Failed to parse OpenAI response: ${error.message}`));
                }
            });
        });

        req.on("error", (error) => {
            reject(error);
        });

        req.write(requestData);
        req.end();
    });
}

// ===================================================================
// HIGH-LEVEL LLM FUNCTIONS
// ===================================================================

async function generateCircuitDesign(description) {
    console.log(`[LLM] Generating circuit design for: "${description}"`);
    try {
        const response = await callOpenAI(
            `Design a PCB circuit for the following requirement:\n\n${description}`,
            SYSTEM_PROMPTS.circuit_designer
        );
        
        // Extract JSON from response
        const jsonMatch = response.match(/\{[\s\S]*\}/);
        if (!jsonMatch) {
            throw new Error("LLM did not return valid JSON circuit design");
        }
        
        const circuit = JSON.parse(jsonMatch[0]);
        console.log(`[LLM] Circuit "${circuit.circuit_name}" generated successfully`);
        return {
            success: true,
            circuit,
            raw_response: response
        };
    } catch (error) {
        console.error(`[LLM Error] Circuit generation failed: ${error.message}`);
        return {
            success: false,
            error: error.message
        };
    }
}

async function queryPCBKnowledge(question) {
    console.log(`[LLM] PCB Knowledge Query: "${question}"`);
    try {
        const response = await callOpenAI(
            question,
            SYSTEM_PROMPTS.pcb_knowledge
        );
        
        console.log(`[LLM] Knowledge response generated`);
        return {
            success: true,
            answer: response,
            question
        };
    } catch (error) {
        console.error(`[LLM Error] Knowledge query failed: ${error.message}`);
        return {
            success: false,
            error: error.message
        };
    }
}

async function recommendComponents(requirements) {
    console.log(`[LLM] Component Recommendation: "${requirements}"`);
    try {
        const response = await callOpenAI(
            `Based on these requirements, recommend specific components with part numbers:\n\n${requirements}`,
            SYSTEM_PROMPTS.component_selector
        );
        
        console.log(`[LLM] Component recommendation generated`);
        return {
            success: true,
            recommendations: response,
            requirements
        };
    } catch (error) {
        console.error(`[LLM Error] Component recommendation failed: ${error.message}`);
        return {
            success: false,
            error: error.message
        };
    }
}

async function performDRC(circuit) {
    console.log(`[LLM] Performing Design Rule Check on circuit`);
    try {
        const circuitDescription = JSON.stringify(circuit, null, 2);
        const response = await callOpenAI(
            `Please perform a design rule check on this circuit:\n\n${circuitDescription}\n\nProvide feedback on potential issues and recommendations.`,
            SYSTEM_PROMPTS.drc_assistant
        );
        
        console.log(`[LLM] DRC analysis complete`);
        return {
            success: true,
            analysis: response,
            circuit_name: circuit.circuit_name || "Unknown"
        };
    } catch (error) {
        console.error(`[LLM Error] DRC analysis failed: ${error.message}`);
        return {
            success: false,
            error: error.message
        };
    }
}

async function parseDatasheet(datastringInput) {
    console.log(`[LLM] Parsing datasheet information`);
    try {
        const response = await callOpenAI(
            `Extract and explain the key information from this datasheet content:\n\n${datastringInput}`,
            SYSTEM_PROMPTS.datasheet_parser
        );
        
        console.log(`[LLM] Datasheet parsing complete`);
        return {
            success: true,
            parsed_info: response
        };
    } catch (error) {
        console.error(`[LLM Error] Datasheet parsing failed: ${error.message}`);
        return {
            success: false,
            error: error.message
        };
    }
}

// ===================================================================
// EXPORTS
// ===================================================================

module.exports = {
    SYSTEM_PROMPTS,
    callOpenAI,
    generateCircuitDesign,
    queryPCBKnowledge,
    recommendComponents,
    performDRC,
    parseDatasheet
};
