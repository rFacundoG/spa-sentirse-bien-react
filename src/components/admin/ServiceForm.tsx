import { useState } from 'react';
import type { Service } from '../../types/service';
import { addService, updateService } from '../../services/firebase';
import { FaUpload } from 'react-icons/fa';

interface ServiceFormProps {
  service?: Service | null;
  onSuccess: () => void;
}

export default function ServiceForm({ service, onSuccess }: ServiceFormProps) {
  const [formData, setFormData] = useState<Omit<Service, 'id'>>({
    title: service?.title || '',
    description: service?.description || '',
    duration: service?.duration || 60,
    price: service?.price || 0,
    category: service?.category || 'masajes',
    image: service?.image || '',
    isActive: service?.isActive ?? true
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (service?.id) {
        await updateService(service.id, formData);
      } else {
        await addService(formData);
      }
      onSuccess();
    } catch (error) {
      console.error('Error saving service:', error);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'duration' || name === 'price' ? Number(value) : value
    }));
  };

  return (
    <form onSubmit={handleSubmit} className="service-form">
      <div className="form-group">
        <label>Nombre del servicio</label>
        <input
          type="text"
          name="name"
          value={formData.title}
          onChange={handleChange}
          required
        />
      </div>

      <div className="form-group">
        <label>Descripción</label>
        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          required
          rows={4}
        />
      </div>

      <div className="form-row">
        <div className="form-group">
          <label>Duración (minutos)</label>
          <input
            type="number"
            name="duration"
            value={formData.duration}
            onChange={handleChange}
            required
            min="15"
            step="15"
          />
        </div>

        <div className="form-group">
          <label>Precio ($)</label>
          <input
            type="number"
            name="price"
            value={formData.price}
            onChange={handleChange}
            required
            min="0"
          />
        </div>
      </div>

      <div className="form-group">
        <label>Categoría</label>
        <select
          name="category"
          value={formData.category}
          onChange={handleChange}
          required
        >
          <option value="masajes">Masajes</option>
          <option value="faciales">Faciales</option>
          <option value="corporales">Tratamientos corporales</option>
          <option value="especiales">Servicios especiales</option>
        </select>
      </div>

      <div className="form-group">
        <label>URL de la imagen</label>
        <input
          type="text"
          name="image"
          value={formData.image}
          onChange={handleChange}
          required
        />
        {formData.image && (
          <div className="image-preview">
            <img src={formData.image} alt="Vista previa" />
          </div>
        )}
      </div>

      <button type="submit" className="submit-btn">
        <FaUpload /> {service?.id ? 'Actualizar' : 'Guardar'} Servicio
      </button>
    </form>
  );
}