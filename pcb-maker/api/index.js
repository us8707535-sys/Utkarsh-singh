const CIRCUIT_TEMPLATES = {
    "555_astable": {
        keywords: ["555", "timer", "astable", "oscillator", "blink", "pulse", "square wave", "clock"],
        description: "NE555 Astable Multivibrator - generates continuous square wave output",
        components: [
            { type: "ic", ref: "U1", label: "NE555", zone: "center" },
            { type: "resistor", ref: "R1", label: "1k", zone: "center", value: "1k" },
            { type: "resistor", ref: "R2", label: "10k", zone: "center", value: "10k" },
            { type: "capacitor", ref: "C1", label: "10uF", zone: "center", value: "10uF" },
            { type: "capacitor", ref: "C2", label: "100nF", zone: "center", value: "100nF" },
            { type: "connector", ref: "J1", label: "VCC", zone: "left" },
            { type: "connector", ref: "J2", label: "GND", zone: "left" },
            { type: "connector", ref: "J3", label: "OUT", zone: "right" },
        ],
        nets: [
            ["J1.1", "U1.VCC", "U1.RESET", "R1.1"],
            ["R1.2", "U1.DISCH", "R2.1"],
            ["R2.2", "U1.THRESH", "U1.TRIG", "C1.1"],
            ["C1.2", "J2.1", "U1.GND", "C2.2"],
            ["U1.OUT", "J3.1"],
            ["U1.CTRL", "C2.1"],
        ]
    },
    "led_basic": {
        keywords: ["led", "light", "indicator", "blinker"],
        description: "Basic LED circuit with current limiting resistor",
        components: [
            { type: "resistor", ref: "R1", label: "330R", zone: "center", value: "330" },
            { type: "led", ref: "D1", label: "RED", zone: "right" },
            { type: "connector", ref: "J1", label: "VCC", zone: "left" },
            { type: "connector", ref: "J2", label: "GND", zone: "left" },
        ],
        nets: [
            ["J1.1", "R1.1"],
            ["R1.2", "D1.A"],
            ["D1.K", "J2.1"],
        ]
    },
    "5v_regulator": {
        keywords: ["5v", "power supply", "voltage regulator", "7805", "regulator", "power"],
        description: "5V Linear Voltage Regulator (7805) with filter caps",
        components: [
            { type: "connector", ref: "J1", label: "VIN", zone: "left" },
            { type: "connector", ref: "J2", label: "GND", zone: "left" },
            { type: "capacitor", ref: "C1", label: "100uF", zone: "left", value: "100uF" },
            { type: "regulator", ref: "U1", label: "7805", zone: "center" },
            { type: "capacitor", ref: "C2", label: "100nF", zone: "right", value: "100nF" },
            { type: "capacitor", ref: "C3", label: "10uF", zone: "right", value: "10uF" },
            { type: "connector", ref: "J3", label: "VOUT", zone: "right" },
        ],
        nets: [
            ["J1.1", "C1.1", "U1.IN"],
            ["U1.GND", "J2.1", "C1.2", "C2.2", "C3.2"],
            ["U1.OUT", "C2.1", "C3.1", "J3.1"],
        ]
    },
    "audio_amplifier": {
        keywords: ["amplifier", "audio", "amp", "speaker", "lm386", "sound"],
        description: "LM386 Audio Amplifier for speaker output",
        components: [
            { type: "ic", ref: "U1", label: "LM386", zone: "center" },
            { type: "capacitor", ref: "C1", label: "10uF", zone: "left", value: "10uF" },
            { type: "resistor", ref: "R1", label: "10k", zone: "left", value: "10k" },
            { type: "capacitor", ref: "C2", label: "100uF", zone: "right", value: "100uF" },
            { type: "capacitor", ref: "C3", label: "100nF", zone: "center", value: "100nF" },
            { type: "resistor", ref: "R2", label: "10R", zone: "right", value: "10" },
            { type: "connector", ref: "J1", label: "AUD_IN", zone: "left" },
            { type: "connector", ref: "J2", label: "SPK", zone: "right" },
            { type: "connector", ref: "J3", label: "VCC", zone: "left" },
            { type: "connector", ref: "J4", label: "GND", zone: "left" },
        ],
        nets: [
            ["J1.1", "C1.1"],
            ["C1.2", "R1.1", "U1.IN+"],
            ["R1.2", "J4.1", "U1.GND", "C3.2"],
            ["U1.OUT", "C2.1", "R2.1"],
            ["C2.2", "J2.1"],
            ["R2.2", "C3.1"],
            ["J3.1", "U1.VCC"],
        ]
    },
    "npn_switch": {
        keywords: ["transistor", "npn", "switch", "2n2222", "driver", "bjt"],
        description: "NPN Transistor Switch for load driving",
        components: [
            { type: "transistor", ref: "Q1", label: "2N2222", zone: "center" },
            { type: "resistor", ref: "R1", label: "1k", zone: "left", value: "1k" },
            { type: "resistor", ref: "R2", label: "10k", zone: "center", value: "10k" },
            { type: "diode", ref: "D1", label: "1N4148", zone: "center" },
            { type: "connector", ref: "J1", label: "CTRL", zone: "left" },
            { type: "connector", ref: "J2", label: "LOAD", zone: "right" },
            { type: "connector", ref: "J3", label: "VCC", zone: "right" },
            { type: "connector", ref: "J4", label: "GND", zone: "left" },
        ],
        nets: [
            ["J1.1", "R1.1"],
            ["R1.2", "Q1.B"],
            ["Q1.E", "J4.1"],
            ["Q1.C", "D1.A", "J2.1"],
            ["D1.K", "J3.1", "R2.1"],
            ["R2.2", "Q1.B"],
        ]
    },
    "h_bridge": {
        keywords: ["h-bridge", "h bridge", "motor driver", "dc motor", "bidirectional"],
        description: "H-Bridge DC Motor Driver for bidirectional control",
        components: [
            { type: "mosfet", ref: "Q1", label: "P-CH", zone: "left" },
            { type: "mosfet", ref: "Q2", label: "P-CH", zone: "right" },
            { type: "mosfet", ref: "Q3", label: "N-CH", zone: "left" },
            { type: "mosfet", ref: "Q4", label: "N-CH", zone: "right" },
            { type: "resistor", ref: "R1", label: "10k", zone: "left", value: "10k" },
            { type: "resistor", ref: "R2", label: "10k", zone: "right", value: "10k" },
            { type: "connector", ref: "J1", label: "V+", zone: "top" },
            { type: "connector", ref: "J2", label: "GND", zone: "bottom" },
            { type: "connector", ref: "J3", label: "IN_A", zone: "left" },
            { type: "connector", ref: "J4", label: "IN_B", zone: "right" },
            { type: "connector", ref: "J5", label: "MOTOR+", zone: "center" },
            { type: "connector", ref: "J6", label: "MOTOR-", zone: "center" },
        ],
        nets: [
            ["J1.1", "Q1.S", "Q2.S"],
            ["Q1.D", "Q3.D", "J5.1"],
            ["Q2.D", "Q4.D", "J6.1"],
            ["Q3.S", "Q4.S", "J2.1"],
            ["J3.1", "R1.1", "Q1.G", "Q3.G"],
            ["J4.1", "R2.1", "Q2.G", "Q4.G"],
        ]
    },
    "power_supply_module": {
        keywords: ["power supply module", "buck", "boost", "converter", "12v to 5v", "smps"],
        description: "Switch-Mode Power Supply (Buck Converter) - 12V to 5V step-down",
        components: [
            { type: "connector", ref: "J1", label: "VIN_12V", zone: "left" },
            { type: "connector", ref: "J2", label: "GND", zone: "left" },
            { type: "capacitor", ref: "C1", label: "100uF", zone: "left", value: "100uF" },
            { type: "ic", ref: "U1", label: "LM2596", zone: "center" },
            { type: "diode", ref: "D1", label: "SS34", zone: "center" },
            { type: "inductor", ref: "L1", label: "33uH", zone: "center", value: "33uH" },
            { type: "capacitor", ref: "C2", label: "220uF", zone: "right", value: "220uF" },
            { type: "connector", ref: "J3", label: "VOUT_5V", zone: "right" },
        ],
        nets: [
            ["J1.1", "C1.1", "U1.VIN"],
            ["U1.GND", "D1.A", "J2.1", "C1.2", "C2.2"],
            ["U1.SW", "D1.K", "L1.1"],
            ["L1.2", "C2.1", "U1.FB", "J3.1"],
        ]
    },
    "mcu_core": {
        keywords: ["microcontroller core", "mcu", "oscillator", "reset circuit", "atmega", "arduino core"],
        description: "Microcontroller Core with 16MHz Oscillator and Reset Circuit",
        components: [
            { type: "ic", ref: "U1", label: "ATmega328P", zone: "center" },
            { type: "crystal", ref: "Y1", label: "16MHz", zone: "bottom" },
            { type: "capacitor", ref: "C1", label: "22pF", zone: "bottom", value: "22pF" },
            { type: "capacitor", ref: "C2", label: "22pF", zone: "bottom", value: "22pF" },
            { type: "resistor", ref: "R1", label: "10k", zone: "top", value: "10k" },
            { type: "switch", ref: "SW1", label: "RESET", zone: "top" },
            { type: "capacitor", ref: "C3", label: "100nF", zone: "left", value: "100nF" },
            { type: "connector", ref: "J1", label: "VCC", zone: "left" },
            { type: "connector", ref: "J2", label: "GND", zone: "left" },
        ],
        nets: [
            ["J1.1", "U1.VCC", "U1.AVCC", "R1.1"],
            ["R1.2", "SW1.1", "U1.RESET"],
            ["SW1.2", "J2.1", "U1.GND", "C1.2", "C2.2", "C3.2"],
            ["Y1.1", "C1.1", "U1.XTAL1"],
            ["Y1.2", "C2.1", "U1.XTAL2"],
            ["U1.AREF", "C3.1"],
        ]
    },
    "protection_circuits": {
        keywords: ["protection", "esd", "reverse polarity", "surge", "tvs", "overvoltage"],
        description: "Input Protection Circuit - ESD TVS and Reverse Polarity MOSFET",
        components: [
            { type: "connector", ref: "J1", label: "DC_IN", zone: "left" },
            { type: "connector", ref: "J2", label: "GND_IN", zone: "left" },
            { type: "diode", ref: "D1", label: "TVS_5V", zone: "center" },
            { type: "mosfet", ref: "Q1", label: "P-CH", zone: "center" },
            { type: "resistor", ref: "R1", label: "100k", zone: "center", value: "100k" },
            { type: "diode", ref: "D2", label: "Zener12V", zone: "center" },
            { type: "connector", ref: "J3", label: "SAFE_VCC", zone: "right" },
            { type: "connector", ref: "J4", label: "SAFE_GND", zone: "right" },
        ],
        nets: [
            ["J1.1", "D1.K", "Q1.D"],
            ["J2.1", "D1.A", "R1.2", "D2.A", "J4.1"],
            ["Q1.G", "R1.1", "D2.K"],
            ["Q1.S", "J3.1"],
        ]
    },
};

