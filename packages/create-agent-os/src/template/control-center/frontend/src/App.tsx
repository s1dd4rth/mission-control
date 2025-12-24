import { useEffect, useState } from 'react';
import axios from 'axios';
import { Layout, Monitor, Layers, FileText, Code, CheckSquare, RefreshCw, ArrowRight, X, Plus, Trash2, WalletCards, LayoutDashboard, Copy, Package } from 'lucide-react';
import { useToast } from './components/ui/ToastContext';
import { ThemeToggle } from '@builderos/agent-os-ui';
import '@builderos/agent-os-ui/style.css';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import remarkBreaks from 'remark-breaks';

// Types
interface Status {
  exists: boolean;
  completed: number;
  total: number;
  nextItem?: string | null;
  items?: { name: string; completed: boolean }[];
  isBoilerplate?: boolean;
}
interface ProductStatus {
  mission: Status;
  roadmap: Status;
  techStack: Status;
}
interface Spec {
  name: string;
  spec: Status;
  tasks: Status;
}
interface ProjectState {
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
  };
  implementation: {
    scaffolded: boolean;
  };
  specs: Spec[];
  services?: {
    api: boolean;
    design: boolean;
    app: boolean;
  };
  projectRoot: string;
}

const Guidance = ({ phase, title, description, prompt, actionLabel, onAction, className }: any) => (
  <div className={`bg-card border border-border rounded-xl p-6 shadow-sm ${className}`}>
    <div className="text-xs font-semibold tracking-wider text-muted-foreground uppercase mb-2">
      {phase}
    </div>
    <div className="flex flex-col md:flex-row gap-6 items-start justify-between">
      <div className="max-w-xl">
        <h2 className="text-2xl font-bold text-foreground mb-2">{title}</h2>
        <p className="text-muted-foreground leading-relaxed">
          {description}
        </p>
      </div>
      {(prompt || actionLabel) && (
        <div className="flex items-center gap-3 shrink-0">
          {prompt && (
            <button
              onClick={() => {
                navigator.clipboard.writeText(prompt);
                const toast = document.createElement('div');
                toast.textContent = "Prompt Copied!";
                toast.className = "fixed bottom-8 right-8 bg-foreground text-background px-4 py-2 rounded-md shadow-lg z-50 animate-in fade-in slide-in-from-bottom-4";
                document.body.appendChild(toast);
                setTimeout(() => toast.remove(), 2000);
              }}
              className="flex items-center gap-2 px-4 py-2.5 bg-secondary hover:bg-secondary/80 text-secondary-foreground font-medium rounded-lg border border-border transition-all shadow-sm hover:shadow"
            >
              <Copy size={16} />
              Copy Prompt
            </button>
          )}
          {actionLabel && (
            <button
              onClick={onAction}
              className="flex items-center gap-2 px-4 py-2.5 bg-primary hover:bg-primary/90 text-primary-foreground font-medium rounded-lg shadow-sm hover:shadow-md transition-all"
            >
              {actionLabel} <ArrowRight size={16} />
            </button>
          )}
        </div>
      )}
    </div>
  </div>
);

function StatusItem({ label, status, icon, small, onClick }: any) {
  if (!status) return null;
  const isComplete = status.exists && (status.total > 0 ? status.completed === status.total : true);

  return (
    <div
      onClick={onClick}
      className={`flex items-center justify-between ${small ? 'text-xs' : 'text-sm'} ${onClick ? 'cursor-pointer hover:bg-secondary/50 p-1.5 -mx-1.5 rounded-md transition-colors group' : ''}`}
    >
      <div className="flex items-center gap-2 text-muted-foreground group-hover:text-foreground transition-colors">
        {icon}
        <span>{label}</span>
      </div>
      <div>
        {status.exists && !status.isBoilerplate ? (
          <span className={`px-2 py-0.5 rounded-full text-xs font-medium border ${isComplete
            ? 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 border-emerald-200 dark:border-emerald-800'
            : 'bg-secondary text-muted-foreground border-border'
            }`}>
            {isComplete ? 'Done' : 'Pending'}
          </span>
        ) : (
          <span className="text-muted-foreground bg-secondary px-2 py-0.5 rounded text-xs font-medium border border-border">Pending</span>
        )}
      </div>
    </div>
  );
}

