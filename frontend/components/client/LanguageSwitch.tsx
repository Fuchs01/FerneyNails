import React from 'react';
import { useTranslation } from 'react-i18next';

const LanguageSwitch: React.FC = () => {
  const { i18n } = useTranslation();

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
  };

  return (
    <div className="flex items-center space-x-2">
      <button
        onClick={() => changeLanguage('fr')}
        className={`px-2 py-1 rounded ${i18n.language === 'fr' ? 'bg-pink-500 text-white' : 'text-gray-700'}`}
      >
        FR
      </button>
      <button
        onClick={() => changeLanguage('en')}
        className={`px-2 py-1 rounded ${i18n.language === 'en' ? 'bg-pink-500 text-white' : 'text-gray-700'}`}
      >
        EN
      </button>
    </div>
  );
};

export default LanguageSwitch;