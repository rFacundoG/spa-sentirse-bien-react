import { useState, useEffect } from 'react';
import { FaUser, FaCreditCard, FaShieldAlt, FaTrash, FaSave, FaPlus, FaCheck, FaSpinner } from 'react-icons/fa';
import Layout from '../../components/Layout';
import { useAuth } from '../../hooks/useAuth';
import { getUserProfile, updateUserProfile } from '../../services/userService';
import '../../styles/ProfilePage.css';

type CreditCard = {
  id: string;
  number: string;
  name: string;
  expiry: string;
  cvc: string;
  isDefault: boolean;
};

export default function ProfilePage() {
  const { currentUser } = useAuth();
  const [activeTab, setActiveTab] = useState('personal');
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  const [userData, setUserData] = useState({
    firstName: '',
    lastName: '',
    dni: '',
    phone: ''
  });

  const [cards, setCards] = useState<CreditCard[]>([]);
  const [newCard, setNewCard] = useState({
    number: '',
    name: '',
    expiry: '',
    cvc: ''
  });

  const [isAddingCard, setIsAddingCard] = useState(false);
  const [professionalRequest, setProfessionalRequest] = useState({
    specialty: '',
    experience: '',
    description: ''
  });

  // Cargar datos del usuario desde Firestore
  useEffect(() => {
    const loadUserProfile = async () => {
      if (currentUser) {
        try {
          setIsLoading(true);
          const profile = await getUserProfile(currentUser.uid);

          if (profile) {
            setUserData({
              firstName: profile.firstName || '',
              lastName: profile.lastName || '',
              dni: profile.dni || '',
              phone: profile.phone || ''
            });
          } else {
            // Si no existe el perfil, creamos uno vacío
            await updateUserProfile(currentUser, {
              firstName: '',
              lastName: '',
              dni: '',
              phone: ''
            });
          }
        } catch (error) {
          console.error('Error loading user profile:', error);
          alert('Error al cargar los datos del perfil');
        } finally {
          setIsLoading(false);
        }
      }
    };

    loadUserProfile();
  }, [currentUser]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setUserData(prev => ({ ...prev, [name]: value }));
  };

  const handleProfessionalChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setProfessionalRequest(prev => ({ ...prev, [name]: value }));
  };

  const handleCardInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewCard(prev => ({ ...prev, [name]: value }));
  };

  const handleSavePersonalData = async () => {
    if (!currentUser) return;

    try {
      setIsSaving(true);
      await updateUserProfile(currentUser, userData);
      alert('Datos personales guardados correctamente');
    } catch (error) {
      console.error('Error saving user profile:', error);
      alert('Error al guardar los datos');
    } finally {
      setIsSaving(false);
    }
  };

  const handleAddCard = () => {
    if (newCard.number && newCard.name && newCard.expiry && newCard.cvc) {
      const cardToAdd: CreditCard = {
        id: Date.now().toString(),
        ...newCard,
        isDefault: cards.length === 0
      };
      setCards([...cards, cardToAdd]);
      setNewCard({ number: '', name: '', expiry: '', cvc: '' });
      setIsAddingCard(false);
      alert('Tarjeta agregada correctamente');
    }
  };

  const handleSetDefaultCard = (id: string) => {
    setCards(cards.map(card => ({
      ...card,
      isDefault: card.id === id
    })));
  };

  const handleDeleteCard = (id: string) => {
    if (cards.find(c => c.id === id)?.isDefault && cards.length > 1) {
      alert('Debes establecer otra tarjeta como predeterminada antes de eliminar esta.');
      return;
    }
    setCards(cards.filter(card => card.id !== id));
  };

  const handleSubmitProfessionalRequest = () => {
    // Lógica para enviar solicitud de profesional
    alert('Solicitud para ser profesional enviada correctamente');
  };

  const handleDeleteAccount = () => {
    if (window.confirm('¿Estás seguro de que deseas eliminar tu cuenta? Esta acción no se puede deshacer.')) {
      // Lógica para eliminar cuenta
      alert('Cuenta eliminada correctamente');
    }
  };

  if (isLoading) {
    return (
      <Layout>
        <div className="profile-page">
          <div className="loading-container">
            <FaSpinner className="spinner" />
            <p>Cargando perfil...</p>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="profile-page">
        <div className="profile-header">
          <h1>Mi Perfil</h1>
          <p>Gestiona tu información personal y preferencias</p>
        </div>

        <div className="profile-container">
          <div className="profile-sidebar">
            <button
              className={`sidebar-tab ${activeTab === 'personal' ? 'active' : ''}`}
              onClick={() => setActiveTab('personal')}
            >
              <FaUser /> Datos Personales
            </button>
            <button
              className={`sidebar-tab ${activeTab === 'professional' ? 'active' : ''}`}
              onClick={() => setActiveTab('professional')}
            >
              <FaUser /> Ser Profesional
            </button>
            <button
              className={`sidebar-tab ${activeTab === 'cards' ? 'active' : ''}`}
              onClick={() => setActiveTab('cards')}
            >
              <FaCreditCard /> Tarjetas
            </button>
            <button
              className={`sidebar-tab ${activeTab === 'security' ? 'active' : ''}`}
              onClick={() => setActiveTab('security')}
            >
              <FaShieldAlt /> Seguridad
            </button>
          </div>

          <div className="profile-content">
            {activeTab === 'personal' && (
              <div className="tab-content">
                <h2>Datos Personales</h2>
                <div className="form-grid">
                  <div className="form-group">
                    <label>Nombre</label>
                    <input
                      type="text"
                      name="firstName"
                      value={userData.firstName}
                      onChange={handleInputChange}
                      placeholder="Ingresa tu nombre"
                    />
                  </div>
                  <div className="form-group">
                    <label>Apellido</label>
                    <input
                      type="text"
                      name="lastName"
                      value={userData.lastName}
                      onChange={handleInputChange}
                      placeholder="Ingresa tu apellido"
                    />
                  </div>
                  <div className="form-group">
                    <label>DNI</label>
                    <input
                      type="text"
                      name="dni"
                      value={userData.dni}
                      onChange={handleInputChange}
                      placeholder="Ingresa tu DNI"
                    />
                  </div>
                  <div className="form-group">
                    <label>Teléfono</label>
                    <input
                      type="tel"
                      name="phone"
                      value={userData.phone}
                      onChange={handleInputChange}
                      placeholder="Ingresa tu teléfono"
                    />
                  </div>
                  <div className="form-group full-width">
                    <label>Email</label>
                    <input
                      type="email"
                      value={currentUser?.email || ''}
                      disabled
                      className="disabled-input"
                      placeholder="Email de tu cuenta"
                    />
                  </div>
                </div>
                <button
                  className="save-btn"
                  onClick={handleSavePersonalData}
                  disabled={isSaving}
                >
                  {isSaving ? <FaSpinner className="spinner" /> : <FaSave />}
                  {isSaving ? 'Guardando...' : 'Guardar Cambios'}
                </button>
              </div>
            )}

            {activeTab === 'professional' && (
              <div className="tab-content">
                <h2>Convertirse en Profesional</h2>
                <p>Completa tu información para ofrecer servicios en nuestra plataforma</p>

                <div className="form-grid">
                  <div className="form-group full-width">
                    <label>Especialidad</label>
                    <select
                      name="specialty"
                      value={professionalRequest.specialty}
                      onChange={handleProfessionalChange}
                    >
                      <option value="">Selecciona tu especialidad</option>
                      <option value="masajes">Masajes</option>
                      <option value="estetica">Estética Facial</option>
                      <option value="spa">Tratamientos Spa</option>
                      <option value="aromaterapia">Aromaterapia</option>
                      <option value="reflexologia">Reflexología</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label>Años de experiencia</label>
                    <input
                      type="number"
                      name="experience"
                      value={professionalRequest.experience}
                      onChange={handleProfessionalChange}
                      min="0"
                      placeholder="0"
                    />
                  </div>

                  <div className="form-group full-width">
                    <label>Descripción profesional</label>
                    <textarea
                      name="description"
                      value={professionalRequest.description}
                      onChange={handleProfessionalChange}
                      rows={4}
                      placeholder="Describe tus habilidades, formación y experiencia..."
                    />
                  </div>
                </div>

                <button className="save-btn" onClick={handleSubmitProfessionalRequest}>
                  <FaCheck /> Enviar Solicitud
                </button>
              </div>
            )}

            {activeTab === 'cards' && (
              <div className="tab-content">
                <h2>Mis Tarjetas</h2>

                {cards.length === 0 ? (
                  <div className="empty-state">
                    <p>No tienes tarjetas registradas</p>
                  </div>
                ) : (
                  <div className="cards-list">
                    {cards.map(card => (
                      <div key={card.id} className={`credit-card ${card.isDefault ? 'default' : ''}`}>
                        <div className="card-info">
                          <div className="card-number">{card.number}</div>
                          <div className="card-details">
                            <span>{card.name}</span>
                            <span>{card.expiry}</span>
                          </div>
                        </div>
                        <div className="card-actions">
                          {!card.isDefault && (
                            <button
                              className="default-btn"
                              onClick={() => handleSetDefaultCard(card.id)}
                            >
                              Establecer como predeterminada
                            </button>
                          )}
                          {card.isDefault && (
                            <span className="default-badge">Predeterminada</span>
                          )}
                          <button
                            className="delete-btn"
                            onClick={() => handleDeleteCard(card.id)}
                          >
                            <FaTrash />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {isAddingCard ? (
                  <div className="add-card-form">
                    <h3>Agregar Nueva Tarjeta</h3>
                    <div className="form-grid">
                      <div className="form-group full-width">
                        <label>Número de tarjeta</label>
                        <input
                          type="text"
                          name="number"
                          value={newCard.number}
                          onChange={handleCardInputChange}
                          placeholder="1234 5678 9012 3456"
                        />
                      </div>
                      <div className="form-group full-width">
                        <label>Nombre del titular</label>
                        <input
                          type="text"
                          name="name"
                          value={newCard.name}
                          onChange={handleCardInputChange}
                          placeholder="Como aparece en la tarjeta"
                        />
                      </div>
                      <div className="form-group">
                        <label>Fecha de expiración</label>
                        <input
                          type="text"
                          name="expiry"
                          value={newCard.expiry}
                          onChange={handleCardInputChange}
                          placeholder="MM/AA"
                        />
                      </div>
                      <div className="form-group">
                        <label>CVC</label>
                        <input
                          type="text"
                          name="cvc"
                          value={newCard.cvc}
                          onChange={handleCardInputChange}
                          placeholder="123"
                        />
                      </div>
                    </div>
                    <div className="form-actions">
                      <button className="cancel-btn" onClick={() => setIsAddingCard(false)}>
                        Cancelar
                      </button>
                      <button className="save-btn" onClick={handleAddCard}>
                        <FaPlus /> Agregar Tarjeta
                      </button>
                    </div>
                  </div>
                ) : (
                  <button
                    className="add-card-btn"
                    onClick={() => setIsAddingCard(true)}
                  >
                    <FaPlus /> Agregar Nueva Tarjeta
                  </button>
                )}
              </div>
            )}

            {activeTab === 'security' && (
              <div className="tab-content">
                <h2>Seguridad de la Cuenta</h2>

                <div className="security-section">
                  <h3>Cambiar Contraseña</h3>
                  <div className="form-grid">
                    <div className="form-group">
                      <label>Contraseña actual</label>
                      <input type="password" placeholder="Ingresa tu contraseña actual" />
                    </div>
                    <div className="form-group">
                      <label>Nueva contraseña</label>
                      <input type="password" placeholder="Ingresa nueva contraseña" />
                    </div>
                    <div className="form-group">
                      <label>Confirmar nueva contraseña</label>
                      <input type="password" placeholder="Confirma nueva contraseña" />
                    </div>
                  </div>
                  <button className="save-btn">Cambiar Contraseña</button>
                </div>

                <div className="security-section danger-zone">
                  <h3>Zona Peligrosa</h3>
                  <p>Una vez que eliminas tu cuenta, no hay vuelta atrás. Por favor, ten certeza.</p>
                  <button className="delete-account-btn" onClick={handleDeleteAccount}>
                    <FaTrash /> Eliminar Mi Cuenta Permanentemente
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
}