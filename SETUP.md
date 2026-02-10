# Salary Manager — Configuration

## 📝 Setup Instructions

### 1. Configuration de l'environnement

Copiez le fichier d'exemple et remplissez vos propres clés :

```bash
cp src/environments/environment.example.ts src/environments/environment.ts
```

### 2. Firebase Configuration

1. Allez sur [Firebase Console](https://console.firebase.google.com/)
2. Créez un nouveau projet ou sélectionnez `salaire-manage`
3. Allez dans **Project Settings** → **General**
4. Copiez vos identifiants Firebase dans `environment.ts`
5. Activez **Authentication** → **Sign-in method** → **Google**

### 3. Claude API Key

1. Créez un compte sur [Anthropic Console](https://console.anthropic.com/)
2. Générez une clé API
3. Ajoutez-la dans `environment.ts` → `claudeApiKey`

> [!WARNING]
> **Ne committez JAMAIS vos clés API dans Git !**
> Le fichier `environment.ts` est dans `.gitignore` pour vous protéger.

## 🚀 Démarrage

```bash
npm install
npm start
```

L'application sera accessible sur http://localhost:4200/
