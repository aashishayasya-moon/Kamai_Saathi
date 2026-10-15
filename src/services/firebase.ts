import { initializeApp, getApps, getApp } from 'firebase/app';
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  User as FirebaseUser,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  updateProfile,
} from 'firebase/auth';
import {
  getFirestore,
  doc,
  getDocFromServer,
  setDoc,
  getDoc,
  collection,
  getDocs,
  deleteDoc,
  query,
  where,
  orderBy,
  onSnapshot,
} from 'firebase/firestore';
import firebaseConfig from '../../firebase-applet-config.json';
import { Transaction } from '../types';
import { UserProfile } from './authService';

// Initialize Firebase App singleton
export const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

// CRITICAL: Initialize Firestore with specific database ID from config
export const db = getFirestore(app, firebaseConfig.firestoreDatabaseId);

// Initialize Firebase Auth
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();

// Error Handling according to Firebase Integration Skill
export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

export interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
    tenantId?: string | null;
    providerInfo?: {
      providerId?: string | null;
      email?: string | null;
    }[];
  };
}

export function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null): never {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
      tenantId: auth.currentUser?.tenantId,
      providerInfo:
        auth.currentUser?.providerData?.map((provider) => ({
          providerId: provider.providerId,
          email: provider.email,
        })) || [],
    },
    operationType,
    path,
  };
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

// Connection check to Firestore server
export async function validateFirestoreConnection(): Promise<boolean> {
  try {
    await getDocFromServer(doc(db, 'test', 'connection'));
    return true;
  } catch (error) {
    if (error instanceof Error && error.message.includes('the client is offline')) {
      console.warn('Firestore offline notice: Local offline caching is active.');
      return false;
    }
    return true;
  }
}

// Firebase Firestore Service for Kamai Saathi
export const firestoreService = {
  // Sync user profile document
  async syncUserProfile(user: UserProfile): Promise<void> {
    const userPath = `users/${user.uid}`;
    try {
      await setDoc(
        doc(db, 'users', user.uid),
        {
          uid: user.uid,
          email: user.email,
          displayName: user.displayName || 'Kamai Earner',
          photoURL: user.photoURL || '',
          provider: user.provider,
          createdAt: user.createdAt || new Date().toISOString(),
          lastActiveAt: new Date().toISOString(),
        },
        { merge: true }
      );
    } catch (err) {
      handleFirestoreError(err, OperationType.WRITE, userPath);
    }
  },

  // Save transaction to user's Firestore subcollection
  async saveTransaction(userId: string, tx: Transaction): Promise<void> {
    const txPath = `users/${userId}/transactions/${tx.id}`;
    try {
      await setDoc(doc(db, 'users', userId, 'transactions', tx.id), {
        id: tx.id,
        userId,
        type: tx.type,
        amount: tx.amount,
        amountPaise: tx.amountPaise,
        currency: tx.currency || 'INR',
        category: tx.category,
        date: tx.date,
        description: tx.description,
        entryMethod: tx.entryMethod,
        confirmationStatus: tx.confirmationStatus,
        createdAt: tx.createdAt,
      });
    } catch (err) {
      handleFirestoreError(err, OperationType.WRITE, txPath);
    }
  },

  // Save multiple transactions (batch/loop)
  async saveTransactions(userId: string, txs: Transaction[]): Promise<void> {
    for (const tx of txs) {
      await this.saveTransaction(userId, tx);
    }
  },

  // Fetch all transactions for user
  async fetchTransactions(userId: string): Promise<Transaction[]> {
    const txsPath = `users/${userId}/transactions`;
    try {
      const snap = await getDocs(collection(db, 'users', userId, 'transactions'));
      const items: Transaction[] = [];
      snap.forEach((d) => {
        items.push(d.data() as Transaction);
      });
      return items;
    } catch (err) {
      handleFirestoreError(err, OperationType.LIST, txsPath);
    }
  },

  // Delete transaction
  async deleteTransaction(userId: string, txId: string): Promise<void> {
    const txPath = `users/${userId}/transactions/${txId}`;
    try {
      await deleteDoc(doc(db, 'users', userId, 'transactions', txId));
    } catch (err) {
      handleFirestoreError(err, OperationType.DELETE, txPath);
    }
  },
};
