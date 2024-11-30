import React from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';

const HomePage: React.FC = () => {
  const { t } = useTranslation();

  return (
    <div>
      <section className="relative bg-white">
        <div className="container mx-auto px-4 py-20">
          <div className="max-w-2xl">
            <h1 className="text-5xl font-bold mb-6">
              {t('hero.title')}
            </h1>
            <p className="text-xl text-gray-600 mb-4">
              {t('hero.subtitle')}
            </p>
            <p className="text-gray-600 mb-8">
              {t('hero.description')}
            </p>
            <Link
              to="/appointments"
              className="inline-block bg-pink-500 text-white px-8 py-3 rounded-full text-lg hover:bg-pink-600 transition-colors"
            >
              {t('hero.bookNow')}
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;