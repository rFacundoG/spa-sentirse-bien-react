import { useState } from 'react';
import { FaTimes, FaUser, FaEnvelope, FaLock, FaSpinner } from 'react-icons/fa';
import { registerUser } from '../services/firebase.ts';
import styles from '@/styles/AuthModal.module.css';

interface RegisterModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSwitchToLogin: () => void;
}

interface FirebaseAuthError {
    code: string;
    message: string;
}

function isFirebaseAuthError(error: unknown): error is FirebaseAuthError {
    return (
        typeof error === 'object' &&
        error !== null &&
        'code' in error &&
        typeof (error as Record<string, unknown>).code === 'string'
    );
}

export default function RegisterModal({ isOpen, onClose, onSwitchToLogin }: RegisterModalProps) {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: ''
    });

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData(prev => ({
            ...prev,
            [e.target.name]: e.target.value
        }));
        setError('');
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            if (formData.password !== formData.confirmPassword) {
                throw new Error('Las contraseñas no coinciden');
            }
            await registerUser(formData.email, formData.password, formData.name);
            onClose();
        } catch (error: unknown) {
            if (isFirebaseAuthError(error)) {
                setError(getErrorMessage(error.code));
            } else if (error instanceof Error) {
                setError(error.message);
            } else {
                setError('Ocurrió un error inesperado');
            }
        } finally {
            setLoading(false);
        }
    };

    const getErrorMessage = (code: string) => {
        switch (code) {
            case 'auth/email-already-in-use':
                return 'Este correo ya está registrado';
            case 'auth/invalid-email':
                return 'Correo electrónico inválido';
            case 'auth/weak-password':
                return 'La contraseña debe tener al menos 6 caracteres';
            default:
                return 'Error al procesar la solicitud';
        }
    };

    if (!isOpen) return null;

    return (
        <div className={styles['auth-modal-overlay']} onClick={onClose}>
            <div className={styles['auth-modal-container']} onClick={(e) => e.stopPropagation()}>
                <div className={styles['auth-modal']}>

                    {/* Panel izquierdo - Decoración para registro */}
                    <div className={styles['decoration-panel']} style={{ background: 'linear-gradient(135deg, #8C6E5F 0%, #C1A18F 100%)' }}>
                        <div className={styles['logo-container']}>
                            <img src="../logo-white.ico" alt="Logo" className={styles.logo} />
                        </div>
                        <h2 className={styles.welcome}>Únete a</h2>
                        <h1 className={styles.brand}>Spa Sentirse Bien</h1>
                        <p className={styles.tagline}>Comienza tu viaje hacia el bienestar</p>
                    </div>

                    {/* Panel derecho - Formulario */}
                    <div className={styles['form-panel']}>
                        <button className={styles['close-btn']} onClick={onClose}>
                            <FaTimes />
                        </button>

                        <div className={styles['form-container']}>
                            <h2>Crear Cuenta</h2>
                            <p className={styles['form-subtitle']}>
                                Completa tus datos para crear una cuenta
                            </p>

                            <form className={styles['auth-form']} onSubmit={handleSubmit}>
                                {error && (
                                    <div className={styles['error-message']}>
                                        {error}
                                    </div>
                                )}

                                <div className={styles['input-container']}>
                                    <input
                                        type="text"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleInputChange}
                                        required
                                        disabled={loading}
                                    />
                                    <label className={formData.name ? styles.focused : ''}>Nombre completo</label>
                                    <FaUser className={styles['input-icon']} />
                                </div>

                                <div className={styles['input-container']}>
                                    <input
                                        type="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleInputChange}
                                        required
                                        disabled={loading}
                                    />
                                    <label className={formData.email ? styles.focused : ''}>Correo electrónico</label>
                                    <FaEnvelope className={styles['input-icon']} />
                                </div>

                                <div className={styles['input-container']}>
                                    <input
                                        type="password"
                                        name="password"
                                        value={formData.password}
                                        onChange={handleInputChange}
                                        required
                                        disabled={loading}
                                        minLength={6}
                                    />
                                    <label className={formData.password ? styles.focused : ''}>Contraseña</label>
                                    <FaLock className={styles['input-icon']} />
                                </div>

                                <div className={styles['input-container']}>
                                    <input
                                        type="password"
                                        name="confirmPassword"
                                        value={formData.confirmPassword}
                                        onChange={handleInputChange}
                                        required
                                        disabled={loading}
                                        minLength={6}
                                    />
                                    <label className={formData.confirmPassword ? styles.focused : ''}>Confirmar contraseña</label>
                                    <FaLock className={styles['input-icon']} />
                                </div>

                                <button
                                    type="submit"
                                    className={styles['submit-btn']}
                                    disabled={loading}
                                >
                                    {loading ? (
                                        <FaSpinner className={styles.spinner} />
                                    ) : (
                                        'Crear Cuenta'
                                    )}
                                </button>
                            </form>

                            
                            {/* Enlace para cambiar a login */}
                            <div className={styles['auth-footer-register']}>
                                <p>
                                    ¿Ya tienes cuenta?{' '}
                                    <button
                                        type="button"
                                        className={styles['switch-mode']}
                                        onClick={onSwitchToLogin}
                                        disabled={loading}
                                    >
                                        Inicia sesión aquí
                                    </button>
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}