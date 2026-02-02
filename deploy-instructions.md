# SRIDEVI PINDI VANTALU - Deployment Instructions

## 🚀 GitHub Setup

### 1. Create GitHub Repository
1. Go to https://github.com
2. Click "New repository"
3. Repository name: `pindi-vantalu-website`
4. Description: `SRIDEVI PINDI VANTALU - Traditional South Indian Snacks Website`
5. Make it Public (for free hosting)
6. Click "Create repository"

### 2. Push to GitHub
```bash
git remote add origin https://github.com/rohithnani0282-1/pindi-vantalu-website.git
git branch -M main
git push -u origin main
```

## 🔥 Firebase Setup

### 1. Install Firebase CLI
```bash
npm install -g firebase-tools
```

### 2. Login to Firebase
```bash
firebase login
```

### 3. Initialize Firebase
```bash
firebase init hosting
```
- Choose: `Use an existing project` or `Create a new project`
- Public directory: `.` (current directory)
- Configure as single-page app: `Yes`
- Overwrite index.html: `No`

### 4. Deploy to Firebase
```bash
firebase deploy
```

## 🔄 Automatic Updates Setup

### Monthly Updates Workflow

1. **Update Your Website**:
   - Add new items to menu
   - Update prices
   - Change images
   - Modify content

2. **Push Changes**:
   ```bash
   git add .
   git commit -m "Monthly updates: new items and price changes"
   git push origin main
   ```

3. **Deploy to Firebase**:
   ```bash
   firebase deploy
   ```

## 📱 Firebase Hosting URL

After deployment, your website will be available at:
- `https://your-project-name.web.app`
- `https://your-project-name.firebaseapp.com`

## 🎯 Benefits

- **Free Hosting**: Firebase provides free hosting
- **Automatic HTTPS**: SSL certificate included
- **Global CDN**: Fast loading worldwide
- **Custom Domain**: Can connect your own domain later
- **Easy Updates**: Push changes and deploy instantly

## 📞 Support

For any issues:
- GitHub: https://github.com/rohithnani0282-1/pindi-vantalu-website
- Firebase: https://console.firebase.google.com
