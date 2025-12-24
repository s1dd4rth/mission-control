import './index.css';

function App() {
    return (
        <div className="min-h-screen bg-background text-foreground flex flex-col items-center justify-center p-4">
            <header className="mb-8 text-center">
                <h1 className="text-4xl font-bold tracking-tight mb-2">
                    Your Agent OS App
                </h1>
                <p className="text-muted-foreground">
                    Ready for implementation.
                </p>
            </header>

            <main className="max-w-2xl text-center space-y-4">
                <div className="p-6 border rounded-lg bg-card text-card-foreground shadow-sm">
                    <p>
                        This application is scaffolded and ready.
                        <br />
                        Use the <strong>Control Center</strong> to start shaping features.
                    </p>
                </div>
            </main>
        </div>
    );
}

export default App;
