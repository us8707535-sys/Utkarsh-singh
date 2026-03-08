# ALLEGRO X 2.0 - QUICK START GUIDE

## 🚀 Get Started in 5 Minutes

### Step 1: Get Your OpenAI API Key
1. Go to https://platform.openai.com/api-keys
2. Click "Create new secret key"
3. Copy the key (starts with `sk-`)

### Step 2: Configure the Project
```bash
# Navigate to project folder
cd pcb-maker

# Create .env file with your API key
echo OPENAI_API_KEY=sk-your-key-here > .env
```

**On Windows (PowerShell):**
```powershell
"OPENAI_API_KEY=sk-your-key-here" | Out-File -Encoding utf8 .env
```

### Step 3: Install Dependencies
```bash
npm install
```

### Step 4: Start the Server
```bash
npm start
```

You'll see:
```
===========================================================
  ALLEGRO X -- Circuit Knowledge Engine (LLM Edition)
===========================================================
  OpenAI API Key: ✓ CONFIGURED
  Model: gpt-4-turbo-preview
  Server: http://localhost:5000
  Docs: http://localhost:5000/api/docs
===========================================================
```

### Step 5: Open in Browser
Browser will auto-open to: **http://localhost:5000**

---

## 💡 Usage Examples

### Example 1: Generate a 5V Power Supply
1. Go to **Circuit Generator** tab
2. Enter: `Design a 5V power supply with 7805 regulator, input capacitor and output filter capacitor`
3. Click "Generate Circuit"
4. See the LLM-generated circuit in JSON format

### Example 2: Ask About PCB Materials
1. Go to **PCB Knowledge** tab
2. Enter: `What's the best substrate material for high-speed USB 3.0 signals?`
3. Click "Ask Expert"
4. Get expert advice from the LLM

### Example 3: Get Component Suggestions
1. Go to **Components** tab
2. Enter: `Low-noise precision amplifier, DIP-8 package, 5V single supply, rail-to-rail outputs`
3. Click "Recommend Components"
4. Get vendor-specific part numbers and recommendations

### Example 4: Check Your Design
1. Go to **Design Check** tab
2. Paste your circuit JSON (from circuit generation or manual design)
3. Click "Analyze Circuit"
4. Get AI-powered feedback on signal integrity, thermal, and EMI

### Example 5: Parse a Datasheet
1. Go to **Datasheet** tab
2. Paste datasheet text content
3. Click "Parse Datasheet"
4. Get extracted pin configs, specs, and application notes

---

## 🔧 API Endpoints (For Integration)

### Generate Circuit
```bash
curl -X POST http://localhost:5000/api/generate \
  -H "Content-Type: application/json" \
  -d '{"prompt":"555 timer astable circuit"}'
```

### Ask Knowledge Question
```bash
curl -X POST http://localhost:5000/api/ask \
  -H "Content-Type: application/json" \
  -d '{"query":"What is HDI PCB?"}'
```

### Recommend Components
```bash
curl -X POST http://localhost:5000/api/recommend-components \
  -H "Content-Type: application/json" \
  -d '{"requirements":"USB Type-C switch IC, integrated ESD"}'
```

### Design Rule Check
```bash
curl -X POST http://localhost:5000/api/drc \
  -H "Content-Type: application/json" \
  -d '{"circuit_name":"LED Driver","components":[],"nets":[]}'
```

### Check API Status
```bash
curl http://localhost:5000/api/health
```

### Get Full API Docs
```bash
curl http://localhost:5000/api/docs
```

---

## ⚡ Environment Setup (Advanced)

Create `.env` file with these options:

```env
# REQUIRED: Your OpenAI API Key
OPENAI_API_KEY=sk-...

# Model (default: gpt-4-turbo-preview)
# Options: gpt-4-turbo-preview, gpt-4, gpt-3.5-turbo (cheaper)
OPENAI_MODEL=gpt-4-turbo-preview

# Server Port (default: 5000)
SERVER_PORT=5000

# Logging Level (default: info)
LOG_LEVEL=debug    # debug | info | warn | error
```

