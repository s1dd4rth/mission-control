#!/bin/bash

# generate_docs.sh
# Automates the "Export Product" workflow for Agent OS.
# Syncs Design OS product definitions to the Agent OS "Product Plan" and "Specs".

# Directory Definitions
PROJECT_ROOT="$(pwd)"
DESIGN_SYSTEM_DIR="$PROJECT_ROOT/design-system"
PRODUCT_PLAN_DIR="$PROJECT_ROOT/product-plan"
# "agent-os/specs" is where Control Center looks for specs (Phase 4)
AGENT_OS_SPECS_DIR="$PROJECT_ROOT/agent-os/specs"

echo "🚀 Starting Product Export & Sync..."

# --- Step 0: Pre-flight Checks ---
if [ ! -d "$DESIGN_SYSTEM_DIR" ]; then
    echo "❌ Error: 'design-system' directory not found at $DESIGN_SYSTEM_DIR"
    exit 1
fi

# --- Step 1: Create Directories ---
echo "📂 Creating directories..."
mkdir -p "$PRODUCT_PLAN_DIR"
mkdir -p "$PRODUCT_PLAN_DIR/prompts"
mkdir -p "$PRODUCT_PLAN_DIR/instructions/incremental"
mkdir -p "$PRODUCT_PLAN_DIR/design-system"
mkdir -p "$PRODUCT_PLAN_DIR/data-model"
mkdir -p "$PRODUCT_PLAN_DIR/shell/components"
mkdir -p "$PRODUCT_PLAN_DIR/sections"

# Ensure Agent OS specs dir exists for the sync
mkdir -p "$AGENT_OS_SPECS_DIR"

# --- Step 2: Copy Core Product Docs to Product Plan ---
echo "📝 Copying Core Docs..."
if [ -f "$DESIGN_SYSTEM_DIR/product/product-overview.md" ]; then
    cp "$DESIGN_SYSTEM_DIR/product/product-overview.md" "$PRODUCT_PLAN_DIR/product-overview.md"
    echo "   ✅ product-overview.md"
else
    echo "   ⚠️ Warning: product-overview.md not found."
fi

if [ -f "$DESIGN_SYSTEM_DIR/product/product-roadmap.md" ]; then
    cp "$DESIGN_SYSTEM_DIR/product/product-roadmap.md" "$PRODUCT_PLAN_DIR/product-roadmap.md"
    echo "   ✅ product-roadmap.md"
fi

# --- Step 3: Sync Specs to Agent OS (Phase 4 Fix) ---
echo "🔄 Syncing Specs to Agent OS (Phase 4)..."

# Iterate over section directories in Design OS
# Pattern: design-system/product/sections/[section-id]/spec.md
if [ -d "$DESIGN_SYSTEM_DIR/product/sections" ]; then
    for section_dir in "$DESIGN_SYSTEM_DIR/product/sections"/*; do
        if [ -d "$section_dir" ]; then
            section_id=$(basename "$section_dir")
            
            # Check if a spec exists
            if [ -f "$section_dir/spec.md" ]; then
                target_dir="$AGENT_OS_SPECS_DIR/$section_id"
                mkdir -p "$target_dir"
                
                # Copy the spec
                cp "$section_dir/spec.md" "$target_dir/spec.md"
                
                # Create a barebones tasks.md if it doesn't exist, so Control Center sees it as valid
                if [ ! -f "$target_dir/tasks.md" ]; then
                    echo "# Tasks for $section_id" > "$target_dir/tasks.md"
                    echo "" >> "$target_dir/tasks.md"
                    echo "- [ ] Implement spec requirements" >> "$target_dir/tasks.md"
                fi
                
                echo "   ✅ Synced spec: $section_id"
            fi
        fi
    done
else
    echo "   ℹ️ No sections directory found in Design OS."
fi

# --- Step 4: Generate Design System Assets for Product Plan ---
echo "🎨 Exporting Design System Assets..."

# Copy JSONs
if [ -f "$DESIGN_SYSTEM_DIR/public/product/design-system/colors.json" ]; then
    cp "$DESIGN_SYSTEM_DIR/public/product/design-system/colors.json" "$PRODUCT_PLAN_DIR/design-system/"
fi
if [ -f "$DESIGN_SYSTEM_DIR/public/product/design-system/typography.json" ]; then
    cp "$DESIGN_SYSTEM_DIR/public/product/design-system/typography.json" "$PRODUCT_PLAN_DIR/design-system/"
fi

# Generate Tokens CSS (Placeholder logic - ideally this uses a node script, but we'll do a basic copy if exists)
# In a real scenario, we might want to run a node script here to transform JSON to CSS.
# For now, we assume the user/agent might have generated it, or we skip simple generation.

# --- Step 5: Copy Data Model ---
if [ -f "$DESIGN_SYSTEM_DIR/product/data-model/data-model.md" ]; then
    cp "$DESIGN_SYSTEM_DIR/product/data-model/data-model.md" "$PRODUCT_PLAN_DIR/data-model/README.md"
fi

# --- Step 6: Generate Prompts ---
echo "🤖 Generating Prompts..."

# One-Shot Prompt
cat > "$PRODUCT_PLAN_DIR/prompts/one-shot-prompt.md" <<EOF
# One-Shot Implementation Prompt

I need you to implement a complete web application based on detailed design specifications.

## Instructions
1. Read **@product-plan/product-overview.md**
2. Read **@product-plan/product-roadmap.md**

## Context
- **Design System:** @product-plan/design-system/
- **Data Model:** @product-plan/data-model/

## Before coding
Ask me satisfying questions about:
1. Authentication
2. User Modeling
3. Tech Stack
4. Backend Logic

Then create a plan and implement.
EOF

# Section Prompt
cat > "$PRODUCT_PLAN_DIR/prompts/section-prompt.md" <<EOF
# Section Implementation Prompt

## Variables
- **SECTION_ID**: [folder name]

## Instructions
I need you to implement the **SECTION_ID** section.

1. Read **@product-plan/product-overview.md**
2. Read **@product-plan/sections/[SECTION_ID]/README.md** (if available) or the Spec.

## Approach
Use Test-Driven Development (TDD).
EOF

echo "✅ Prompts Generated."

echo "🎉 Export & Sync Complete!"
echo "   - Product Plan: product-plan/"
echo "   - Agent OS Specs: agent-os/specs/ (Phase 4 populated)"
