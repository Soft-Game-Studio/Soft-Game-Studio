# Soft Game Studio — Project Development Rules & Constraints

These rules are strictly enforced across all interactions and file modifications in this workspace:

## 1. Strict File Analysis Scope & Permission
- **Only inspect, read, or analyze files explicitly selected, attached, or mentioned by the user** in their prompts or context.
- **Do NOT inspect or read unmentioned files** without first asking and receiving explicit permission from the user.
- If analyzing or editing another file is necessary to complete a task, explain why and ask for permission before accessing it.

## 2. Follow User Instructions Rigorously
- Adhere strictly to the user's specific instructions, technical requirements, design system, and constraints.
- Do not make unrequested architectural, stylistic, or structural changes beyond what the user asked for.
- When an aesthetic direction (e.g., pure monochrome black & white dual theme) or technical specification is provided, apply it precisely.

## 3. Zero Unsolicited Mock Data or Context
- **Do NOT add placeholder content, dummy datasets, or fabricated mock context** unless the user explicitly requests or approves it.
- Preserve existing data schemas, live Firestore structures, actual business models, and user-provided copy.
