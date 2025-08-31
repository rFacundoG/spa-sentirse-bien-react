import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import {
  FaBars,
  FaTimes,
  FaUser,
  FaSignOutAlt,
  FaUserCircle,
  FaCalendarAlt,
  FaCaretDown,
  FaFacebook,
  FaInstagram,
  FaWhatsapp,
  FaTiktok,
  FaMapMarkerAlt,
  FaPhone,
  FaEnvelope,
  FaClock
} from 'react-icons/fa';
import AuthModal from './AuthModal';
import RegisterModal from './RegisterModal';
import { useAuth } from '../hooks/useAuth';
import { logoutUser } from '../services/firebase';
import type { PropsWithChildren } from 'react';

type LayoutProps = PropsWithChildren<object>;

export default function Layout({ children }: LayoutProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);
  const { currentUser } = useAuth();

  // Detectar cambios en el tamaño de la pantalla
  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth <= 768;
      setIsMobile(mobile);

      if (!mobile && isMenuOpen) {
        setIsMenuOpen(false);
        document.body.style.overflow = 'auto';
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [isMenuOpen]);

  // Cerrar menú de usuario al hacer clic fuera
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setIsUserMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleLogout = async () => {
    try {
      await logoutUser();
      if (isMobile) setIsMenuOpen(false);
      setIsUserMenuOpen(false);
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

  const toggleUserMenu = () => {
    setIsUserMenuOpen(!isUserMenuOpen);
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
                <div className="user-menu-container" ref={userMenuRef}>
                  <div className="user-menu-trigger" onClick={toggleUserMenu}>
                    <span className="user-greeting">
                      <FaUser /> Hola, {currentUser.displayName || 'Usuario'} <FaCaretDown />
                    </span>
                  </div>
                  {isUserMenuOpen && (
                    <div className="user-dropdown-menu">
                      <Link to="/perfil" className="dropdown-item" onClick={() => setIsUserMenuOpen(false)}>
                        <FaUserCircle /> Mi Perfil
                      </Link>
                      <Link to="/turnos" className="dropdown-item" onClick={() => setIsUserMenuOpen(false)}>
                        <FaCalendarAlt /> Mis Turnos
                      </Link>
                      <div className="dropdown-divider"></div>
                      <button className="dropdown-item logout-btn" onClick={handleLogout}>
                        <FaSignOutAlt /> Cerrar Sesión
                      </button>
                    </div>
                  )}
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
          <div className="footer-section footer-about">
            <div className="footer-logo">
              <img src="../logo-white.ico" alt="Spa Sentirse Bien" />
              <h3>Spa Sentirse Bien</h3>
            </div>
            <p>Tu lugar de relajación y bienestar en la ciudad. Te ayudamos a encontrar el equilibrio que merecés.</p>
          </div>

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
                <input type="email" placeholder="Tu email" className="newsletter-input" />
                <button className="newsletter-btn">Suscribirse</button>
              </div>
            </div>
          </div>
        </div>

        <div className="footer-divider"></div>

        <div className="footer-bottom">
          <p>© 2025 Spa Sentirse Bien. Todos los derechos reservados. | <a href="#">Política de privacidad</a> | <a href="#">Términos de servicio</a></p>
        </div>
      </footer>
    </div>
  );
}