
export interface Status {
    exists: boolean;
    completed: number;
    total: number;
    nextItem?: string | null;
    items?: { name: string; completed: boolean }[];
    isBoilerplate?: boolean;
}

export interface ProductStatus {
    mission: Status;
    roadmap: Status;
    techStack: Status;
}

export interface Spec {
    name: string;
    spec: Status;
    tasks: Status;
}

export interface ProjectState {
    product: ProductStatus;
    design: {
        exists: boolean;
        initialized: boolean;
        tokens: boolean;
        shell: boolean;
        exported: boolean;
        exportPrompts?: {
            oneShot: boolean;
            section: boolean;
        };
        qa?: {
            audit: boolean;
            polish: boolean;
        };
    };
    implementation: {
        scaffolded: boolean;
        tests?: {
            count: number;
            hasTests: boolean;
        };
        coverage?: number | null;
        specs?: {
            total: number;
            completed: number;
        };
        git?: {
            initialized: boolean;
            branch: string | null;
            uncommitted: number;
            lastCommit: string | null;
        };
    };
    specs: Spec[];
    services?: {
        api: boolean;
        design: boolean;
        app: boolean;
    };
    projectRoot: string;
}
