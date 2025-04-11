import React, { createContext, useContext, useState, useEffect } from 'react';

type Language = 'en' | 'fr';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const translations = {
  en: {
    // Navigation
    home: 'Home',
    about: 'About',
    programs: 'Programs',
    campusLife: 'Campus Life',
    hostels: 'Hostels',
    contact: 'Contact',
    login: 'Login',
    applyNow: 'Apply Now',
    
    // Common
    welcome: 'Welcome',
    readMore: 'Read More',
    learnMore: 'Learn More',
    viewDetails: 'View Details',
    submit: 'Submit',
    cancel: 'Cancel',
    save: 'Save',
    delete: 'Delete',
    edit: 'Edit',
    back: 'Back',
    next: 'Next',
    previous: 'Previous',
    search: 'Search',
    
    // Home Page
    heroTitle: 'Welcome to AUST Abuja',
    heroSubtitle: 'Your Gateway to Excellence in Science and Technology',
    featuredPrograms: 'Featured Programs',
    latestNews: 'Latest News',
    upcomingEvents: 'Upcoming Events',
    programsDescription: 'Discover our comprehensive range of undergraduate and postgraduate programs in science and technology.',
    community: 'Join our diverse student body from across Africa, creating a rich cultural learning environment.',
    academicExcellence: 'Academic Excellence',
    academic: 'Award-winning faculty, cutting-edge research, and comprehensive curricula designed for real-world success.',
    careerSupport: 'Career Support',
    career: 'Internship opportunities, career counseling, and strong industry connections to help you launch your career.',
    readyToStart: 'Ready to Start Your Journey?',
    startJourney: 'Take the first step towards your future at AUST Abuja. Apply now and join our community of innovators and leaders.',
    
    // About Page
    aboutTitle: 'About AUST',
    mission: 'Our Mission',
    vision: 'Our Vision',
    values: 'Our Values',
    
    // Programs Page
    undergraduate: 'Undergraduate Programs',
    postgraduate: 'Postgraduate Programs',
    foundation: 'FOUNDATION AND REMEDIAL STUDIES Programs',
    duration: 'Duration',
    requirements: 'Requirements',
    apply: 'Apply Now',
    
    // Campus Life
    studentLife: 'Student Life',
    facilities: 'Facilities',
    activities: 'Activities',
    clubs: 'Clubs & Organizations',
    
    // Contact
    getInTouch: 'Get in Touch',
    address: 'Address',
    phone: 'Phone',
    emailAddress: 'Email',
    sendMessage: 'Send Message',
    
    // Forms
    firstName: 'First Name',
    lastName: 'Last Name',
    emailField: 'Email',
    password: 'Password',
    confirmPassword: 'Confirm Password',
    phoneNumber: 'Phone Number',
    message: 'Message',
    required: 'Required',
    
    // Footer
    quickLinks: 'Quick Links',
    socialMedia: 'Social Media',
    privacyPolicy: 'Privacy Policy',
    termsOfService: 'Terms of Service',
    copyright: '© 2024 AUST Abuja. All rights reserved.',
  },
  fr: {
    // Navigation
    home: 'Accueil',
    about: 'À propos',
    programs: 'Programmes',
    campusLife: 'Vie étudiante',
    hostels: 'Résidences',
    contact: 'Contact',
    login: 'Connexion',
    applyNow: 'Postuler',
    
    // Common
    welcome: 'Bienvenue',
    readMore: 'Lire plus',
    learnMore: 'En savoir plus',
    viewDetails: 'Voir les détails',
    submit: 'Soumettre',
    cancel: 'Annuler',
    save: 'Enregistrer',
    delete: 'Supprimer',
    edit: 'Modifier',
    back: 'Retour',
    next: 'Suivant',
    previous: 'Précédent',
    search: 'Rechercher',
    
    // Home Page
    heroTitle: 'Bienvenue à AUST Abuja',
    heroSubtitle: 'Votre Porte vers l\'Excellence en Science et Technologie',
    featuredPrograms: 'Programmes Vedettes',
    latestNews: 'Dernières Nouvelles',
    upcomingEvents: 'Événements à Venir',
    programsDescription: 'Découvrez notre gamme complète de programmes de premier cycle et de cycle supérieur en science et technologie.',
    community: 'Rejoignez notre corps étudiant diversifié de toute l\'Afrique, créant un environnement d\'apprentissage culturellement riche.',
    academicExcellence: 'Excellence Académique',
    academic: 'Corps professoral primé, recherche de pointe et programmes complets conçus pour le succès dans le monde réel.',
    careerSupport: 'Soutien à la Carrière',
    career: 'Opportunités de stage, conseil en carrière et solides connexions industrielles pour vous aider à lancer votre carrière.',
    readyToStart: 'Prêt à Commencer Votre Voyage ?',
    startJourney: 'Faites le premier pas vers votre avenir à AUST Abuja. Postulez maintenant et rejoignez notre communauté d\'innovateurs et de leaders.',
    
    // About Page
    aboutTitle: 'À propos d\'AUST',
    mission: 'Notre Mission',
    vision: 'Notre Vision',
    values: 'Nos Valeurs',
    
    // Programs Page
    undergraduate: 'Programmes de Premier Cycle',
    postgraduate: 'Programmes de Cycle Supérieur',
    foundation: 'Programmes de FONDATION ET ÉTUDES REMÉDIALES',
    duration: 'Durée',
    requirements: 'Prérequis',
    apply: 'Postuler',
    
    // Campus Life
    studentLife: 'Vie Étudiante',
    facilities: 'Installations',
    activities: 'Activités',
    clubs: 'Clubs et Organisations',
    
    // Contact
    getInTouch: 'Contactez-nous',
    address: 'Adresse',
    phone: 'Téléphone',
    emailAddress: 'Email',
    sendMessage: 'Envoyer un Message',
    
    // Forms
    firstName: 'Prénom',
    lastName: 'Nom',
    emailField: 'Email',
    password: 'Mot de passe',
    confirmPassword: 'Confirmer le mot de passe',
    phoneNumber: 'Numéro de téléphone',
    message: 'Message',
    required: 'Obligatoire',
    
    // Footer
    quickLinks: 'Liens Rapides',
    socialMedia: 'Réseaux Sociaux',
    privacyPolicy: 'Politique de Confidentialité',
    termsOfService: 'Conditions d\'Utilisation',
    copyright: '© 2024 AUST Abuja. Tous droits réservés.',
  },
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>(() => {
    const savedLanguage = localStorage.getItem('language');
    return (savedLanguage as Language) || 'en';
  });

  useEffect(() => {
    localStorage.setItem('language', language);
  }, [language]);

  const t = (key: string): string => {
    return translations[language][key as keyof typeof translations['en']] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}; 