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
        <div className="login-wrapper">
            <div className="login-card">
                <div className="login-hero">
                    <div>
                        <div style={{ fontSize: 13, letterSpacing: 1.8, textTransform: 'uppercase', opacity: 0.8, marginBottom: 18 }}>
                            Foot-and-Mouth Disease Control
                        </div>
                        <h1 className="login-hero-title">
                            National operations dashboard
                        </h1>
                        <p style={{ margin: 0, color: 'rgba(255,255,255,0.82)', lineHeight: 1.7, maxWidth: 460 }}>
                            Secure access to outbreak intelligence, quarantine controls, vaccination progress, and livestock traceability.
                        </p>
                    </div>

                    <div className="login-hero-bullets" style={{ display: 'grid', gap: 14 }}>
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

                <div className="login-form-panel">
                    <div className="login-form-inner">
                        <div className="login-tab-bar">
                            <button
                                type="button"
                                className={`login-tab${mode === 'login' ? ' active' : ''}`}
                                onClick={() => { setMode('login'); setError(null); }}
                            >
                                Sign In
                            </button>
                            <button
                                type="button"
                                className={`login-tab${mode === 'register' ? ' active' : ''}`}
                                onClick={() => { setMode('register'); setError(null); }}
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