/**
 * FedSignal Firestore Database Helpers
 * 
 * Utility functions for Firestore operations including query builders,
 * pagination helpers, and filter utilities for FedSignal collections.
 */

import { db } from "@/lib/firebase";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  limit,
  startAfter,
  Query,
  QueryConstraint,
  DocumentData,
  Timestamp,
} from "firebase/firestore";
import { FSCOLLECTIONS } from "./schema";

// ============================================================================
// Query Builders
// ============================================================================

/**
 * Build a query with optional filters, ordering, and pagination
 */
export function buildQuery(
  collectionName: string,
  constraints: QueryConstraint[] = []
): Query<DocumentData> | null {
  if (!db) return null;
  const collRef = collection(db, collectionName);
  return query(collRef, ...constraints);
}

/**
 * Common filter constraints
 */
export const filters = {
  where: where,
  orderBy: orderBy,
  limit: limit,
  startAfter: startAfter,
};

// ============================================================================
// Pagination Helpers
// ============================================================================

export interface PaginationParams {
  page?: number;
  pageSize?: number;
  startAfterDoc?: DocumentData;
}

export interface PaginatedResult<T> {
  data: T[];
  totalCount?: number;
  hasMore: boolean;
  nextPageCursor?: DocumentData;
}

/**
 * Fetch paginated results from a collection
 */
export async function fetchPaginated<T>(
  collectionName: string,
  params: PaginationParams = {},
  additionalConstraints: QueryConstraint[] = []
): Promise<PaginatedResult<T>> {
  if (!db) {
    return { data: [], hasMore: false };
  }

  const { page = 1, pageSize = 20, startAfterDoc } = params;
  const constraints: QueryConstraint[] = [...additionalConstraints];

  // Add ordering by createdAt desc for consistent pagination
  constraints.push(orderBy("createdAt", "desc"));

  // Add limit
  constraints.push(limit(pageSize + 1)); // Fetch one extra to check if there are more

  // Add cursor for pagination
  if (startAfterDoc) {
    constraints.push(startAfter(startAfterDoc));
  }

  const q = buildQuery(collectionName, constraints);
  if (!q) {
    return { data: [], hasMore: false };
  }
  const snapshot = await getDocs(q);

  const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as T[];
  const hasMore = data.length > pageSize;
  
  // Remove the extra item if it exists
  if (hasMore) {
    data.pop();
  }

  return {
    data,
    hasMore,
    nextPageCursor: hasMore ? snapshot.docs[snapshot.docs.length - 2] : undefined,
  };
}

// ============================================================================
// Filter Utilities
// ============================================================================

export interface FilterOptions {
  universityId?: string;
  status?: string;
  dateFrom?: Date | string;
  dateTo?: Date | string;
  searchQuery?: string;
  tags?: string[];
  [key: string]: unknown;
}

/**
 * Build query constraints from filter options
 */
export function buildFilterConstraints(
  collectionName: string,
  options: FilterOptions = {}
): QueryConstraint[] {
  const constraints: QueryConstraint[] = [];

  if (options.universityId) {
    constraints.push(where("universityId", "==", options.universityId));
  }

  if (options.status) {
    constraints.push(where("status", "==", options.status));
  }

  if (options.dateFrom) {
    const fromDate = typeof options.dateFrom === "string" 
      ? new Date(options.dateFrom) 
      : options.dateFrom;
    constraints.push(where("createdAt", ">=", Timestamp.fromDate(fromDate)));
  }

  if (options.dateTo) {
    const toDate = typeof options.dateTo === "string" 
      ? new Date(options.dateTo) 
      : options.dateTo;
    constraints.push(where("createdAt", "<=", Timestamp.fromDate(toDate)));
  }

  if (options.tags && options.tags.length > 0) {
    constraints.push(where("tags", "array-contains-any", options.tags));
  }

  // Note: text search requires Firestore indexes or client-side filtering
  // For now, we'll handle search query client-side

  return constraints;
}

// ============================================================================
// CRUD Helpers
// ============================================================================

/**
 * Get a single document by ID
 */
export async function getDocument<T>(
  collectionName: string,
  id: string
): Promise<T | null> {
  if (!db) return null;
  const docRef = doc(db, collectionName, id);
  const docSnap = await getDoc(docRef);

  if (!docSnap.exists()) {
    return null;
  }

  return { id: docSnap.id, ...docSnap.data() } as T;
}

/**
 * Get multiple documents by IDs
 */
export async function getDocumentsByIds<T>(
  collectionName: string,
  ids: string[]
): Promise<T[]> {
  if (ids.length === 0) return [];
  if (!db) return [];

  const promises = ids.map(id => getDocument<T>(collectionName, id));
  const results = await Promise.all(promises);
  return results.filter((r) => r !== null) as T[];
}

/**
 * Create a new document
 */