**Save as:** `.env` in project root (not `.env.example`)

---

## 🐛 Troubleshooting

### "API Connection Failed"
```
✗ API Connection Failed - Check OPENAI_API_KEY
```
**Solution:**
- Check if `.env` file exists in the project root
- Verify your API key is correct (starts with `sk-`)
- Restart the server after updating `.env`
- Test with: `npm start`

### "OPENAI_API_KEY is not set"
**Solution:**
- Make sure you created `.env` file (not `.env.example`)
- File must be in the root pcb-maker folder
- Windows: Use `"OPENAI_API_KEY=sk-..."  | Out-File -Encoding utf8 .env`

### "Invalid circuit JSON from LLM"
- Try rephrasing your prompt more specifically
- Use gpt-4 model instead (more reliable)
- Reduce complexity of the circuit

### "Rate limit exceeded"
- You've exceeded OpenAI's usage limits
- Wait a few minutes or upgrade your plan
- Consider using gpt-3.5-turbo (cheaper)

### Port 5000 Already in Use
Change the port in `.env`:
```
SERVER_PORT=5001
```

---

## 📊 Cost Estimation

**OpenAI Pricing (March 2026):**

| Model | Input Cost | Output Cost |
|-------|------------|-------------|
| gpt-4-turbo-preview | $0.01/1K tokens | $0.03/1K tokens |
| gpt-4 | $0.03/1K tokens | $0.06/1K tokens |
| gpt-3.5-turbo | $0.0005/1K tokens | $0.0015/1K tokens |

**Typical Operations:**
- Circuit generation: 800-1200 tokens (~$0.03-0.04 with gpt-4-turbo)
- Knowledge query: 500-800 tokens (~$0.02-0.03)
- Component recommendation: 600-900 tokens (~$0.025-0.035)

**Reduce Cost:** Use `gpt-3.5-turbo` for development (~10x cheaper)

---

## 📚 File Structure

```
pcb-maker/
├── app_ai_server.js        ← Main Node.js server with LLM endpoints
├── llm-utils.js            ← LLM API wrapper & system prompts
├── index_llm.html          ← Beautiful web UI for all features
├── .env                    ← Your secrets (gitignore'd)
├── .env.example            ← Configuration template
├── package.json            ← Dependencies
├── README_LLM.md           ← Full documentation
├── QUICKSTART.md           ← This file
├── api/
│   └── index.js           ← Vercel serverless endpoint
├── inference_pcb.py        ← Python inference reference
└── train_pcb_llm.py        ← Fine-tuning template (legacy)
```

---

## 🎯 Next Steps

1. **Test the API** - Try each endpoint with example prompts
2. **Integrate into CAD** - Use the API from KiCad/Allegro/Eagle
3. **Fine-tune Models** - Train custom models for your company's standards
4. **Deploy to Production** - Use Vercel (see `api/index.js`)

---

## 🚀 Production Deployment

### Deploy to Vercel
1. Ensure `api/index.js` is configured
2. Run: `vercel deploy`
3. Set `OPENAI_API_KEY` secret in Vercel dashboard

### Docker Deployment
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY . .
RUN npm install
ENV OPENAI_API_KEY=sk-...
EXPOSE 5000
CMD ["npm", "start"]
```

Build and run:
```bash
docker build -t allegro-x .
docker run -e OPENAI_API_KEY=sk-... -p 5000:5000 allegro-x
```

---

## 📞 Support

- **API Docs**: http://localhost:5000/api/docs
- **Full README**: See `README_LLM.md`
- **Issues**: Check configuration first
- **Updates**: Monitor for new LLM features

---

**Welcome to Allegro X 2.0 - Where AI Meets Electronics Design! 🎉**

For more details, see: [README_LLM.md](README_LLM.md)
