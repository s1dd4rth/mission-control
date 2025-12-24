# COMMAND: Scaffold Implementation

## Goal
Initialize the production Next.js application (`app/facilitron`) and prepare it for feature implementation.

## Steps

### 1. Initialize Next.js App
Run the following command to create the app if it doesn't exist:
```bash
npx create-next-app@latest app/facilitron \
  --typescript \
  --tailwind \
  --eslint \
  --app \
  --src-dir \
  --import-alias "@/*" \
  --use-npm \
  --no-git # We are already in a git repo
```

### 2. Install Core Dependencies
Install the standard UI libraries used in Design OS:
```bash
cd app/facilitron
npm install lucide-react clsx tailwind-merge class-variance-authority @radix-ui/react-slot
```

### 3. Integrate Design System
- Copy `product-plan/design-system/colors.json` -> `app/facilitron/src/styles/colors.json` (or verify path)
- Update `app/facilitron/tailwind.config.ts` (or .js) to import and use these colors.
- Copy `design-system/src/lib/utils.ts` -> `app/facilitron/src/lib/utils.ts` (cn helper)

### 4. Verification
- Start the dev server: `npm run dev` (on a new port, e.g., 3002).
- Verify basic page load.
