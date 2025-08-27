import { useState } from 'react';
import { FaTimes, FaEnvelope, FaLock, FaSpinner, FaGoogle, FaMicrosoft } from 'react-icons/fa';
import { loginUser } from '../services/firebase.ts';
import styles from '@/styles/AuthModal.module.css';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSwitchToRegister: () => void;
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

export default function AuthModal({ isOpen, onClose, onSwitchToRegister }: AuthModalProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    email: '',
    password: '',
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
      await loginUser(formData.email, formData.password);
      onClose();
    } catch (error: unknown) {
      if (isFirebaseAuthError(error)) {
        setError(getErrorMessage(error.code));
      } else {
        setError('Ocurrió un error inesperado');
      }
    } finally {
      setLoading(false);
    }
  };

  const getErrorMessage = (code: string) => {
    switch (code) {
      case 'auth/invalid-email':
        return 'Correo electrónico inválido';
      case 'auth/user-not-found':
        return 'Usuario no encontrado';
      case 'auth/wrong-password':
        return 'Contraseña incorrecta';
      default:
        return 'Error al procesar la solicitud';
    }
  };

  if (!isOpen) return null;

  return (
    <div className={styles['auth-modal-overlay']} onClick={onClose}>
      <div className={styles['auth-modal-container']} onClick={(e) => e.stopPropagation()}>
        <div className={styles['auth-modal']}>

          {/* Panel izquierdo - Decoración */}
          <div className={styles['decoration-panel']}>
            <div className={styles['logo-container']}>
              <img src="../logo-white.ico" alt="Logo" className={styles.logo} />
            </div>
            <h2 className={styles.welcome}>Bienvenido a</h2>
            <h1 className={styles.brand}>Spa Sentirse Bien</h1>
            <p className={styles.tagline}>Tu oasis de paz y bienestar</p>
          </div>

          {/* Panel derecho - Formulario */}
          <div className={styles['form-panel']}>
            <button className={styles['close-btn']} onClick={onClose}>
              <FaTimes />
            </button>

            <div className={styles['form-container']}>
              <h2>Iniciar Sesión</h2>
              <p className={styles['form-subtitle']}>
                Ingresa tus credenciales para acceder a tu cuenta
              </p>

              <form className={styles['auth-form']} onSubmit={handleSubmit}>
                {error && (
                  <div className={styles['error-message']}>
                    {error}
                  </div>
                )}

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

                <button
                  type="submit"
                  className={styles['submit-btn']}
                  disabled={loading}
                >
                  {loading ? (
                    <FaSpinner className={styles.spinner} />
                  ) : (
                    'Iniciar Sesión'
                  )}
                </button>
              </form>

              {/* Separador con "o" */}
              <div className={styles.separator}>
                <div className={styles['separator-line']}></div>
                <span className={styles['separator-text']}>o</span>
                <div className={styles['separator-line']}></div>
              </div>

              {/* Botones de redes sociales */}
              <div className={styles['social-login']}>
                <button type="button" className={styles['social-btn-round']}>
                  <FaGoogle />
                </button>
                <button type="button" className={styles['social-btn-round']}>
                  <FaMicrosoft />
                </button>
              </div>

              {/* Enlace para cambiar a registro */}
              <div className={styles['auth-footer']}>
                <p>
                  ¿No tienes cuenta?{' '}
                  <button
                    type="button"
                    className={styles['switch-mode']}
                    onClick={onSwitchToRegister}
                    disabled={loading}
                  >
                    Regístrate aquí
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