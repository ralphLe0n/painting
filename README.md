# Citadel Paint Mixer App

A comprehensive React application for managing your Citadel miniature paint collection and creating custom paint mixes.

## Features

### Core Functionality
- **Paint Database**: 120+ Citadel paints across all ranges (Base, Layer, Shade, Contrast, Technical)
- **Search**: Real-time search by paint name
- **Filtering**: Filter by paint type and primary color category
- **Inventory Management**: Track paints in stock and wishlist
- **Paint Mixing Studio**: Mix 2-4 paints with adjustable ratios and see the resulting color
- **Firebase Integration**: Persist your inventory across sessions

## Tech Stack

- **Frontend**: React 18 with Vite
- **Styling**: Tailwind CSS
- **Database**: Firebase Firestore
- **State Management**: React Context API
- **Deployment**: Vercel-ready

## Getting Started

### Prerequisites

- Node.js 16+ and npm
- A Firebase project (for inventory persistence)

### Installation

1. Clone the repository:
```bash
git clone <your-repo-url>
cd painting
```

2. Install dependencies:
```bash
npm install
```

3. Set up Firebase:
   - Create a new project at [Firebase Console](https://console.firebase.google.com/)
   - Enable Firestore Database
   - Copy your Firebase configuration

4. Create environment file:
```bash
cp .env.local.example .env.local
```

5. Edit `.env.local` and add your Firebase credentials:
```env
VITE_FIREBASE_API_KEY=your_api_key_here
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

6. Configure Firebase Security Rules:
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{userId}/{document=**} {
      allow read, write: if true; // For MVP - tighten in production
    }
  }
}
```

7. Start the development server:
```bash
npm run dev
```

8. Open [http://localhost:5173](http://localhost:5173) in your browser

## Usage

### Managing Your Collection

1. **Browse Paints**: Scroll through the paint library or use search and filters
2. **Add to Stock**: Click "Add Stock" on any paint card to track paints you own
3. **Add to Wishlist**: Click "Add Wish" to mark paints you want to buy
4. **Remove Items**: Click the button again to remove from stock or wishlist

### Mixing Paints

1. **Open Mixing Studio**: Located at the top of the page
2. **Select Paints**: Search and click to add up to 4 paints
3. **Adjust Ratios**: Use sliders to change the proportion of each paint
4. **View Result**: See the mixed color preview and formula
5. **Remove Paints**: Click "Remove" to take a paint out of the mix

### Search and Filter

- **Search**: Type paint name in the search bar for instant filtering
- **Filter by Type**: Select Base, Layer, Shade, Contrast, or Technical
- **Filter by Color**: Choose from primary color categories
- **Clear Filters**: Click "Clear Filters" to reset all filters

## Project Structure

```
painting/
├── src/
│   ├── components/
│   │   ├── ColorCard.jsx        # Individual paint display
│   │   ├── SearchBar.jsx        # Search input component
│   │   └── MixingStudio.jsx     # Paint mixing interface
│   ├── context/
│   │   └── PaintContext.jsx     # Firebase inventory management
│   ├── data/
│   │   └── citadelColors.json   # Paint database
│   ├── firebase/
│   │   └── config.js            # Firebase initialization
│   ├── utils/
│   │   └── colorMixer.js        # Color mixing algorithms
│   ├── App.jsx                  # Main app component
│   ├── main.jsx                 # App entry point
│   └── index.css                # Tailwind directives
├── .env.local.example           # Environment variables template
└── README.md
```

## Deployment to Vercel

1. Push your code to GitHub

2. Import project in Vercel:
   - Go to [Vercel Dashboard](https://vercel.com/dashboard)
   - Click "New Project"
   - Import your GitHub repository

3. Configure build settings:
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
   - **Install Command**: `npm install`

4. Add environment variables in Vercel dashboard:
   - Go to Project Settings > Environment Variables
   - Add all `VITE_FIREBASE_*` variables from your `.env.local`

5. Deploy and visit your live site!

## Firebase Firestore Structure

```
users/
  └── {userId}/
      ├── inStock/
      │   └── {paintId}
      │       ├── id: string
      │       ├── name: string
      │       ├── hex: string
      │       ├── type: string
      │       ├── primaryColor: string
      │       └── addedDate: timestamp
      └── wishlist/
          └── {paintId}
              └── (same structure as inStock)
```

## Color Mixing Algorithm

The app uses weighted RGB averaging to mix colors:

1. Convert hex colors to RGB values
2. Multiply each RGB component by its ratio
3. Sum all weighted components
4. Convert result back to hex

**Note**: This is a computational approximation. Actual paint mixing results may vary due to pigment properties, paint medium, and application techniques.

## Features for Future Versions

- [ ] User authentication with Firebase Auth
- [ ] Recipe saving and sharing
- [ ] Paint compatibility checker
- [ ] Color wheel visualization
- [ ] Mobile app with React Native
- [ ] Barcode scanner for adding paints
- [ ] Paint store locator
- [ ] Community recipes

## Troubleshooting

### Firebase Connection Issues

If you see Firebase errors in the console:
- Verify all environment variables are set correctly
- Check that Firestore is enabled in your Firebase project
- Ensure security rules allow read/write access
- The app will work with local state if Firebase is unavailable

### Build Issues

If the build fails:
- Clear node_modules and reinstall: `rm -rf node_modules package-lock.json && npm install`
- Ensure Node.js version is 16 or higher: `node --version`
- Check for any TypeScript errors if you added custom types

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

MIT License - feel free to use this project for personal or commercial purposes.

## Acknowledgments

- Citadel paint color data compiled from official sources and community contributions
- Built with React, Vite, Tailwind CSS, and Firebase
- Color mixing algorithms inspired by traditional color theory

## Support

For issues, questions, or suggestions, please open an issue on GitHub.

---

**Happy Painting!**
