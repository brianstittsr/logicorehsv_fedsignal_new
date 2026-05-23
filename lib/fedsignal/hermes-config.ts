/**
 * Hermes Agent Configuration Management
 * 
 * Functions to load, save, and manage Hermes Agent configuration
 */

import { doc, getDoc, setDoc, Timestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { FSCOLLECTIONS, FSHermesConfigDoc, HermesHostingMode, HermesModelProvider, HermesNotificationDigest } from "@/lib/fedsignal/schema";

/**
 * Default Hermes configuration
 */
export const DEFAULT_HERMES_CONFIG: Omit<FSHermesConfigDoc, "id" | "createdAt" | "updatedAt"> = {
  hosting: {
    mode: "vercel-edge",
    backendUrl: "",
    region: "us-east-1",
  },
  interfaces: {
    chat: {
      enabled: true,
      default: true,
    },
    messaging: {
      enabled: false,
      platforms: [],
      config: {},
    },
    cli: {
      enabled: false,
      allowedUsers: [],
    },
  },
  models: {
    defaultProvider: "openai",
    providers: {
      openai: { apiKey: "", model: "gpt-4" },
    },
    useCaseDefaults: {
      analysis: "gpt-4",
      notifications: "gpt-3.5-turbo",
      chat: "gpt-4",
    },
  },
  samgov: {
    pollingInterval: 60, // 60 minutes
    enabledUniversities: [],
    notificationDigest: "daily",
  },
};

/**
 * Load Hermes configuration from Firestore
 */
export async function loadHermesConfig(): Promise<FSHermesConfigDoc | null> {
  if (!db) return null;
  
  try {
    const docRef = doc(db, FSCOLLECTIONS.HERMES_CONFIG, "default");
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      return docSnap.data() as FSHermesConfigDoc;
    }
    
    return null;
  } catch (error) {
    console.error("Error loading Hermes config:", error);
    return null;
  }
}

/**
 * Save Hermes configuration to Firestore
 */
export async function saveHermesConfig(config: Partial<FSHermesConfigDoc>): Promise<boolean> {
  if (!db) {
    console.error("Firebase not initialized");
    return false;
  }

  try {
    const docRef = doc(db, FSCOLLECTIONS.HERMES_CONFIG, "default");
    const existingDoc = await getDoc(docRef);
    
    const configData: FSHermesConfigDoc = {
      id: "default",
      ...DEFAULT_HERMES_CONFIG,
      ...config,
      createdAt: existingDoc.exists() 
        ? (existingDoc.data() as FSHermesConfigDoc).createdAt 
        : Timestamp.now(),
      updatedAt: Timestamp.now(),
    };
    
    await setDoc(docRef, configData, { merge: true });
    return true;
  } catch (error) {
    console.error("Error saving Hermes config:", error);
    return false;
  }
}

/**
 * Initialize Hermes configuration with defaults
 */
export async function initializeHermesConfig(): Promise<boolean> {
  const existing = await loadHermesConfig();
  if (existing) return true;
  
  return await saveHermesConfig(DEFAULT_HERMES_CONFIG);
}

/**
 * Get hosting mode configuration
 */
export function getHostingMode(config: FSHermesConfigDoc | null): HermesHostingMode {
  return config?.hosting.mode || DEFAULT_HERMES_CONFIG.hosting.mode;
}

/**
 * Check if chat interface is enabled
 */
export function isChatEnabled(config: FSHermesConfigDoc | null): boolean {
  return config?.interfaces.chat.enabled ?? DEFAULT_HERMES_CONFIG.interfaces.chat.enabled;
}

/**
 * Check if messaging gateway is enabled
 */
export function isMessagingEnabled(config: FSHermesConfigDoc | null): boolean {
  return config?.interfaces.messaging.enabled ?? DEFAULT_HERMES_CONFIG.interfaces.messaging.enabled;
}

/**
 * Get default model provider
 */
export function getDefaultModelProvider(config: FSHermesConfigDoc | null): HermesModelProvider {
  return config?.models.defaultProvider || DEFAULT_HERMES_CONFIG.models.defaultProvider;
}

/**
 * Get model for specific use case
 */
export function getModelForUseCase(
  config: FSHermesConfigDoc | null,
  useCase: "analysis" | "notifications" | "chat"
): string {
  return config?.models.useCaseDefaults[useCase] || DEFAULT_HERMES_CONFIG.models.useCaseDefaults[useCase];
}

/**
 * Get SAM.gov polling interval
 */
export function getSamGovPollingInterval(config: FSHermesConfigDoc | null): number {
  return config?.samgov.pollingInterval || DEFAULT_HERMES_CONFIG.samgov.pollingInterval;
}

/**
 * Get enabled universities for SAM.gov
 */
export function getEnabledUniversities(config: FSHermesConfigDoc | null): string[] {
  return config?.samgov.enabledUniversities || DEFAULT_HERMES_CONFIG.samgov.enabledUniversities;
}

/**
 * Get notification digest setting
 */
export function getNotificationDigest(config: FSHermesConfigDoc | null): HermesNotificationDigest {
  return config?.samgov.notificationDigest || DEFAULT_HERMES_CONFIG.samgov.notificationDigest;
}
