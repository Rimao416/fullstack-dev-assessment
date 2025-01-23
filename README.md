# Seminar Management Application

Ce projet est une solution complète pour la gestion de séminaires, permettant de créer des cours, d'assigner des formateurs, et d'envoyer des notifications par e-mail aux formateurs.

## Fonctionnalités principales
- **Gestion des cours** : création et affichage des cours.
- **Gestion des formateurs** : création et assignation de formateurs aux cours.
- **Notifications** : envoi d'un email au formateur lors de son assignation à un cours.
- **Détection des conflits de planification**.
- **Suggestion du formateur optimal** pour un cours donné.

---

## Prérequis
Avant de commencer, assurez-vous d'avoir les outils suivants installés sur votre machine :
- [Node.js](https://nodejs.org/) (version LTS recommandée)
- [Docker](https://www.docker.com/) et [Docker Compose](https://docs.docker.com/compose/)
- [Git](https://git-scm.com/)

---

## Installation et démarrage

### 1. Cloner le projet
Clonez ce dépôt sur votre machine locale :
```bash
git clone https://github.com/Rimao416/fullstack-dev-assessment.git
cd fullstack-dev-assessment.git
```
# 2. Installer les dépendances

Installez les dépendances nécessaires pour le frontend et le backend.

## Frontend

Allez dans le dossier `frontend` :

```bash
cd frontend
npm install
```

## Backend

Allez dans le dossier `backend` :

```bash
cd backend
npm install
```

# 3. Configurer les fichiers d'environnement

Assurez-vous d'avoir les fichiers `.env` pour le frontend et le backend.

### Exemple de `.env` pour le backend :

```env
DATABASE_URL=mongodb://mongodb:27017/seminar_management
JWT_SECRET=your_jwt_secret
SMTP_HOST=mailhog
SMTP_PORT=1025
SMTP_USER=
SMTP_PASSWORD=
```

### Exemple de `.env` pour le frontend :

```env
NEXT_PUBLIC_API_URL=http://localhost:5000
```

# 4. Lancer l'application avec Docker

À la racine du projet, exécutez la commande suivante pour construire et démarrer les conteneurs Docker :

```bash
docker-compose up --build
```

Cette commande démarre :

- Le frontend (Next.js)
- Le backend (Node.js)
- La base de données (MongoDB ou MySQL)
- Mailhog pour tester les notifications par e-mail

# 5. Tester l'application

Une fois les conteneurs démarrés :

- **Frontend** : [http://localhost:3000](http://localhost:3000)
- **Backend API** : [http://localhost:5000](http://localhost:5000)
- **Mailhog** : [http://localhost:8025](http://localhost:8025)

```

# 6. Créer les données initiales

Assurez-vous que le conteneur Docker du backend est en marche. Ensuite, exécutez la commande suivante pour créer les données initiales :

```bash
docker exec -it test-backend-1 npm run data:create
```

**Remarque :**  

- `test-backend-1` est le nom du conteneur backend par défaut. Si ce n'est pas le cas, vous pouvez vérifier le nom exact du conteneur en utilisant la commande suivante :

```bash
docker ps
```

Cela affichera la liste des conteneurs en cours d'exécution. Identifiez le nom du conteneur backend et remplacez `test-backend-1` par ce nom dans la commande ci-dessus.

Exemple :

```bash
docker exec -it nom_du_conteneur_backend npm run data:create
```

Cela exécutera le script de création des données initiales dans le conteneur backend.
