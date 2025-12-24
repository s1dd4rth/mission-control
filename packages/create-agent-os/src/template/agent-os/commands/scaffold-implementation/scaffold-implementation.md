# COMMAND: Scaffold Implementation

## Goal
Initialize the production Next.js application (`app`) and prepare it for feature implementation.
Initialize the production Next.js application (`app`) and prepare it for feature implementation.

## Steps

### 1. Initialize Next.js App
Run the following command to create the app if it doesn't exist:
```bash
npx create-next-app@latest app \
  --typescript \
  --tailwind \
  --eslint \
  --app \
  --src-dir \
  --import-alias "@/*"
```

3. **Install Dependencies**:
```bash
cd app
npm install lucide-react clsx tailwind-merge
npm install -D @tailwindcss/typography animate.css
```

4. **Connect Design System**:
- Copy `product-plan/design-system/colors.json` -> `app/src/styles/colors.json` (or verify path)
- Update `app/tailwind.config.ts` (or .js) to import and use these colors.
- Copy `design-system/src/lib/utils.ts` -> `app/src/lib/utils.ts` (cn helper)

### 5. Verification
- Start the dev server: `npm run dev` (on a new port, e.g., 3002).
- Verify basic page load.