export async function createDocument<T>(
  collectionName: string,
  data: Omit<T, "id" | "createdAt" | "updatedAt">
): Promise<T> {
  if (!db) throw new Error("Firebase not initialized");
  const collRef = collection(db, collectionName);
  const docRef = await addDoc(collRef, {
    ...data,
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now(),
  });

  const newDoc = await getDoc(docRef);
  return { id: newDoc.id, ...newDoc.data() } as T;
}

/**
 * Update a document
 */
export async function updateDocument<T>(
  collectionName: string,
  id: string,
  data: Partial<Omit<T, "id" | "createdAt">>
): Promise<T> {
  if (!db) throw new Error("Firebase not initialized");
  const docRef = doc(db, collectionName, id);
  await updateDoc(docRef, {
    ...data,
    updatedAt: Timestamp.now(),
  });

  return (await getDocument<T>(collectionName, id))!;
}

/**
 * Delete a document (soft delete by setting status to inactive if available)
 */
export async function deleteDocument(
  collectionName: string,
  id: string,
  softDelete = true
): Promise<void> {
  if (!db) throw new Error("Firebase not initialized");
  const docRef = doc(db, collectionName, id);

  if (softDelete) {
    try {
      await updateDoc(docRef, {
        status: "inactive",
        updatedAt: Timestamp.now(),
      });
    } catch (error) {
      // If status field doesn't exist, do hard delete
      await deleteDoc(docRef);
    }
  } else {
    await deleteDoc(docRef);
  }
}

// ============================================================================
// Collection-Specific Helpers
// ============================================================================

/**
 * Get universities by state
 */
export async function getUniversitiesByState(state: string): Promise<any[]> {
  if (!db) return [];
  const q = query(
    collection(db, FSCOLLECTIONS.UNIVERSITIES),
    where("state", "==", state),
    where("isActive", "==", true),
    orderBy("name")
  );
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
}

/**
 * Get opportunities by university
 */
export async function getOpportunitiesByUniversity(
  universityId: string,
  status?: string
): Promise<any[]> {
  if (!db) return [];
  const constraints: QueryConstraint[] = [
    where("universityId", "==", universityId),
    orderBy("deadline", "asc"),
  ];

  if (status) {
    constraints.unshift(where("status", "==", status));
  }

  const q = query(collection(db, FSCOLLECTIONS.OPPORTUNITIES), ...constraints);
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
}

/**
 * Get contacts by university
 */
export async function getContactsByUniversity(universityId: string): Promise<any[]> {
  if (!db) return [];
  const q = query(
    collection(db, FSCOLLECTIONS.CONTACTS),
    where("universityId", "==", universityId),
    orderBy("name")
  );
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
}

/**
 * Get grants by university
 */
export async function getGrantsByUniversity(
  universityId: string,
  status?: string
): Promise<any[]> {
  if (!db) return [];
  const constraints: QueryConstraint[] = [
    where("universityId", "==", universityId),
    orderBy("startDate", "desc"),
  ];

  if (status) {
    constraints.unshift(where("status", "==", status));
  }

  const q = query(collection(db, FSCOLLECTIONS.GRANTS), ...constraints);
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
}

/**
 * Get consortiums by university member
 */
export async function getConsortiumsByUniversityMember(universityId: string): Promise<any[]> {
  if (!db) return [];
  const q = query(
    collection(db, FSCOLLECTIONS.CONSORTIUMS),
    where("universityIds", "array-contains", universityId),
    orderBy("name")
  );
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
}

// ============================================================================
// Count Helpers
// ============================================================================

/**
 * Get count of documents in a collection with optional filters
 * Note: Firestore doesn't have a native count query, so this fetches all matching docs
 * For large collections, consider using a counter document pattern
 */
export async function getDocumentCount(
  collectionName: string,
  constraints: QueryConstraint[] = []
): Promise<number> {
  if (!db) return 0;
  const q = query(collection(db, collectionName), ...constraints);
  const snapshot = await getDocs(q);
  return snapshot.size;
}

/**
 * Get statistics for a university
 */
export async function getUniversityStats(universityId: string) {
  const [opportunityCount, grantCount, contactCount, consortiumCount] = await Promise.all([
    getDocumentCount(FSCOLLECTIONS.OPPORTUNITIES, [where("universityId", "==", universityId)]),
    getDocumentCount(FSCOLLECTIONS.GRANTS, [where("universityId", "==", universityId)]),
    getDocumentCount(FSCOLLECTIONS.CONTACTS, [where("universityId", "==", universityId)]),
    getDocumentCount(FSCOLLECTIONS.CONSORTIUMS, [where("universityIds", "array-contains", universityId)]),
  ]);

  return {
    opportunities: opportunityCount,
    grants: grantCount,
    contacts: contactCount,
    consortiums: consortiumCount,
  };
}
