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
        console.log('Firestore getList result (page > 1):', { data, total: allDocs.size });
        return { data, total: allDocs.size };
      }
      
      const snapshot = await getDocs(q);
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      
      // Get total count (this is a simplified approach)
      const totalSnapshot = await getDocs(collectionRef);
      
      console.log('Firestore getList result:', { data, total: totalSnapshot.size });
      console.log('Raw Firestore documents:', snapshot.docs.map(doc => ({ id: doc.id, data: doc.data() })));
      console.log('Raw Firestore row:', snapshot.docs[0].data());

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
        const data = { id: docSnap.id, ...docSnap.data() };
        console.log('Firestore getOne result:', data);
        console.log('Raw Firestore document:', { id: docSnap.id, data: docSnap.data() });
        return { data };
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
      console.log('Firestore create - resource:', resource);
      console.log('Firestore create - params.data:', params.data);
      
      // Clean up undefined values before sending to Firestore
      const cleanData = JSON.parse(JSON.stringify(params.data, (key, value) => {
        return value === undefined ? null : value;
      }));
      
      const collectionRef = collection(db, resource);
      const docRef = await addDoc(collectionRef, cleanData);
      const docSnap = await getDoc(docRef);
      
      const data = { id: docSnap.id, ...docSnap.data() };
      console.log('Firestore create - result:', data);
      
      return { data };
    } catch (error) {
      console.error('Error in create:', error);
      throw error;
    }
  },

  update: async (resource, params) => {
    try {
      // Clean up undefined values before sending to Firestore
      const cleanData = JSON.parse(JSON.stringify(params.data, (key, value) => {
        return value === undefined ? null : value;
      }));
      
      const docRef = doc(db, resource, params.id);
      await updateDoc(docRef, cleanData);
      const docSnap = await getDoc(docRef);
      
      const data = { id: docSnap.id, ...docSnap.data() };
      return { data };
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