const PCB_KNOWLEDGE = {
    materials: {
        title: "Dielectric Substrates & Material Science",
        entries: {
            fr4: {
                keywords: ["fr4", "fr-4", "fiberglass", "epoxy", "standard", "substrate"],
                name: "FR-4 (Glass Epoxy Laminate)",
                info: "Global industry standard. Woven fiberglass cloth + flame-retardant epoxy resin. Cost-effective, minimal water absorption. Ideal for low-to-moderate frequencies and general consumer electronics.",
                specs: { Tg: "130-180C", Dk: "3.9-4.8", Df: "0.015-0.020", Thermal_W_mK: "0.3" }
            },
            polyimide: {
                keywords: ["polyimide", "kapton", "flex", "flexible substrate", "dynamic"],
                name: "Polyimide",
                info: "Highly flexible with robust thermal stability. Essential for flex/rigid-flex, medical wearables, military. Saves up to 60% spatial volume.",
                specs: { Tg: "200-260+C", Dk: "3.5-4.2", Df: "0.002-0.008", Thermal_W_mK: "0.2" }
            },
            ptfe_rogers: {
                keywords: ["ptfe", "teflon", "rogers", "rf", "high frequency", "5g", "radar", "ro4000"],
                name: "PTFE / Teflon (Rogers RO4000)",
                info: "Extreme high-frequency performance with negligible signal loss. Mandatory for 5G comms, ADAS radar (77 GHz), aerospace RF.",
                specs: { Tg: "200-260+C", Dk: "2.1-2.5", Df: "0.0005-0.001", Thermal_W_mK: "0.25" }
            },
            metal_core: {
                keywords: ["metal core", "aluminum", "mcpcb", "led", "thermal", "heat sink", "power"],
                name: "Metal Core (Aluminum/Copper)",
                info: "Massive heat dissipation. Metal core acts as integrated heat sink. Standard in high-power LEDs, EV motor controls.",
                specs: { Tg: "140-180C", Dk: "1.0-4.2", Df: "0.015-0.020", Thermal_W_mK: "1.0-2.0" }
            },
            ceramic: {
                keywords: ["ceramic", "alumina", "extreme thermal", "aerospace engine"],
                name: "Ceramic (Al2O3/AlN)",
                info: "Exceptional thermal management and absolute rigidity. Ideal for aerospace, heavy industrial electronics.",
                specs: { Tg: ">250C", Dk: "9.0-10.0", Df: "N/A", Thermal_W_mK: ">10.0" }
            },
            lcp: {
                keywords: ["lcp", "liquid crystal polymer", "antenna cable", "5g module", "low moisture"],
                name: "LCP (Liquid Crystal Polymer)",
                info: "Ultra-low moisture absorption and excellent high-speed signal performance. Used in 5G antenna cables within smartphones.",
                specs: { Tg: "280-310C", Dk: "2.9-3.2", Df: "0.002-0.004", Thermal_W_mK: "0.2" }
            }
        }
    },
    board_types: {
        title: "PCB Architectural Topologies",
        entries: {
            single_sided: {
                keywords: ["single sided", "single layer", "one layer", "simple"],
                name: "Single-Sided PCB",
                info: "One dielectric substrate + one copper layer. Highly cost-effective. For low-complexity devices.",
            },
            double_sided: {
                keywords: ["double sided", "double layer", "two layer", "pth"],
                name: "Double-Sided PCB",
                info: "Copper on both sides connected via PTH (plated through-holes). Standard for consumer electronics.",
            },
            multi_layer: {
                keywords: ["multi layer", "multilayer", "4 layer", "6 layer", "ground plane"],
                name: "Multi-Layer PCB (4-12+ Layers)",
                info: "3+ conductive layers with dedicated power distribution networks and ground planes. For complex electronics.",
            },
            flexible: {
                keywords: ["flexible", "flex", "flex circuit", "bend", "wearable"],
                name: "Flexible PCB (Flex Circuit)",
                info: "Polyimide layers that bend, twist, fold. Saves 60% volume, lighter. For smartwatches, medical wearables.",
            },
            rigid_flex: {
                keywords: ["rigid flex", "rigid-flex", "hybrid pcb", "foldable"],
                name: "Rigid-Flex PCB",
                info: "Rigid FR-4 + flexible polyimide combined. Eliminates connectors/wire harnesses. For aerospace, military.",
            },
            hdi: {
                keywords: ["hdi", "high density", "microvia", "blind via", "buried via", "uhdi"],
                name: "High-Density Interconnect (HDI)",
                info: "Pinnacle of miniaturization. Microvias (20um), blind/buried vias. 30-40% smaller boards, 10 GHz signal integrity.",
            },
            hdi_mobile: {
                keywords: ["smartphone pcb", "phone motherboard", "mobile board", "iphone pcb"],
                name: "HDI for Smartphones",
                info: "8-14 layers in <1mm. Trace widths under 75um. Microvias, blind/buried vias. Critical for 5G modems and camera ISP.",
            },
            fpc_mobile: {
                keywords: ["fpc", "flex cable", "screen connector", "camera connector", "foldable phone"],
                name: "FPC (Flexible PCB for Mobile)",
                info: "Polyimide/PET substrates. Connects screen, battery, camera in phones. Essential for foldable devices.",
            }
        }
    },
    manufacturing: {
        title: "Manufacturing Pipeline",
        entries: {
            step_overview: {
                keywords: ["manufacturing", "fabrication", "how pcb made", "production"],
                name: "19-Step Manufacturing Pipeline",
                info: "1) CAM, 2) Inner Imaging, 3) Etching, 4) Strip, 5) AOI, 6) Oxide, 7) Lamination, 8) CNC Drill, 9) Plating, 10) Outer Imaging, 11) Electroplating, 12) Strip, 13) Final Etch, 14) Tin Strip, 15) Solder Mask, 16) Surface Finish, 17) Silkscreen, 18) E-Test, 19) Profiling."
            },
            reflow: {
                keywords: ["reflow", "solder paste", "stencil", "convection", "pick and place"],
                name: "Convection Reflow Soldering",
                info: "Dominant SMT method. Stencil applies paste, pick-and-place at 50K+ CPH, multi-zone oven (220-260C for SAC305)."
            },
            wave: {
                keywords: ["wave solder", "wave soldering", "tht solder"],
                name: "Wave Soldering",
                info: "THT focused. Board passes over molten solder wave. Nitrogen atmosphere. Fast but massive thermal stress."
            },
            vapor_phase: {
                keywords: ["vapor phase", "vps", "galden", "condensation"],
                name: "Vapor Phase Reflow (VPS)",
                info: "Board in boiling inert fluid (Galden). 100-400 W/m2K transfer. Impossible to overheat. Vacuum removes voids for BGA."
            }
        }
    },
    ipc_standards: {
        title: "IPC Standards & Quality",
        entries: {
            ipc_classes: {
                keywords: ["ipc class", "class 1", "class 2", "class 3", "quality", "reliability"],
                name: "IPC Product Classifications",
                info: "Class 1: Consumer (toys). Class 2: Industrial (computers). Class 3: Mission-critical (medical, military). Zero defects required."
            },
            design_rules: {
                keywords: ["design rules", "clearance", "creepage", "trace width", "3w rule"],
                name: "Critical Design Rules",
                info: "3W Rule: trace spacing >= 3x width. USB=90ohm, PCIe=85ohm, Ethernet=100ohm. Length match within 25mil."
            }
        }
    },
    vanguard: {
        title: "Vanguard Technologies",
        entries: {
            "3d_printed": {
                keywords: ["3d print", "additive", "ame", "nano dimension", "dragonfly"],
                name: "3D Printed PCBs",
                info: "Nano Dimension DragonFly IV: simultaneous printing of traces + dielectric. AgCite silver nanoparticle ink. Sub-micrometer resolution."
            },
            biodegradable: {
                keywords: ["biodegradable", "soluboard", "sustainable", "green", "eco"],
                name: "Biodegradable Substrates",
                info: "Soluboard by Jiva Materials: plant-derived cellulosic fibers in water-soluble polymer. Saves 10.5kg carbon/m2."
            },
            liquid_metal: {
                keywords: ["liquid metal", "egain", "gallium", "stretchable", "soft robot"],
                name: "Stretchable Liquid-Metal",
                info: "EGaIn in elastomeric substrates. Liquid at room temp. Self-healing. For soft robotics and wearables."
            },
            impedance_control: {
                keywords: ["impedance", "controlled impedance", "z0", "transmission line", "50 ohm"],
                name: "Impedance Control",
                info: "Z0 must match source/load to prevent reflections. Function of trace width, Dk, distance to reference plane."
            },
            differential_pairs: {
                keywords: ["differential pair", "usb", "hdmi", "pcie", "ethernet", "100 ohm", "skew"],
                name: "Differential Pair Routing",
                info: "Two coupled traces with inverted signals. USB=90ohm, PCIe=85ohm, Ethernet=100ohm. Length match within 25mil."
            }
        }
    }
};


