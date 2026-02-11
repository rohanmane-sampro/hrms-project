export default function SettingsPage() {
    return (
        <div className="flex flex-col gap-8 animate-fade-in max-w-4xl">
            <header>
                <h3 className="text-gray-500 text-sm font-bold uppercase tracking-wide mb-1">Configuration</h3>
                <h1 className="text-3xl font-bold text-gray-900">System Settings</h1>
                <p className="text-gray-600 max-w-md">Manage application preferences and security settings.</p>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Visual Settings */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                    <h2 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-3">
                        <div className="w-1 h-6 bg-indigo-500 rounded-full"></div>
                        Appearance & Notifications
                    </h2>

                    <div className="flex flex-col gap-4">
                        <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg border border-gray-100">
                            <div>
                                <p className="font-bold text-gray-800 text-sm mb-1">Theme Preference</p>
                                <span className="text-xs font-medium text-gray-500">Currently using Light Mode</span>
                            </div>
                            <div className="px-2 py-1 bg-indigo-50 text-indigo-600 text-xs font-bold rounded border border-indigo-100 uppercase tracking-wide">
                                Light
                            </div>
                        </div>

                        <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg border border-gray-100">
                            <div>
                                <p className="font-bold text-gray-800 text-sm mb-1">Email Notifications</p>
                                <span className="text-xs font-medium text-gray-500">Receive updates via email</span>
                            </div>
                            <input type="checkbox" className="w-5 h-5 rounded text-indigo-600 focus:ring-indigo-500 border-gray-300 cursor-pointer" defaultChecked />
                        </div>
                    </div>
                </div>

                {/* Security Settings */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                    <h2 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-3">
                        <div className="w-1 h-6 bg-red-500 rounded-full"></div>
                        Danger Zone
                    </h2>

                    <div className="p-6 bg-red-50 rounded-xl border border-red-100">
                        <h4 className="text-sm font-bold text-red-800 uppercase mb-2">System Reset</h4>
                        <p className="text-xs font-medium text-red-600 mb-6 leading-relaxed">Permanently delete all data including employees, departments, and records. This action cannot be undone.</p>

                        <button className="w-full py-2.5 bg-white text-red-600 font-bold text-sm rounded-lg border border-red-200 hover:bg-red-50 hover:border-red-300 transition-all flex items-center justify-center gap-2">
                            <span>⚠️</span> Factory Reset
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
