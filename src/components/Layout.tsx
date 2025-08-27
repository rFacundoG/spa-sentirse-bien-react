import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaBars, FaTimes, FaUser, FaSignOutAlt, FaFacebook, FaInstagram, FaWhatsapp, FaTiktok, FaMapMarkerAlt, FaPhone, FaEnvelope, FaClock } from 'react-icons/fa';
import AuthModal from './AuthModal';
import RegisterModal from './RegisterModal'; // Asegúrate de importar RegisterModal
import { useAuth } from '../hooks/useAuth';
import { logoutUser } from '../services/firebase';
import type { PropsWithChildren } from 'react';

type LayoutProps = PropsWithChildren<object>;

export default function Layout({ children }: LayoutProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const { currentUser } = useAuth();

  // Detectar cambios en el tamaño de la pantalla
  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth <= 768;
      setIsMobile(mobile);

      // Cerrar menú al cambiar de móvil a desktop
      if (!mobile && isMenuOpen) {
        setIsMenuOpen(false);
        document.body.style.overflow = 'auto';
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [isMenuOpen]);

  const handleLogout = async () => {
    try {
      await logoutUser();
      if (isMobile) setIsMenuOpen(false);
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
    }
  };

  const toggleMenu = () => {
    const newState = !isMenuOpen;
    setIsMenuOpen(newState);
    document.body.style.overflow = newState ? 'hidden' : 'auto';
  };

  const closeMenu = () => {
    if (isMobile) {
      setIsMenuOpen(false);
      document.body.style.overflow = 'auto';
    }
  };

  return (
    <div className={`layout ${isMenuOpen ? 'menu-open' : ''}`}>
      <header className="main-header">
        <div className="header-content">
          <Link to="/" className="logo" onClick={closeMenu}>
            <div className="logo-container">
              <img src="../logo-white.ico" alt="Logo" className="logo-img" />
              <h1>Spa Sentirse Bien</h1>
            </div>
          </Link>

          {/* Overlay para móvil */}
          {isMenuOpen && isMobile && (
            <div className="nav-overlay" onClick={closeMenu}></div>
          )}

          <nav className={`main-nav ${isMenuOpen ? 'open' : ''}`}>
            <ul className="nav-links">
              <li><Link to="/" onClick={closeMenu}>Inicio</Link></li>
              <li><Link to="/servicios" onClick={closeMenu}>Servicios</Link></li>
              <li><Link to="/contacto" onClick={closeMenu}>Contacto</Link></li>
            </ul>

            <div className="auth-section">
              {currentUser ? (
                <div className="user-menu">
                  <span className="user-greeting">
                    <FaUser /> Hola, {currentUser.displayName || 'Usuario'}
                  </span>
                  <button
                    className="auth-btn logout-btn"
                    onClick={handleLogout}
                  >
                    <FaSignOutAlt /> Cerrar Sesión
                  </button>
                </div>
              ) : (
                <div className="auth-buttons">
                  <button
                    className="auth-btn login-btn"
                    onClick={() => {
                      setIsAuthModalOpen(true);
                      if (isMobile) closeMenu();
                    }}
                  >
                    <FaUser /> Iniciar Sesión
                  </button>
                  <button
                    className="auth-btn signup-btn"
                    onClick={() => {
                      setIsRegisterModalOpen(true);
                      if (isMobile) closeMenu();
                    }}
                  >
                    Crear Cuenta
                  </button>
                </div>
              )}
            </div>
          </nav>

          {/* Botón hamburguesa solo visible en móvil */}
          {isMobile && (
            <button className="menu-toggle" onClick={toggleMenu} aria-label="Menú">
              {isMenuOpen ? <FaTimes /> : <FaBars />}
            </button>
          )}
        </div>
      </header>

      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onSwitchToRegister={() => {
          setIsAuthModalOpen(false);
          setIsRegisterModalOpen(true);
        }}
      />

      <RegisterModal
        isOpen={isRegisterModalOpen}
        onClose={() => setIsRegisterModalOpen(false)}
        onSwitchToLogin={() => {
          setIsRegisterModalOpen(false);
          setIsAuthModalOpen(true);
        }}
      />

      <main>{children}</main>

      <footer className="main-footer">
        <div className="footer-content">
          {/* Sección izquierda: Logo y descripción */}
          <div className="footer-section footer-about">
            <div className="footer-logo">
              <img src="../logo-white.ico" alt="Spa Sentirse Bien" />
              <h3>Spa Sentirse Bien</h3>
            </div>
            <p>Tu lugar de relajación y bienestar en la ciudad. Te ayudamos a encontrar el equilibrio que merecés.</p>
          </div>

          {/* Sección central: Contacto */}
          <div className="footer-section footer-contact">
            <h3>Contacto</h3>
            <div className="contact-info">
              <div className="contact-item">
                <FaMapMarkerAlt />
                <span>Av. Principal 123, Ciudad</span>
              </div>
              <div className="contact-item">
                <FaEnvelope />
                <span>info@spasentirsebien.com</span>
              </div>
              <div className="contact-item">
                <FaPhone />
                <span>+54 11 2345-6789</span>
              </div>
              <div className="contact-item">
                <FaClock />
                <span>Lun a Vie: 9:00 - 20:00 | Sáb: 10:00 - 18:00</span>
              </div>
            </div>
          </div>

          {/* Sección derecha: Redes sociales y newsletter */}
          <div className="footer-section footer-social">
            <h3>Seguinos</h3>
            <div className="social-icons">
              <a href="https://www.facebook.com" target="_blank" rel="noopener noreferrer" aria-label="Facebook"><FaFacebook /></a>
              <a href="https://www.instagram.com" target="_blank" rel="noopener noreferrer" aria-label="Instagram"><FaInstagram /></a>
              <a href="https://www.whatsapp.com" target="_blank" rel="noopener noreferrer" aria-label="WhatsApp"><FaWhatsapp /></a>
              <a href="https://www.tiktok.com" target="_blank" rel="noopener noreferrer" aria-label="TikTok"><FaTiktok /></a>
            </div>

            <div className="newsletter">
              <h4>Novedades</h4>
              <p>Suscríbete para recibir promociones exclusivas.</p>
              <div className="newsletter-form">
                <input
                  type="email"
                  placeholder="Email"
                  className="newsletter-input"
                />
                <button className="newsletter-btn">Suscribirse</button>
              </div>
            </div>
          </div>
        </div>

        {/* Línea separadora */}
        <div className="footer-divider"></div>

        {/* Copyright y enlaces legales */}
        <div className="footer-bottom">
          <p>© 2025 Spa Sentirse Bien. Todos los derechos reservados. | <a href="#">Política de privacidad</a> | <a href="#">Términos de servicio</a></p>
        </div>
      </footer>
    </div>
  );
}