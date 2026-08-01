// Configuración centralizada de datos para Betech Boutique
// Los placeholders están claramente marcados para fácil reemplazo

export const siteConfig = {
  // Brand
  brand: {
    name: 'BETECH',
    subtitle: 'BOUTIQUE',
  },

  // Contacto - PLACEHOLDER: Reemplazar con datos reales
  contact: {
    phone: '+54 9 11 3632 7076',
    whatsapp: 'https://wa.me/5491136327076',
    email: 'hello@betech.com', // PLACEHOLDER
    instagram: 'https://instagram.com/betechboutique', // PLACEHOLDER
    facebook: 'https://facebook.com/betechboutique', // PLACEHOLDER
    tiktok: 'https://tiktok.com/@betechboutique', // PLACEHOLDER
  },

  // Hero section
  hero: {
    topText: 'TECNOLOGÍA. DISEÑO. CONFIANZA.',
    title: 'Elegimos tecnología\npara disfrutarla\ntodos los días.',
    subtitle: 'Productos seleccionados, asesoramiento real y envíos a todo el país.\nAsí de simple.',
    cta1: {
      text: 'Explorar categorías',
      href: '#categorias',
      style: 'primary',
    },
    cta2: {
      text: 'Descubrir el Drop',
      href: '#drop',
      style: 'secondary',
    },
    image: {
      desktop: '/images/hero/hero-home-desktop.jpeg',
      mobile: '/images/hero/hero-home-mobile.jpeg',
      alt: 'Living premium con tecnología curada - sofá, TV, ciudad, Empire State',
    },
  },

  // Hero para perfil revendedores (reemplazar imágenes por banner gremio)
  heroResellers: {
    topText: 'TECNOLOGIA PARA REVENDEDORES',
    title: 'Catalogo exclusivo\npara revendedores',
    subtitle: 'Mismo portfolio, precios para tu canal y actualizacion constante desde Master.',
    cta1: {
      text: 'Explorar categorias',
      href: '#categorias',
      style: 'primary',
    },
    cta2: {
      text: 'Descubrir el Drop',
      href: '#drop',
      style: 'secondary',
    },
    image: {
      desktop: '/images/hero/hero-revendedores-desktop.jpeg',
      mobile: '/images/hero/hero-revendedores-desktop.jpeg',
      alt: 'Banner de catalogo para revendedores',
    },
  },

  // Categorías
  categories: [
    {
      id: 'celulares',
      name: 'Celulares',
      icon: '📱',
      image: '/images/categories/celulares/cover.jpeg',
    },
    {
      id: 'tecnologia',
      name: 'Tecnología',
      icon: '💻',
      image: '/images/categories/tecnologia/cover.jpeg',
    },
    {
      id: 'climatizacion',
      name: 'Climatización',
      icon: '❄️',
      image: '/images/categories/climatizacion/cover.jpeg',
    },
    {
      id: 'lavado',
      name: 'Lavado',
      icon: '🧺',
      image: '/images/categories/lavado/cover.jpeg',
    },
    {
      id: 'pequenos-electrodomesticos',
      name: 'Pequeños Electrodomésticos',
      icon: '☕',
      image: '/images/categories/pequenos-electrodomesticos/cover.jpeg',
    },
  ],

  // Categorías adicionales (pantalla de categorías expandida)
  allCategories: [
    {
      id: 'tv-audio',
      name: 'TV & Audio',
      icon: '📺',
      image: '/images/categories/tv-audio/cover.jpeg',
    },
    {
      id: 'heladeras-freezer',
      name: 'Heladeras & Freezer',
      icon: '❄️',
      image: '/images/categories/heladeras-freezer/cover.jpeg',
    },
    {
      id: 'cocina',
      name: 'Cocina',
      icon: '🍳',
      image: '/images/categories/cocina/cover.jpeg',
    },
    {
      id: 'bazar',
      name: 'Bazar',
      icon: '🛍️',
      image: '/images/categories/bazar/cover.jpeg',
    },
  ],

  // Drop de la semana
  drop: {
    title: 'DROP DE LA SEMANA',
    viewMoreText: 'Ver Drop',
    dropNumber: 'DROP 01',
    dropDescription:
      'Esta semana elegimos\nproductos que vale la pena descubrir.',
    ctaText: 'Descubrir el Drop',
    ctaHref: '#drop',
    // PLACEHOLDER: Estos son datos temporales de demostración
    products: [
      {
        id: 'iphone-15',
        name: 'iPhone 15 128GB',
        price: 999,
        currency: 'USD',
        image: '/images/placeholders/product-placeholder.svg',
      },
      {
        id: 'dell-xps',
        name: 'Dell XPS 13 Plus',
        price: 1299,
        currency: 'USD',
        image: '/images/placeholders/product-placeholder.svg',
      },
      {
        id: 'sonos-arc',
        name: 'Sonos Arc SL',
        price: 799,
        currency: 'USD',
        image: '/images/placeholders/product-placeholder.svg',
      },
      {
        id: 'apple-watch',
        name: 'Apple Watch Series 9',
        price: 399,
        currency: 'USD',
        image: '/images/placeholders/product-placeholder.svg',
      },
    ],
    // Imagen editorial del lado izquierdo
    editorialImage: '/images/drop/editorial/cover.jpg',
  },

  // Marcas
  brands: [
    { id: 'apple', name: 'Apple', logo: '🍎' },
    { id: 'lenovo', name: 'Lenovo', logo: '💻' },
    { id: 'lg', name: 'LG', logo: '📺' },
    { id: 'candy', name: 'Candy', logo: '🔴' },
    { id: 'kitchenaid', name: 'KitchenAid', logo: '🥘' },
    { id: 'cuisinart', name: 'Cuisinart', logo: '⚙️' },
  ],

  // Equipo
  team: {
    title: 'Asesoramiento real,\npersonas reales.',
    description:
      'Nuestro equipo acompaña cada consulta para asegurar que encuentres exactamente lo que necesitas. Sin presión, con total transparencia.',
    ctaText: 'Hablar con el equipo',
    ctaHref: '#contact', // Se vinculará a WhatsApp
    image: '/images/team.jpg', // PLACEHOLDER
    imageAlt: 'Equipo de Betech',
  },

  // Beneficios
  benefits: [
    {
      id: 'warranty',
      title: 'Garantía oficial',
      description: 'Productos con respaldo oficial de marca.',
      icon: '✓',
    },
    {
      id: 'delivery',
      title: 'Entregas en todo el país',
      description: 'Envío seguro a cualquier parte del territorio nacional.',
      icon: '📦',
    },
    {
      id: 'experience',
      title: '15 años en el mercado',
      description: 'Trayectoria sólida y experiencia en el rubro tecnológico.',
      icon: '🏆',
    },
    {
      id: 'support',
      title: 'Asesoramiento personalizado',
      description: 'Equipo disponible para guiar tu decisión de compra.',
      icon: '👥',
    },
  ],

  // Footer
  footer: {
    description:
      'Tecnología, diseño y productos elegidos para vos. Asesoramiento real de personas reales.',
    links: {
      main: [
        { label: 'Preguntas frecuentes', href: '#faq' },
        { label: 'Términos y condiciones', href: '#terms' },
        { label: 'Política de privacidad', href: '#privacy' },
      ],
      legal: [
        { label: 'Cambios y devoluciones', href: '#changes' },
        { label: 'Cómo compramos', href: '#how' },
      ],
    },
    copyright: '© 2026 Betech Boutique. Todos los derechos reservados.',
  },

  // Navegación mobile inferior
  mobileNav: [
    { label: 'Inicio', icon: '🏠', href: '#' },
    { label: 'Categorías', icon: '📂', href: '#categorias' },
    { label: 'Drop', icon: '✨', href: '#drop' },
    { label: 'Consulta', icon: '💬', href: '#contact' },
  ],
};