function fuzzyMatch(prompt) {
    prompt = prompt.toLowerCase().trim();
    let bestKey = null;
    let bestScore = 0;
    for (const [key, tmpl] of Object.entries(CIRCUIT_TEMPLATES)) {
        let score = 0;
        for (const kw of tmpl.keywords) {
            if (prompt.includes(kw)) {
                score += kw.length * 2;
            }
        }
        if (score > bestScore) {
            bestScore = score;
            bestKey = key;
        }
    }
    return { key: bestKey, score: bestScore };
}


function knowledgeSearch(query) {
    query = query.toLowerCase().trim();
    let bestEntry = null;
    let bestScore = 0;
    let bestCategory = null;
    for (const [catKey, category] of Object.entries(PCB_KNOWLEDGE)) {
        for (const [ek, entry] of Object.entries(category.entries)) {
            let score = 0;
            for (const kw of (entry.keywords || [])) {
                if (query.includes(kw)) {
                    score += kw.length * 3;
                }
            }
            if (score > bestScore) {
                bestScore = score;
                bestEntry = entry;
                bestCategory = category.title;
            }
        }
    }
    return { entry: bestEntry, category: bestCategory, score: bestScore };
}


function setCorsHeaders(res) {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "GET,POST,OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type");
}


module.exports = (req, res) => {
    setCorsHeaders(res);

    if (req.method === "OPTIONS") {
        return res.status(200).end();
    }

    const url = req.url.split("?")[0];

    // POST /api/generate
    if (url === "/api/generate" && req.method === "POST") {
        const prompt = (req.body && req.body.prompt) || "";
        const { key, score } = fuzzyMatch(prompt);
        if (key && score > 0) {
            const tmpl = CIRCUIT_TEMPLATES[key];
            return res.status(200).json({
                success: true,
                autonomous: true,
                template_id: key,
                description: tmpl.description,
                components: tmpl.components,
                nets: tmpl.nets,
                component_count: tmpl.components.length,
                net_count: tmpl.nets.length,
            });
        }
        return res.status(200).json({
            success: false,
            message: `Could not match '${prompt}'. Try: '555 timer', 'LED', '5V power supply'.`
        });
    }

    // GET /api/templates
    if (url === "/api/templates" && req.method === "GET") {
        const presets = [];
        for (const [key, tmpl] of Object.entries(CIRCUIT_TEMPLATES)) {
            const desc = tmpl.description;
            const name = desc.includes(" - ") ? desc.split(" - ")[0].trim() : desc;
            presets.push({ id: key, name, description: desc, component_count: tmpl.components.length });
        }
        return res.status(200).json(presets);
    }

    // GET /api/knowledge
    if (url === "/api/knowledge" && req.method === "GET") {
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
        return res.status(200).json(result);
    }

    // POST /api/ask
    if (url === "/api/ask" && req.method === "POST") {
        const query = (req.body && req.body.query) || "";
        const { entry, category, score } = knowledgeSearch(query);
        if (entry && score > 0) {
            const resp = { success: true, category, topic: entry.name, answer: entry.info };
            if (entry.specs) resp.specs = entry.specs;
            return res.status(200).json(resp);
        }
        return res.status(200).json({
            success: false,
            message: `No knowledge match for '${query}'. Try: FR-4, HDI, reflow soldering, IPC classes.`
        });
    }

    return res.status(404).json({ error: "Not found" });
};
