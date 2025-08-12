## Contribuer à RentToCraft

Merci de votre intérêt pour le projet! Ce guide explique comment proposer des améliorations, corriger des bugs et ouvrir des Pull Requests.

### Pré-requis

- Node.js ≥ 18
- pnpm ≥ 8
- Docker et Docker Compose (pour l'exécution complète via `make`)

### Installation et démarrage

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

3. Démarrer les applications:

```bash
pnpm run dev:api
pnpm run dev:ui
```

### Workflow Git

- Créez une branche à partir de la branche par défaut du dépôt (ex: `main`):
  - `feat/<courte-description>` pour une fonctionnalité
  - `fix/<courte-description>` pour un correctif
  - `chore/<courte-description>` pour la maintenance

- Utilisez les Conventional Commits:
  - `feat: …`, `fix: …`, `docs: …`, `chore: …`, `refactor: …`, `test: …`, etc.

### Lint, formatage et tests

Avant de soumettre une PR:

```bash
pnpm lint
pnpm test
```

Respectez la configuration ESLint/Prettier du repo. Le code est principalement en TypeScript (Next.js côté UI, NestJS côté API).

### Pull Requests

- Rédigez un titre clair et une description concise (quoi/pourquoi/comment tester).
- Ciblez la branche par défaut du dépôt, sauf indication contraire.
- Scindez les changements volumineux en PRs plus petites et autonomes.
- Ajoutez des tests lorsque pertinent et mettez à jour la documentation.

Checklist rapide:

- [ ] Le code compile et passe les tests localement
- [ ] `pnpm lint` ne remonte pas d'erreurs
- [ ] Les changements sont documentés (README, commentaires pertinents)
- [ ] Les migrations/impacts infra sont décrits si besoin

### Signaler un bug

Ouvrez une issue avec:

- Étapes de reproduction
- Comportement attendu vs observé
- Logs/erreurs, versions (Node, OS, navigateur), et contexte

Veuillez éviter d'inclure des secrets ou données sensibles.

### Proposer une fonctionnalité

Expliquez l'usage, l'impact utilisateur, et des exemples d'API/UI. Si possible, liez un MVP ou un POC.

### Licence

En contribuant, vous acceptez que vos contributions soient licenciées sous la licence du projet (voir `license.md`).

Merci et bonnes contributions!
