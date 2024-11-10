# Web AI Screen Reader (Beta)

<div align="center">

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Chrome](https://img.shields.io/badge/Chrome-v128.0.6545.0+-green.svg)
![Platform](https://img.shields.io/badge/platform-Windows%20|%20MacOS%20|%20Linux-lightgrey)
![Status](https://img.shields.io/badge/status-beta-orange)

An advanced Chrome extension leveraging Web AI and Gemini Nano for real-time image description with privacy-first approach.

</div>

## Table of Contents
- [Overview](#overview)
- [Key Features](#key-features)
- [System Requirements](#system-requirements)
- [Installation Guide](#installation-guide)
- [Technical Architecture](#technical-architecture)
- [Current Limitations](#current-limitations)
- [License](#license)

## Overview
Web AI Screen Reader is a cutting-edge Chrome extension that integrates advanced AI technologies to provide real-time image descriptions and web content analysis. Powered by Chrome's built-in Gemini Nano, it ensures secure on-device processing for enhanced privacy protection.

## Key Features

| Feature | Description |
|---------|-------------|
| Privacy-First | All processing happens locally on your device |
| Real-Time Performance | Instant image analysis and description |
| Dual AI Models | Leveraging both Gemini Nano and Moondream2 |
| Cross-Platform | Supports Windows, macOS, and Linux |

## System Requirements

### Hardware Specifications

| Component | Minimum Requirement |
|-----------|-------------------|
| CPU | Multi-core processor (Intel/AMD) |
| GPU | Integrated GPU or discrete GPU |
| VRAM | 4GB minimum |
| Storage | 24GB free space |

### Software Specifications

| Component | Requirement |
|-----------|------------|
| Windows | Version 10 or later |
| macOS | Version 13 (Ventura) or later |
| Linux | Modern distribution with WebGPU support |
| Chrome | Dev/Canary Channel (≥ 128.0.6545.0) |
| WebGPU | Enabled configuration required |

### Storage Requirements

| Component | Space Required |
|-----------|---------------|
| Gemini Nano | 22GB |
| Moondream2 | 2GB |
| Cache & Temp Files | Additional space required |

## Installation Guide

### Extension Setup

1. Download Extension
   ```
   https://github.com/vincentwun/Web-AI-Screen-Reader-Beta/archive/refs/heads/main.zip
   ```

2. Chrome Configuration
   - Launch Chrome browser
   - Navigate to `chrome://extensions`
   - Enable "Developer mode" (top-right corner)
   - Select "Load unpacked"
   - Navigate to extracted extension directory
   - Verify successful installation

### Required Configuration

#### Chrome Flags Setup

| Category | Flag | Setting |
|----------|------|---------|
| WebGPU | `chrome://flags/#enable-webgpu-developer-features` | Enabled |
| Gemini Nano | `chrome://flags/#optimization-guide-on-device-model` | Enabled BypassPerfRequirement |
| Prompt API | `chrome://flags/#prompt-api-for-gemini-nano` | Enabled |

Note: Restart Chrome after modifying these flags.

#### Gemini Nano Setup

1. Model Initialization
   - Visit [Prompt API Playground](https://chrome.dev/web-ai-demos/prompt-api-playground/)
   - Open DevTools Console (F12)
   - Execute:
     ```javascript
     await ai.languageModel.create();
     ```

2. Component Verification
   - Navigate to `chrome://components`
   - Verify Optimization Guide On Device Model version ≥ 2024.5.21.1031
   - If needed, click "Check for update"

3. Availability Check
   - In DevTools Console (F12), execute:
     ```javascript
     (await ai.languageModel.capabilities()).available;
     ```
   - Confirm return value is "readily"

## Technical Architecture

### Component Structure
[Update Soon]

### Technology Stack
[Update Soon]

## Current Limitations

| Limitation | Description |
|------------|-------------|
| Language Support | English only |
| Chrome Version | Requires Dev/Canary Channel |
| Hardware Requirements | Significant storage space needed |
| Model Updates | Regular downloads required |

## Dependencies and Acknowledgments

This project utilizes several open-source libraries and technologies:

| Component | License | Description |
|-----------|---------|-------------|
| [Moondream2](https://huggingface.co/Xenova/moondream2) | Apache 2.0 | AI model for image analysis |
| [Readability.js](https://github.com/mozilla/readability) | Apache 2.0 | Web content extraction library |
| [Transformers.js](https://github.com/xenova/transformers.js) | Apache 2.0 | Machine learning library for the web |
| Chrome Gemini Nano | Proprietary | Chrome's built-in AI capabilities |

We are grateful to the developers and contributors of these projects for making their work available to the community. All third-party components are used in accordance with their respective licenses.

For detailed license information, please see the [LICENSE](LICENSE) file in the project repository.

## License
This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for full details.