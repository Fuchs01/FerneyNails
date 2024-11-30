import React from 'react';
import { ArrowRight, Calculator, Gift, Star } from 'lucide-react';



const LoyaltyExplanation: React.FC = () => {
  
  


  return (
    <div className="py-12 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h1 className="text-4xl font-extrabold text-gray-900">
            Programme de Fidélité
          </h1>
          <p className="mt-4 text-xl text-gray-600">
            Découvrez comment gagner et utiliser vos points fidélité
          </p>
        </div>

        <div className="mt-16">
          <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            <div className="p-8">
              <div className="flex items-center">
                <Star className="h-8 w-8 text-yellow-400" />
                <h2 className="ml-3 text-2xl font-bold text-gray-900">
                  Comment gagner des points ?
                </h2>
              </div>
              <p className="mt-4 text-lg text-gray-600">
                Pour chaque euro dépensé, vous gagnez 1 point de fidélité.
                Plus vous réservez de services, plus vous accumulez de points !
              </p>
            </div>
          </div>

          <div className="mt-8 grid gap-8 md:grid-cols-2">
            <div className="bg-white rounded-lg shadow-lg overflow-hidden">
              <div className="p-8">
                <div className="flex items-center">
                  <Calculator className="h-8 w-8 text-pink-600" />
                  <h2 className="ml-3 text-2xl font-bold text-gray-900">
                    Option 1 : Cumuler vos points
                  </h2>
                </div>
                
                <div className="mt-6 space-y-4">
                  <div className="flex items-start">
                    <div className="flex-shrink-0">
                      <div className="flex items-center justify-center h-6 w-6 rounded-full bg-pink-100 text-pink-600">
                        1
                      </div>
                    </div>
                    <p className="ml-3 text-gray-600">
                      Gardez vos points pour les cumuler
                    </p>
                  </div>
                  
                  <div className="flex items-start">
                    <div className="flex-shrink-0">
                      <div className="flex items-center justify-center h-6 w-6 rounded-full bg-pink-100 text-pink-600">
                        2
                      </div>
                    </div>
                    <p className="ml-3 text-gray-600">
                      Plus vous avez de points, plus la réduction sera importante en %
                    </p>
                  </div>
                  
                  <div className="flex items-start">
                    <div className="flex-shrink-0">
                      <div className="flex items-center justify-center h-6 w-6 rounded-full bg-pink-100 text-pink-600">
                        3
                      </div>
                    </div>
                    <p className="ml-3 text-gray-600">
                      la reduction sera automatique des 500 points (5%)
                    </p>

                  </div>
                </div>

                <div className="mt-8 p-4 bg-pink-50 rounded-lg">
                  <h3 className="text-lg font-semibold text-pink-900">Exemple :</h3>
                  <div className="mt-2 flex items-center space-x-2">
                    <span className="text-pink-900">1000 points</span>
                    <ArrowRight className="h-4 w-4 text-pink-600" />
                    <span className="text-pink-900">10% de réduction sur tout les prestations</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-lg overflow-hidden">
              <div className="p-8">
                <div className="flex items-center">
                  <Gift className="h-8 w-8 text-pink-600" />
                  <h2 className="ml-3 text-2xl font-bold text-gray-900">
                    Option 2 : Utiliser vos points immédiatement
                  </h2>
                </div>
                
                <div className="mt-6 space-y-4">
                  <div className="flex items-start">
                    <div className="flex-shrink-0">
                      <div className="flex items-center justify-center h-6 w-6 rounded-full bg-pink-100 text-pink-600">
                        1
                      </div>
                    </div>
                    <p className="ml-3 text-gray-600">
                      Convertissez vos points en réduction directe
                    </p>
                  </div>
                  
                  <div className="flex items-start">
                    <div className="flex-shrink-0">
                      <div className="flex items-center justify-center h-6 w-6 rounded-full bg-pink-100 text-pink-600">
                        2
                      </div>
                    </div>
                    <p className="ml-3 text-gray-600">
                      Réduction immédiate sur votre prochain rendez-vous
                    </p>
                  </div>
                  
                  <div className="flex items-start">
                    <div className="flex-shrink-0">
                      <div className="flex items-center justify-center h-6 w-6 rounded-full bg-pink-100 text-pink-600">
                        3
                      </div>
                    </div>
                    <p className="ml-3 text-gray-600">
                      Profitez d'une réduction à chaque visite
                    </p>
                  </div>
                </div>

                <div className="mt-8 p-4 bg-pink-50 rounded-lg">
                  <h3 className="text-lg font-semibold text-pink-900">Exemple :</h3>
                  <div className="mt-2 flex items-center space-x-2">
                    <span className="text-pink-900">500 points</span>
                    <ArrowRight className="h-4 w-4 text-pink-600" />
                    <span className="text-pink-900">5€ de réduction</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-8 bg-white rounded-lg shadow-lg overflow-hidden">
            <div className="p-8">
              <h2 className="text-2xl font-bold text-gray-900">
                Conditions d'utilisation
              </h2>
              <ul className="mt-4 space-y-2 text-gray-600">
                <li className="flex items-center">
                  <div className="h-2 w-2 rounded-full bg-pink-600 mr-2"></div>
                  Les points sont valables pendant 1 an à partir de la date d'acquisition
                </li>
                <li className="flex items-center">
                  <div className="h-2 w-2 rounded-full bg-pink-600 mr-2"></div>
                  La réduction maximale ne peut pas dépasser 50% du montant total de la prestation
                </li>
                <li className="flex items-center">
                  <div className="h-2 w-2 rounded-full bg-pink-600 mr-2"></div>
                  Les points ne sont pas transférables
                </li>
                <li className="flex items-center">
                  <div className="h-2 w-2 rounded-full bg-pink-600 mr-2"></div>
                  Les points ne peuvent pas être convertis en espèces
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
  };
  
  export default LoyaltyExplanation;