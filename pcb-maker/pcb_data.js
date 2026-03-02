// Auto-generated from app_ai_server.py

const CIRCUIT_TEMPLATES = {
  "555_astable": {
    "keywords": [
      "555",
      "timer",
      "astable",
      "oscillator",
      "blink",
      "pulse",
      "square wave",
      "clock"
    ],
    "description": "NE555 Astable Multivibrator - generates continuous square wave output",
    "components": [
      {
        "type": "ic",
        "ref": "U1",
        "label": "NE555",
        "zone": "center"
      },
      {
        "type": "resistor",
        "ref": "R1",
        "label": "1k",
        "zone": "center",
        "value": "1k"
      },
      {
        "type": "resistor",
        "ref": "R2",
        "label": "10k",
        "zone": "center",
        "value": "10k"
      },
      {
        "type": "capacitor",
        "ref": "C1",
        "label": "10uF",
        "zone": "center",
        "value": "10uF"
      },
      {
        "type": "capacitor",
        "ref": "C2",
        "label": "100nF",
        "zone": "center",
        "value": "100nF"
      },
      {
        "type": "connector",
        "ref": "J1",
        "label": "VCC",
        "zone": "left"
      },
      {
        "type": "connector",
        "ref": "J2",
        "label": "GND",
        "zone": "left"
      },
      {
        "type": "connector",
        "ref": "J3",
        "label": "OUT",
        "zone": "right"
      }
    ],
    "nets": [
      [
        "J1.1",
        "U1.VCC",
        "U1.RESET",
        "R1.1"
      ],
      [
        "R1.2",
        "U1.DISCH",
        "R2.1"
      ],
      [
        "R2.2",
        "U1.THRESH",
        "U1.TRIG",
        "C1.1"
      ],
      [
        "C1.2",
        "J2.1",
        "U1.GND",
        "C2.2"
      ],
      [
        "U1.OUT",
        "J3.1"
      ],
      [
        "U1.CTRL",
        "C2.1"
      ]
    ]
  },
  "555_monostable": {
    "keywords": [
      "monostable",
      "one shot",
      "single pulse",
      "delay timer"
    ],
    "description": "NE555 Monostable - single timed pulse on trigger",
    "components": [
      {
        "type": "ic",
        "ref": "U1",
        "label": "NE555",
        "zone": "center"
      },
      {
        "type": "resistor",
        "ref": "R1",
        "label": "10k",
        "zone": "center",
        "value": "10k"
      },
      {
        "type": "capacitor",
        "ref": "C1",
        "label": "10uF",
        "zone": "center",
        "value": "10uF"
      },
      {
        "type": "capacitor",
        "ref": "C2",
        "label": "100nF",
        "zone": "center",
        "value": "100nF"
      },
      {
        "type": "switch",
        "ref": "SW1",
        "label": "TRIG",
        "zone": "left"
      },
      {
        "type": "connector",
        "ref": "J1",
        "label": "VCC",
        "zone": "left"
      },
      {
        "type": "connector",
        "ref": "J2",
        "label": "GND",
        "zone": "left"
      },
      {
        "type": "connector",
        "ref": "J3",
        "label": "OUT",
        "zone": "right"
      }
    ],
    "nets": [
      [
        "J1.1",
        "U1.VCC",
        "U1.RESET",
        "R1.1"
      ],
      [
        "R1.2",
        "U1.DISCH",
        "U1.THRESH",
        "C1.1"
      ],
      [
        "C1.2",
        "J2.1",
        "U1.GND",
        "C2.2"
      ],
      [
        "SW1.1",
        "U1.TRIG"
      ],
      [
        "U1.OUT",
        "J3.1"
      ],
      [
        "U1.CTRL",
        "C2.1"
      ]
    ]
  },
  "led_basic": {
    "keywords": [
      "led",
      "light",
      "indicator",
      "blinker"
    ],
    "description": "Basic LED circuit with current limiting resistor",
    "components": [
      {
        "type": "resistor",
        "ref": "R1",
        "label": "330R",
        "zone": "center",
        "value": "330"
      },
      {
        "type": "led",
        "ref": "D1",
        "label": "RED",
        "zone": "right"
      },
      {
        "type": "connector",
        "ref": "J1",
        "label": "VCC",
        "zone": "left"
      },
      {
        "type": "connector",
        "ref": "J2",
        "label": "GND",
        "zone": "left"
      }
    ],
    "nets": [
      [
        "J1.1",
        "R1.1"
      ],
      [
        "R1.2",
        "D1.A"
      ],
      [
        "D1.K",
        "J2.1"
      ]
    ]
  },
  "led_array": {
    "keywords": [
      "led array",
      "multiple led",
      "led strip",
      "led bar",
      "chaser"
    ],
    "description": "5-LED array with individual current limiting resistors",
    "components": [
      {
        "type": "resistor",
        "ref": "R1",
        "label": "220R",
        "zone": "center",
        "value": "220"
      },
      {
        "type": "resistor",
        "ref": "R2",
        "label": "220R",
        "zone": "center",
        "value": "220"
      },
      {
        "type": "resistor",
        "ref": "R3",
        "label": "220R",
        "zone": "center",
        "value": "220"
      },
      {
        "type": "resistor",
        "ref": "R4",
        "label": "220R",
        "zone": "center",
        "value": "220"
      },
      {
        "type": "resistor",
        "ref": "R5",
        "label": "220R",
        "zone": "center",
        "value": "220"
      },
      {
        "type": "led",
        "ref": "D1",
        "label": "RED",
        "zone": "right"
      },
      {
        "type": "led",
        "ref": "D2",
        "label": "GRN",
        "zone": "right"
      },
      {
        "type": "led",
        "ref": "D3",
        "label": "BLU",
        "zone": "right"
      },
      {
        "type": "led",
        "ref": "D4",
        "label": "YEL",
        "zone": "right"
      },
      {
        "type": "led",
        "ref": "D5",
        "label": "WHT",
        "zone": "right"
      },
      {
        "type": "connector",
        "ref": "J1",
        "label": "VCC",
        "zone": "left"
      },
      {
        "type": "connector",
        "ref": "J2",
        "label": "GND",
        "zone": "left"
      }
    ],
    "nets": [
      [
        "J1.1",
        "R1.1",
        "R2.1",
        "R3.1",
        "R4.1",
        "R5.1"
      ],
      [
        "R1.2",
        "D1.A"
      ],
      [
        "R2.2",
        "D2.A"
      ],
      [
        "R3.2",
        "D3.A"
      ],
      [
        "R4.2",
        "D4.A"
      ],
      [
        "R5.2",
        "D5.A"
      ],
      [
        "D1.K",
        "D2.K",
        "D3.K",
        "D4.K",
        "D5.K",
        "J2.1"
      ]
    ]
  },
  "5v_regulator": {
    "keywords": [
      "5v",
      "power supply",
      "voltage regulator",
      "7805",
      "regulator",
      "power"
    ],
    "description": "5V Linear Voltage Regulator (7805) with filter caps",
    "components": [
      {
        "type": "connector",
        "ref": "J1",
        "label": "VIN",
        "zone": "left"
      },
      {
        "type": "connector",
        "ref": "J2",
        "label": "GND",
        "zone": "left"
      },
      {
        "type": "capacitor",
        "ref": "C1",
        "label": "100uF",
        "zone": "left",
        "value": "100uF"
      },
      {
        "type": "regulator",
        "ref": "U1",
        "label": "7805",
        "zone": "center"
      },
      {
        "type": "capacitor",
        "ref": "C2",
        "label": "100nF",
        "zone": "right",
        "value": "100nF"
      },
      {
        "type": "capacitor",
        "ref": "C3",
        "label": "10uF",
        "zone": "right",
        "value": "10uF"
      },
      {
        "type": "connector",
        "ref": "J3",
        "label": "VOUT",
        "zone": "right"
      }
    ],
    "nets": [
      [
        "J1.1",
        "C1.1",
        "U1.IN"
      ],
      [
        "U1.GND",
        "J2.1",
        "C1.2",
        "C2.2",
        "C3.2"
      ],
      [
        "U1.OUT",
        "C2.1",
        "C3.1",
        "J3.1"
      ]
    ]
  },
  "3v3_regulator": {
    "keywords": [
      "3.3v",
      "3v3",
      "ldo",
      "ams1117"
    ],
    "description": "3.3V LDO Regulator (AMS1117-3.3)",
    "components": [
      {
        "type": "connector",
        "ref": "J1",
        "label": "VIN",
        "zone": "left"
      },
      {
        "type": "connector",
        "ref": "J2",
        "label": "GND",
        "zone": "left"
      },
      {
        "type": "capacitor",
        "ref": "C1",
        "label": "10uF",
        "zone": "left",
        "value": "10uF"
      },
      {
        "type": "regulator",
        "ref": "U1",
        "label": "AMS1117",
        "zone": "center"
      },
      {
        "type": "capacitor",
        "ref": "C2",
        "label": "22uF",
        "zone": "right",
        "value": "22uF"
      },
      {
        "type": "connector",
        "ref": "J3",
        "label": "3V3OUT",
        "zone": "right"
      }
    ],
    "nets": [
      [
        "J1.1",
        "C1.1",
        "U1.IN"
      ],
      [
        "U1.GND",
        "J2.1",
        "C1.2",
        "C2.2"
      ],
      [
        "U1.OUT",
        "C2.1",
        "J3.1"
      ]
    ]
  },
  "battery_power": {
    "keywords": [
      "battery",
      "portable",
      "coin cell",
      "cr2032"
    ],
    "description": "Battery-powered supply with switch and decoupling",
    "components": [
      {
        "type": "battery",
        "ref": "BT1",
        "label": "CR2032",
        "zone": "left"
      },
      {
        "type": "switch",
        "ref": "SW1",
        "label": "ON/OFF",
        "zone": "left"
      },
      {
        "type": "capacitor",
        "ref": "C1",
        "label": "100nF",
        "zone": "center",
        "value": "100nF"
      },
      {
        "type": "led",
        "ref": "D1",
        "label": "PWR",
        "zone": "right"
      },
      {
        "type": "resistor",
        "ref": "R1",
        "label": "1k",
        "zone": "right",
        "value": "1k"
      },
      {
        "type": "connector",
        "ref": "J1",
        "label": "VOUT",
        "zone": "right"
      },
      {
        "type": "connector",
        "ref": "J2",
        "label": "GND",
        "zone": "left"
      }
    ],
    "nets": [
      [
        "BT1.1",
        "SW1.1"
      ],
      [
        "SW1.2",
        "C1.1",
        "R1.1",
        "J1.1"
      ],
      [
        "R1.2",
        "D1.A"
      ],
      [
        "D1.K",
        "BT1.2",
        "C1.2",
        "J2.1"
      ]
    ]
  },
  "audio_amplifier": {
    "keywords": [
      "amplifier",
      "audio",
      "amp",
      "speaker",
      "lm386",
      "sound"
    ],
    "description": "LM386 Audio Amplifier for speaker output",
    "components": [
      {
        "type": "ic",
        "ref": "U1",
        "label": "LM386",
        "zone": "center"
      },
      {
        "type": "capacitor",
        "ref": "C1",
        "label": "10uF",
        "zone": "left",
        "value": "10uF"
      },
      {
        "type": "resistor",
        "ref": "R1",
        "label": "10k",
        "zone": "left",
        "value": "10k"
      },
      {
        "type": "capacitor",
        "ref": "C2",
        "label": "100uF",
        "zone": "right",
        "value": "100uF"
      },
      {
        "type": "capacitor",
        "ref": "C3",
        "label": "100nF",
        "zone": "center",
        "value": "100nF"
      },
      {
        "type": "resistor",
        "ref": "R2",
        "label": "10R",
        "zone": "right",
        "value": "10"
      },
      {
        "type": "connector",
        "ref": "J1",
        "label": "AUD_IN",
        "zone": "left"
      },
      {
        "type": "connector",
        "ref": "J2",
        "label": "SPK",
        "zone": "right"
      },
      {
        "type": "connector",
        "ref": "J3",
        "label": "VCC",
        "zone": "left"
      },
      {
        "type": "connector",
        "ref": "J4",
        "label": "GND",
        "zone": "left"
      }
    ],
    "nets": [
      [
        "J1.1",
        "C1.1"
      ],
      [
        "C1.2",
        "R1.1",
        "U1.IN+"
      ],
      [
        "R1.2",
        "J4.1",
        "U1.GND",
        "C3.2"
      ],
      [
        "U1.OUT",
        "C2.1",
        "R2.1"
      ],
      [
        "C2.2",
        "J2.1"
      ],
      [
        "R2.2",
        "C3.1"
      ],
      [
        "J3.1",
        "U1.VCC"
      ]
    ]
  },
  "inverting_amp": {
    "keywords": [
      "inverting",
      "op amp",
      "opamp",
      "gain"
    ],
    "description": "Inverting Op-Amp Amplifier with adjustable gain",
    "components": [
      {
        "type": "opamp",
        "ref": "U1",
        "label": "LM358",
        "zone": "center"
      },
      {
        "type": "resistor",
        "ref": "R1",
        "label": "10k",
        "zone": "left",
        "value": "10k"
      },
      {
        "type": "resistor",
        "ref": "R2",
        "label": "100k",
        "zone": "center",
        "value": "100k"
      },
      {
        "type": "connector",
        "ref": "J1",
        "label": "VIN",
        "zone": "left"
      },
      {
        "type": "connector",
        "ref": "J2",
        "label": "VOUT",
        "zone": "right"
      },
      {
        "type": "connector",
        "ref": "J3",
        "label": "VCC",
        "zone": "left"
      },
      {
        "type": "connector",
        "ref": "J4",
        "label": "GND",
        "zone": "left"
      }
    ],
    "nets": [
      [
        "J1.1",
        "R1.1"
      ],
      [
        "R1.2",
        "U1.IN-",
        "R2.1"
      ],
      [
        "R2.2",
        "U1.OUT",
        "J2.1"
      ],
      [
        "U1.IN+",
        "J4.1",
        "U1.GND"
      ],
      [
        "J3.1",
        "U1.VCC"
      ]
    ]
  },
  "npn_switch": {
    "keywords": [
      "transistor",
      "npn",
      "switch",
      "2n2222",
      "driver",
      "bjt"
    ],
    "description": "NPN Transistor Switch for load driving",
    "components": [
      {
        "type": "transistor",
        "ref": "Q1",
        "label": "2N2222",
        "zone": "center"
      },
      {
        "type": "resistor",
        "ref": "R1",
        "label": "1k",
        "zone": "left",
        "value": "1k"
      },
      {
        "type": "resistor",
        "ref": "R2",
        "label": "10k",
        "zone": "center",
        "value": "10k"
      },
      {
        "type": "diode",
        "ref": "D1",
        "label": "1N4148",
        "zone": "center"
      },
      {
        "type": "connector",
        "ref": "J1",
        "label": "CTRL",
        "zone": "left"
      },
      {
        "type": "connector",
        "ref": "J2",
        "label": "LOAD",
        "zone": "right"
      },
      {
        "type": "connector",
        "ref": "J3",
        "label": "VCC",
        "zone": "right"
      },
      {
        "type": "connector",
        "ref": "J4",
        "label": "GND",
        "zone": "left"
      }
    ],
    "nets": [
      [
        "J1.1",
        "R1.1"
      ],
      [
        "R1.2",
        "Q1.B"
      ],
      [
        "Q1.E",
        "J4.1"
      ],
      [
        "Q1.C",
        "D1.A",
        "J2.1"
      ],
      [
        "D1.K",
        "J3.1",
        "R2.1"
      ],
      [
        "R2.2",
        "Q1.B"
      ]
    ]
  },
  "mosfet_switch": {
    "keywords": [
      "mosfet",
      "fet",
      "irf540",
      "power switch",
      "high current"
    ],
    "description": "N-Channel MOSFET Power Switch for high-current loads",
    "components": [
      {
        "type": "mosfet",
        "ref": "Q1",
        "label": "IRF540",
        "zone": "center"
      },
      {
        "type": "resistor",
        "ref": "R1",
        "label": "10k",
        "zone": "left",
        "value": "10k"
      },
      {
        "type": "resistor",
        "ref": "R2",
        "label": "100R",
        "zone": "center",
        "value": "100"
      },
      {
        "type": "diode",
        "ref": "D1",
        "label": "1N4007",
        "zone": "center"
      },
      {
        "type": "connector",
        "ref": "J1",
        "label": "GATE",
        "zone": "left"
      },
      {
        "type": "connector",
        "ref": "J2",
        "label": "LOAD",
        "zone": "right"
      },
      {
        "type": "connector",
        "ref": "J3",
        "label": "V+",
        "zone": "right"
      },
      {
        "type": "connector",
        "ref": "J4",
        "label": "GND",
        "zone": "left"
      }
    ],
    "nets": [
      [
        "J1.1",
        "R2.1"
      ],
      [
        "R2.2",
        "Q1.G",
        "R1.1"
      ],
      [
        "R1.2",
        "Q1.S",
        "J4.1"
      ],
      [
        "Q1.D",
        "D1.A",
        "J2.1"
      ],
      [
        "D1.K",
        "J3.1"
      ]
    ]
  },
  "temp_sensor": {
    "keywords": [
      "temperature",
      "sensor",
      "lm35",
      "thermometer",
      "temp"
    ],
    "description": "LM35 Temperature Sensor with analog output",
    "components": [
      {
        "type": "sensor",
        "ref": "U1",
        "label": "LM35",
        "zone": "center"
      },
      {
        "type": "capacitor",
        "ref": "C1",
        "label": "100nF",
        "zone": "center",
        "value": "100nF"
      },
      {
        "type": "connector",
        "ref": "J1",
        "label": "VCC",
        "zone": "left"
      },
      {
        "type": "connector",
        "ref": "J2",
        "label": "GND",
        "zone": "left"
      },
      {
        "type": "connector",
        "ref": "J3",
        "label": "AOUT",
        "zone": "right"
      }
    ],
    "nets": [
      [
        "J1.1",
        "U1.VCC",
        "C1.1"
      ],
      [
        "U1.OUT",
        "J3.1"
      ],
      [
        "U1.GND",
        "J2.1",
        "C1.2"
      ]
    ]
  },
  "light_sensor": {
    "keywords": [
      "light",
      "ldr",
      "photoresistor",
      "brightness",
      "light sensor"
    ],
    "description": "LDR Light Sensor with voltage divider output",
    "components": [
      {
        "type": "resistor",
        "ref": "R1",
        "label": "10k",
        "zone": "center",
        "value": "10k"
      },
      {
        "type": "resistor",
        "ref": "R2",
        "label": "LDR",
        "zone": "center"
      },
      {
        "type": "capacitor",
        "ref": "C1",
        "label": "100nF",
        "zone": "center",
        "value": "100nF"
      },
      {
        "type": "connector",
        "ref": "J1",
        "label": "VCC",
        "zone": "left"
      },
      {
        "type": "connector",
        "ref": "J2",
        "label": "GND",
        "zone": "left"
      },
      {
        "type": "connector",
        "ref": "J3",
        "label": "AOUT",
        "zone": "right"
      }
    ],
    "nets": [
      [
        "J1.1",
        "R1.1"
      ],
      [
        "R1.2",
        "R2.1",
        "C1.1",
        "J3.1"
      ],
      [
        "R2.2",
        "J2.1",
        "C1.2"
      ]
    ]
  },
  "pir_motion": {
    "keywords": [
      "pir",
      "motion",
      "motion sensor",
      "infrared",
      "presence"
    ],
    "description": "PIR Motion Sensor module with indicator LED",
    "components": [
      {
        "type": "sensor",
        "ref": "U1",
        "label": "PIR",
        "zone": "center"
      },
      {
        "type": "resistor",
        "ref": "R1",
        "label": "330R",
        "zone": "right",
        "value": "330"
      },
      {
        "type": "led",
        "ref": "D1",
        "label": "IND",
        "zone": "right"
      },
      {
        "type": "capacitor",
        "ref": "C1",
        "label": "10uF",
        "zone": "left",
        "value": "10uF"
      },
      {
        "type": "connector",
        "ref": "J1",
        "label": "VCC",
        "zone": "left"
      },
      {
        "type": "connector",
        "ref": "J2",
        "label": "GND",
        "zone": "left"
      },
      {
        "type": "connector",
        "ref": "J3",
        "label": "DOUT",
        "zone": "right"
      }
    ],
    "nets": [
      [
        "J1.1",
        "U1.VCC",
        "C1.1"
      ],
      [
        "U1.OUT",
        "R1.1",
        "J3.1"
      ],
      [
        "R1.2",
        "D1.A"
      ],
      [
        "D1.K",
        "J2.1",
        "U1.GND",
        "C1.2"
      ]
    ]
  },
  "low_pass_rc": {
    "keywords": [
      "low pass",
      "filter",
      "rc filter",
      "noise filter",
      "lpf"
    ],
    "description": "RC Low-Pass Filter for noise reduction",
    "components": [
      {
        "type": "resistor",
        "ref": "R1",
        "label": "1k",
        "zone": "center",
        "value": "1k"
      },
      {
        "type": "capacitor",
        "ref": "C1",
        "label": "100nF",
        "zone": "center",
        "value": "100nF"
      },
      {
        "type": "connector",
        "ref": "J1",
        "label": "IN",
        "zone": "left"
      },
      {
        "type": "connector",
        "ref": "J2",
        "label": "OUT",
        "zone": "right"
      },
      {
        "type": "connector",
        "ref": "J3",
        "label": "GND",
        "zone": "left"
      }
    ],
    "nets": [
      [
        "J1.1",
        "R1.1"
      ],
      [
        "R1.2",
        "C1.1",
        "J2.1"
      ],
      [
        "C1.2",
        "J3.1"
      ]
    ]
  },
  "high_pass_rc": {
    "keywords": [
      "high pass",
      "hpf",
      "ac coupling",
      "dc block"
    ],
    "description": "RC High-Pass Filter / AC coupling stage",
    "components": [
      {
        "type": "capacitor",
        "ref": "C1",
        "label": "100nF",
        "zone": "center",
        "value": "100nF"
      },
      {
        "type": "resistor",
        "ref": "R1",
        "label": "10k",
        "zone": "center",
        "value": "10k"
      },
      {
        "type": "connector",
        "ref": "J1",
        "label": "IN",
        "zone": "left"
      },
      {
        "type": "connector",
        "ref": "J2",
        "label": "OUT",
        "zone": "right"
      },
      {
        "type": "connector",
        "ref": "J3",
        "label": "GND",
        "zone": "left"
      }
    ],
    "nets": [
      [
        "J1.1",
        "C1.1"
      ],
      [
        "C1.2",
        "R1.1",
        "J2.1"
      ],
      [
        "R1.2",
        "J3.1"
      ]
    ]
  },
  "h_bridge": {
    "keywords": [
      "h-bridge",
      "motor",
      "dc motor",
      "motor driver",
      "h bridge",
      "bidirectional"
    ],
    "description": "H-Bridge DC Motor Driver with direction control",
    "components": [
      {
        "type": "mosfet",
        "ref": "Q1",
        "label": "IRF540",
        "zone": "center"
      },
      {
        "type": "mosfet",
        "ref": "Q2",
        "label": "IRF540",
        "zone": "center"
      },
      {
        "type": "mosfet",
        "ref": "Q3",
        "label": "IRF540",
        "zone": "center"
      },
      {
        "type": "mosfet",
        "ref": "Q4",
        "label": "IRF540",
        "zone": "center"
      },
      {
        "type": "diode",
        "ref": "D1",
        "label": "1N4007",
        "zone": "center"
      },
      {
        "type": "diode",
        "ref": "D2",
        "label": "1N4007",
        "zone": "center"
      },
      {
        "type": "diode",
        "ref": "D3",
        "label": "1N4007",
        "zone": "center"
      },
      {
        "type": "diode",
        "ref": "D4",
        "label": "1N4007",
        "zone": "center"
      },
      {
        "type": "connector",
        "ref": "J1",
        "label": "MOTOR+",
        "zone": "right"
      },
      {
        "type": "connector",
        "ref": "J2",
        "label": "MOTOR-",
        "zone": "right"
      },
      {
        "type": "connector",
        "ref": "J3",
        "label": "VCC",
        "zone": "left"
      },
      {
        "type": "connector",
        "ref": "J4",
        "label": "GND",
        "zone": "left"
      },
      {
        "type": "connector",
        "ref": "J5",
        "label": "IN1",
        "zone": "left"
      },
      {
        "type": "connector",
        "ref": "J6",
        "label": "IN2",
        "zone": "left"
      }
    ],
    "nets": [
      [
        "J3.1",
        "Q1.D",
        "Q3.D",
        "D1.K",
        "D3.K"
      ],
      [
        "Q1.S",
        "Q2.D",
        "J1.1",
        "D1.A",
        "D2.K"
      ],
      [
        "Q3.S",
        "Q4.D",
        "J2.1",
        "D3.A",
        "D4.K"
      ],
      [
        "Q2.S",
        "Q4.S",
        "J4.1",
        "D2.A",
        "D4.A"
      ],
      [
        "J5.1",
        "Q1.G",
        "Q4.G"
      ],
      [
        "J6.1",
        "Q2.G",
        "Q3.G"
      ]
    ]
  },
  "relay_driver": {
    "keywords": [
      "relay",
      "switch",
      "relay driver",
      "contactor",
      "solenoid"
    ],
    "description": "Transistor-driven Relay with flyback diode",
    "components": [
      {
        "type": "relay",
        "ref": "RL1",
        "label": "5V-RLY",
        "zone": "center"
      },
      {
        "type": "transistor",
        "ref": "Q1",
        "label": "2N2222",
        "zone": "center"
      },
      {
        "type": "diode",
        "ref": "D1",
        "label": "1N4007",
        "zone": "center"
      },
      {
        "type": "resistor",
        "ref": "R1",
        "label": "1k",
        "zone": "left",
        "value": "1k"
      },
      {
        "type": "connector",
        "ref": "J1",
        "label": "CTRL",
        "zone": "left"
      },
      {
        "type": "connector",
        "ref": "J2",
        "label": "VCC",
        "zone": "left"
      },
      {
        "type": "connector",
        "ref": "J3",
        "label": "GND",
        "zone": "left"
      },
      {
        "type": "connector",
        "ref": "J4",
        "label": "COM",
        "zone": "right"
      },
      {
        "type": "connector",
        "ref": "J5",
        "label": "NO",
        "zone": "right"
      }
    ],
    "nets": [
      [
        "J1.1",
        "R1.1"
      ],
      [
        "R1.2",
        "Q1.B"
      ],
      [
        "Q1.E",
        "J3.1"
      ],
      [
        "Q1.C",
        "RL1.COIL1",
        "D1.A"
      ],
      [
        "RL1.COIL2",
        "J2.1",
        "D1.K"
      ],
      [
        "RL1.COM",
        "J4.1"
      ],
      [
        "RL1.NO",
        "J5.1"
      ]
    ]
  },
  "overvoltage_protection": {
    "keywords": [
      "protection",
      "overvoltage",
      "tvs",
      "clamp",
      "surge"
    ],
    "description": "Overvoltage Protection with TVS diode and fuse",
    "components": [
      {
        "type": "fuse",
        "ref": "F1",
        "label": "500mA",
        "zone": "left"
      },
      {
        "type": "diode",
        "ref": "D1",
        "label": "TVS",
        "zone": "center"
      },
      {
        "type": "capacitor",
        "ref": "C1",
        "label": "100nF",
        "zone": "center",
        "value": "100nF"
      },
      {
        "type": "connector",
        "ref": "J1",
        "label": "VIN",
        "zone": "left"
      },
      {
        "type": "connector",
        "ref": "J2",
        "label": "VOUT",
        "zone": "right"
      },
      {
        "type": "connector",
        "ref": "J3",
        "label": "GND",
        "zone": "left"
      }
    ],
    "nets": [
      [
        "J1.1",
        "F1.1"
      ],
      [
        "F1.2",
        "D1.K",
        "C1.1",
        "J2.1"
      ],
      [
        "D1.A",
        "C1.2",
        "J3.1"
      ]
    ]
  },
  "reverse_polarity": {
    "keywords": [
      "reverse polarity",
      "polarity protection",
      "reverse voltage"
    ],
    "description": "Reverse Polarity Protection using P-MOSFET",
    "components": [
      {
        "type": "mosfet",
        "ref": "Q1",
        "label": "IRF9540",
        "zone": "center"
      },
      {
        "type": "fuse",
        "ref": "F1",
        "label": "1A",
        "zone": "left"
      },
      {
        "type": "connector",
        "ref": "J1",
        "label": "VIN",
        "zone": "left"
      },
      {
        "type": "connector",
        "ref": "J2",
        "label": "VOUT",
        "zone": "right"
      },
      {
        "type": "connector",
        "ref": "J3",
        "label": "GND",
        "zone": "left"
      }
    ],
    "nets": [
      [
        "J1.1",
        "F1.1"
      ],
      [
        "F1.2",
        "Q1.S",
        "Q1.G"
      ],
      [
        "Q1.D",
        "J2.1"
      ],
      [
        "J3.1",
        "Q1.G"
      ]
    ]
  },
  "arduino_minimal": {
    "keywords": [
      "arduino",
      "atmega",
      "microcontroller",
      "mcu",
      "avr",
      "328p"
    ],
    "description": "Minimal ATmega328P MCU system with crystal and decoupling",
    "components": [
      {
        "type": "ic",
        "ref": "U1",
        "label": "ATmega328P",
        "zone": "center"
      },
      {
        "type": "crystal",
        "ref": "Y1",
        "label": "16MHz",
        "zone": "center"
      },
      {
        "type": "capacitor",
        "ref": "C1",
        "label": "22pF",
        "zone": "center",
        "value": "22pF"
      },
      {
        "type": "capacitor",
        "ref": "C2",
        "label": "22pF",
        "zone": "center",
        "value": "22pF"
      },
      {
        "type": "capacitor",
        "ref": "C3",
        "label": "100nF",
        "zone": "left",
        "value": "100nF"
      },
      {
        "type": "resistor",
        "ref": "R1",
        "label": "10k",
        "zone": "left",
        "value": "10k"
      },
      {
        "type": "connector",
        "ref": "J1",
        "label": "VCC",
        "zone": "left"
      },
      {
        "type": "connector",
        "ref": "J2",
        "label": "GND",
        "zone": "left"
      },
      {
        "type": "connector",
        "ref": "J3",
        "label": "RESET",
        "zone": "left"
      },
      {
        "type": "connector",
        "ref": "J4",
        "label": "GPIO",
        "zone": "right"
      }
    ],
    "nets": [
      [
        "J1.1",
        "U1.VCC",
        "C3.1",
        "R1.1"
      ],
      [
        "J2.1",
        "U1.GND",
        "C3.2",
        "C1.2",
        "C2.2"
      ],
      [
        "U1.XTAL1",
        "Y1.1",
        "C1.1"
      ],
      [
        "U1.XTAL2",
        "Y1.2",
        "C2.1"
      ],
      [
        "R1.2",
        "U1.RESET",
        "J3.1"
      ],
      [
        "U1.PB0",
        "J4.1"
      ]
    ]
  },
  "esp32_minimal": {
    "keywords": [
      "esp32",
      "wifi",
      "bluetooth",
      "iot",
      "wireless",
      "esp"
    ],
    "description": "Minimal ESP32 module with power and programming header",
    "components": [
      {
        "type": "ic",
        "ref": "U1",
        "label": "ESP32",
        "zone": "center"
      },
      {
        "type": "regulator",
        "ref": "U2",
        "label": "AMS1117",
        "zone": "left"
      },
      {
        "type": "capacitor",
        "ref": "C1",
        "label": "10uF",
        "zone": "left",
        "value": "10uF"
      },
      {
        "type": "capacitor",
        "ref": "C2",
        "label": "100nF",
        "zone": "center",
        "value": "100nF"
      },
      {
        "type": "resistor",
        "ref": "R1",
        "label": "10k",
        "zone": "left",
        "value": "10k"
      },
      {
        "type": "connector",
        "ref": "J1",
        "label": "USB/5V",
        "zone": "left"
      },
      {
        "type": "connector",
        "ref": "J2",
        "label": "GND",
        "zone": "left"
      },
      {
        "type": "connector",
        "ref": "J3",
        "label": "GPIO",
        "zone": "right"
      },
      {
        "type": "connector",
        "ref": "J4",
        "label": "PROG",
        "zone": "right"
      }
    ],
    "nets": [
      [
        "J1.1",
        "U2.IN",
        "C1.1"
      ],
      [
        "U2.OUT",
        "U1.VCC",
        "C2.1",
        "R1.1"
      ],
      [
        "R1.2",
        "U1.EN"
      ],
      [
        "J2.1",
        "U2.GND",
        "U1.GND",
        "C1.2",
        "C2.2"
      ],
      [
        "U1.GPIO0",
        "J4.1"
      ],
      [
        "U1.TX",
        "J4.2"
      ],
      [
        "U1.RX",
        "J4.3"
      ],
      [
        "U1.GPIO2",
        "J3.1"
      ]
    ]
  },
  "uart_level_shifter": {
    "keywords": [
      "uart",
      "level shifter",
      "rs232",
      "serial",
      "ttl"
    ],
    "description": "UART TTL Level Shifter (3.3V to 5V bidirectional)",
    "components": [
      {
        "type": "mosfet",
        "ref": "Q1",
        "label": "BSS138",
        "zone": "center"
      },
      {
        "type": "mosfet",
        "ref": "Q2",
        "label": "BSS138",
        "zone": "center"
      },
      {
        "type": "resistor",
        "ref": "R1",
        "label": "10k",
        "zone": "left",
        "value": "10k"
      },
      {
        "type": "resistor",
        "ref": "R2",
        "label": "10k",
        "zone": "left",
        "value": "10k"
      },
      {
        "type": "resistor",
        "ref": "R3",
        "label": "10k",
        "zone": "right",
        "value": "10k"
      },
      {
        "type": "resistor",
        "ref": "R4",
        "label": "10k",
        "zone": "right",
        "value": "10k"
      },
      {
        "type": "connector",
        "ref": "J1",
        "label": "3V3",
        "zone": "left"
      },
      {
        "type": "connector",
        "ref": "J2",
        "label": "5V",
        "zone": "right"
      },
      {
        "type": "connector",
        "ref": "J3",
        "label": "TX_LV",
        "zone": "left"
      },
      {
        "type": "connector",
        "ref": "J4",
        "label": "TX_HV",
        "zone": "right"
      },
      {
        "type": "connector",
        "ref": "J5",
        "label": "RX_LV",
        "zone": "left"
      },
      {
        "type": "connector",
        "ref": "J6",
        "label": "RX_HV",
        "zone": "right"
      },
      {
        "type": "connector",
        "ref": "J7",
        "label": "GND",
        "zone": "left"
      }
    ],
    "nets": [
      [
        "J3.1",
        "R1.1",
        "Q1.S"
      ],
      [
        "R1.2",
        "J1.1"
      ],
      [
        "Q1.D",
        "R3.1",
        "J4.1"
      ],
      [
        "R3.2",
        "J2.1"
      ],
      [
        "Q1.G",
        "J1.1"
      ],
      [
        "J5.1",
        "R2.1",
        "Q2.S"
      ],
      [
        "R2.2",
        "J1.1"
      ],
      [
        "Q2.D",
        "R4.1",
        "J6.1"
      ],
      [
        "R4.2",
        "J2.1"
      ],
      [
        "Q2.G",
        "J1.1"
      ],
      [
        "J7.1"
      ]
    ]
  },
  "crystal_oscillator": {
    "keywords": [
      "crystal",
      "oscillator",
      "clock",
      "xtal",
      "crystal oscillator"
    ],
    "description": "Crystal Oscillator with buffer gate",
    "components": [
      {
        "type": "crystal",
        "ref": "Y1",
        "label": "16MHz",
        "zone": "center"
      },
      {
        "type": "capacitor",
        "ref": "C1",
        "label": "22pF",
        "zone": "center",
        "value": "22pF"
      },
      {
        "type": "capacitor",
        "ref": "C2",
        "label": "22pF",
        "zone": "center",
        "value": "22pF"
      },
      {
        "type": "resistor",
        "ref": "R1",
        "label": "1M",
        "zone": "center",
        "value": "1M"
      },
      {
        "type": "connector",
        "ref": "J1",
        "label": "VCC",
        "zone": "left"
      },
      {
        "type": "connector",
        "ref": "J2",
        "label": "GND",
        "zone": "left"
      },
      {
        "type": "connector",
        "ref": "J3",
        "label": "CLK",
        "zone": "right"
      }
    ],
    "nets": [
      [
        "Y1.1",
        "C1.1",
        "R1.1"
      ],
      [
        "Y1.2",
        "C2.1",
        "R1.2",
        "J3.1"
      ],
      [
        "C1.2",
        "C2.2",
        "J2.1"
      ],
      [
        "J1.1"
      ]
    ]
  },
  "pwm_led_dimmer": {
    "keywords": [
      "pwm",
      "dimmer",
      "led dimmer",
      "brightness",
      "pulse width"
    ],
    "description": "555-based PWM LED Dimmer with potentiometer control",
    "components": [
      {
        "type": "ic",
        "ref": "U1",
        "label": "NE555",
        "zone": "center"
      },
      {
        "type": "potentiometer",
        "ref": "RV1",
        "label": "100k",
        "zone": "left"
      },
      {
        "type": "diode",
        "ref": "D1",
        "label": "1N4148",
        "zone": "center"
      },
      {
        "type": "diode",
        "ref": "D2",
        "label": "1N4148",
        "zone": "center"
      },
      {
        "type": "capacitor",
        "ref": "C1",
        "label": "10nF",
        "zone": "center",
        "value": "10nF"
      },
      {
        "type": "mosfet",
        "ref": "Q1",
        "label": "IRF540",
        "zone": "right"
      },
      {
        "type": "led",
        "ref": "D3",
        "label": "LED",
        "zone": "right"
      },
      {
        "type": "resistor",
        "ref": "R1",
        "label": "100R",
        "zone": "right",
        "value": "100"
      },
      {
        "type": "connector",
        "ref": "J1",
        "label": "VCC",
        "zone": "left"
      },
      {
        "type": "connector",
        "ref": "J2",
        "label": "GND",
        "zone": "left"
      }
    ],
    "nets": [
      [
        "J1.1",
        "U1.VCC",
        "U1.RESET",
        "RV1.1"
      ],
      [
        "RV1.W",
        "D1.A",
        "D2.K"
      ],
      [
        "D1.K",
        "U1.DISCH"
      ],
      [
        "D2.A",
        "U1.DISCH"
      ],
      [
        "U1.THRESH",
        "U1.TRIG",
        "C1.1"
      ],
      [
        "C1.2",
        "J2.1",
        "U1.GND",
        "Q1.S"
      ],
      [
        "U1.OUT",
        "Q1.G"
      ],
      [
        "Q1.D",
        "R1.1"
      ],
      [
        "R1.2",
        "D3.A"
      ],
      [
        "D3.K",
        "J1.1"
      ]
    ]
  },
  "voltage_divider": {
    "keywords": [
      "voltage divider",
      "divider",
      "attenuator",
      "reference"
    ],
    "description": "Precision Voltage Divider with output buffer",
    "components": [
      {
        "type": "resistor",
        "ref": "R1",
        "label": "10k",
        "zone": "center",
        "value": "10k"
      },
      {
        "type": "resistor",
        "ref": "R2",
        "label": "10k",
        "zone": "center",
        "value": "10k"
      },
      {
        "type": "capacitor",
        "ref": "C1",
        "label": "100nF",
        "zone": "center",
        "value": "100nF"
      },
      {
        "type": "connector",
        "ref": "J1",
        "label": "VIN",
        "zone": "left"
      },
      {
        "type": "connector",
        "ref": "J2",
        "label": "VOUT",
        "zone": "right"
      },
      {
        "type": "connector",
        "ref": "J3",
        "label": "GND",
        "zone": "left"
      }
    ],
    "nets": [
      [
        "J1.1",
        "R1.1"
      ],
      [
        "R1.2",
        "R2.1",
        "C1.1",
        "J2.1"
      ],
      [
        "R2.2",
        "C1.2",
        "J3.1"
      ]
    ]
  },
  "power_supply_module": {
    "keywords": [
      "power supply module",
      "buck",
      "boost",
      "converter",
      "12v to 5v",
      "12v to 3.3v",
      "smps"
    ],
    "description": "Switch-Mode Power Supply (Buck Converter) - High efficiency 12V to 5V/3.3V step-down",
    "components": [
      {
        "type": "connector",
        "ref": "J1",
        "label": "VIN_12V",
        "zone": "left"
      },
      {
        "type": "connector",
        "ref": "J2",
        "label": "GND",
        "zone": "left"
      },
      {
        "type": "capacitor",
        "ref": "C1",
        "label": "100uF",
        "zone": "left",
        "value": "100uF"
      },
      {
        "type": "ic",
        "ref": "U1",
        "label": "LM2596",
        "zone": "center"
      },
      {
        "type": "diode",
        "ref": "D1",
        "label": "SS34",
        "zone": "center"
      },
      {
        "type": "inductor",
        "ref": "L1",
        "label": "33uH",
        "zone": "center",
        "value": "33uH"
      },
      {
        "type": "capacitor",
        "ref": "C2",
        "label": "220uF",
        "zone": "right",
        "value": "220uF"
      },
      {
        "type": "connector",
        "ref": "J3",
        "label": "VOUT_5V",
        "zone": "right"
      }
    ],
    "nets": [
      [
        "J1.1",
        "C1.1",
        "U1.VIN"
      ],
      [
        "U1.GND",
        "D1.A",
        "J2.1",
        "C1.2",
        "C2.2"
      ],
      [
        "U1.SW",
        "D1.K",
        "L1.1"
      ],
      [
        "L1.2",
        "C2.1",
        "U1.FB",
        "J3.1"
      ]
    ]
  },
  "mcu_core": {
    "keywords": [
      "microcontroller core",
      "mcu",
      "oscillator",
      "reset circuit",
      "atmega",
      "arduino core"
    ],
    "description": "Microcontroller Core with 16MHz Oscillator and Reset Circuit",
    "components": [
      {
        "type": "ic",
        "ref": "U1",
        "label": "ATmega328P",
        "zone": "center"
      },
      {
        "type": "crystal",
        "ref": "Y1",
        "label": "16MHz",
        "zone": "bottom"
      },
      {
        "type": "capacitor",
        "ref": "C1",
        "label": "22pF",
        "zone": "bottom",
        "value": "22pF"
      },
      {
        "type": "capacitor",
        "ref": "C2",
        "label": "22pF",
        "zone": "bottom",
        "value": "22pF"
      },
      {
        "type": "resistor",
        "ref": "R1",
        "label": "10k",
        "zone": "top",
        "value": "10k"
      },
      {
        "type": "switch",
        "ref": "SW1",
        "label": "RESET",
        "zone": "top"
      },
      {
        "type": "capacitor",
        "ref": "C3",
        "label": "100nF",
        "zone": "left",
        "value": "100nF"
      },
      {
        "type": "connector",
        "ref": "J1",
        "label": "VCC",
        "zone": "left"
      },
      {
        "type": "connector",
        "ref": "J2",
        "label": "GND",
        "zone": "left"
      }
    ],
    "nets": [
      [
        "J1.1",
        "U1.VCC",
        "U1.AVCC",
        "R1.1"
      ],
      [
        "R1.2",
        "SW1.1",
        "U1.RESET"
      ],
      [
        "SW1.2",
        "J2.1",
        "U1.GND",
        "C1.2",
        "C2.2",
        "C3.2"
      ],
      [
        "Y1.1",
        "C1.1",
        "U1.XTAL1"
      ],
      [
        "Y1.2",
        "C2.1",
        "U1.XTAL2"
      ],
      [
        "U1.AREF",
        "C3.1"
      ]
    ]
  },
  "signal_conditioning": {
    "keywords": [
      "signal conditioning",
      "filter",
      "active filter",
      "analog to digital",
      "op-amp filter"
    ],
    "description": "Active Low-Pass Filter and Amplifier for sensor signal conditioning",
    "components": [
      {
        "type": "opamp",
        "ref": "U1",
        "label": "TL072",
        "zone": "center"
      },
      {
        "type": "resistor",
        "ref": "R1",
        "label": "10k",
        "zone": "left",
        "value": "10k"
      },
      {
        "type": "resistor",
        "ref": "R2",
        "label": "10k",
        "zone": "center",
        "value": "10k"
      },
      {
        "type": "capacitor",
        "ref": "C1",
        "label": "10nF",
        "zone": "center",
        "value": "10nF"
      },
      {
        "type": "capacitor",
        "ref": "C2",
        "label": "100nF",
        "zone": "top",
        "value": "100nF"
      },
      {
        "type": "connector",
        "ref": "J1",
        "label": "SENSOR_IN",
        "zone": "left"
      },
      {
        "type": "connector",
        "ref": "J2",
        "label": "ADC_OUT",
        "zone": "right"
      },
      {
        "type": "connector",
        "ref": "J3",
        "label": "VCC",
        "zone": "top"
      },
      {
        "type": "connector",
        "ref": "J4",
        "label": "GND",
        "zone": "bottom"
      }
    ],
    "nets": [
      [
        "J1.1",
        "R1.1"
      ],
      [
        "R1.2",
        "R2.1",
        "C1.1"
      ],
      [
        "R2.2",
        "U1.IN+",
        "C2.1"
      ],
      [
        "U1.OUT",
        "U1.IN-",
        "C1.2",
        "J2.1"
      ],
      [
        "C2.2",
        "J4.1",
        "U1.V-"
      ],
      [
        "J3.1",
        "U1.V+"
      ]
    ]
  },
  "protection_circuits": {
    "keywords": [
      "protection",
      "esd",
      "reverse polarity",
      "surge",
      "tvs",
      "overvoltage"
    ],
    "description": "Input Protection Circuit - ESD TVS diodes and Reverse Polarity MOSFET",
    "components": [
      {
        "type": "connector",
        "ref": "J1",
        "label": "DC_IN",
        "zone": "left"
      },
      {
        "type": "connector",
        "ref": "J2",
        "label": "GND_IN",
        "zone": "left"
      },
      {
        "type": "diode",
        "ref": "D1",
        "label": "TVS_5V",
        "zone": "center"
      },
      {
        "type": "mosfet",
        "ref": "Q1",
        "label": "P-CH",
        "zone": "center"
      },
      {
        "type": "resistor",
        "ref": "R1",
        "label": "100k",
        "zone": "center",
        "value": "100k"
      },
      {
        "type": "diode",
        "ref": "D2",
        "label": "Zener 12V",
        "zone": "center"
      },
      {
        "type": "connector",
        "ref": "J3",
        "label": "SAFE_VCC",
        "zone": "right"
      },
      {
        "type": "connector",
        "ref": "J4",
        "label": "SAFE_GND",
        "zone": "right"
      }
    ],
    "nets": [
      [
        "J1.1",
        "D1.K",
        "Q1.D"
      ],
      [
        "J2.1",
        "D1.A",
        "R1.2",
        "D2.A",
        "J4.1"
      ],
      [
        "Q1.G",
        "R1.1",
        "D2.K"
      ],
      [
        "Q1.S",
        "J3.1"
      ]
    ]
  },
  "full_bridge_rectifier": {
    "keywords": [
      "rectifier",
      "bridge",
      "ac to dc",
      "ac-dc",
      "full bridge",
      "diode bridge"
    ],
    "description": "Full Bridge Rectifier with smoothing capacitor",
    "components": [
      {
        "type": "diode",
        "ref": "D1",
        "label": "1N4007",
        "zone": "center"
      },
      {
        "type": "diode",
        "ref": "D2",
        "label": "1N4007",
        "zone": "center"
      },
      {
        "type": "diode",
        "ref": "D3",
        "label": "1N4007",
        "zone": "center"
      },
      {
        "type": "diode",
        "ref": "D4",
        "label": "1N4007",
        "zone": "center"
      },
      {
        "type": "capacitor",
        "ref": "C1",
        "label": "1000uF",
        "zone": "right",
        "value": "1000uF"
      },
      {
        "type": "connector",
        "ref": "J1",
        "label": "AC1",
        "zone": "left"
      },
      {
        "type": "connector",
        "ref": "J2",
        "label": "AC2",
        "zone": "left"
      },
      {
        "type": "connector",
        "ref": "J3",
        "label": "DC+",
        "zone": "right"
      },
      {
        "type": "connector",
        "ref": "J4",
        "label": "DC-",
        "zone": "right"
      }
    ],
    "nets": [
      [
        "J1.1",
        "D1.A",
        "D2.K"
      ],
      [
        "J2.1",
        "D3.A",
        "D4.K"
      ],
      [
        "D1.K",
        "D3.K",
        "C1.1",
        "J3.1"
      ],
      [
        "D2.A",
        "D4.A",
        "C1.2",
        "J4.1"
      ]
    ]
  },
  "schmitt_trigger": {
    "keywords": [
      "schmitt",
      "trigger",
      "comparator",
      "hysteresis",
      "threshold"
    ],
    "description": "Schmitt Trigger Comparator with adjustable thresholds",
    "components": [
      {
        "type": "opamp",
        "ref": "U1",
        "label": "LM358",
        "zone": "center"
      },
      {
        "type": "resistor",
        "ref": "R1",
        "label": "10k",
        "zone": "left",
        "value": "10k"
      },
      {
        "type": "resistor",
        "ref": "R2",
        "label": "10k",
        "zone": "center",
        "value": "10k"
      },
      {
        "type": "resistor",
        "ref": "R3",
        "label": "100k",
        "zone": "center",
        "value": "100k"
      },
      {
        "type": "connector",
        "ref": "J1",
        "label": "VIN",
        "zone": "left"
      },
      {
        "type": "connector",
        "ref": "J2",
        "label": "VOUT",
        "zone": "right"
      },
      {
        "type": "connector",
        "ref": "J3",
        "label": "VCC",
        "zone": "left"
      },
      {
        "type": "connector",
        "ref": "J4",
        "label": "GND",
        "zone": "left"
      }
    ],
    "nets": [
      [
        "J1.1",
        "R1.1"
      ],
      [
        "R1.2",
        "U1.IN-"
      ],
      [
        "U1.IN+",
        "R2.1",
        "R3.1"
      ],
      [
        "R2.2",
        "J4.1",
        "U1.GND"
      ],
      [
        "R3.2",
        "U1.OUT",
        "J2.1"
      ],
      [
        "J3.1",
        "U1.VCC"
      ]
    ]
  },
  "instrumentation_amp": {
    "keywords": [
      "instrumentation",
      "ina",
      "differential",
      "strain gauge",
      "wheatstone"
    ],
    "description": "Instrumentation Amplifier for precision measurements",
    "components": [
      {
        "type": "connector",
        "ref": "J1",
        "label": "SIG+",
        "zone": "left"
      },
      {
        "type": "connector",
        "ref": "J2",
        "label": "SIG-",
        "zone": "left"
      },
      {
        "type": "resistor",
        "ref": "R1",
        "label": "10k",
        "zone": "center",
        "value": "10k"
      },
      {
        "type": "resistor",
        "ref": "R2",
        "label": "10k",
        "zone": "center",
        "value": "10k"
      },
      {
        "type": "resistor",
        "ref": "R3",
        "label": "10k",
        "zone": "center",
        "value": "10k"
      },
      {
        "type": "resistor",
        "ref": "R4",
        "label": "10k",
        "zone": "center",
        "value": "10k"
      },
      {
        "type": "resistor",
        "ref": "R5",
        "label": "100k",
        "zone": "center",
        "value": "100k"
      },
      {
        "type": "ic",
        "ref": "U1",
        "label": "LM358",
        "zone": "center"
      },
      {
        "type": "capacitor",
        "ref": "C1",
        "label": "100nF",
        "zone": "center",
        "value": "100nF"
      },
      {
        "type": "connector",
        "ref": "J6",
        "label": "VOUT",
        "zone": "right"
      },
      {
        "type": "connector",
        "ref": "J3",
        "label": "LOAD",
        "zone": "right"
      },
      {
        "type": "connector",
        "ref": "J4",
        "label": "GND",
        "zone": "left"
      },
      {
        "type": "connector",
        "ref": "J5",
        "label": "VCC",
        "zone": "left"
      }
    ],
    "nets": [
      [
        "J1.1",
        "R1.1"
      ],
      [
        "R1.2",
        "J3.1",
        "R2.1"
      ],
      [
        "R2.2",
        "U1.IN+",
        "R4.1"
      ],
      [
        "R1.1",
        "R3.1"
      ],
      [
        "R3.2",
        "U1.IN-",
        "R5.1"
      ],
      [
        "R5.2",
        "U1.OUT",
        "J6.1"
      ],
      [
        "R4.2",
        "J4.1",
        "U1.GND",
        "C1.2"
      ],
      [
        "J5.1",
        "U1.VCC",
        "C1.1"
      ]
    ]
  }
};

