export default function SettingsPage() {
    return (
        <div className="flex flex-col gap-12 animate-fade-in max-w-4xl">
            <header>
                <h3 className="text-indigo-400">Core Configuration</h3>
                <h1>System Preferences</h1>
                <p className="max-w-md">Manage neural link parameters and structural database integrity.</p>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Visual Settings */}
                <div className="bento-card">
                    <h2 className="text-2xl font-black mb-8 flex items-center gap-4">
                        <div className="w-2 h-8 bg-indigo-600 rounded-full"></div>
                        CORE VISUALS
                    </h2>

                    <div className="flex flex-col gap-6">
                        <div className="flex justify-between items-center p-6 bg-white/5 rounded-2xl border border-white/5 group">
                            <div>
                                <p className="font-black text-white uppercase tracking-tight group-hover:text-indigo-400 transition-all">TERMINAL DARK MODE</p>
                                <span className="text-[10px] font-black uppercase text-gray-500 tracking-[0.2em]">Always active: Nexus v1.0</span>
                            </div>
                            <div className="w-12 h-6 bg-indigo-600/20 rounded-full p-1 border border-indigo-600/30">
                                <div className="w-4 h-4 bg-indigo-600 rounded-full shadow-[0_0_8px_rgba(99,102,241,0.8)]"></div>
                            </div>
                        </div>

                        <div className="flex justify-between items-center p-6 bg-white/5 rounded-2xl border border-white/5 group">
                            <div>
                                <p className="font-black text-white uppercase tracking-tight group-hover:text-cyan-400 transition-all">NEURAL NOTIFICATIONS</p>
                                <span className="text-[10px] font-black uppercase text-gray-500 tracking-[0.2em]">Real-time broadcast sync</span>
                            </div>
                            <input type="checkbox" className="w-6 h-6 rounded-lg bg-white/5 border-white/10 checked:bg-indigo-600 transition-all cursor-pointer" defaultChecked />
                        </div>
                    </div>
                </div>

                {/* Security Settings */}
                <div className="bento-card border-red-600/10">
                    <h2 className="text-2xl font-black mb-8 flex items-center gap-4 text-red-500">
                        <div className="w-2 h-8 bg-red-600 rounded-full"></div>
                        VOID PROTOCOL
                    </h2>

                    <div className="p-8 bg-black/40 rounded-3xl border border-red-600/20">
                        <h4 className="text-lg font-black text-white uppercase mb-2 tracking-tight">TOTAL SYSTEM RESET</h4>
                        <p className="text-sm font-medium text-gray-500 mb-8 leading-relaxed">Initialization of this protocol will permanently wipe all organizational clusters, specialists, and neural broadcast logs.</p>

                        <button className="btn-action bg-red-600/20 text-red-500 hover:bg-red-600 hover:text-white border border-red-600/20 w-full group">
                            <span className="group-hover:animate-ping mr-2">⚠️</span> PURGE ALL DATA
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
