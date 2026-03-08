# Allegro X - LLM-Powered PCB Design Engine (v2.0)

**Advanced Generative AI for Circuit Design & PCB Knowledge**

## Overview

Allegro X is now a fully LLM-powered PCB design platform that uses OpenAI's GPT-4 to intelligently generate circuit designs, answer PCB engineering questions, recommend components, and perform design rule checking.

### Key Features

✨ **LLM-Driven Circuit Generation** - Describe circuits in natural language, AI creates designs  
🤖 **Intelligent PCB Knowledge** - Ask anything about PCB design, materials, manufacturing  
🔧 **Component Recommendations** - Get vendor-specific part suggestions for your requirements  
✅ **Design Rule Checking** - LLM-powered DRC analysis for signal integrity and thermal concerns  
📄 **Datasheet Parsing** - Extract and explain IC datasheets automatically  

---

## Installation

### Prerequisites

- **Node.js** 14+ - [Download](https://nodejs.org/)
- **OpenAI API Key** - [Get API Key](https://platform.openai.com/api-keys)

### Setup Steps

1. **Clone/Extract the project**
   ```bash
   cd pcb-maker
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure OpenAI API**
   ```bash
   # Copy the example env file
   copy .env.example .env

   # Edit .env and add your API key
   OPENAI_API_KEY=sk-your-api-key-here
   ```

4. **Start the server**
   ```bash
   npm start
   ```

5. **Open in browser**
   ```
   http://localhost:5000
   ```

---

## API Endpoints

### 1. Generate Circuit Design
**POST** `/api/generate`

Generate a PCB circuit from natural language description.

**Request:**
```json
{
  "prompt": "Design a 5V power supply with 7805 regulator and decoupling capacitors"
}
```

**Response:**
```json
{
  "success": true,
  "method": "llm-generated",
  "circuit_name": "5V Linear Regulator",
  "description": "5V power supply using LM7805 with input/output filtering",
  "components": [
    {"ref": "U1", "type": "ic", "label": "LM7805", "value": "", "footprint": "TO-220"},
    {"ref": "C1", "type": "capacitor", "label": "100uF", "value": "100uF", "footprint": "1206"}
  ],
  "nets": [
    ["J1.1", "C1.1", "U1.1"],
    ["U1.2", "C2.1", "J2.1"]
  ],
  "power_pins": [{"pin": "U1.1", "voltage": "12V"}],
  "notes": "LM7805 requires proper input voltage (min 7V recommended)"
}
```

### 2. PCB Knowledge Q&A
**POST** `/api/ask`

Query PCB design knowledge and best practices.

**Request:**
```json
{
  "query": "What is the difference between reflow soldering and wave soldering?"
}
```

**Response:**
```json
{
  "success": true,
  "method": "llm-knowledge",
  "question": "What is the difference between reflow soldering...",
  "answer": "Reflow soldering is used for SMT components... Wave soldering is for THT..."
}
```

### 3. Component Recommendations
**POST** `/api/recommend-components`

Get vendor-specific component recommendations.

**Request:**
```json
{
  "requirements": "Low-noise precision comparator, rail-to-rail inputs, CMOS, DIP-8 package, 5V supply"
}
```

**Response:**
```json
{
  "success": true,
  "method": "llm-recommendations",
  "requirements": "Low-noise precision comparator...",
  "recommendations": "TI LM393 (DIP-8), NXP LPC393 (DIP-8), STM LM2903 (DIP-8)...\n\nRecommended: LM393 for cost efficiency..."
}
```

### 4. Design Rule Check
**POST** `/api/drc`

Perform LLM-powered design rule checking.

**Request:**
```json
{
  "circuit_name": "RF Mixer",
  "components": [...],
  "nets": [...]
}
```

**Response:**
```json
{
  "success": true,
  "method": "llm-drc",
  "circuit_name": "RF Mixer",
  "analysis": "⚠️ Signal Integrity: Missing termination resistors on high-speed lines...\n✓ Power Distribution: Good decoupling near IC...\n⚠️ Thermal: U1 may dissipate up to 2W without heatsink..."
}
```

### 5. Datasheet Parsing
**POST** `/api/parse-datasheet`

Extract and explain datasheet information.

**Request:**
```json
{
  "content": "[Extracted datasheet text]"
}
```

**Response:**
```json
{
  "success": true,
  "method": "llm-parser",
  "parsed_info": "Pin Configuration:\nPin 1: VCC (5V)\nPin 8: GND\n\nElectrical Specifications:\nMax Input Frequency: 10 MHz..."
}
```

### 6. API Health Check
**GET** `/api/health`

Check API status.

**Response:**
```json
{
  "status": "healthy",
  "service": "Allegro X LLM API",
  "timestamp": "2026-03-06T10:30:00.000Z"
}
```

### 7. API Documentation
**GET** `/api/docs`

Get full API documentation.

---

## Environment Configuration

Create a `.env` file in the project root:

```env
# REQUIRED
OPENAI_API_KEY=sk-your-key-here

# Optional
OPENAI_MODEL=gpt-4-turbo-preview      # Options: gpt-4, gpt-3.5-turbo
SERVER_PORT=5000
SERVER_HOST=localhost
LOG_LEVEL=info                         # Options: debug, info, warn, error
```

### Model Selection

- **gpt-4-turbo-preview** (Recommended) - Best accuracy for complex circuit design
- **gpt-4** - Slower but highest quality
- **gpt-3.5-turbo** - Cheaper, faster, adequate for simple designs

---

## Architecture

### File Structure

```
pcb-maker/
├── app_ai_server.js          # Main Express server with LLM integration
├── llm-utils.js              # LLM API wrapper & system prompts
├── package.json              # Dependencies
├── .env.example              # Environment template
├── .env                       # Your secrets (gitignored)
├── index.html                # Web UI
├── api/
│   └── index.js             # Vercel serverless API endpoints
├── inference_pcb.py          # Python inference reference
├── train_pcb_llm.py          # Fine-tuning template (reference)
└── README_LLM.md             # This file
```

###  System Prompts

Each LLM request uses a specialized system prompt:

| Feature | Model | Prompt |
|---------|-------|--------|
| Circuit Generation | GPT-4 | Electrical engineer expertise, JSON output format |
| PCB Knowledge | GPT-4 | Industry expert on materials, manufacturing, standards |
| Component Selection | GPT-4 | BOM expert, vendor awareness, cost/performance tradeoff |
| DRC Analysis | GPT-4 | Signal integrity, thermal, EMI/EMC expert |
| Datasheet Parsing | GPT-4 | Technical documentation translator |

---

## Usage Examples

### Example 1: Generate an LED Circuit

```bash
curl -X POST http://localhost:5000/api/generate \  
  -H "Content-Type: application/json" \
  -d '{"prompt": "Create a simple LED blinking circuit with a 555 timer and LED on pin 3"}'
```

### Example 2: Ask About PCB Materials

```bash
curl -X POST http://localhost:5000/api/ask \
  -H "Content-Type: application/json" \
  -d '{"query": "What substrate material should I use for a 5 GHz RF design?"}'
```

### Example 3: Get Component Recommendations

```bash
curl -X POST http://localhost:5000/api/recommend-components \
  -H "Content-Type: application/json" \
  -d '{"requirements": "3.3V to 5V level shifter, non-inverting, bidirectional, DIP or SOIC package"}'
```

### Example 4: Analyze a Circuit

```bash
curl -X POST http://localhost:5000/api/drc \
  -H "Content-Type: application/json" \
  -d '{
    "circuit_name": "LED Driver",
    "components": [{"ref": "U1", "type": "ic", "label": "TLC5940"}],
    "nets": [["J1.1", "R1.1"]]
  }'
```

---

## Pricing

OpenAI API costs (as of March 2026):

- **gpt-4-turbo-preview**: $0.01/1K tokens input, $0.03/1K tokens output
- **gpt-3.5-turbo**: $0.0005/1K tokens input, $0.0015/1K tokens output

Typical circuit generation: 800-1200 tokens (~$0.03-0.04)

---

## Troubleshooting

### "OPENAI_API_KEY is not set"
- Check `.env` file exists in project root
- Verify you copied your actual API key
- Restart the server after updating `.env`

### "API rate limit exceeded"
- OpenAI API has usage limits
- Implement retry logic or use lower-cost model (gpt-3.5-turbo)
- Upgrade OpenAI organization plan

### "Invalid circuit JSON from LLM"
- LLM may hallucinate invalid formats occasionally
- Try rephrasing the prompt with more specific requirements
- Use gpt-4 instead of gpt-3.5-turbo for better consistency

### Localhost not opening automatically (non-Windows)
- Manually visit `http://localhost:5000` in your browser
- Or: `open http://localhost:5000` (macOS) or `xdg-open http://localhost:5000` (Linux)

---

## Advanced: Fine-Tuning Custom Models

**Coming Soon**: Deploy a fine-tuned LLaMA2 or CodeLlama for offline circuit generation

For now, see `train_pcb_llm.py` for LoRA fine-tuning reference.

---

## API Pricing Optimization

To reduce costs:

1. **Use gpt-3.5-turbo** for simple circuits  
2. **Cache frequently asked questions**
3. **Batch process multiple designs**
4. **Use prompt engineering** to reduce token count

---

## Future Roadmap

- 🧠 Fine-tuned CodeLlama models for local inference
- 📊 Circuit simulation integration (SPICE)
- 🎨 Automatic PCB layout generation (CAD export)
- 🔍 Real-time DRC with signal integrity solvers
- 💾 Design history & version control
- 🌐 Multi-user collaboration backend

---

## Support & Contact

- **Issues**: Check existing solutions in docs
- **Updates**: Watch for new LLM-powered features
- **Feedback**: Submit feature requests

---

*Allegro X: Where AI Meets Electronics Design* 🚀
