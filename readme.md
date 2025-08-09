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


# Cahier de Recettes — C2.3.1

## État de la couverture de tests

**Résultat global :** | **135 tests** | **Couverture : ~65%** | **9 August 2025**

## Tests existants (complets)

| Module / Fonctionnalité         | Fichiers de tests existants                                      | Type de test      | Ce qui est vérifié actuellement                                      |
|---------------------------------|------------------------------------------------------------------|-------------------|---------------------------------------------------------------------|
| **Core Application**            | `app.controller.spec.ts`, `app.service.spec.ts`, `main.spec.ts`  | Unitaire          | Contrôleur principal, service de base, bootstrap de l'application   |
| **Authentification**            | `auth.controller.spec.ts`, `auth.service.spec.ts`                | Fonctionnel       | Inscription, connexion, reset password, logout, gestion des tokens  |
| **Guards & Stratégies**         | `jwt-passport.guard.spec.ts`, `roles.guard.spec.ts`, `passport-jwt.strategy.spec.ts` | Sécurité | Authentification JWT, autorisation par rôles, validation des tokens |
| **Utilisateurs**                | `user.controller.spec.ts`, `user.service.spec.ts`                | Fonctionnel       | CRUD utilisateurs, upload profil/bannière, soft delete             |
| **Catégories de location**      | `rental-cat.controller.spec.ts`, `rental-cat.service.spec.ts`    | Fonctionnel       | CRUD catégories, recherche par slug, données d'initialisation       |
| **Locations**                   | `rental.controller.spec.ts`, `rental.service.spec.ts`            | Fonctionnel       | CRUD locations, upload fichiers, recherche, filtrage                |
| **Commentaires sur location**   | `rental-comment.controller.spec.ts`, `rental-comment.service.spec.ts` | Fonctionnel  | Ajout, suppression, modification, récupération des commentaires     |
| **Fichiers**                    | `file.controller.spec.ts`, `file.service.spec.ts`                | Fonctionnel       | Upload, suppression, récupération, suppression des orphelins        |
| **Gestion des emails**          | `mail.service.spec.ts`, `mail.module.spec.ts`                   | Fonctionnel       | Envoi emails de confirmation, reset password, gestion des erreurs   |
| **Tokens de validation**        | `valid-token.controller.spec.ts`, `valid-token.service.spec.ts`  | Sécurité          | Création, validation, suppression des tokens JWT                    |
| **Reset mot de passe**          | `token-reset-password.controller.spec.ts`, `token-reset-password.service.spec.ts` | Sécurité | Génération, validation, suppression des tokens de reset             |
| **Middleware & Filtres**        | `logger.middleware.spec.ts`, `global-exception.filter.spec.ts`   | Infrastructure    | Logging des requêtes, gestion globale des exceptions               |
| **Intercepteurs**               | `clean-null.interceptor.spec.ts`, `date-transform.interceptor.spec.ts` | Infrastructure | Nettoyage des valeurs nulles, transformation des dates             |


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

| Priorité | Scénario                                      | Type          | Complexité |
|----------|-----------------------------------------------|---------------|------------|
|  Haute  | Tests E2E avec base de données réelle        | Intégration   | Élevée     |
|  Moyenne| Tests de performance sur large dataset       | Performance   | Moyenne    |
|  Moyenne| Tests de sécurité avancés (injection, XSS)   | Sécurité      | Moyenne    |
|  Basse  | Tests de stress sur les uploads de fichiers  | Performance   | Faible     |

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
it('should throw UnauthorizedException for invalid token', async () => {
  (validTokenService.findOne as jest.Mock).mockResolvedValue(false);
  await expect(strategy.validate({ email: 'user@test.com' }))
    .rejects.toThrow(UnauthorizedException);
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
