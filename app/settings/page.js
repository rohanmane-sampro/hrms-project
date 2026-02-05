export default function SettingsPage() {
    return (
        <div style={{ maxWidth: '600px' }}>
            <h1 style={{ marginBottom: '2rem' }}>Settings</h1>

            <div className="card flex flex-col gap-6">
                <div>
                    <h3>System Preferences</h3>
                    <p style={{ marginBottom: '1rem' }}>Manage your application settings.</p>

                    <div className="flex justify-between items-center" style={{ padding: '1rem 0', borderBottom: '1px solid var(--border)' }}>
                        <span>Dark Mode (Coming Soon)</span>
                        <button className="btn" disabled style={{ opacity: 0.5 }}>Toggle</button>
                    </div>

                    <div className="flex justify-between items-center" style={{ padding: '1rem 0', borderBottom: '1px solid var(--border)' }}>
                        <span>Email Notifications</span>
                        <input type="checkbox" defaultChecked />
                    </div>
                </div>

                <div>
                    <h3 style={{ color: 'var(--danger)' }}>Danger Zone</h3>
                    <div style={{ marginTop: '1rem', padding: '1rem', backgroundColor: '#FEF2F2', borderRadius: '8px', border: '1px solid #FECACA' }}>
                        <h4>Reset Database</h4>
                        <p style={{ fontSize: '0.875rem', marginBottom: '1rem' }}>This action cannot be undone.</p>
                        <button className="btn" style={{ backgroundColor: 'var(--danger)', color: 'white' }}>Reset All Data</button>
                    </div>
                </div>
            </div>
        </div>
    );
}
