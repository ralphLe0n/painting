import { createContext, useState, useEffect, useContext } from 'react'
import { db } from '../firebase/config'
import {
  collection,
  addDoc,
  deleteDoc,
  getDocs,
  doc,
  query,
  where
} from 'firebase/firestore'

const PaintContext = createContext()

export function usePaint() {
  return useContext(PaintContext)
}

export function PaintProvider({ children }) {
  const [stock, setStock] = useState([])
  const [wishlist, setWishlist] = useState([])
  const [loading, setLoading] = useState(true)

  // For MVP, using a simple user ID. In production, use Firebase Auth
  const userId = 'default-user'

  // Load stock and wishlist from Firebase
  useEffect(() => {
    const loadData = async () => {
      // Check if Firebase is configured
      if (!db) {
        console.log('Firebase not configured. Using local state only.')
        setLoading(false)
        return
      }

      try {
        // Load stock
        const stockRef = collection(db, 'users', userId, 'inStock')
        const stockSnap = await getDocs(stockRef)
        const stockData = stockSnap.docs.map(doc => ({
          firestoreId: doc.id,
          ...doc.data()
        }))
        setStock(stockData)

        // Load wishlist
        const wishlistRef = collection(db, 'users', userId, 'wishlist')
        const wishlistSnap = await getDocs(wishlistRef)
        const wishlistData = wishlistSnap.docs.map(doc => ({
          firestoreId: doc.id,
          ...doc.data()
        }))
        setWishlist(wishlistData)
      } catch (error) {
        console.error('Error loading data from Firebase:', error)
        // If Firebase is not configured, continue with local state
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [])

  const addToStock = async (paint) => {
    if (!db) {
      // Use local state only
      setStock([...stock, paint])
      return
    }

    try {
      const stockRef = collection(db, 'users', userId, 'inStock')
      const docRef = await addDoc(stockRef, {
        ...paint,
        addedDate: new Date().toISOString()
      })
      setStock([...stock, { ...paint, firestoreId: docRef.id }])
    } catch (error) {
      console.error('Error adding to stock:', error)
      // Fallback to local state
      setStock([...stock, paint])
    }
  }

  const removeFromStock = async (paint) => {
    if (!db) {
      // Use local state only
      setStock(stock.filter(p => p.id !== paint.id))
      return
    }

    try {
      const paintInStock = stock.find(p => p.id === paint.id)
      if (paintInStock?.firestoreId) {
        await deleteDoc(doc(db, 'users', userId, 'inStock', paintInStock.firestoreId))
      }
      setStock(stock.filter(p => p.id !== paint.id))
    } catch (error) {
      console.error('Error removing from stock:', error)
      // Fallback to local state
      setStock(stock.filter(p => p.id !== paint.id))
    }
  }

  const addToWishlist = async (paint) => {
    if (!db) {
      // Use local state only
      setWishlist([...wishlist, paint])
      return
    }

    try {
      const wishlistRef = collection(db, 'users', userId, 'wishlist')
      const docRef = await addDoc(wishlistRef, {
        ...paint,
        addedDate: new Date().toISOString()
      })
      setWishlist([...wishlist, { ...paint, firestoreId: docRef.id }])
    } catch (error) {
      console.error('Error adding to wishlist:', error)
      // Fallback to local state
      setWishlist([...wishlist, paint])
    }
  }

  const removeFromWishlist = async (paint) => {
    if (!db) {
      // Use local state only
      setWishlist(wishlist.filter(p => p.id !== paint.id))
      return
    }

    try {
      const paintInWishlist = wishlist.find(p => p.id === paint.id)
      if (paintInWishlist?.firestoreId) {
        await deleteDoc(doc(db, 'users', userId, 'wishlist', paintInWishlist.firestoreId))
      }
      setWishlist(wishlist.filter(p => p.id !== paint.id))
    } catch (error) {
      console.error('Error removing from wishlist:', error)
      // Fallback to local state
      setWishlist(wishlist.filter(p => p.id !== paint.id))
    }
  }

  const value = {
    stock,
    wishlist,
    loading,
    addToStock,
    removeFromStock,
    addToWishlist,
    removeFromWishlist
  }

  return <PaintContext.Provider value={value}>{children}</PaintContext.Provider>
}