const PCB_KNOWLEDGE = {
  "materials": {
    "title": "Dielectric Substrates & Material Science",
    "entries": {
      "fr4": {
        "keywords": [
          "fr4",
          "fr-4",
          "fiberglass",
          "epoxy",
          "standard",
          "substrate"
        ],
        "name": "FR-4 (Glass Epoxy Laminate)",
        "info": "Global industry standard. Woven fiberglass cloth + flame-retardant epoxy resin. Cost-effective, minimal water absorption. Ideal for low-to-moderate frequencies and general consumer electronics.",
        "specs": {
          "Tg": "130-180C",
          "Dk": "3.9-4.8",
          "Df": "0.015-0.020",
          "Thermal_W_mK": "0.3"
        }
      },
      "polyimide": {
        "keywords": [
          "polyimide",
          "kapton",
          "flex",
          "flexible substrate",
          "dynamic"
        ],
        "name": "Polyimide",
        "info": "Highly flexible with robust thermal stability. Capable of dynamic bending. Essential for flex/rigid-flex, medical wearables, military systems. Saves up to 60% spatial volume.",
        "specs": {
          "Tg": "200-260+C",
          "Dk": "3.5-4.2",
          "Df": "0.002-0.008",
          "Thermal_W_mK": "0.2"
        }
      },
      "ptfe_rogers": {
        "keywords": [
          "ptfe",
          "teflon",
          "rogers",
          "rf",
          "high frequency",
          "5g",
          "radar",
          "ro4000"
        ],
        "name": "PTFE / Teflon (Rogers RO4000)",
        "info": "Extreme high-frequency performance with negligible signal loss. Mandatory for 5G comms, ADAS automotive radar (77 GHz), aerospace RF transceivers. Dk as low as 2.1.",
        "specs": {
          "Tg": "200-260+C",
          "Dk": "2.1-2.5",
          "Df": "0.0005-0.001",
          "Thermal_W_mK": "0.25"
        }
      },
      "metal_core": {
        "keywords": [
          "metal core",
          "aluminum",
          "mcpcb",
          "led",
          "thermal",
          "heat sink",
          "power"
        ],
        "name": "Metal Core (Aluminum/Copper)",
        "info": "Massive heat dissipation. Metal core acts as integrated heat sink. Standard in high-power LEDs, EV motor controls, power converters.",
        "specs": {
          "Tg": "140-180C",
          "Dk": "1.0-4.2",
          "Df": "0.015-0.020",
          "Thermal_W_mK": "1.0-2.0"
        }
      },
      "ceramic": {
        "keywords": [
          "ceramic",
          "alumina",
          "extreme thermal",
          "aerospace engine"
        ],
        "name": "Ceramic (Al2O3/AlN)",
        "info": "Exceptional thermal management and absolute rigidity under extreme stress. Ideal for aerospace engines, heavy industrial electronics, ultra-high-power.",
        "specs": {
          "Tg": ">250C",
          "Dk": "9.0-10.0",
          "Df": "N/A",
          "Thermal_W_mK": ">10.0"
        }
      },
      "lcp": {
        "keywords": [
          "lcp",
          "liquid crystal polymer",
          "antenna cable",
          "5g module",
          "low moisture"
        ],
        "name": "LCP (Liquid Crystal Polymer)",
        "info": "Ultra-low moisture absorption and excellent high-speed signal performance. Used in high-end antenna cables and 5G modules within smartphones. Combines flexibility with high-frequency capability, making it superior to standard polyimide for RF applications.",
        "specs": {
          "Tg": "280-310C",
          "Dk": "2.9-3.2",
          "Df": "0.002-0.004",
          "Thermal_W_mK": "0.2"
        }
      }
    }
  },
  "board_types": {
    "title": "PCB Architectural Topologies",
    "entries": {
      "single_sided": {
        "keywords": [
          "single sided",
          "single layer",
          "one layer",
          "simple",
          "fr-1"
        ],
        "name": "Single-Sided (Single-Layer) PCB",
        "info": "Most rudimentary form: one dielectric substrate + one copper layer. Highly cost-effective. Through-hole or simple SMT. Deployed in low-complexity devices like toys and remote controls.",
        "layers": 1,
        "cost": "Lowest"
      },
      "double_sided": {
        "keywords": [
          "double sided",
          "double layer",
          "two layer",
          "pth",
          "plated through hole"
        ],
        "name": "Double-Sided (Double-Layer) PCB",
        "info": "Copper layers on both top and bottom. Connected via PTH (plated through-holes), allowing crossover routing and significantly higher component density. Standard for most consumer electronics.",
        "layers": 2,
        "cost": "Low-Moderate"
      },
      "multi_layer": {
        "keywords": [
          "multi layer",
          "multilayer",
          "4 layer",
          "6 layer",
          "8 layer",
          "12 layer",
          "pdn",
          "ground plane"
        ],
        "name": "Multi-Layer PCB (4-12+ Layers)",
        "info": "3+ conductive layers separated by dielectric cores and prepreg. Essential for complex routing. Dedicated internal power distribution networks (PDN) and solid ground planes. Used in smartphones, computers, servers.",
        "layers": "4-12+",
        "cost": "Moderate-High"
      },
      "flexible": {
        "keywords": [
          "flexible",
          "flex",
          "flex circuit",
          "bend",
          "polyimide flex",
          "wearable"
        ],
        "name": "Flexible PCB (Flex Circuit)",
        "info": "Multiple layers of flexible polyimide. Can bend, twist, fold without fracturing traces. Saves 60% spatial volume, reduces weight. Ideal for smartwatches, medical wearables, cameras, robotics. Superior heat dissipation and vibration durability.",
        "layers": "1-6",
        "cost": "Moderate-High"
      },
      "rigid_flex": {
        "keywords": [
          "rigid flex",
          "rigid-flex",
          "hybrid pcb",
          "foldable"
        ],
        "name": "Rigid-Flex PCB",
        "info": "Advanced hybrid: rigid FR-4 zones + flexible polyimide layers sandwiched together. Eliminates bulky connectors and wire harnesses. Drastically enhances reliability by minimizing failure points. Standard for aerospace, military, high-vibration environments.",
        "layers": "4-10+",
        "cost": "High"
      },
      "hdi": {
        "keywords": [
          "hdi",
          "high density",
          "microvia",
          "blind via",
          "buried via",
          "uhdi",
          "any layer"
        ],
        "name": "High-Density Interconnect (HDI)",
        "info": "Pinnacle of PCB miniaturization. Uses microvias (laser-drilled, 20um), blind vias, buried vias. An 8-layer standard board can be reduced to 4-layer HDI with same performance. UHDI and Any-Layer HDI decrease board sizes by 30-40% while maintaining signal integrity up to 10 GHz.",
        "layers": "4-20+",
        "cost": "Very High"
      },
      "hdi_mobile": {
        "keywords": [
          "hdi mobile",
          "smartphone pcb",
          "phone motherboard",
          "mobile board",
          "iphone pcb",
          "android pcb"
        ],
        "name": "HDI for Smartphones (Mobile Motherboard)",
        "info": "Standard for modern smartphone motherboards. Uses trace widths and spaces under 75um. Typically 8-14 layers in a board less than 1mm thick. Microvias, Blind Vias, and Buried Vias save surface space. Shorter routing distances reduce signal delay and EMI, critical for 5G modems, camera ISP, and application processors.",
        "layers": "8-14",
        "cost": "Very High"
      },
      "fpc_mobile": {
        "keywords": [
          "fpc",
          "flex cable",
          "fpc mobile",
          "screen connector",
          "battery connector",
          "camera connector",
          "pet",
          "foldable phone"
        ],
        "name": "FPC (Flexible PCB for Mobile)",
        "info": "Made of Polyimide (PI) or Polyester (PET) substrates. Connects screen, battery, camera to main motherboard in smartphones. Can be bent, folded, twisted to fit tight corners. Highly resistant to vibrations and mechanical stress - essential for foldable phones. Significantly lighter and thinner than rigid boards.",
        "layers": "1-4",
        "cost": "Moderate"
      },
      "rigid_flex_mobile": {
        "keywords": [
          "rigid flex mobile",
          "camera module pcb",
          "phone rigid flex",
          "internal module"
        ],
        "name": "Rigid-Flex for Mobile Modules",
        "info": "Hybrid combining rigid and flexible layers into a single unit. Used for complex internal modules like camera assemblies in smartphones. Eliminates bulky connectors and cables saving space. Fewer solder joints mean fewer failure points. Excellent thermal stability compared to pure flex boards.",
        "layers": "4-8",
        "cost": "High"
      }
    }
  },
  "manufacturing": {
    "title": "Subtractive Manufacturing Pipeline (19 Steps)",
    "entries": {
      "step_overview": {
        "keywords": [
          "manufacturing",
          "fabrication",
          "how pcb made",
          "production",
          "process"
        ],
        "name": "Full 19-Step Manufacturing Pipeline",
        "info": "1) Pre-Production CAM, 2) Inner Layer Imaging (LDI/UV), 3) Chemical Etching, 4) Photoresist Stripping, 5) AOI Inner Layers, 6) Oxide Coating, 7) Lamination & Bonding, 8) CNC Drilling (280K RPM), 9) Electroless Copper Plating, 10) Outer Layer Imaging, 11) Copper Electroplating, 12) Photoresist Strip, 13) Final Etching, 14) Tin Stripping, 15) Solder Mask (LPI), 16) Surface Finish (HASL/ENIG), 17) Silkscreen Legend, 18) E-Test, 19) Profiling/Routing."
      },
      "lamination": {
        "keywords": [
          "lamination",
          "prepreg",
          "bonding",
          "stack up",
          "stackup"
        ],
        "name": "Lamination & Layer Bonding",
        "info": "Inner cores stacked symmetrically with prepreg (uncured fiberglass resin). Mechanical press applies intense heat + pressure through hot/cold pressing stages. Prepreg melts, flows, permanently fuses layers into a monolithic structure."
      },
      "drilling": {
        "keywords": [
          "drilling",
          "cnc drill",
          "via hole",
          "mechanical drill",
          "laser drill"
        ],
        "name": "CNC Drilling & Via Formation",
        "info": "High-speed CNC machines at up to 280,000 RPM. Aluminum top sheets prevent burrs. For HDI, laser drilling creates microvias as small as 20 microns. Aspect ratio (depth:diameter) controls manufacturing reliability."
      },
      "plating": {
        "keywords": [
          "plating",
          "electroless",
          "copper plating",
          "metallization",
          "electroplating"
        ],
        "name": "Metallization & Copper Plating",
        "info": "Drilled holes are non-conductive fiberglass. Desmear cleaning is followed by electroless copper bath depositing a molecularly thin layer across all surfaces and hole walls. Then electrolytic copper builds thickness for current-carrying capacity."
      },
      "surface_finish": {
        "keywords": [
          "surface finish",
          "hasl",
          "enig",
          "osp",
          "immersion gold",
          "pad finish"
        ],
        "name": "Surface Finish Technologies",
        "info": "HASL (Hot Air Solder Leveling): economical, good shelf life. ENIG (Electroless Nickel Immersion Gold): perfectly flat for fine-pitch BGAs, excellent corrosion resistance. OSP (Organic Solderability Preservative): low cost, limited shelf life."
      },
      "etching": {
        "keywords": [
          "etching",
          "chemical etch",
          "cupric chloride",
          "ammonia etch",
          "subtractive"
        ],
        "name": "Chemical Etching Process",
        "info": "Alkaline or acidic chemical bath dissolves unprotected copper. Hardened photoresist protects desired circuitry. Final outer etch uses ammonia-based etchant. Tin plating protects final traces during this aggressive process."
      }
    }
  },
  "soldering": {
    "title": "PCBA Soldering & Assembly Technologies",
    "entries": {
      "smt_vs_tht": {
        "keywords": [
          "smt",
          "tht",
          "surface mount",
          "through hole",
          "component type"
        ],
        "name": "SMT vs THT Component Technologies",
        "info": "SMT: microscopic leads sit flat on pads. Enables extreme miniaturization, fine-pitch, double-sided population, massive automation. THT: wire leads inserted through plated holes. Provides unmatched mechanical strength for connectors, transformers, relays."
      },
      "reflow": {
        "keywords": [
          "reflow",
          "solder paste",
          "stencil",
          "convection",
          "pick and place"
        ],
        "name": "Convection Reflow Soldering",
        "info": "Dominant SMT method. Laser-cut stencil applies solder paste to pads. Pick-and-place machines at 50,000+ CPH. Board conveyed through multi-zone reflow oven (Preheat, Soak, Reflow 220-260C for SAC305, Cooling). Minimal thermal shock."
      },
      "wave": {
        "keywords": [
          "wave solder",
          "wave soldering",
          "tht solder",
          "through hole solder"
        ],
        "name": "Wave Soldering",
        "info": "THT focused. Board underside passes over cascading molten solder wave. Flux application, preheating, then passage over molten solder. Often in nitrogen atmosphere. Capillary action bonds leads in seconds. Fast but massive thermal stress."
      },
      "selective": {
        "keywords": [
          "selective solder",
          "selective soldering",
          "mixed assembly",
          "aperture"
        ],
        "name": "Selective Soldering",
        "info": "For mixed SMT/THT boards. Methods: 1) Aperture pallets shield SMT from wave, 2) Multi-fountain dip, 3) Miniature wave drag soldering with programmable micro-fountain, 4) Laser selective with zero contact. Prevents damage to existing SMT joints."
      },
      "vapor_phase": {
        "keywords": [
          "vapor phase",
          "vps",
          "galden",
          "condensation",
          "void free"
        ],
        "name": "Vapor Phase Reflow (VPS)",
        "info": "Board lowered into boiling inert perfluorinated fluid (Galden). Vapor condenses uniformly at 100-400 W/m2K (vs 10-60 for convection). Temperature physically limited by fluid boiling point - impossible to overheat. Vacuum option removes voids for flawless BGA joints."
      }
    }
  },
  "ipc_standards": {
    "title": "IPC Regulatory & Quality Framework",
    "entries": {
      "ipc_classes": {
        "keywords": [
          "ipc class",
          "class 1",
          "class 2",
          "class 3",
          "quality",
          "reliability"
        ],
        "name": "IPC Product Classifications",
        "info": "Class 1: General consumer (toys, remotes). Cosmetic defects OK. Lowest cost. Class 2: Dedicated service (computers, industrial). Extended life, limited defects allowed, 50% barrel fill OK. Moderate. Class 3: Mission-critical (medical implants, military, aerospace). ZERO defects, 75% barrel fill, full traceability. 15-30% cost premium."
      },
      "ipc_6012": {
        "keywords": [
          "ipc 6012",
          "rigid board",
          "qualification",
          "plating thickness"
        ],
        "name": "IPC-6012 Rigid Board Qualification",
        "info": "Definitive performance spec for rigid boards. Dictates plating thickness, conductor dimensions, structural integrity, dielectric tolerances, thermal stress survival. Addendums: IPC-6012EA (automotive), IPC-6012EM (medical fine-feature)."
      },
      "ipc_a610": {
        "keywords": [
          "ipc 610",
          "ipc-a-610",
          "assembly",
          "acceptability",
          "solder quality"
        ],
        "name": "IPC-A-610 Assembly Acceptability",
        "info": "Universal standard for assembled PCBAs. Strict visual criteria for soldering quality, mechanical assembly, component placement. Defines acceptable vs defective solder fillets, wetting, bridging, insufficient solder."
      },
      "design_rules": {
        "keywords": [
          "design rules",
          "clearance",
          "creepage",
          "trace width",
          "spacing",
          "3w rule"
        ],
        "name": "Critical Design Rules",
        "info": "Trace Width: determined by current capacity. Clearance: min safe distance between conductors. Creepage: surface distance for high-voltage safety. 3W Rule: trace center spacing >= 3x trace width for crosstalk mitigation. Differential pairs: USB 90ohm, PCIe 85ohm, Ethernet 100ohm. Length matching within 25mil."
      }
    }
  },
  "vanguard": {
    "title": "Vanguard Technologies & Future Horizons",
    "entries": {
      "3d_printed": {
        "keywords": [
          "3d print",
          "additive",
          "ame",
          "nano dimension",
          "dragonfly",
          "nanoparticle"
        ],
        "name": "3D Printed PCBs (Additive Manufacturing)",
        "info": "Nano Dimension DragonFly IV: simultaneous printing of conductive traces + dielectric polymers. AgCite silver nanoparticle ink. Bypasses etching, plating, lamination entirely. Enables 3D antennas, stacked ICs, embedded passives. XTPL achieves sub-micrometer resolution. Lights-Out Digital Manufacturing (LDM)."
      },
      "biodegradable": {
        "keywords": [
          "biodegradable",
          "soluboard",
          "jiva",
          "sustainable",
          "green",
          "eco",
          "cellulose"
        ],
        "name": "Biodegradable Substrates (Soluboard/Mycelium)",
        "info": "Soluboard by Jiva Materials (adopted by Infineon): plant-derived cellulosic fibers in water-soluble polymer. Hot water dissolves board for metal recovery. Saves 10.5kg carbon/m2. Mycelium research: fungal hyphae digest agricultural waste to create heat-resistant, insulating bio-composites using natural chitin."
      },
      "transient": {
        "keywords": [
          "transient",
          "dissolving",
          "resorbable",
          "biocompatible",
          "silk",
          "implant"
        ],
        "name": "Transient/Resorbable Electronics",
        "info": "Circuits that physically vanish on schedule. Ultrathin doped silicon (nanometer-scale) + magnesium conductors in programmable silk protein encapsulation. Exposure to biofluids triggers controlled dissolution (minutes to years). Eliminates surgical extraction of implants. DARPA + UIUC + Northwestern + Tufts research."
      },
      "liquid_metal": {
        "keywords": [
          "liquid metal",
          "egain",
          "gallium",
          "stretchable",
          "soft robot",
          "elastomer"
        ],
        "name": "Stretchable Liquid-Metal Circuitry",
        "info": "Eutectic Gallium-Indium (EGaIn) in elastomeric substrates. Remains liquid at room temp - traces stretch without breaking. Ga2O3 oxide skin stabilizes droplets for printing while core stays fluid and conductive. Self-healing. For soft robotics, artificial nervous systems, dynamic kinetic wearables."
      },
      "impedance_control": {
        "keywords": [
          "impedance",
          "controlled impedance",
          "z0",
          "transmission line",
          "50 ohm",
          "return path"
        ],
        "name": "Impedance Control & SI Fundamentals",
        "info": "High-speed traces act as transmission lines. Z0 must match source and load to prevent reflections (ringing, overshoot, data corruption). Function of trace width, copper weight, Dk, distance to reference plane. Continuous ground plane mandatory - voids create unintentional EMI antennas. Keep traces 1.5W from voids, 90mil from board edge."
      },
      "differential_pairs": {
        "keywords": [
          "differential pair",
          "usb",
          "hdmi",
          "pcie",
          "ethernet",
          "100 ohm",
          "skew"
        ],
        "name": "Differential Pair Routing Directives",
        "info": "Two coupled traces carrying inverted signals. Receiver reads voltage difference, canceling common-mode noise. Rules: USB=90ohm, PCIe=85ohm, Ethernet=100ohm impedance. Length match within 25mil (5-10mil for critical). Uniform intra-pair spacing. Symmetric via placement. Back-drilling for stub resonance. Serpentine routing for length compensation."
      }
    }
  }
};


function fuzzyMatch(prompt) {
    prompt = prompt.toLowerCase().trim();
    let bestKey = null, bestScore = 0;
    for (const [key, tmpl] of Object.entries(CIRCUIT_TEMPLATES)) {
        let score = 0;
        for (const kw of tmpl.keywords) {
            if (prompt.includes(kw)) score += kw.length * 2;
        }
        if (score > bestScore) { bestScore = score; bestKey = key; }
    }
    return { key: bestKey, score: bestScore };
}

function knowledgeSearch(query) {
    query = query.toLowerCase().trim();
    let bestEntry = null, bestScore = 0, bestCategory = null;
    for (const [catKey, category] of Object.entries(PCB_KNOWLEDGE)) {
        for (const [ek, entry] of Object.entries(category.entries)) {
            let score = 0;
            for (const kw of (entry.keywords || [])) {
                if (query.includes(kw)) score += kw.length * 3;
            }
            if (score > bestScore) { bestScore = score; bestEntry = entry; bestCategory = category.title; }
        }
    }
    return { entry: bestEntry, category: bestCategory, score: bestScore };
}

module.exports = { CIRCUIT_TEMPLATES, PCB_KNOWLEDGE, fuzzyMatch, knowledgeSearch };
