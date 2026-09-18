# MuseForge Prompt Generator

## Overview

The application layer provides prompt generation capabilities based on the MuseForge beauty knowledge database.

## Roadmap

- [x] Dataset based prompt generation design
- [ ] FastAPI service
- [ ] Prompt recommendation
- [ ] Web UI
- [ ] Community contribution system

## Architecture

```
Request
  |
  v
Prompt Generator
  |
  +-- Beauty Style
  +-- Country
  +-- Clothing
  +-- Scene
  +-- Camera
  |
  v
AI Image Prompt
```
