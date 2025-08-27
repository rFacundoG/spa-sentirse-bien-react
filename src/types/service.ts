export interface Service {
  id?: string;
  title: string;
  description: string;
  duration: number;
  price: number;
  category: string;
  image: string;
  isActive?: boolean;
  createdAt?: Date;
}
