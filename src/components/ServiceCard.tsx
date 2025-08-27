import type { Service } from '../types/service';

import { FaClock, FaMoneyBillWave } from 'react-icons/fa';

interface ServiceCardProps {
  service: Service;
}

export default function ServiceCard({ service }: ServiceCardProps) {
  return (
    <div className="service-card">
      <div
        className="service-image"
        style={{ backgroundImage: `url(${service.image})` }}
      />

      <div className="service-content">
        <h3>{service.title}</h3>
        <p>{service.description}</p>

        <div className="service-meta">
          <span>
            <FaClock /> {service.duration} min
          </span>
          <span>
            <FaMoneyBillWave /> ${service.price}
          </span>
        </div>

        <button className="book-btn">Reservar</button>
      </div>
    </div>
  );
}
