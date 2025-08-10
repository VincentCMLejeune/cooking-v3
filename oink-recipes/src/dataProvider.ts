import { DataProvider } from 'react-admin';
import { 
  collection, 
  doc, 
  getDocs, 
  getDoc, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  query, 
  where, 
  orderBy, 
  limit, 
  startAfter,
  QueryDocumentSnapshot,
  DocumentData
} from 'firebase/firestore';
import { db } from './firebase';

export const firestoreDataProvider: DataProvider = {
  getList: async (resource, params) => {
    const { page, perPage } = params.pagination;
    const { field, order } = params.sort;
    
    try {
      const collectionRef = collection(db, resource);
      let q = query(collectionRef);
      
      // Apply sorting
      if (field && order) {
        q = query(q, orderBy(field, order.toLowerCase() as 'asc' | 'desc'));
      }
      
      // Apply filters
      if (params.filter) {
        Object.keys(params.filter).forEach(key => {
          if (params.filter[key] !== undefined && params.filter[key] !== null) {
            q = query(q, where(key, '==', params.filter[key]));
          }
        });
      }
      
      // Apply pagination
      q = query(q, limit(perPage));
      if (page > 1) {
        // For simplicity, we'll get all docs and slice
        // In production, you might want to implement cursor-based pagination
        const allDocs = await getDocs(query(collectionRef));
        const docs = allDocs.docs.slice((page - 1) * perPage, page * perPage);
        const data = docs.map(doc => ({ id: doc.id, ...doc.data() }));
        return { data, total: allDocs.size };
      }
      
      const snapshot = await getDocs(q);
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      
      // Get total count (this is a simplified approach)
      const totalSnapshot = await getDocs(collectionRef);
      
      return { data, total: totalSnapshot.size };
    } catch (error) {
      console.error('Error in getList:', error);
      throw error;
    }
  },

  getOne: async (resource, params) => {
    try {
      const docRef = doc(db, resource, params.id);
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        return { data: { id: docSnap.id, ...docSnap.data() } };
      } else {
        throw new Error(`Document not found: ${params.id}`);
      }
    } catch (error) {
      console.error('Error in getOne:', error);
      throw error;
    }
  },

  getMany: async (resource, params) => {
    try {
      const promises = params.ids.map(id => 
        getDoc(doc(db, resource, id))
      );
      const snapshots = await Promise.all(promises);
      const data = snapshots
        .filter(snap => snap.exists())
        .map(snap => ({ id: snap.id, ...snap.data() }));
      
      return { data };
    } catch (error) {
      console.error('Error in getMany:', error);
      throw error;
    }
  },

  getManyReference: async (resource, params) => {
    const { page, perPage } = params.pagination;
    const { field, order } = params.sort;
    
    try {
      const collectionRef = collection(db, resource);
      let q = query(collectionRef, where(params.target, '==', params.id));
      
      // Apply sorting
      if (field && order) {
        q = query(q, orderBy(field, order.toLowerCase() as 'asc' | 'desc'));
      }
      
      // Apply additional filters
      if (params.filter) {
        Object.keys(params.filter).forEach(key => {
          if (params.filter[key] !== undefined && params.filter[key] !== null) {
            q = query(q, where(key, '==', params.filter[key]));
          }
        });
      }
      
      const snapshot = await getDocs(q);
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      
      return { data, total: snapshot.size };
    } catch (error) {
      console.error('Error in getManyReference:', error);
      throw error;
    }
  },

  create: async (resource, params) => {
    try {
      const collectionRef = collection(db, resource);
      const docRef = await addDoc(collectionRef, params.data);
      const docSnap = await getDoc(docRef);
      
      return { data: { id: docSnap.id, ...docSnap.data() } };
    } catch (error) {
      console.error('Error in create:', error);
      throw error;
    }
  },

  update: async (resource, params) => {
    try {
      const docRef = doc(db, resource, params.id);
      await updateDoc(docRef, params.data);
      const docSnap = await getDoc(docRef);
      
      return { data: { id: docSnap.id, ...docSnap.data() } };
    } catch (error) {
      console.error('Error in update:', error);
      throw error;
    }
  },

  updateMany: async (resource, params) => {
    try {
      const promises = params.ids.map(id => 
        updateDoc(doc(db, resource, id), params.data)
      );
      await Promise.all(promises);
      
      return { data: params.ids };
    } catch (error) {
      console.error('Error in updateMany:', error);
      throw error;
    }
  },

  delete: async (resource, params) => {
    try {
      const docRef = doc(db, resource, params.id);
      const docSnap = await getDoc(docRef);
      const data = { id: docSnap.id, ...docSnap.data() };
      
      await deleteDoc(docRef);
      
      return { data };
    } catch (error) {
      console.error('Error in delete:', error);
      throw error;
    }
  },

  deleteMany: async (resource, params) => {
    try {
      const promises = params.ids.map(id => 
        deleteDoc(doc(db, resource, id))
      );
      await Promise.all(promises);
      
      return { data: params.ids };
    } catch (error) {
      console.error('Error in deleteMany:', error);
      throw error;
    }
  }
};

