import type { ProjectState } from '../types';
import { Guidance } from './Guidance';

interface NextStepCardProps {
    state: ProjectState;
    onOpenDesign: () => void;
}

export const NextStepCard = ({ state, onOpenDesign }: NextStepCardProps) => {
    let step = { phase: "", title: "", description: "", prompt: "", link: "", actionLabel: "", action: () => { } };

    const isProductComplete =
        state?.product?.mission?.exists && !state?.product?.mission?.isBoilerplate &&
        state?.product?.techStack?.exists && !state?.product?.techStack?.isBoilerplate &&
        state?.product?.roadmap?.exists && !state?.product?.roadmap?.isBoilerplate;

    if (!isProductComplete) {
        step = {
            phase: "Phase 1: Product Strategy",
            title: "Plan Your Product",
            description: "Define your Mission, Roadmap, and Tech Stack to build a solid foundation.",
            prompt: "Antigravity, let's start Phase 1: Product Planning. Please read 'agent-os/commands/plan-product/plan-product.md' and guide me.",
            link: "",
            actionLabel: "",
            action: () => { }
        }
    } else if (!state?.design?.initialized) {
        step = {
            phase: "Phase 2: Design System",
            title: "Sync Product to Design OS",
            description: "Transfer your Product Mission and Roadmap to Design OS to automate the setup.",
            prompt: "Antigravity, please sync my product plan to Design OS. Read 'agent-os/commands/initialize-design/initialize-design.md'.",
            link: "",
            actionLabel: "",
            action: () => { }
        }
    } else if (!state?.design?.exported) {
        step = {
            phase: "Phase 2: Design System",
            title: "Define Your Visuals",
            description: "Defining the visuals now prevents generic UI later. Export your system when ready.",
            prompt: "",
            link: "",
            actionLabel: "Open Design OS",
            action: onOpenDesign
        };
    } else if (!state?.implementation?.scaffolded) {
        step = {
            phase: "Phase 3: Implementation",
            title: "Scaffold Application",
            description: "Your design is exported. Now, scaffold the production app with the design system.",
            prompt: "Antigravity, scaffold the implementation. Read 'agent-os/commands/scaffold-implementation/scaffold-implementation.md'.",
            link: "",
            actionLabel: "",
            action: () => { }
        };
    } else if (state?.specs?.length === 0) {
        step = {
            phase: "Phase 4: Feature Specs",
            title: "Shape Your First Spec",
            description: "Your app is ready! Create a spec for the first feature in your roadmap.",
            prompt: "Antigravity, let's shape the spec for a new feature. Please read 'agent-os/commands/shape-spec/shape-spec.md'.",
            link: "",
            actionLabel: "",
            action: () => { }
        };
    } else {
        const incompleteSpec = state?.specs?.find(s => s.tasks.completed < s.tasks.total || !s.tasks.exists);
        if (incompleteSpec) {
            step = {
                phase: "Phase 4: Feature Specs",
                title: `Implement '${incompleteSpec.name}'`,
                description: `Active spec detected. Write the code!`,
                prompt: `Antigravity, implement the tasks for '${incompleteSpec.name}'. Read commands/implement-tasks/implement-tasks.md.`,
                link: "",
                actionLabel: "",
                action: () => { }
            };
        } else if (state?.product?.roadmap?.nextItem && !state?.product?.roadmap?.isBoilerplate) {
            const rawName = state?.product?.roadmap?.nextItem;
            const cleanName = rawName.replace(/\*\*/g, '').replace(/^\d+\.\s*/, '').split('\n')[0].trim();
            step = {
                phase: "Phase 4: Feature Specs",
                title: `Shape '${cleanName}'`,
                description: `Ready to start the next feature? Shape the spec now.`,
                prompt: `Antigravity, let's shape the spec for '${cleanName}'. Please read 'agent-os/commands/shape-spec/shape-spec.md'.`,
                link: "",
                actionLabel: "",
                action: () => { }
            };
        } else {
            step = {
                phase: "Phase 4: Feature Specs",
                title: "Verify or Plan Next",
                description: "Verify implementation or start a new feature.",
                prompt: "Antigravity, let's verify the implementation. Read 'agent-os/commands/implement-tasks/3-verify-implementation.md'.",
                link: "",
                actionLabel: "",
                action: () => { }
            }
        }
    }

    return (
        <Guidance
            phase={step.phase}
            title={step.title}
            description={step.description}
            prompt={step.prompt}
            actionLabel={step.actionLabel}
            onAction={step.action}
            className="mb-8"
        />
    );
};