function PromptButton({ label, prompt, onClick, small, primary }: any) {
  return (
    <button
      onClick={() => onClick(prompt)}
      className={`flex items-center justify-center gap-2 rounded-lg font-medium transition cursor-pointer
            ${small ? 'px-3 py-1.5 text-xs flex-1' : 'px-4 py-2 text-sm w-full'}
            ${primary
          ? 'bg-primary hover:bg-primary/90 text-primary-foreground shadow-sm'
          : 'bg-background hover:bg-secondary border border-border text-foreground hover:text-foreground'}
          `}
    >
      <Copy size={small ? 12 : 14} />
      {label}
    </button>
  )
}

const NextStepCard = ({ state, onOpenDesign }: { state: ProjectState, onOpenDesign: () => void }) => {
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

function App() {
  const [state, setState] = useState<ProjectState | null>(null);
  const [loading, setLoading] = useState(true);
  const [showDesignOS, setShowDesignOS] = useState(false);
  const { toast } = useToast();
  const [runtimeConfig, setRuntimeConfig] = useState<any>(null);

  // Edit State
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState("");

  useEffect(() => {
    fetch('/runtime-config.json')
      .then(res => res.json())
      .then(config => { setRuntimeConfig(config); })
      .catch(err => {
        setRuntimeConfig({
          api: 'http://localhost:5403',
          app: 'http://localhost:5402',
          design: 'http://localhost:5400',
          ports: { api: 5403, app: 5402, design: 5400 }
        });
      });
  }, []);

  const fetchStatus = async () => {
    if (!runtimeConfig) return;
    try {
      const res = await axios.get(`${runtimeConfig.api}/api/status`);
      setState(res.data);
    } catch (error) { console.error(error); } finally { setLoading(false); }
  };

  useEffect(() => {
    if (runtimeConfig) {
      fetchStatus();
      const interval = setInterval(fetchStatus, 2000);
      return () => clearInterval(interval);
    }
  }, [runtimeConfig]);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({ title: "Prompt Copied!", type: "success" });
  };

  const [viewingFile, setViewingFile] = useState<{ path: string, title: string } | null>(null);
  const [fileContent, setFileContent] = useState<string | null>(null);
  const [creatingSpec, setCreatingSpec] = useState(false);
  const [deletingSpec, setDeletingSpec] = useState<string | null>(null);
  const [newSpecName, setNewSpecName] = useState("");


  const openFile = async (path: string, title: string) => {
    setViewingFile({ path, title });
    setFileContent("Loading...");
    setIsEditing(false);
    try {
      const res = await axios.get(`${runtimeConfig.api}/api/files?path=${encodeURIComponent(path)}`);
      setFileContent(res.data.content);
      setEditContent(res.data.content);
    } catch (error) {
      setFileContent("Error loading file.");
    }
  };

  const saveFile = async () => {
    if (!viewingFile) return;
    try {
      await axios.post(`${runtimeConfig.api}/api/files`, {
        path: viewingFile.path,
        content: editContent
      });
      setFileContent(editContent);
      setIsEditing(false);
      toast({ title: "File Saved!", type: "success" });
      fetchStatus();
    } catch (error) {
      toast({ title: "Failed to save file", type: "error" });
    }
  };

  if (loading) return <div className="min-h-screen bg-background text-foreground flex items-center justify-center">Loading Control Center...</div>;

  if (!state) {
    return (
      <div className="min-h-screen bg-background text-foreground flex flex-col items-center justify-center gap-4 p-8">
        <h2 className="text-xl font-semibold text-red-500">Connection Failed</h2>
        <p className="text-muted-foreground text-center max-w-md">
          Could not connect to the Control Center API at <code>{runtimeConfig?.api || '...'}</code>.
          <br />Please ensure the backend is running.
        </p>
        <button
          onClick={() => { setLoading(true); fetchStatus(); }}
          className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
        >
          Retry Connection
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground font-sans flex flex-col h-screen overflow-hidden">
      {[
        viewingFile && (
          <div className="fixed inset-0 z-[200] bg-black/50 backdrop-blur-sm flex items-center justify-center p-6 animate-in fade-in">
            <div className="bg-card border border-border w-full max-w-4xl max-h-[90vh] rounded-xl shadow-2xl flex flex-col overflow-hidden animate-in zoom-in-95 duration-200">
              <div className="flex items-center justify-between px-6 py-4 border-b border-border bg-muted/30">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-primary/10 text-primary rounded-md">
                    <FileText size={18} />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg">{viewingFile.title}</h3>
                    <code className="text-xs text-muted-foreground font-mono">{viewingFile.path}</code>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {!isEditing ? (
                    <button
                      onClick={() => setIsEditing(true)}
                      className="px-3 py-1.5 text-sm font-medium bg-secondary hover:bg-secondary/80 rounded-md transition-colors"
                    >
                      Edit
                    </button>
                  ) : (
                    <>
                      <button
                        onClick={() => setIsEditing(false)}
                        className="px-3 py-1.5 text-sm font-medium hover:bg-secondary rounded-md transition-colors"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={saveFile}
                        className="px-3 py-1.5 text-sm font-medium bg-primary text-primary-foreground hover:bg-primary/90 rounded-md transition-colors"
                      >
                        Save Changes
                      </button>
                    </>
                  )}
                  <button onClick={() => setViewingFile(null)} className="p-2 hover:bg-secondary rounded-full transition-colors ml-2">
                    <X size={20} />
                  </button>
                </div>
              </div>
              <div className="flex-1 overflow-y-auto p-6 bg-background">
                {fileContent === "Loading..." || fileContent === "Error loading file." ? (
                  <div className="font-mono text-sm">{fileContent}</div>
                ) : isEditing ? (
                  <textarea
                    value={editContent}
                    onChange={(e) => setEditContent(e.target.value)}
                    className="w-full h-full min-h-[500px] p-4 font-mono text-sm bg-secondary/10 border border-border rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-primary/20"
                  />
                ) : (
                  <article className="prose dark:prose-invert max-w-none prose-headings:font-serif prose-headings:font-semibold prose-a:text-primary prose-code:text-primary prose-pre:bg-secondary/50 prose-pre:border prose-pre:border-border prose-p:leading-relaxed prose-p:mb-4">
                    <ReactMarkdown remarkPlugins={[remarkGfm, remarkBreaks]}>
                      {fileContent || ''}
                    </ReactMarkdown>
                  </article>
                )}
              </div>
            </div>
          </div>
        ),
        creatingSpec && (
          <div className="fixed inset-0 z-[200] bg-black/50 backdrop-blur-sm flex items-center justify-center p-6 animate-in fade-in">
            <div className="bg-card border border-border w-full max-w-md rounded-xl shadow-2xl flex flex-col overflow-hidden animate-in zoom-in-95 duration-200">
              <div className="px-6 py-4 border-b border-border bg-muted/30">
                <h3 className="font-semibold text-lg">New Feature Spec</h3>
                <p className="text-sm text-muted-foreground">Shape a new feature for your project.</p>
              </div>
              <div className="p-6">
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium mb-1.5 block">Feature Name</label>
                    <input
                      autoFocus
                      type="text"
                      className="w-full px-3 py-2 rounded-md border border-input bg-background text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                      placeholder="e.g. user-profile"
                      value={newSpecName}
                      onChange={(e) => setNewSpecName(e.target.value)}
                      onKeyDown={async (e) => {
                        if (e.key === 'Enter' && newSpecName.trim()) {
                          const name = newSpecName.trim();
                          if (runtimeConfig?.api) {
                            await axios.post(`${runtimeConfig.api}/api/scaffold/spec`, { name });
                            const prompt = `Antigravity, let's shape the spec for '${name}'. Read commands/shape-spec/shape-spec.md.`;
                            await copyToClipboard(prompt);
                            setNewSpecName("");
                            setCreatingSpec(false);
                            await fetchStatus();
                            openFile(`specs/${name}/spec.md`, `${name} Spec`);
                            toast({ title: "Spec created & Prompt copied!", type: 'success' });
                          }
                        }
                      }}
                    />
                    <p className="text-xs text-muted-foreground mt-1.5">
                      This will create a new directory in <code>specs/</code> and copy the prompt to your clipboard.
                    </p>
                  </div>
                  <div className="flex justify-end gap-2 pt-2">
                    <button onClick={() => { setCreatingSpec(false); setNewSpecName(""); }} className="px-4 py-2 text-sm font-medium rounded-md hover:bg-secondary transition-colors">Cancel</button>
                    <button
                      disabled={!newSpecName.trim()}
                      onClick={async () => {
                        if (newSpecName.trim()) {
                          const name = newSpecName.trim();
                          if (runtimeConfig?.api) {
                            await axios.post(`${runtimeConfig.api}/api/scaffold/spec`, { name });
                            const prompt = `Antigravity, let's shape the spec for '${name}'. Read commands/shape-spec/shape-spec.md.`;
                            await copyToClipboard(prompt);
                            setNewSpecName("");
                            setCreatingSpec(false);
                            await fetchStatus();
                            openFile(`specs/${name}/spec.md`, `${name} Spec`);
                            toast({ title: "Spec created & Prompt copied!", type: 'success' });
                          }
                        }
                      }}
                      className="px-4 py-2 text-sm font-medium rounded-md bg-primary text-primary-foreground hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Create Spec
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ),
        deletingSpec && (
          <div className="fixed inset-0 z-[200] bg-black/50 backdrop-blur-sm flex items-center justify-center p-6 animate-in fade-in">
            <div className="bg-card border border-border w-full max-w-sm rounded-xl shadow-2xl flex flex-col overflow-hidden animate-in zoom-in-95 duration-200">
              <div className="p-6">
                <div className="flex items-center gap-3 mb-4 text-red-500">
                  <div className="p-2 bg-red-100 dark:bg-red-900/20 rounded-full">
                    <Trash2 size={24} />
                  </div>
                  <h3 className="font-semibold text-lg text-foreground">Delete Spec?</h3>
                </div>
                <p className="text-muted-foreground mb-6">
                  Are you sure you want to delete <strong>{deletingSpec}</strong>? This action cannot be undone and will permanently delete the spec files.
                </p>
                <div className="flex justify-end gap-2">
                  <button onClick={() => setDeletingSpec(null)} className="px-4 py-2 text-sm font-medium rounded-md hover:bg-secondary transition-colors">Cancel</button>
                  <button
                    onClick={async () => {
                      await axios.delete(`${runtimeConfig.api}/api/specs/${deletingSpec}`);
                      setDeletingSpec(null);
                      fetchStatus();
                    }}
                    className="px-4 py-2 text-sm font-medium rounded-md bg-red-500 hover:bg-red-600 text-white transition-colors"
                  >
                    Delete Spec
                  </button>
                </div>
              </div>
            </div>
          </div>
        )
      ]}

      {showDesignOS && (
        <div className="fixed inset-0 z-[100] bg-background flex flex-col animate-fade-in w-screen h-screen">
          <div className="h-14 border-b border-border flex items-center justify-between px-6 bg-card shrink-0 shadow-sm z-50">
            <div className="flex items-center gap-3">
              <div className="p-1.5 bg-sidebar-primary/10 text-sidebar-primary rounded-md">
                <Layers size={20} />
              </div>
              <h2 className="font-semibold text-lg text-foreground">Design OS</h2>
              <span className="text-muted-foreground text-sm border-l border-border pl-3">Design System & Handoff</span>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setShowDesignOS(false)}
                className="p-2 text-muted-foreground hover:text-foreground hover:bg-secondary rounded-md transition-colors"
                title="Close Design OS"
              >
                <X size={20} />
              </button>
            </div>
          </div>
          <div className="flex-1 bg-background relative">
            <iframe
              src={`http://localhost:5400?theme=${localStorage.getItem('theme') || 'system'}`}
              className="absolute inset-0 w-full h-full border-none"
              title="Design OS"
              allow="clipboard-read; clipboard-write"
            />
          </div>
        </div >
      )
      }

      <header className="px-8 py-6 flex justify-between items-end border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-10 shrink-0">
        <div className="flex flex-col gap-4">
          <h1 className="text-2xl font-semibold text-foreground tracking-tight flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-black flex items-center justify-center text-white">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" className="w-5 h-5">
                <path d="M30 50h40M70 50l-10-10M70 50l-10 10" stroke="white" strokeWidth="12" strokeLinecap="round" strokeLinejoin="round" fill="none" />
              </svg>
            </div>
            Agent OS Control Center
          </h1>
          <p className="text-muted-foreground font-mono text-xs opacity-70">Project: {state?.projectRoot}</p>
        </div>
        <div className="flex gap-3 items-center">
          <ThemeToggle onThemeChange={(theme: string) => {
            const iframe = document.querySelector('iframe[title="Design OS"]') as HTMLIFrameElement;
            if (iframe?.contentWindow) {
              iframe.contentWindow.postMessage({ type: 'THEME_CHANGE', theme }, '*');
            }
          }} />
          <button className={`px-4 py-2 border rounded-lg flex items-center gap-2 transition text-sm font-medium ${showDesignOS ? 'bg-primary text-primary-foreground border-primary' : 'bg-background hover:bg-secondary border-border text-foreground'}`}
            onClick={() => setShowDesignOS(!showDesignOS)}>
            <Layers size={16} /> {showDesignOS ? 'Close Design OS' : 'Open Design OS'}
          </button>
        </div>
      </header>

      <div className="p-8 overflow-y-auto flex-1 bg-background/50">
        <div className="max-w-7xl mx-auto">
          {state && <NextStepCard state={state} onOpenDesign={() => setShowDesignOS(true)} />}

          <main className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Phase 1: Product Strategy */}
            <section className="bg-card border border-border rounded-xl p-5 shadow-sm h-full flex flex-col transition-all hover:shadow-md hover:border-border/80">
              <div className="flex items-center gap-3 mb-5 pb-4 border-b border-border/50">
                <div className="p-2 bg-sidebar-primary/10 text-sidebar-primary rounded-lg">
                  <LayoutDashboard size={20} />
                </div>
                <h2 className="text-lg font-semibold">1. Product Strategy</h2>
              </div>

              <div className="space-y-3 flex-1">
                <StatusItem label="Mission" status={state?.product?.mission} icon={<FileText size={16} />} onClick={() => openFile('product/mission.md', 'Product Mission')} />
                <StatusItem label="Roadmap" status={state?.product?.roadmap} icon={<CheckSquare size={16} />} onClick={() => openFile('product/roadmap.md', 'Product Roadmap')} />
                <StatusItem label="Tech Stack" status={state?.product?.techStack} icon={<Code size={16} />} onClick={() => openFile('product/tech-stack.md', 'Tech Stack')} />
              </div>

              <div className="mt-6">
                <PromptButton
                  label={state?.product?.mission?.exists && !state?.product?.mission?.isBoilerplate && state?.product?.roadmap?.exists && !state?.product?.roadmap?.isBoilerplate && state?.product?.techStack?.exists && !state?.product?.techStack?.isBoilerplate ? "Next: Design System" : "Plan Product"}
                  prompt={state?.product?.mission?.exists && !state?.product?.mission?.isBoilerplate && state?.product?.roadmap?.exists && !state?.product?.roadmap?.isBoilerplate && state?.product?.techStack?.exists && !state?.product?.techStack?.isBoilerplate ? "Antigravity, please sync my product plan to Design OS. Read 'agent-os/commands/initialize-design/initialize-design.md'." : "Antigravity, let's start Phase 1: Product Planning. Please read 'agent-os/commands/plan-product/plan-product.md' and guide me."}
                  onClick={copyToClipboard}
                  primary={state?.product?.mission?.exists && !state?.product?.mission?.isBoilerplate && state?.product?.roadmap?.exists && !state?.product?.roadmap?.isBoilerplate && state?.product?.techStack?.exists && !state?.product?.techStack?.isBoilerplate}
                />
              </div>
            </section>

            {/* Phase 2: Design */}
            <section className="bg-card border border-border rounded-xl p-5 shadow-sm h-full flex flex-col transition-all hover:shadow-md hover:border-border/80">
              <div className="flex items-center gap-3 mb-5 pb-4 border-b border-border/50">
                <div className="p-2 bg-sidebar-primary/10 text-sidebar-primary rounded-lg">
                  <Layers size={20} />
                </div>
                <h2 className="text-lg font-semibold">2. Design System</h2>
              </div>

              <div className="space-y-4 flex-1">
                <div className="flex items-center justify-between p-3 bg-secondary/30 rounded-lg border border-border/50">
                  <span className="text-foreground font-medium text-sm flex items-center gap-2"><RefreshCw size={16} className="text-muted-foreground" /> Data Sync</span>
                  {state?.design?.initialized ? (
                    <span className="text-emerald-600 bg-emerald-50 dark:bg-emerald-900/20 px-2 py-0.5 rounded text-xs font-medium border border-emerald-200 dark:border-emerald-800">Synced</span>
                  ) : (
                    <span className="text-muted-foreground bg-secondary px-2 py-0.5 rounded text-xs font-medium border border-border">Pending</span>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div className={`p-2 rounded-lg border text-center ${state?.design?.tokens ? 'bg-emerald-50/50 border-emerald-200 text-emerald-700 dark:bg-emerald-900/20 dark:border-emerald-800 dark:text-emerald-300' : 'bg-secondary/20 border-border/50 text-muted-foreground'}`}>
                    <span className="text-xs font-medium block mb-1">Tokens</span>
                    {state?.design?.tokens ? <CheckSquare size={14} className="mx-auto" /> : <span className="block w-2 h-2 rounded-full bg-stone-300 mx-auto mt-1" />}
                  </div>
                  <div className={`p-2 rounded-lg border text-center ${state?.design?.shell ? 'bg-emerald-50/50 border-emerald-200 text-emerald-700 dark:bg-emerald-900/20 dark:border-emerald-800 dark:text-emerald-300' : 'bg-secondary/20 border-border/50 text-muted-foreground'}`}>
                    <span className="text-xs font-medium block mb-1">App Shell</span>
                    {state?.design?.shell ? <CheckSquare size={14} className="mx-auto" /> : <span className="block w-2 h-2 rounded-full bg-stone-300 mx-auto mt-1" />}
                  </div>
                </div>

                <div className="flex items-center justify-between p-3 bg-secondary/30 rounded-lg border border-border/50">
                  <span className="text-foreground font-medium text-sm flex items-center gap-2"><ArrowRight size={16} className="text-muted-foreground" /> Export</span>
                  {state?.design?.exported ? (
                    <span className="text-emerald-600 bg-emerald-50 dark:bg-emerald-900/20 px-2 py-0.5 rounded text-xs font-medium border border-emerald-200 dark:border-emerald-800">Done</span>
                  ) : state?.design?.exists ? (
                    <span className="text-emerald-600 bg-emerald-50 dark:bg-emerald-900/20 px-2 py-0.5 rounded text-xs font-medium border border-emerald-200 dark:border-emerald-800">Ready</span>
                  ) : (
                    <span className="text-muted-foreground bg-secondary px-2 py-0.5 rounded text-xs font-medium border border-border">Pending</span>
                  )}
                </div>
              </div>

              <div className="mt-6 flex gap-2">
                {!state?.design?.initialized && (
                  <PromptButton
                    label="Sync Data"
                    prompt="Antigravity, please sync my product plan to Design OS. Read 'agent-os/commands/initialize-design/initialize-design.md'."
                    onClick={copyToClipboard}
                    primary
                  />
                )}
              </div>
            </section>

            {/* Phase 3: Implementation */}
            <section className="bg-card border border-border rounded-xl p-5 shadow-sm h-full flex flex-col transition-all hover:shadow-md hover:border-border/80">
              <div className="flex items-center gap-3 mb-5 pb-4 border-b border-border/50">
                <div className="p-2 bg-sidebar-primary/10 text-sidebar-primary rounded-lg">
                  <Package size={20} />
                </div>
                <h2 className="text-lg font-semibold">3. Implementation</h2>
              </div>

              <div className="space-y-4 flex-1">
                <div className="flex items-center justify-between p-3 bg-secondary/30 rounded-lg border border-border/50">
                  <span className="text-foreground font-medium text-sm flex items-center gap-2"><Layout size={16} className="text-muted-foreground" /> Scaffold</span>
                  {state?.implementation?.scaffolded ? (
                    <span className="text-emerald-600 bg-emerald-50 dark:bg-emerald-900/20 px-2 py-0.5 rounded text-xs font-medium border border-emerald-200 dark:border-emerald-800">Done</span>
                  ) : (
                    <span className="text-muted-foreground bg-secondary px-2 py-0.5 rounded text-xs font-medium border border-border">Pending</span>
                  )}
                </div>
              </div>

              <div className="mt-6">
                <PromptButton
                  label="Scaffold App"
                  prompt="Antigravity, scaffold the implementation. Read 'agent-os/commands/scaffold-implementation/scaffold-implementation.md'."
                  onClick={copyToClipboard}
                />

                {state?.implementation?.scaffolded && state?.design?.exportPrompts?.oneShot && (
                  <div className="mt-3 pt-3 border-t border-border/50">
                    <p className="text-xs text-muted-foreground mb-2 font-medium">Implementation Options:</p>
                    <div className="space-y-2">
                      <PromptButton
                        label="Option A: One-Shot (All)"
                        prompt={`Antigravity, implement the app. Read 'product-plan/prompts/one-shot-prompt.md'.`}
                        onClick={copyToClipboard}
                        small
                        primary
                      />
                      {state?.design?.exportPrompts?.section && (
                        <PromptButton
                          label="Option B: Incremental (Section)"
                          prompt={`Antigravity, implement a section. Read 'product-plan/prompts/section-prompt.md'.`}
                          onClick={copyToClipboard}
                          small
                        />
                      )}
                    </div>
                  </div>
                )}
              </div>
            </section>

            {/* Phase 4: Specs & Implementation */}
            <section className="bg-card border border-border rounded-xl p-5 shadow-sm col-span-1 md:col-span-2 lg:col-span-1 h-full flex flex-col transition-all hover:shadow-md hover:border-border/80">
              <div className="flex items-center justify-between mb-5 pb-4 border-b border-border/50">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-sidebar-primary/10 text-sidebar-primary rounded-lg">
                    <Code size={20} />
                  </div>
                  <h2 className="text-lg font-semibold">4. Feature Specs</h2>
                </div>
                <button className="text-xs bg-secondary hover:bg-secondary/80 border border-border px-3 py-2 rounded-md flex items-center gap-1.5 font-medium transition cursor-pointer"
                  onClick={() => setCreatingSpec(true)}>
                  <Plus size={14} /> New
                </button>
              </div>

              <div className="space-y-3 flex-1 overflow-y-auto max-h-[300px] pr-1">
                {state?.specs?.map(spec => (
                  <div key={spec.name} className="bg-secondary/20 p-4 rounded-lg border border-border/50 hover:border-border transition-colors group relative">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setDeletingSpec(spec.name);
                      }}
                      className="absolute top-4 right-4 text-muted-foreground hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all p-1"
                      title="Delete Spec"
                    >
                      <Trash2 size={16} />
                    </button>
                    <h3 className="font-medium text-base mb-3 flex items-center gap-2">
                      <WalletCards size={16} className="text-muted-foreground" />
                      {spec.name}
                    </h3>
                    <div className="space-y-2 mb-4">
                      <StatusItem label="Spec" status={spec.spec} icon={<FileText size={14} />} small onClick={() => openFile(`specs/${spec.name}/spec.md`, `${spec.name} Spec`)} />
                      <StatusItem label="Tasks" status={spec.tasks} icon={<CheckSquare size={14} />} small onClick={() => openFile(`specs/${spec.name}/tasks.md`, `${spec.name} Tasks`)} />
                    </div>
                    <div className="flex gap-2">
                      <PromptButton
                        label="Shape"
                        prompt={`Antigravity, let's shape the spec for '${spec.name}'. Read commands/shape-spec/shape-spec.md.`}
                        onClick={copyToClipboard}
                        small
                      />
                      <PromptButton
                        label="Implement"
                        prompt={`Antigravity, implement the tasks for '${spec.name}'. Read commands/implement-tasks/implement-tasks.md.`}
                        onClick={copyToClipboard}
                        small
                        primary
                      />
                    </div>
                  </div>
                ))}

                {/* Pending Roadmap Items */}
                {state?.product?.roadmap?.items?.filter(item =>
                  !item.completed &&
                  !state?.product?.roadmap?.isBoilerplate &&
                  !state?.specs?.some(s => s.name.toLowerCase() === item.name.toLowerCase().trim().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, ''))
                ).map(item => (
                  <div key={item.name} className="border border-dashed border-border/60 p-4 rounded-lg bg-secondary/5 hover:bg-secondary/10 transition-colors">
                    <h3 className="font-medium text-base mb-2 flex items-center gap-2 text-muted-foreground">
                      <div className="w-2 h-2 rounded-full bg-stone-300" />
                      {item.name}
                    </h3>
                    <p className="text-xs text-muted-foreground mb-4 pl-4">Pending in Roadmap</p>
                    <div className="pl-4">
                      <button
                        onClick={() => {
                          setNewSpecName(item.name.toLowerCase().replace(/\s+/g, '-'));
                          setCreatingSpec(true);
                        }}
                        className="text-xs bg-background hover:bg-secondary border border-border px-3 py-1.5 rounded-md flex items-center gap-1.5 font-medium transition cursor-pointer"
                      >
                        <Plus size={12} /> Shape Spec
                      </button>
                    </div>
                  </div>
                ))}

                {state?.specs?.length === 0 && (!state?.product?.roadmap?.items || state?.product?.roadmap?.items?.length === 0) && (
                  <div className="text-muted-foreground italic p-8 text-center text-sm border border-dashed border-border rounded-lg bg-secondary/10">
                    No specs found yet.<br />Create one to start coding.
                  </div>
                )}
              </div>
            </section>
          </main>
        </div>
      </div>
      <footer className="h-8 border-t border-border/40 bg-card px-4 flex items-center gap-6 text-[10px] font-medium text-muted-foreground fixed bottom-0 w-full z-50">
        <div className="flex items-center gap-2">
          <div className={`w-1.5 h-1.5 rounded-full ${state?.services?.api ? 'bg-emerald-500 shadow-[0_0_6px_rgba(16,185,129,0.4)]' : 'bg-red-500 animate-pulse'}`} />
          <span>Control Center API ({runtimeConfig?.ports?.api || 5403})</span>
        </div>
        <div className="h-3 w-[1px] bg-border" />
        <div className="flex items-center gap-2">
          <div className={`w-1.5 h-1.5 rounded-full ${state?.services?.design ? 'bg-emerald-500 shadow-[0_0_6px_rgba(16,185,129,0.4)]' : 'bg-red-500'}`} />
          <span>Design OS ({runtimeConfig?.ports?.design || 5400})</span>
        </div>
        <div className="h-3 w-[1px] bg-border" />
        <div className="flex items-center gap-2">
          <div className={`w-1.5 h-1.5 rounded-full ${state?.services?.app ? 'bg-emerald-500 shadow-[0_0_6px_rgba(16,185,129,0.4)]' : 'bg-red-500'}`} />
          <span>App ({runtimeConfig?.ports?.app || 5402})</span>
        </div>
      </footer>
    </div >
  );
}

export default App;
