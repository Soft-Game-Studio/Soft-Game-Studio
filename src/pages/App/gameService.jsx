import { fireDB, storage } from "../../DataBase/firebaseConfig.jsx";
import { 
  collection, 
  doc, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  getDoc, 
  getDocs,
  query,
} from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL, deleteObject } from "firebase/storage";

export const gameCollection = collection(fireDB, "games");

export const gameService = {
  // Get all games
  async getAllGames() {
    try {
      const q = query(gameCollection);
      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
    } catch (error) {
      console.error("Error getting games:", error);
      throw error;
    }
  },

  // Get single game by ID
  async getGameById(gameId) {
    try {
      const gameDoc = doc(fireDB, "games", gameId);
      const snapshot = await getDoc(gameDoc);
      if (snapshot.exists()) {
        return { id: snapshot.id, ...snapshot.data() };
      }
      return null;
    } catch (error) {
      console.error("Error getting game:", error);
      throw error;
    }
  },

  // Upload image to storage
  async uploadImage(file, gameId = null) {
    try {
      const timestamp = Date.now();
      const fileName = `${timestamp}_${file.name}`;
      const storageRef = ref(storage, `game-images/${fileName}`);
      await uploadBytes(storageRef, file);
      const downloadURL = await getDownloadURL(storageRef);
      return { url: downloadURL, fileName };
    } catch (error) {
      console.error("Error uploading image:", error);
      throw error;
    }
  },

  // Delete image from storage
  async deleteImage(imageUrl) {
    try {
      if (imageUrl) {
        const imageRef = ref(storage, imageUrl);
        await deleteObject(imageRef);
      }
    } catch (error) {
      console.error("Error deleting image:", error);
    }
  },

  // Create new game
  async createGame(gameData, bannerImage) {
    try {
      let bannerUrl = "";
      if (bannerImage) {
        const imageResult = await this.uploadImage(bannerImage);
        bannerUrl = imageResult.url;
      }

      const gameDoc = {
        ...gameData,
        bannerImageUrl: bannerUrl,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      const docRef = await addDoc(gameCollection, gameDoc);
      return { id: docRef.id, ...gameDoc };
    } catch (error) {
      console.error("Error creating game:", error);
      throw error;
    }
  },

  // Update existing game
  async updateGame(gameId, gameData, newBannerImage, oldBannerUrl) {
    try {
      let bannerUrl = oldBannerUrl;
      
      // Delete old image if new image is provided
      if (newBannerImage) {
        await this.deleteImage(oldBannerUrl);
        const imageResult = await this.uploadImage(newBannerImage, gameId);
        bannerUrl = imageResult.url;
      }

      const gameDoc = {
        ...gameData,
        bannerImageUrl: bannerUrl,
        updatedAt: new Date().toISOString()
      };

      const gameRef = doc(fireDB, "games", gameId);
      await updateDoc(gameRef, gameDoc);
      
      return { id: gameId, ...gameDoc };
    } catch (error) {
      console.error("Error updating game:", error);
      throw error;
    }
  },

  // Delete game
  async deleteGame(gameId, bannerImageUrl) {
    try {
      // Delete banner image from storage
      await this.deleteImage(bannerImageUrl);
      
      // Delete game document
      const gameRef = doc(fireDB, "games", gameId);
      await deleteDoc(gameRef);
      
      return true;
    } catch (error) {
      console.error("Error deleting game:", error);
      throw error;
    }
  }
};