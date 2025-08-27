import { useState, useEffect } from 'react';
import Layout from '../../components/Layout';
import ServiceCard from '../../components/ServiceCard';
import { getServices } from '../../services/firebase';
import type { Service } from '../../types/service';
import '../../styles/ServicesPage.css';


export default function ServicesPage() {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [category, setCategory] = useState<string>('todos');

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const data = await getServices();
        setServices(data as Service[]);
      } catch (err) {
        setError('Error al cargar servicios');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchServices();
  }, []);

  const categories = ['todos', ...new Set(services.map(s => s.category))];
  const filteredServices = category === 'todos' 
    ? services 
    : services.filter(s => s.category === category);

  if (loading) return <Layout><div className="loading">Cargando...</div></Layout>;
  if (error) return <Layout><div className="error">{error}</div></Layout>;

  return (
    <Layout>
      <div className="services-container">
        <h1 className="services-title">Servicios Individuales</h1>
        
        <div className="category-filters">
          {categories.map(cat => (
            <button
              key={cat}
              className={`category-btn ${category === cat ? 'active' : ''}`}
              onClick={() => setCategory(cat)}
            >
              {cat.charAt(0).toUpperCase() + cat.slice(1)}
            </button>
          ))}
        </div>
        
        <div className="services-grid">
          {filteredServices.map(service => (
            <ServiceCard key={service.id} service={service} />
          ))}
        </div>
      </div>
    </Layout>
  );
}