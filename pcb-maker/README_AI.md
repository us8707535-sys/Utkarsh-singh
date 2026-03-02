# Allegro X Generative Neural Core v2.0

This project integrates a Generative AI layer into PCB design using Large Language Models (LLMs) like CodeLlama.

## AI Architecture

1.  **Fine-Tuning (`train_pcb_llm.py`)**:
    *   Uses **LoRA (Low-Rank Adaptation)** to fine-tune `codellama/CodeLlama-7b-hf`.
    *   Dataset consists of natural language prompts mapping to semantic PCB layout descriptions (JSON/KiCad-like formats).
    *   Leverages the `trl` and `peft` libraries for efficient parameter tuning.

2.  **Inference (`inference_pcb.py`)**:
    *   Loads the base model and merges the LoRA adapters.
    *   Takes user design intent (e.g., "Build a bypass circuit") and generates the corresponding component placement and netlist.

3.  **Frontend Integration**:
    *   The `index.html` simulates the neural training process via the **Neural Core Overlay**.
    *   A bridge is provided to connect the UI directly to a local Python inference server.

## Future Roadmap

*   **Real-time DRC (Design Rule Checking)**: Using LLMs to predict potential signal integrity issues during routing.
*   **Datasheet Scraping**: Automating footprint generation by scraping manufacturer datasheets via AI vision models.
*   **Auto-Routing**: Neural-guided pathfinding optimized for high-speed differential pairs.

---
*Allegro X AI: Redefining PCB Design with Generative Intelligence.*
