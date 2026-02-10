# 💰 Salary Manager

Application Angular moderne de gestion de salaire avec intelligence artificielle, authentification Google et design premium.

![Angular](https://img.shields.io/badge/Angular-19-DD0031?logo=angular)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript)
![Firebase](https://img.shields.io/badge/Firebase-Auth-FFCA28?logo=firebase)
![Claude AI](https://img.shields.io/badge/Claude-API-6B4FBB)

## ✨ Fonctionnalités

- 🔐 **Authentification Google** via Firebase
- 💵 **Gestion du salaire** avec saisie et persistence
- 📊 **Suivi des dépenses** par catégories (10 catégories disponibles)
- 🤖 **Recommandations IA** personnalisées via Claude API
- 💾 **Persistence locale** avec localStorage
- 🎨 **Design premium** : glassmorphism, gradients, animations
- 📱 **Responsive** : mobile et desktop

## 🎯 Catégories de dépenses

- Logement
- Transport
- Alimentation
- Ravitaillement
- Dîme
- Habillement
- Santé
- Factures
- Abonnements
- Autre

## 🚀 Installation rapide

### Prérequis

- Node.js 20+ et npm
- Compte Firebase (gratuit)
- Clé API Claude/Anthropic (optionnel)

### Étapes

1. **Cloner le dépôt**
   ```bash
   git clone https://github.com/orace18/gestion-de-salaire.git
   cd gestion-de-salaire
   ```

2. **Installer les dépendances**
   ```bash
   npm install
   ```

3. **Configurer l'environnement**
   ```bash
   cp src/environments/environment.example.ts src/environments/environment.ts
   ```
   Puis éditez `src/environments/environment.ts` avec vos propres clés (voir [SETUP.md](./SETUP.md))

4. **Lancer l'application**
   ```bash
   npm start
   ```
   Ouvrez http://localhost:4200/

## 📖 Configuration détaillée

Consultez [SETUP.md](./SETUP.md) pour les instructions complètes de configuration de :
- Firebase Authentication
- Claude API
- Deployment en production

## 🎨 Aperçu

### Page de connexion
Design glassmorphism avec dégradés animés et authentification Google sécurisée.

### Dashboard
Interface intuitive pour gérer votre budget avec recommandations IA en temps réel.

## 🧠 Recommandations IA

L'application utilise **Claude API (Anthropic)** pour analyser votre profil financier et suggérer une répartition optimale entre :
- **Épargne** : pour vos objectifs long terme
- **Imprévus** : fonds d'urgence
- **Plaisir** : dépenses personnelles

Si l'API n'est pas configurée, un algorithme de fallback (règle 50/30/20) est automatiquement utilisé.

## 🛠️ Technologies

- **Frontend** : Angular 19 (standalone components)
- **Auth** : Firebase Authentication
- **IA** : Claude API (Anthropic)
- **Styling** : SCSS, Glassmorphism, Google Fonts (Inter)
- **State** : Services Angular + RxJS
- **Storage** : localStorage

## 📦 Scripts disponibles

```bash
npm start          # Serveur de développement (port 4200)
npm run build      # Build de production
npm run watch      # Build en mode watch
```

## 🔒 Sécurité

⚠️ **Important** : Ne committez jamais vos clés API dans Git !

- `environment.ts` est dans `.gitignore`
- Utilisez `environment.example.ts` comme template
- En production, utilisez des variables d'environnement sécurisées

## 📝 License

MIT

## 👤 Auteur

**orace18**
- GitHub: [@orace18](https://github.com/orace18)

## 🤝 Contribution

Les contributions sont les bienvenues ! N'hésitez pas à ouvrir une issue ou une pull request.

---

⭐ Si ce projet vous aide, donnez-lui une étoile !
