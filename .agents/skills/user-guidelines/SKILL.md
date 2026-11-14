---
name: user-guidelines
description: >-
  Enforces strict working rules: only analyze files selected or mentioned by the user (ask permission before analyzing any other file), strictly follow user instructions, and never add mock context or dummy data without user permission.
---

# User-Specified Development Rules

When working on any task in this workspace, the agent must adhere strictly to these three mandatory rules:

## Rule 1: Restricted File Analysis & Explicit Permission
- Only analyze, read, or inspect files that the user has explicitly selected, mentioned, or provided in the current prompt/context.
- If you believe analyzing an additional file is necessary to properly diagnose an issue or complete a task, you must explicitly ask the user for permission and wait for approval before reading that file.

## Rule 2: Strict Adherence to Instructions
- Follow the user's instructions meticulously.
- Implement the exact design requirements, component behavior, theme palettes, and technical specifications provided.
- Do not deviate from or omit requested features.

## Rule 3: Zero Unsolicited Mock Data
- Do not introduce mock context, fabricated data structures, or fake placeholder records without explicit user approval.
- Maintain existing real data models, Firebase/Firestore integrations, and user-specified content.
