![Tests](https://github.com/GuillaumeM10/RentToCraft/actions/workflows/test.yml/badge.svg)
![Lint](https://github.com/GuillaumeM10/RentToCraft/actions/workflows/lint.yml/badge.svg)

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


# 📋 Cahier de Recettes — C2.3.1


## Tests existants

| Module / Fonctionnalité         | Fichiers de tests existants                                      | Type de test      | Ce qui est vérifié actuellement                                      |
|---------------------------------|------------------------------------------------------------------|-------------------|---------------------------------------------------------------------|
| **Authentification**            | `auth.controller.spec.ts`, `auth.service.spec.ts`                | Fonctionnel       | Inscription, connexion, reset password, logout, gestion des tokens  |
| **Catégories de location**      | `rental-cat.controller.spec.ts`, `rental-cat.service.spec.ts`    | Fonctionnel       | CRUD catégories, recherche par slug                                 |
| **Locations**                   | `rental.controller.spec.ts`, `rental.service.spec.ts`            | Fonctionnel       | CRUD locations, upload fichiers, recherche, filtrage                |
| **Commentaires sur location**   | `rental-comment.controller.spec.ts`, `rental-comment.service.spec.ts` | Fonctionnel  | Ajout, suppression, modification, récupération des commentaires     |
| **Fichiers**                    | `file.controller.spec.ts`, `file.service.spec.ts`                | Fonctionnel       | Upload, suppression, récupération, suppression des orphelins        |

## Scénarios de tests todo

| Module / Fonctionnalité         | Type de test      | Scénario pertinent à ajouter                        | Résultat attendu                        |
|---------------------------------|-------------------|-----------------------------------------------------|-----------------------------------------|
| **Authentification**            | Sécurité          | Accès à une ressource sans token                    | 401 Unauthorized                        |
|                                 | Sécurité          | Accès à une ressource d’un autre utilisateur        | 403 Forbidden                           |
|                                 | Sécurité          | Tentative de brute force sur le login               | Blocage ou délai                        |
| **Locations**                   | Structurel        | Création d’une location sans champ obligatoire      | 400 Bad Request                         |
|                                 | Fonctionnel       | Pagination sur la liste des locations               | Résultat paginé conforme                |
| **Commentaires**                | Sécurité          | Suppression d’un commentaire par un autre utilisateur | 403 Forbidden                        |
| **Fichiers**                    | Sécurité          | Upload d’un fichier de type interdit                | 400 ou 415 Unsupported Media Type        |
|                                 | Sécurité          | Upload d’un fichier trop volumineux                 | 413 Payload Too Large                   |
| **Général**                     | Sécurité          | Test d’injection SQL/XSS sur les champs texte       | Aucune faille, données non altérées     |
|                                 | Structurel        | Validation stricte des DTOs (types, formats)        | Erreur si non conforme                  |
| **Mail / Notifications**        | Fonctionnel       | Envoi de mail à l’inscription ou reset password     | Mail reçu par l’utilisateur             |

### Exemple de scénario rédigé

- **Fonctionnalité** : Authentification
- **Scénario** : Accès à une route/donnée protégée sans bearer token
- **Pré-condition** : Aucun utilisateur connecté
- **Action** : Appeler l’API `/api/rental` avec la méthode POST sans header d’authentification
- **Résultat attendu** : Réponse 401 Unauthorized



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
