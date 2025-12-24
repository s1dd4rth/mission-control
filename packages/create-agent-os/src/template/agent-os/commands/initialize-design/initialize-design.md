# COMMAND: Initialize Design OS

## Goal
Populate the Design OS workspace with the product strategy defined in Agent OS, enabling the user to start designing immediately without manual data entry.

## Prerequisites
- `agent-os/product/mission.md` must exist.
- `agent-os/product/roadmap.md` must exist.
- `design-system/` directory must be a valid Design OS clone.

## Instructions

### Step 1: Read Product Data
Read the content of:
- `agent-os/product/mission.md`
- `agent-os/product/roadmap.md`

### Step 2: Generate Design OS Files
You will create/overwrite files in `design-system/product/`.

#### 2.1 Create `design-system/product/product-overview.md`
Extract the following from `mission.md` and format it EXACTLY as follows (headers are required):

```markdown
# [Product Name]

## Description
[The core pitch/mission]

## Problems & Solutions
### Problem 1: [Problem Title]
[Solution description]
### Problem 2: [Problem Title]
[Solution description]

## Key Features
- [Feature 1]
- [Feature 2]
```

#### 2.2 Create `design-system/product/product-roadmap.md`
Extract the numbered feature list from `roadmap.md` and format it as:
```markdown
# Product Roadmap
## Sections
### 1. [Feature Name]
[Brief description]
...
```

#### 2.3 Create `design-system/product/data-model/data-model.md` (Draft)
Based on the `mission.md` and `roadmap.md`, infer the core Entities and Relationships.
Create a draft data model file:
```markdown
# Data Model
## Entities
### [Entity Name]
[Description]
## Relationships
- [Entity] has many [Entity]
```
*Note: Verify this draft with the user if the inference seems ambiguous.*

### Step 3: Verification
- Check that `design-system/product/product-overview.md` exists.
- Check that `design-system/product/product-roadmap.md` exists.
- Output a confirmation message: "Design OS initialized! You can now open http://localhost:3000 to begin designing."
