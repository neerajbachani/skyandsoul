export type NavLink = {
  label: string;
  href: string;
};

export type Category = {
  id: string;
  title: string;
  href: string;
  image: string;
  imageAlt: string;
};

export type Product = {
  id: string;
  name: string;
  price: number;
  href: string;
  image: string;
  imageAlt: string;
  category: string;
};

export type Testimonial = {
  id: string;
  quote: string;
  author: string;
  detail: string;
};

export type ValueProp = {
  id: string;
  title: string;
  description: string;
};
