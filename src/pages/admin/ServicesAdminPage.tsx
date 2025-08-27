import { useState, useEffect } from 'react';
import Layout from '../../components/Layout';
import { getServices, deleteService } from '../../services/firebase';
import type { Service } from '../../types/service';
import ServiceForm from '../../components/admin/ServiceForm';
import { FaEdit, FaTrash, FaPlus } from 'react-icons/fa';
import '../../styles/admin.css';

export default function ServicesAdminPage() {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingService, setEditingService] = useState<Service | null>(null);
  const [showForm, setShowForm] = useState(false);

  const fetchServices = async () => {
    try {
      const data = await getServices();
      setServices(data as Service[]);
    } catch (error) {
      console.error('Error fetching services:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchServices();
  }, []);

  const handleDelete = async (id: string) => {
    if (confirm('¿Estás seguro de eliminar este servicio?')) {
      try {
        await deleteService(id);
        fetchServices();
      } catch (error) {
        console.error('Error deleting service:', error);
      }
    }
  };

  const handleSuccess = () => {
    setShowForm(false);
    setEditingService(null);
    fetchServices();
  };

  if (loading) return <Layout>Loading...</Layout>;

  return (
    <Layout>
      <div className="admin-container">
        <h1>Administrar Servicios</h1>
        
        <button 
          onClick={() => {
            setEditingService(null);
            setShowForm(true);
          }}
          className="add-btn"
        >
          <FaPlus /> Nuevo Servicio
        </button>

        {showForm && (
          <div className="form-modal">
            <div className="form-content">
              <h2>{editingService ? 'Editar' : 'Agregar'} Servicio</h2>
              <ServiceForm 
                service={editingService} 
                onSuccess={handleSuccess}
              />
              <button 
                onClick={() => {
                  setShowForm(false);
                  setEditingService(null);
                }}
                className="cancel-btn"
              >
                Cancelar
              </button>
            </div>
          </div>
        )}

        <div className="services-list">
          {services.map(service => (
            <div key={service.id} className="service-item">
              <div className="service-info">
                <h3>{service.title}</h3>
                <p>{service.category} • {service.duration} min • ${service.price}</p>
              </div>
              <div className="service-actions">
                <button 
                  onClick={() => {
                    setEditingService(service);
                    setShowForm(true);
                  }}
                  className="edit-btn"
                >
                  <FaEdit />
                </button>
                <button 
                  onClick={() => service.id && handleDelete(service.id)}
                  className="delete-btn"
                >
                  <FaTrash />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Layout>
  );
}