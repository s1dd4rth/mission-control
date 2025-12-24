# COMMAND: Generate Sample Data

## Goal
Create realistic sample data (`data.json`) for a specific product section to populate the UI.

## Prerequisites
- `design-system/product/sections/[section-id]/spec.md` should exist (to understand what data is needed).
- You must know the **Section Title** and **Section ID**.

## Instructions

### Step 1: Analyze Spec
Read `design-system/product/sections/[section-id]/spec.md` to identify the entities and data structures required by the UI.

### Step 2: Create Data File
Create `design-system/product/sections/[section-id]/data.json`.

Format:
```json
{
  "_meta": {
    "models": {
      "ModelName": "Description of the model",
      "AnotherModel": "Description..."
    },
    "relationships": [
      "ModelName has many AnotherModel",
      "AnotherModel belongs to ModelName"
    ]
  },
  "modelCollectionName": [
    {
      "id": "1",
      "name": "Sample Item",
      "status": "active",
      "createdAt": "2023-10-27T10:00:00Z"
    }
  ],
  "singleObject": {
    "key": "value"
  }
}
```

**Requirements:**
- Generate at least 3-5 items for lists.
- Use realistic, semantic data (not "Item 1", "Item 2").
- Ensure dates are ISO 8601 strings.

### Step 3: Verification
- Output: "Sample data for '[Section Title]' generated! You can now view it in Design OS."
