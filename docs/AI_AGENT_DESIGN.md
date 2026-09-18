# MuseForge AI Beauty Prompt Agent

## Goal

Convert natural language beauty creation requirements into structured prompt parameters.

## Flow

User Intent

```
I want a cinematic oriental beauty portrait in autumn
```

↓

Intent Parser

↓

Attribute Planner

```
country: China
style: Eastern Classical Beauty
season: Autumn
scene: Jiangnan Garden
camera: 85mm cinematic
```

↓

Prompt Generator

↓

Final Prompt

## Agent Responsibilities

- understand creative intent
- select beauty style
- recommend clothing
- recommend scene
- recommend photography parameters
- generate model-specific prompt

## Future

- LLM Agent
- Tool calling
- User preference memory
- Prompt optimization
