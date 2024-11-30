# 1. Arrêter tous les conteneurs liés au projet
docker stop ferneynails
docker rm ferneynails

# 2. Supprimer l'image
docker rmi ferneynails:latest

# 5. Reconstruire l'image from scratch
docker build --no-cache -t ferneynails:latest .

# 6. Lancer le nouveau conteneur
docker run -d --name ferneynails -p 3001:3001 -p 5173:5173 ferneynails:latest
