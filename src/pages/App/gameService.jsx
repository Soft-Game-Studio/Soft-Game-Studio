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
      return snapshot.docs.map(docSnapshot => ({
        id: docSnapshot.id,
        ...docSnapshot.data()
      }));
    } catch (error) {
      throw new Error("Unable to retrieve game titles from database.");
    }
  },

  // Get single game by ID
  async getGameById(gameId) {
    if (!gameId) return null;
    try {
      const gameDoc = doc(fireDB, "games", gameId);
      const snapshot = await getDoc(gameDoc);
      if (snapshot.exists()) {
        return { id: snapshot.id, ...snapshot.data() };
      }
      return null;
    } catch (error) {
      throw new Error("Unable to retrieve game details.");
    }
  },

  // Upload image to storage
  async uploadImage(file) {
    try {
      const timestamp = Date.now();
      const cleanFileName = file.name ? file.name.replace(/[^a-zA-Z0-9._-]/g, "_") : "banner";
      const fileName = `${timestamp}_${cleanFileName}`;
      const storageRef = ref(storage, `game-images/${fileName}`);
      await uploadBytes(storageRef, file);
      const downloadURL = await getDownloadURL(storageRef);
      return { url: downloadURL, fileName };
    } catch (error) {
      throw new Error("Image upload failed.");
    }
  },

  // Delete image from storage
  async deleteImage(imageUrl) {
    if (!imageUrl) return;
    try {
      const imageRef = ref(storage, imageUrl);
      await deleteObject(imageRef);
    } catch {
      // Non-blocking cleanup failure
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
      throw new Error("Failed to create game record.");
    }
  },

  // Update existing game
  async updateGame(gameId, gameData, newBannerImage, oldBannerUrl) {
    try {
      let bannerUrl = oldBannerUrl;
      
      // Replace old image if new image is provided
      if (newBannerImage) {
        await this.deleteImage(oldBannerUrl);
        const imageResult = await this.uploadImage(newBannerImage);
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
      throw new Error("Failed to update game record.");
    }
  },

  // Delete game
  async deleteGame(gameId, bannerImageUrl) {
    try {
      await this.deleteImage(bannerImageUrl);
      const gameRef = doc(fireDB, "games", gameId);
      await deleteDoc(gameRef);
      return true;
    } catch (error) {
      throw new Error("Failed to delete game record.");
    }
  }
};