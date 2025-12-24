# COMMAND: Capture Design Screenshots

## Goal
Capture and save a screenshot of the implemented screen design for documentation.

## Prerequisites
- The screen design must be implemented and visible in Design OS.
- You must know the **Section Title** and **Section ID**.

## Instructions

### Step 1: Navigate and Capture
- Use the Browser Tool to navigate to the specific screen design URL in Design OS:
  `http://localhost:3000/sections/[section-id]/screen-designs/[ComponentName]`
- Take a screenshot of the viewport (excluding the browser window chrome if possible, or just the main content area).

### Step 2: Save Screenshot
- Save the screenshot to: `design-system/product/sections/[section-id]/[component-name-kebab-case].png`.

### Step 3: Verification
- Output: "Screenshot saved to [path]! It will now appear in the Section Overview."
