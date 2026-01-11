import { useState, useEffect } from 'react';
import { LayoutDashboard, Layers, Code, Package, Settings, RefreshCw, FileText, CheckSquare, Plus, ArrowRight, Layout, Trash2, WalletCards } from 'lucide-react';
import { useToast } from './components/ui/ToastContext';
// @ts-ignore
import { ThemeToggle } from '@theproductguy/agent-os-ui';
import '@theproductguy/agent-os-ui/style.css';

// Contexts & Hooks
import { IdeContext } from './contexts/IdeContext';
import { useProjectState } from './hooks/useProjectState';
import { useFileEditor } from './hooks/useFileEditor';

// Components
import { StatusItem } from './components/StatusItem';
import { PromptButton } from './components/PromptButton';
import { NextStepCard } from './components/NextStepCard';
import { DesignOSOverlay } from './components/DesignOSOverlay';

// Modals
import { SettingsModal } from './components/modals/SettingsModal';
import { FileEditorModal } from './components/modals/FileEditorModal';
import { CreateSpecModal } from './components/modals/CreateSpecModal';
import { DeleteSpecModal } from './components/modals/DeleteSpecModal';

function App() {
  const { state, loading, runtimeConfig, fetchStatus } = useProjectState();
  const { viewingFile, fileContent, openFile, saveFile, closeFile } = useFileEditor(runtimeConfig, fetchStatus);
  const { toast } = useToast();

  // UI State
  const [showDesignOS, setShowDesignOS] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [ideScheme, setIdeScheme] = useState('vscode');

  // Modal State
  const [creatingSpec, setCreatingSpec] = useState(false);
  const [deletingSpec, setDeletingSpec] = useState<string | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem('ide_scheme');
    if (saved) setIdeScheme(saved);
  }, []);

  const updateIdeScheme = (scheme: string) => {
    setIdeScheme(scheme);
    localStorage.setItem('ide_scheme', scheme);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({ title: "Prompt Copied!", type: "success" });
  };

  if (loading) return <div className="min-h-screen bg-background text-foreground flex items-center justify-center">Loading Control Center...</div>;
  if (!state) return <div className="min-h-screen bg-background text-foreground flex items-center justify-center text-red-500">Connection Failed</div>;

  return (
    <IdeContext.Provider value={{ scheme: ideScheme, setScheme: updateIdeScheme }}>
      <div className="min-h-screen bg-background text-foreground font-sans flex flex-col h-screen overflow-hidden">

        {/* Overlays & Modals */}
        {showSettings && <SettingsModal onClose={() => setShowSettings(false)} />}
        {viewingFile && <FileEditorModal viewingFile={viewingFile} content={fileContent} onClose={closeFile} onSave={saveFile} />}
        {creatingSpec && <CreateSpecModal runtimeConfig={runtimeConfig} onClose={() => setCreatingSpec(false)} onSuccess={fetchStatus} openFile={openFile} />}
        {deletingSpec && <DeleteSpecModal specName={deletingSpec} runtimeConfig={runtimeConfig} onClose={() => setDeletingSpec(null)} onSuccess={fetchStatus} />}
        {showDesignOS && <DesignOSOverlay onClose={() => setShowDesignOS(false)} />}

        {/* Header */}
        <header className="px-8 py-6 flex justify-between items-end border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-10 shrink-0">
          <div className="flex flex-col gap-4">
            <h1 className="text-2xl font-semibold text-foreground tracking-tight flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center text-primary-foreground">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" className="w-5 h-5">
                  <path d="M50 20 L75 80 L50 65 L25 80 Z" fill="currentColor" stroke="none" />
                </svg>
              </div>
              Mission Control
            </h1>
            <p className="text-muted-foreground font-mono text-xs opacity-70">Project: {state?.projectRoot}</p>
          </div>
          <div className="flex gap-3 items-center">
            <ThemeToggle onThemeChange={(theme: string) => {
              const iframe = document.querySelector('iframe[title="Design OS"]') as HTMLIFrameElement;
              if (iframe?.contentWindow) iframe.contentWindow.postMessage({ type: 'THEME_CHANGE', theme }, '*');
            }} />
            <button className={`px-4 py-2 border rounded-lg flex items-center gap-2 transition text-sm font-medium ${showDesignOS ? 'bg-primary text-primary-foreground border-primary' : 'bg-background hover:bg-secondary border-border text-foreground'}`}
              onClick={() => setShowDesignOS(!showDesignOS)}>
              <Layers size={16} /> {showDesignOS ? 'Close Design OS' : 'Open Design OS'}
            </button>
            <button onClick={() => setShowSettings(true)} className="p-2 bg-background hover:bg-secondary border border-border rounded-lg text-foreground transition-colors" title="Settings">
              <Settings size={20} />
            </button>
          </div>
        </header>

        {/* Main Content */}
        <div className="p-8 overflow-y-auto flex-1 bg-background/50">
          <div className="max-w-7xl mx-auto">
            <NextStepCard state={state} onOpenDesign={() => setShowDesignOS(true)} />

            <main className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">

              {/* Phase 1: Product Strategy */}
              <section className="bg-card border border-border rounded-xl p-5 shadow-sm h-full flex flex-col transition-all hover:shadow-md hover:border-border/80 animate-in fade-in slide-in-from-bottom-4 duration-500 fill-mode-backwards" style={{ animationDelay: '100ms' }}>
                <div className="flex items-center gap-3 mb-5 pb-4 border-b border-border/50">
                  <div className="p-2 bg-sidebar-primary/10 text-sidebar-primary rounded-lg"><LayoutDashboard size={20} /></div>
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
              <section className="bg-card border border-border rounded-xl p-5 shadow-sm h-full flex flex-col transition-all hover:shadow-md hover:border-border/80 animate-in fade-in slide-in-from-bottom-4 duration-500 fill-mode-backwards" style={{ animationDelay: '200ms' }}>
                <div className="flex items-center gap-3 mb-5 pb-4 border-b border-border/50">
                  <div className="p-2 bg-sidebar-primary/10 text-sidebar-primary rounded-lg"><Layers size={20} /></div>
                  <h2 className="text-lg font-semibold">2. Design System</h2>
                </div>
                <div className="space-y-4 flex-1">
                  <div className="flex items-center justify-between p-3 bg-secondary/30 rounded-lg border border-border/50">
                    <span className="text-foreground font-medium text-sm flex items-center gap-2"><RefreshCw size={16} className="text-muted-foreground" /> Data Sync</span>
                    {state?.design?.initialized ? <span className="text-success bg-success/10 px-2 py-0.5 rounded text-xs font-medium border border-success/20">Synced</span> : <span className="text-muted-foreground bg-secondary px-2 py-0.5 rounded text-xs font-medium border border-border">Pending</span>}
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div className={`p-2 rounded-lg border text-center ${state?.design?.tokens ? 'bg-success/10 border-success/20 text-success' : 'bg-secondary/20 border-border/50 text-muted-foreground'}`}>
                      <span className="text-xs font-medium block mb-1">Tokens</span>
                      {state?.design?.tokens ? <CheckSquare size={14} className="mx-auto" /> : <span className="block w-2 h-2 rounded-full bg-stone-300 mx-auto mt-1" />}
                    </div>
                    <div className={`p-2 rounded-lg border text-center ${state?.design?.shell ? 'bg-success/10 border-success/20 text-success' : 'bg-secondary/20 border-border/50 text-muted-foreground'}`}>
                      <span className="text-xs font-medium block mb-1">App Shell</span>
                      {state?.design?.shell ? <CheckSquare size={14} className="mx-auto" /> : <span className="block w-2 h-2 rounded-full bg-stone-300 mx-auto mt-1" />}
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div className={`p-2 rounded-lg border text-center ${state?.design?.qa?.audit ? 'bg-success/10 border-success/20 text-success' : 'bg-secondary/20 border-border/50 text-muted-foreground'}`}>
                      <span className="text-xs font-medium block mb-1">Audit</span>
                      {state?.design?.qa?.audit ? <CheckSquare size={14} className="mx-auto" /> : <span className="block w-2 h-2 rounded-full bg-stone-300 mx-auto mt-1" />}
                    </div>
                    <div className={`p-2 rounded-lg border text-center ${state?.design?.qa?.polish ? 'bg-success/10 border-success/20 text-success' : 'bg-secondary/20 border-border/50 text-muted-foreground'}`}>
                      <span className="text-xs font-medium block mb-1">Polish</span>
                      {state?.design?.qa?.polish ? <CheckSquare size={14} className="mx-auto" /> : <span className="block w-2 h-2 rounded-full bg-stone-300 mx-auto mt-1" />}
                    </div>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-secondary/30 rounded-lg border border-border/50">
                    <span className="text-foreground font-medium text-sm flex items-center gap-2"><ArrowRight size={16} className="text-muted-foreground" /> Export</span>
                    {state?.design?.exported ? <span className="text-success bg-success/10 px-2 py-0.5 rounded text-xs font-medium border border-success/20">Done</span> : state?.design?.exists ? <span className="text-success bg-success/10 px-2 py-0.5 rounded text-xs font-medium border border-success/20">Ready</span> : <span className="text-muted-foreground bg-secondary px-2 py-0.5 rounded text-xs font-medium border border-border">Pending</span>}
                  </div>
                </div>
                <div className="mt-6 flex flex-col gap-2">
                  {!state?.design?.initialized && <PromptButton label="Sync Data" prompt="Antigravity, please sync my product plan to Design OS. Read 'agent-os/commands/initialize-design/initialize-design.md'." onClick={copyToClipboard} primary />}
                  {state?.design?.initialized && !state?.design?.exported && (
                    <div className="flex gap-2">
                      <PromptButton label="Run Audit" prompt="Antigravity, run an audit on the design system. Read 'design-system/.gemini/commands/impeccable/audit.md'." onClick={copyToClipboard} small />
                      <PromptButton label="Run Polish" prompt="Antigravity, run a polish pass. Read 'design-system/.gemini/commands/impeccable/polish.md'." onClick={copyToClipboard} small />
                    </div>
                  )}
                </div>
              </section>

              {/* Phase 3: Feature Specs */}
              <section className="bg-card border border-border rounded-xl p-5 shadow-sm col-span-1 md:col-span-2 lg:col-span-1 h-full flex flex-col transition-all hover:shadow-md hover:border-border/80 animate-in fade-in slide-in-from-bottom-4 duration-500 fill-mode-backwards" style={{ animationDelay: '300ms' }}>
                <div className="flex items-center justify-between mb-5 pb-4 border-b border-border/50">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-sidebar-primary/10 text-sidebar-primary rounded-lg"><Code size={20} /></div>
                    <h2 className="text-lg font-semibold">3. Feature Specs</h2>
                  </div>
                  <button className="text-xs bg-secondary hover:bg-secondary/80 border border-border px-3 py-2 rounded-md flex items-center gap-1.5 font-medium transition cursor-pointer" onClick={() => setCreatingSpec(true)}>
                    <Plus size={14} /> New
                  </button>
                </div>
                <div className="space-y-3 flex-1 overflow-y-auto max-h-[300px] pr-1">
                  {(state?.product?.roadmap?.items?.filter(item => !item.completed && !state?.product?.roadmap?.isBoilerplate) ?? []).length > 0 && !state?.specs?.length && (
                    <div className="bg-info/10 border border-info/20 p-4 rounded-lg mb-3">
                      <p className="text-sm text-info mb-2">Ready to generate specs from roadmap items?</p>
                      <PromptButton label="Generate All Specs" prompt={`Antigravity, generate feature specs from the roadmap items. For each item in 'agent-os/product/roadmap.md' that is not yet completed, create a spec folder in 'agent-os/specs/[feature-name]/' with spec.md and tasks.md files. Context: 1. Read 'product-plan/product-overview.md' for data model/flows. 2. Read 'design-system/design-tokens.md' and 'design-system/app-shell.md' for UI/UX constraints. 3. Use the shape-spec command: Read 'agent-os/commands/shape-spec/shape-spec.md'.`} onClick={copyToClipboard} small primary />
                    </div>
                  )}
                  {state?.specs?.map(spec => (
                    <div key={spec.name} className="bg-secondary/20 p-4 rounded-lg border border-border/50 hover:border-border transition-colors group relative">
                      <button onClick={(e) => { e.stopPropagation(); setDeletingSpec(spec.name); }} className="absolute top-4 right-4 text-muted-foreground hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all p-1" title="Delete Spec"><Trash2 size={16} /></button>
                      <h3 className="font-medium text-base mb-3 flex items-center gap-2"><WalletCards size={16} className="text-muted-foreground" />{spec.name}</h3>
                      <div className="space-y-2 mb-4">
                        <StatusItem label="Spec" status={spec.spec} icon={<FileText size={14} />} small onClick={() => openFile(`specs/${spec.name}/spec.md`, `${spec.name} Spec`)} />
                        <StatusItem label="Tasks" status={spec.tasks} icon={<CheckSquare size={14} />} small onClick={() => openFile(`specs/${spec.name}/tasks.md`, `${spec.name} Tasks`)} />
                      </div>
                      <div className="flex gap-2">
                        <PromptButton label="Shape" prompt={`Antigravity, let's shape the spec for '${spec.name}'. Read commands/shape-spec/shape-spec.md.`} onClick={copyToClipboard} small />
                        <PromptButton label="Implement" prompt={`Antigravity, implement the tasks for '${spec.name}'. Read commands/implement-tasks/implement-tasks.md.`} onClick={copyToClipboard} small primary />
                      </div>
                    </div>
                  ))}
                  {state?.product?.roadmap?.items?.filter(item => !item.completed && !state?.product?.roadmap?.isBoilerplate && !state?.specs?.some(s => s.name.toLowerCase().includes(item.name.toLowerCase().trim().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')))).map(item => (
                    <div key={item.name} className="border border-dashed border-border/60 p-4 rounded-lg bg-secondary/5 hover:bg-secondary/10 transition-colors">
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="font-medium text-base flex items-center gap-2 text-muted-foreground w-full"><div className="w-2 h-2 rounded-full bg-stone-300 shrink-0" /><span className="truncate" title={item.name}>{item.name}</span></h3>
                        <span className="text-[10px] uppercase tracking-wider font-semibold text-muted-foreground bg-secondary px-1.5 py-0.5 rounded shrink-0 ml-2">Planned</span>
                      </div>
                      <p className="text-xs text-muted-foreground mb-4 pl-4 opacity-70">Defined in Product Roadmap. Ready to spec.</p>
                      <div className="pl-4">
                        <button onClick={() => { setCreatingSpec(true); }} className="text-xs bg-background hover:bg-secondary border border-border px-3 py-1.5 rounded-md flex items-center gap-1.5 font-medium transition cursor-pointer w-full justify-center group">
                          <Plus size={12} className="group-hover:text-primary transition-colors" /> Shape Spec
                        </button>
                      </div>
                    </div>
                  ))}
                  {(!state?.specs?.length && (!state?.product?.roadmap?.items?.length || state?.product?.roadmap?.isBoilerplate)) && (
                    <div className="border border-dashed border-border/60 p-8 rounded-lg text-center h-40 flex flex-col items-center justify-center">
                      <p className="text-muted-foreground text-sm mb-3">No specs found yet.</p>
                      <button onClick={() => setCreatingSpec(true)} className="text-sm px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors">Create your first spec</button>
                    </div>
                  )}
                </div>
              </section>

              {/* Phase 4: Implementation */}
              <section className="bg-card border border-border rounded-xl p-5 shadow-sm h-full flex flex-col transition-all hover:shadow-md hover:border-border/80 animate-in fade-in slide-in-from-bottom-4 duration-500 fill-mode-backwards" style={{ animationDelay: '400ms' }}>
                <div className="flex items-center gap-3 mb-5 pb-4 border-b border-border/50">
                  <div className="p-2 bg-sidebar-primary/10 text-sidebar-primary rounded-lg"><Package size={20} /></div>
                  <h2 className="text-lg font-semibold">4. Implementation</h2>
                </div>
                <div className="space-y-3 flex-1">
                  <div className="flex items-center justify-between p-3 bg-secondary/30 rounded-lg border border-border/50">
                    <span className="text-foreground font-medium text-sm flex items-center gap-2"><Layout size={16} className="text-muted-foreground" /> Scaffold</span>
                    {state?.implementation?.scaffolded ? <span className="text-success bg-success/10 px-2 py-0.5 rounded text-xs font-medium border border-success/20">Done</span> : <span className="text-muted-foreground bg-secondary px-2 py-0.5 rounded text-xs font-medium border border-border">Pending</span>}
                  </div>
                  {state?.implementation?.git?.initialized && (
                    <div className="flex items-center justify-between p-3 bg-secondary/30 rounded-lg border border-border/50">
                      <span className="text-foreground font-medium text-sm flex items-center gap-2">
                        <svg className="w-4 h-4 text-muted-foreground" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" /></svg>
                        {state.implementation.git.branch || 'main'}
                      </span>
                      <div className="flex items-center gap-2">
                        {state.implementation.git.uncommitted > 0 ? <span className="text-warning bg-warning/10 px-2 py-0.5 rounded text-xs font-medium border border-warning/20">{state.implementation.git.uncommitted} uncommitted</span> : <span className="text-success bg-success/10 px-2 py-0.5 rounded text-xs font-medium border border-success/20">Clean</span>}
                      </div>
                    </div>
                  )}
                  {state?.implementation?.scaffolded && (
                    <div className="flex items-center justify-between p-3 bg-secondary/30 rounded-lg border border-border/50">
                      <span className="text-foreground font-medium text-sm flex items-center gap-2"><CheckSquare size={16} className="text-muted-foreground" /> Tests</span>
                      <div className="flex items-center gap-2">
                        {state?.implementation?.tests?.hasTests ? <span className="text-success bg-success/10 px-2 py-0.5 rounded text-xs font-medium border border-success/20">{state.implementation.tests.count} files</span> : <span className="text-muted-foreground bg-secondary px-2 py-0.5 rounded text-xs font-medium border border-border">No tests</span>}
                        {state?.implementation?.coverage !== null && state?.implementation?.coverage !== undefined && (
                          <span className={`px-2 py-0.5 rounded text-xs font-medium border ${state.implementation.coverage >= 80 ? 'text-success bg-success/10 border-success/20' : state.implementation.coverage >= 50 ? 'text-warning bg-warning/10 border-warning/20' : 'text-destructive bg-destructive/10 border-destructive/20'}`}>{state.implementation.coverage}% coverage</span>
                        )}
                      </div>
                    </div>
                  )}
                  {state?.implementation?.specs && state.implementation.specs.total > 0 && (
                    <div className="flex items-center justify-between p-3 bg-secondary/30 rounded-lg border border-border/50">
                      <span className="text-foreground font-medium text-sm flex items-center gap-2"><FileText size={16} className="text-muted-foreground" /> Specs</span>
                      <span className={`px-2 py-0.5 rounded text-xs font-medium border ${state.implementation.specs.completed === state.implementation.specs.total ? 'text-success bg-success/10 border-success/20' : 'text-info bg-info/10 border-info/20'}`}>{state.implementation.specs.completed}/{state.implementation.specs.total} complete</span>
                    </div>
                  )}
                </div>
                <div className="mt-6">
                  {!state?.implementation?.scaffolded ? (
                    <PromptButton label="Scaffold App" prompt="Antigravity, scaffold the implementation. Read 'agent-os/commands/scaffold-implementation/scaffold-implementation.md'." onClick={copyToClipboard} />
                  ) : <div className="p-3 bg-secondary/30 rounded-lg border border-border/50 text-sm text-muted-foreground text-center italic mb-4">App scaffolded. Ready for implementation.</div>}
                  {state?.implementation?.scaffolded && state?.design?.exportPrompts?.oneShot && (
                    <div className="pt-3 border-t border-border/50">
                      <p className="text-xs text-muted-foreground mb-2 font-medium">Implementation Options:</p>
                      <div className="space-y-2">
                        <PromptButton label="Option A: One-Shot (All)" prompt={`Antigravity, implement the app. Read 'product-plan/prompts/one-shot-prompt.md'. If Context7 is configured, use it to verify library documentation.`} onClick={copyToClipboard} small primary />
                        {state?.design?.exportPrompts?.section && (
                          <div className="relative">
                            <PromptButton label="Option B: Incremental (Section)" prompt={`Antigravity, implement a section. Read 'product-plan/prompts/section-prompt.md'. Use Context7 for latest docs if available.`} onClick={copyToClipboard} small />
                            <p className="text-[10px] text-muted-foreground mt-1.5 text-center leading-tight">Build by spec from <strong>Feature Specs</strong> &larr;</p>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </section>

            </main>
          </div>
        </div>
        <footer className="h-8 border-t border-border/40 bg-card px-4 flex items-center gap-6 text-[10px] font-medium text-muted-foreground fixed bottom-0 w-full z-50">
          <div className="flex items-center gap-2">
            <div className={`w-1.5 h-1.5 rounded-full ${state?.services?.api ? 'bg-success shadow-[0_0_6px_rgba(var(--success))]' : 'bg-destructive animate-pulse'}`} />
            <span>Control Center API ({runtimeConfig?.ports?.api || 5403})</span>
          </div>
          <div className="h-3 w-[1px] bg-border" />
          <div className="flex items-center gap-2">
            <div className={`w-1.5 h-1.5 rounded-full ${state?.services?.design ? 'bg-success shadow-[0_0_6px_rgba(var(--success))]' : 'bg-destructive'}`} />
            <span>Design OS ({runtimeConfig?.ports?.design || 5400})</span>
          </div>
          <div className="h-3 w-[1px] bg-border" />
          <div className="flex items-center gap-2">
            <div className={`w-1.5 h-1.5 rounded-full ${state?.services?.app ? 'bg-success shadow-[0_0_6px_rgba(var(--success))]' : 'bg-destructive'}`} />
            <span>App ({runtimeConfig?.ports?.app || 5402})</span>
          </div>
        </footer>
      </div >
    </IdeContext.Provider>
  );
}

export default App;
