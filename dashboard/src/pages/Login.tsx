import React, { useMemo, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { loginUser, registerUser } from '../services/api';
import { setCredentials } from '../store';

type AuthMode = 'login' | 'register';

const roleOptions = [
    { value: 'authority', label: 'Government Authority' },
    { value: 'admin', label: 'Administrator' },
    { value: 'veterinarian', label: 'Veterinarian' },
    { value: 'farmer', label: 'Farmer' },
    { value: 'regulator', label: 'Regulator' },
    { value: 'vaccine_distributor', label: 'Vaccine Distributor' },
    { value: 'transporter', label: 'Transporter' },
];

const inputStyle: React.CSSProperties = {
    width: '100%',
    padding: '12px 14px',
    borderRadius: 10,
    border: '1px solid #cbd5e1',
    fontSize: 14,
    boxSizing: 'border-box',
};

const labelStyle: React.CSSProperties = {
    display: 'block',
    marginBottom: 6,
    fontSize: 13,
    fontWeight: 600,
    color: '#334155',
};

const Login: React.FC = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [mode, setMode] = useState<AuthMode>('login');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [form, setForm] = useState({
        username: '',
        email: '',
        password: '',
        confirmPassword: '',
        phone: '',
        role: 'authority',
    });

    const heading = useMemo(
        () => mode === 'login' ? 'Sign in to continue' : 'Create an access account',
        [mode]
    );

    const updateField = (field: string, value: string) => {
        setForm((current) => ({ ...current, [field]: value }));
    };

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setError(null);

        if (mode === 'register' && form.password !== form.confirmPassword) {
            setError('Passwords do not match.');
            return;
        }

        try {
            setLoading(true);

            const response = mode === 'login'
                ? await loginUser(form.email, form.password)
                : await registerUser({
                    username: form.username,
                    email: form.email,
                    password: form.password,
                    phone: form.phone || undefined,
                    role: form.role,
                });

            dispatch(setCredentials({ user: response.user, token: response.token }));
            navigate('/dashboard', { replace: true });
        } catch (err: any) {
            setError(err?.response?.data?.message || 'Authentication failed.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: 24,
            background: 'linear-gradient(135deg, #eff6ff 0%, #f8fafc 50%, #ecfeff 100%)',
        }}>
            <div style={{
                width: '100%',
                maxWidth: 1080,
                display: 'grid',
                gridTemplateColumns: '1.1fr 0.9fr',
                background: '#ffffff',
                borderRadius: 24,
                overflow: 'hidden',
                boxShadow: '0 24px 60px rgba(15, 23, 42, 0.14)',
            }}>
                <div style={{
                    padding: 48,
                    background: 'linear-gradient(160deg, #0f172a 0%, #1d4ed8 100%)',
                    color: '#ffffff',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    gap: 24,
                }}>
                    <div>
                        <div style={{ fontSize: 13, letterSpacing: 1.8, textTransform: 'uppercase', opacity: 0.8, marginBottom: 18 }}>
                            Foot-and-Mouth Disease Control
                        </div>
                        <h1 style={{ fontSize: 40, lineHeight: 1.1, margin: '0 0 16px' }}>
                            National operations dashboard
                        </h1>
                        <p style={{ margin: 0, color: 'rgba(255,255,255,0.82)', lineHeight: 1.7, maxWidth: 460 }}>
                            Secure access to outbreak intelligence, quarantine controls, vaccination progress, and livestock traceability.
                        </p>
                    </div>

                    <div style={{ display: 'grid', gap: 14 }}>
                        {[
                            'Monitor live outbreak metrics and heatmap activity.',
                            'Coordinate incident response, permits, and quarantine actions.',
                            'Access role-based features for authorities, veterinarians, and administrators.',
                        ].map((item) => (
                            <div key={item} style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
                                <div style={{
                                    width: 24,
                                    height: 24,
                                    borderRadius: 999,
                                    background: 'rgba(255,255,255,0.18)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    flexShrink: 0,
                                }}>
                                    ✓
                                </div>
                                <span style={{ color: 'rgba(255,255,255,0.88)', lineHeight: 1.5 }}>{item}</span>
                            </div>
                        ))}
                    </div>
                </div>

                <div style={{ padding: 40, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <div style={{ width: '100%', maxWidth: 380 }}>
                        <div style={{ display: 'flex', gap: 8, marginBottom: 24, background: '#f1f5f9', padding: 6, borderRadius: 12 }}>
                            <button
                                type="button"
                                onClick={() => {
                                    setMode('login');
                                    setError(null);
                                }}
                                style={{
                                    flex: 1,
                                    border: 0,
                                    borderRadius: 8,
                                    padding: '10px 14px',
                                    background: mode === 'login' ? '#ffffff' : 'transparent',
                                    color: '#0f172a',
                                    fontWeight: 700,
                                    cursor: 'pointer',
                                    boxShadow: mode === 'login' ? '0 2px 8px rgba(15,23,42,0.08)' : 'none',
                                }}
                            >
                                Sign In
                            </button>
                            <button
                                type="button"
                                onClick={() => {
                                    setMode('register');
                                    setError(null);
                                }}
                                style={{
                                    flex: 1,
                                    border: 0,
                                    borderRadius: 8,
                                    padding: '10px 14px',
                                    background: mode === 'register' ? '#ffffff' : 'transparent',
                                    color: '#0f172a',
                                    fontWeight: 700,
                                    cursor: 'pointer',
                                    boxShadow: mode === 'register' ? '0 2px 8px rgba(15,23,42,0.08)' : 'none',
                                }}
                            >
                                Register
                            </button>
                        </div>

                        <h2 style={{ margin: '0 0 8px', fontSize: 28, color: '#0f172a' }}>{heading}</h2>
                        <p style={{ margin: '0 0 28px', color: '#64748b', lineHeight: 1.6 }}>
                            {mode === 'login'
                                ? 'Use your existing credentials to unlock protected dashboard data.'
                                : 'Create an account to access protected API routes and dashboard features.'}
                        </p>

                        <form onSubmit={handleSubmit} style={{ display: 'grid', gap: 16 }}>
                            {mode === 'register' && (
                                <div>
                                    <label htmlFor="username" style={labelStyle}>Username</label>
                                    <input
                                        id="username"
                                        type="text"
                                        value={form.username}
                                        onChange={(event) => updateField('username', event.target.value)}
                                        style={inputStyle}
                                        required
                                    />
                                </div>
                            )}

                            <div>
                                <label htmlFor="email" style={labelStyle}>Email</label>
                                <input
                                    id="email"
                                    type="email"
                                    value={form.email}
                                    onChange={(event) => updateField('email', event.target.value)}
                                    style={inputStyle}
                                    required
                                />
                            </div>

                            {mode === 'register' && (
                                <div>
                                    <label htmlFor="role" style={labelStyle}>Role</label>
                                    <select
                                        id="role"
                                        value={form.role}
                                        onChange={(event) => updateField('role', event.target.value)}
                                        style={inputStyle}
                                    >
                                        {roleOptions.map((role) => (
                                            <option key={role.value} value={role.value}>{role.label}</option>
                                        ))}
                                    </select>
                                </div>
                            )}

                            {mode === 'register' && (
                                <div>
                                    <label htmlFor="phone" style={labelStyle}>Phone</label>
                                    <input
                                        id="phone"
                                        type="tel"
                                        value={form.phone}
                                        onChange={(event) => updateField('phone', event.target.value)}
                                        style={inputStyle}
                                    />
                                </div>
                            )}

                            <div>
                                <label htmlFor="password" style={labelStyle}>Password</label>
                                <input
                                    id="password"
                                    type="password"
                                    value={form.password}
                                    onChange={(event) => updateField('password', event.target.value)}
                                    style={inputStyle}
                                    required
                                />
                            </div>

                            {mode === 'register' && (
                                <div>
                                    <label htmlFor="confirmPassword" style={labelStyle}>Confirm password</label>
                                    <input
                                        id="confirmPassword"
                                        type="password"
                                        value={form.confirmPassword}
                                        onChange={(event) => updateField('confirmPassword', event.target.value)}
                                        style={inputStyle}
                                        required
                                    />
                                </div>
                            )}

                            {error && (
                                <div style={{
                                    padding: '12px 14px',
                                    borderRadius: 10,
                                    background: '#fef2f2',
                                    color: '#b91c1c',
                                    fontSize: 14,
                                }}>
                                    {error}
                                </div>
                            )}

                            <button
                                type="submit"
                                disabled={loading}
                                style={{
                                    marginTop: 8,
                                    border: 0,
                                    borderRadius: 12,
                                    padding: '14px 18px',
                                    background: '#2563eb',
                                    color: '#ffffff',
                                    fontWeight: 700,
                                    fontSize: 15,
                                    cursor: loading ? 'wait' : 'pointer',
                                    opacity: loading ? 0.8 : 1,
                                }}
                            >
                                {loading ? 'Please wait...' : mode === 'login' ? 'Sign In' : 'Create Account'}
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;