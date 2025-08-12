## Notes de version — Semaine 3 (9 août 2025)

### Points forts

- Intégration de Swiper.js pour l'affichage des cartes de locations
- Système de gestion des catégories de location
- Édition des images de location, pages d'archive (locations et catégories)
- Améliorations globales du style (UI/UX)
- Initialisation des données de catégories de location via l'API
- Ajout du service de location côté UI
- Mise à jour du DTO de location
- Gestion des fichiers de location côté API
- Rework de l'authentification et du profil côté UI, corrections de la page d'accueil
- Dossier `public` Next configuré
- Suppression de l'API Next interne
- Routes API utilisateur pour les fichiers
- Tableau de bord utilisateur (front), édition de profil et page d'accueil
- Intégration et gestion des images
- Backend: locations, commentaires, catégories, fichiers, utilisateurs, auth
- Configuration globale de l'API et typages mis à jour

### Corrections et améliorations

- Résolution des problèmes de prerendering Next.js (AuthProvider)
- Optimisation de la récupération des locations pour éviter les doublons
- Correctifs de build UI
- Correction d'hydratation d'auth
- Correctifs de lint CI et configuration CI

### Qualité et couverture de tests

- 135 tests passants
- Couverture approximative: ~65%
- Sécurité: guards, filtres et middleware testés (JWT, rôles, tokens)

### Mise à niveau / Démarrage

1. Installer les dépendances:

```bash
pnpm install
```

2. Lancer les services (optionnel mais recommandé):
   Créer un fichier `.env` à la racine du projet et copier le contenu de `.env.example` dedans.

```bash
make up
```

```bash
docker compose up -d
```

3. Démarrer:

```bash
pnpm run dev:api
pnpm run dev:ui
```

### Historique récent

#### Semaine 2

- Remplacement de `bcrypt` par `bcryptjs`
- Multiples correctifs de build Vercel et configuration CI
- Réglages Makefile et variables de prod API
- Linting UI et configuration npmrc
- Ré-initialisation de l'état du projet, configuration des ports par défaut
- Mise en place de la base Next.js (contextes, routes, auth) et NestJS (auth, user, config)
- Structuration des packages et imports

#### Semaine 1

- Initialisation des applications Next.js et NestJS
- Mise en place initiale du dépôt

### Remarques

- Voir `readme.md` pour le détail des commandes (`make up/down/reset`, `pnpm run dev:api`, `pnpm run dev:ui`).
- Les contributions sont les bienvenues. Cf. `contributing.md` et `security.md`.
