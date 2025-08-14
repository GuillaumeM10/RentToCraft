![Tests](https://github.com/GuillaumeM10/RentToCraft/actions/workflows/test.yml/badge.svg)
![Lint](https://github.com/GuillaumeM10/RentToCraft/actions/workflows/lint.yml/badge.svg)

# RentToCraft

**Application de location d'outils entre particuliers**

**Application en ligne :** [https://renttocraft-ui.onrender.com/](https://renttocraft-ui.onrender.com/)

## Table des matières

- [Présentation](#présentation)
- [Technologies utilisées](#technologies-utilisées)
- [Architecture](#architecture)
- [Guide d'utilisation](#guide-dutilisation)
- [Base de données](#base-de-données)
- [Installation et développement](#installation-et-développement)
- [Tests et qualité](#tests-et-qualité)
- [Monitoring et outils](#monitoring-et-outils)
- [Changelog](#changelog)
- [Commandes utiles](#commandes-utiles)

## Présentation

RentToCraft est une plateforme web permettant la location d'outils entre particuliers. L'application facilite le partage d'outils en mettant en relation propriétaires et locataires.

### Fonctionnalités principales

- **Authentification sécurisée** avec JWT et gestion des rôles
- **Gestion des locations** avec catégories et commentaires
- **Système de panier** et commandes
- **Upload de fichiers** pour les images de profil et d'outils
- **Interface responsive** adaptée mobile et desktop
- **Système de notifications** par email

## Technologies utilisées

### Backend (API)

- **Framework :** NestJS 10.x avec Express.js
- **Base de données :** PostgreSQL avec TypeORM
- **Authentification :** JWT, Passport.js, bcryptjs
- **Documentation :** Swagger/OpenAPI
- **Tests :** Jest, Supertest

### Frontend (UI)

- **Framework :** Next.js 15.1.4 avec React 19
- **Styling :** Tailwind CSS, Sass
- **PWA :** next-pwa pour les fonctionnalités offline
- **Maps :** Leaflet pour la géolocalisation
- **Monitoring :** Sentry pour le suivi d'erreurs

### DevOps & Qualité

- **Containerisation :** Docker & Docker Compose
- **CI/CD :** GitHub Actions
- **Qualité de code :** ESLint, Prettier, Husky
- **Monitoring :** SonarCloud pour l'analyse statique
- **Package Manager :** pnpm avec workspaces

## Architecture

Le projet suit une architecture monorepo avec les workspaces suivants :

- `apps/api` : API NestJS
- `apps/ui` : Interface Next.js
- `libs/dtos` : DTOs partagés
- `packages/eslint` : Configuration ESLint
- `packages/tsconfig` : Configuration TypeScript

### Schéma de l'architecture de la base de données

![Schéma de la base de données](images/database_schema.png)

## Guide d'utilisation

### Pour les Utilisateurs

#### Créer un compte

1. Accédez à la page d'inscription
2. Remplissez le formulaire avec vos informations
3. Confirmez votre email via le lien reçu
4. Connectez-vous à votre compte

#### Louer un outil

1. Parcourez les outils disponibles
2. Utilisez les filtres par catégorie ou ville
3. Sélectionnez un outil et ajoutez-le au panier
4. Finalisez votre commande
5. Contactez le propriétaire pour organiser la location

#### Gérer son profil

1. Accédez à votre tableau de bord
2. Modifiez vos informations personnelles
3. Uploadez une photo de profil
4. Consultez votre historique de locations

### Pour les Propriétaires d'Outils

#### Publier un outil

1. Connectez-vous à votre compte
2. Accédez à "Mes outils" dans le tableau de bord
3. Cliquez sur "Ajouter un outil"
4. Remplissez les informations (titre, description, prix, catégorie)
5. Uploadez des photos de votre outil
6. Publiez l'annonce

#### Gérer ses locations

1. Consultez les demandes de location reçues
2. Acceptez ou refusez les demandes
3. Suivez l'état de vos locations en cours
4. Récupérez vos outils après location

### Pour les Administrateurs

#### Gestion des utilisateurs

1. Accédez au panneau d'administration
2. Consultez la liste des utilisateurs
3. Modérez les comptes si nécessaire
4. Gérez les signalements

#### Gestion du contenu

1. Modérez les annonces publiées
2. Gérer les catégories d'outils
3. Surveiller les commentaires
4. Maintenir la qualité du contenu

## Base de données

### Schéma de la base de données

```dbml
// Configuration
Project RentToCraft {
  database_type: 'PostgreSQL'
  Note: 'Base de données pour la plateforme de location d\'outils'
}

// Tables principales
Table User {
  id integer [primary key, increment]
  email varchar [unique, not null]
  password varchar [not null]
  firstName varchar [not null]
  lastName varchar [not null]
  phone varchar
  address text
  cityId integer [ref: > City.id]
  role user_role [default: 'user']
  isEmailVerified boolean [default: false]
  profilePictureId integer [ref: > File.id]
  bannerPictureId integer [ref: > File.id]
  isDeleted boolean [default: false]
  createdAt timestamp [default: `now()`]
  updatedAt timestamp [default: `now()`]
}

Table File {
  id integer [primary key, increment]
  filename varchar [not null]
  originalName varchar [not null]
  mimeType varchar [not null]
  size integer [not null]
  path varchar [not null]
  createdAt timestamp [default: `now()`]
  updatedAt timestamp [default: `now()`]
}

Table City {
  id integer [primary key, increment]
  name varchar [not null]
  postalCode varchar [not null]
  latitude decimal
  longitude decimal
  createdAt timestamp [default: `now()`]
  updatedAt timestamp [default: `now()`]
}

Table RentalCat {
  id integer [primary key, increment]
  name varchar [not null]
  slug varchar [unique, not null]
  description text
  icon varchar
  createdAt timestamp [default: `now()`]
  updatedAt timestamp [default: `now()`]
}

Table Rental {
  id integer [primary key, increment]
  title varchar [not null]
  description text [not null]
  price decimal [not null]
  dailyPrice decimal [not null]
  weeklyPrice decimal
  monthlyPrice decimal
  userId integer [ref: > User.id, not null]
  cityId integer [ref: > City.id, not null]
  categoryId integer [ref: > RentalCat.id, not null]
  isAvailable boolean [default: true]
  isDeleted boolean [default: false]
  createdAt timestamp [default: `now()`]
  updatedAt timestamp [default: `now()`]
}

Table RentalComment {
  id integer [primary key, increment]
  content text [not null]
  rating integer [not null]
  userId integer [ref: > User.id, not null]
  rentalId integer [ref: > Rental.id, not null]
  isDeleted boolean [default: false]
  createdAt timestamp [default: `now()`]
  updatedAt timestamp [default: `now()`]
}

Table Cart {
  id integer [primary key, increment]
  userId integer [ref: > User.id, not null]
  createdAt timestamp [default: `now()`]
  updatedAt timestamp [default: `now()`]
}

Table CartItem {
  id integer [primary key, increment]
  cartId integer [ref: > Cart.id, not null]
  rentalId integer [ref: > Rental.id, not null]
  quantity integer [default: 1]
  startDate date [not null]
  endDate date [not null]
  createdAt timestamp [default: `now()`]
  updatedAt timestamp [default: `now()`]
}

Table Order {
  id integer [primary key, increment]
  userId integer [ref: > User.id, not null]
  totalAmount decimal [not null]
  status order_status [default: 'pending']
  createdAt timestamp [default: `now()`]
  updatedAt timestamp [default: `now()`]
}

Table OrderItem {
  id integer [primary key, increment]
  orderId integer [ref: > Order.id, not null]
  rentalId integer [ref: > Rental.id, not null]
  quantity integer [not null]
  startDate date [not null]
  endDate date [not null]
  price decimal [not null]
  createdAt timestamp [default: `now()`]
  updatedAt timestamp [default: `now()`]
}

Table ValidToken {
  id integer [primary key, increment]
  token varchar [unique, not null]
  userId integer [ref: > User.id, not null]
  expiresAt timestamp [not null]
  createdAt timestamp [default: `now()`]
  updatedAt timestamp [default: `now()`]
}

Table TokenResetPassword {
  id integer [primary key, increment]
  token varchar [unique, not null]
  userId integer [ref: > User.id, not null]
  expiresAt timestamp [not null]
  isUsed boolean [default: false]
  createdAt timestamp [default: `now()`]
  updatedAt timestamp [default: `now()`]
}

// Tables du blog
Table Post {
  id integer [primary key, increment]
  title varchar [not null]
  slug varchar [unique, not null]
  content text [not null]
  excerpt text
  authorId integer [ref: > User.id, not null]
  featuredImageId integer [ref: > File.id]
  isPublished boolean [default: false]
  publishedAt timestamp
  isDeleted boolean [default: false]
  createdAt timestamp [default: `now()`]
  updatedAt timestamp [default: `now()`]
}

Table PostCat {
  id integer [primary key, increment]
  name varchar [not null]
  slug varchar [unique, not null]
  description text
  createdAt timestamp [default: `now()`]
  updatedAt timestamp [default: `now()`]
}

Table PostComment {
  id integer [primary key, increment]
  content text [not null]
  authorId integer [ref: > User.id, not null]
  postId integer [ref: > Post.id, not null]
  parentId integer [ref: > PostComment.id]
  isDeleted boolean [default: false]
  createdAt timestamp [default: `now()`]
  updatedAt timestamp [default: `now()`]
}

// Énumérations
Enum user_role {
  user
  admin
}

Enum order_status {
  pending
  confirmed
  completed
  cancelled
}
```

## 🚀 Installation et développement

### Prérequis

- Node.js 20+
- pnpm
- Docker et Docker Compose
- PostgreSQL

### Installation

```bash
# Cloner le repository
git clone https://github.com/GuillaumeM10/RentToCraft.git
cd RentToCraft

# Installer les dépendances
pnpm install

# Démarrer les services avec Docker
make up

# Lancer l'API en mode développement
make api

# Lancer l'UI en mode développement
make ui
```

### Variables d'environnement

Créez les fichiers `.env` nécessaires dans `apps/api` et `apps/ui` en vous basant sur les exemples fournis.

## 🧪 Tests et qualité

### Exécution des tests

```bash
# Tests unitaires
pnpm test

# Tests avec couverture
pnpm test:cov

# Tests E2E
pnpm test:e2e

# Linting
pnpm lint
```

### Couverture de tests

- **135 tests** unitaires et fonctionnels
- **Couverture : ~65%**
- Tests couvrant l'authentification, les CRUD, la sécurité et les middlewares

## 📊 Monitoring et outils

### Sentry

L'application est configurée avec **Sentry** pour le monitoring d'erreurs en temps réel. Cela permet de :

- Détecter et tracer les erreurs en production
- Analyser les performances de l'application
- Recevoir des alertes en cas de problèmes

### SonarCloud

**SonarCloud** est configuré pour l'analyse statique du code et assure :

- La qualité du code avec des métriques détaillées
- La détection de bugs et vulnérabilités
- Le suivi de la dette technique
- L'application des bonnes pratiques

### GitHub Actions

CI/CD automatisé avec :

- Tests automatiques à chaque push
- Linting et vérification de la qualité du code
- Déploiement automatisé

# Changelog

## Week 3

### Feature Highlights

- Add Swiper.js integration for rental cards display
- Add rental categories management system
- Edit rental images, rental archive page, rental cat archive page
- Global style improvements
- API init rentals cats data
- UI add rental service
- Global style updates
- UI rentals cats admin panel, create rental, single rental page
- Update rental DTO
- API rental files
- UI rework auth, profile, home page fixes
- Global style and lint configuration
- Next public folder setup
- Remove Next API
- API user routes for files
- Front user dashboard, edit profile, front page
- Images integration
- Image handling
- Front home page and layout
- Backend rental in file and user
- Backend rental system
- Backend rental comments
- Backend rental categories
- Backend file, user, auth systems
- Main action on push
- Update/create types
- API global configuration

### Fixes and Improvements

- Resolve Next.js build prerendering issues with AuthProvider
- Optimize rental fetching to prevent duplicates
- UI build issues
- Auth hydration issues
- UI lint CI
- Action lint issues
- CI configuration

## Week 2

### Fixes and Improvements

- Build UI DTOs
- UI build issues
- UI package.json
- npmrc configuration
- Remove vercel.json
- Multiple Vercel build fixes
- Replace bcrypt with bcryptjs
- Makefile corrections
- Production API variables
- UI linting issues

### Feature Highlights

0- Reset project state

- Default port configuration
- Setup base Next.js context, routes and authentication
- DTOs as global packages
- API development - auth, user, global config
- Packages and imports structure

## Week 1

### Feature Highlights

- Initialize Next.js application
- Initialize NestJS application
- Initial repository setup

# Cahier de Recettes — C2.3.1

## État de la couverture de tests

**Résultat global :** | **135 tests** | **Couverture : ~65%** | **9 August 2025**

## Tests existants (complets)

| Module / Fonctionnalité       | Fichiers de tests existants                                                          | Type de test   | Ce qui est vérifié actuellement                                     |
| ----------------------------- | ------------------------------------------------------------------------------------ | -------------- | ------------------------------------------------------------------- |
| **Core Application**          | `app.controller.spec.ts`, `app.service.spec.ts`, `main.spec.ts`                      | Unitaire       | Contrôleur principal, service de base, bootstrap de l'application   |
| **Authentification**          | `auth.controller.spec.ts`, `auth.service.spec.ts`                                    | Fonctionnel    | Inscription, connexion, reset password, logout, gestion des tokens  |
| **Guards & Stratégies**       | `jwt-passport.guard.spec.ts`, `roles.guard.spec.ts`, `passport-jwt.strategy.spec.ts` | Sécurité       | Authentification JWT, autorisation par rôles, validation des tokens |
| **Utilisateurs**              | `user.controller.spec.ts`, `user.service.spec.ts`                                    | Fonctionnel    | CRUD utilisateurs, upload profil/bannière, soft delete              |
| **Catégories de location**    | `rental-cat.controller.spec.ts`, `rental-cat.service.spec.ts`                        | Fonctionnel    | CRUD catégories, recherche par slug, données d'initialisation       |
| **Locations**                 | `rental.controller.spec.ts`, `rental.service.spec.ts`                                | Fonctionnel    | CRUD locations, upload fichiers, recherche, filtrage                |
| **Commentaires sur location** | `rental-comment.controller.spec.ts`, `rental-comment.service.spec.ts`                | Fonctionnel    | Ajout, suppression, modification, récupération des commentaires     |
| **Fichiers**                  | `file.controller.spec.ts`, `file.service.spec.ts`                                    | Fonctionnel    | Upload, suppression, récupération, suppression des orphelins        |
| **Gestion des emails**        | `mail.service.spec.ts`, `mail.module.spec.ts`                                        | Fonctionnel    | Envoi emails de confirmation, reset password, gestion des erreurs   |
| **Tokens de validation**      | `valid-token.controller.spec.ts`, `valid-token.service.spec.ts`                      | Sécurité       | Création, validation, suppression des tokens JWT                    |
| **Reset mot de passe**        | `token-reset-password.controller.spec.ts`, `token-reset-password.service.spec.ts`    | Sécurité       | Génération, validation, suppression des tokens de reset             |
| **Middleware & Filtres**      | `logger.middleware.spec.ts`, `global-exception.filter.spec.ts`                       | Infrastructure | Logging des requêtes, gestion globale des exceptions                |
| **Intercepteurs**             | `clean-null.interceptor.spec.ts`, `date-transform.interceptor.spec.ts`               | Infrastructure | Nettoyage des valeurs nulles, transformation des dates              |

## Tests de régression et scénarios critiques couverts

**Authentification & Sécurité**

- Validation des tokens JWT valides et invalides
- Gestion des rôles utilisateur (admin vs user)
- Protection des routes avec guards
- Gestion des tokens de reset de mot de passe

**CRUD Complet**

- Toutes les opérations CRUD pour chaque entité
- Validation des DTOs et erreurs de format
- Gestion des relations entre entités

**Gestion des fichiers**

- Upload et suppression de fichiers
- Validation des types de fichiers
- Nettoyage des fichiers orphelins

**Communication & Emails**

- Envoi d'emails de confirmation
- Gestion des erreurs d'envoi d'emails
- Templates de mails personnalisés

**Robustesse & Exceptions**

- Gestion globale des exceptions
- Logging des requêtes et erreurs
- Transformation et nettoyage des données

## Scénarios de tests d'intégration restants (optionnels)

| Priorité | Scénario                                    | Type        | Complexité |
| -------- | ------------------------------------------- | ----------- | ---------- |
| Haute    | Tests E2E avec base de données réelle       | Intégration | Élevée     |
| Moyenne  | Tests de performance sur large dataset      | Performance | Moyenne    |
| Moyenne  | Tests de sécurité avancés (injection, XSS)  | Sécurité    | Moyenne    |
| Basse    | Tests de stress sur les uploads de fichiers | Performance | Faible     |

## Outils et helpers créés

**`test-helpers/user-mock.helper.ts`**

- Fonctions centralisées pour créer des mocks UserDto, UserEntity, UserUpdateDto
- Assure la cohérence des données de test à travers tous les fichiers
- Réduit la duplication de code dans les tests

## Métriques de qualité

**Tests unitaires :** 135 tests passants
**Couverture globale :** ~65% (cible atteinte)
**Temps d'exécution :** ~11 secondes
**Sécurité :** Guards, filtres et middleware entièrement testés
**Maintenabilité :** Helpers centralisés, mocks réutilisables

### Exemple de test critique couvert

```typescript
// Test de sécurité : validation des tokens JWT
it("should throw UnauthorizedException for invalid token", async () => {
  (validTokenService.findOne as jest.Mock).mockResolvedValue(false);
  await expect(strategy.validate({ email: "user@test.com" })).rejects.toThrow(UnauthorizedException);
});
```

# Commandes utiles

## Make commands

```bash
  # Run all services with docker compose
  "make up",
  # Stop all services with docker compose
  "make down",
  # Reset all services with docker compose
  "make reset",
  # Run api
  "make api",
  "pnpm run dev:api"
  # Run ui
  "make ui",
  "pnpm run dev:ui"
```

## Nest commands

```bash
  # Create a new resource
  "nest g r <name> --no-spec --flat --type rest",
```

## Run ci in local with docker

```bash
  # Run ci in local with docker
  "act",
```
