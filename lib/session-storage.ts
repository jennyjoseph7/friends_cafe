// Session storage utility for persisting user data across sessions
// This allows us to restore user state when they log back in

export interface UserSession {
  cart: any[];
  addresses: any[];
  recentOrders: any[];
  preferences: Record<string, any>;
  lastCheckoutStep?: string;
}

const SESSION_PREFIX = 'friendsCafe_session_';

// Gets a storage key based on the user's phone number
export const getSessionKey = (phone: string): string => {
  // Normalize the phone number to remove spaces or special characters
  const normalizedPhone = phone.replace(/\s+/g, '').replace(/[^0-9+]/g, '');
  return `${SESSION_PREFIX}${normalizedPhone}`;
};

// Save session data for a specific user
export const saveUserSession = (phone: string, sessionData: Partial<UserSession>): void => {
  try {
    const sessionKey = getSessionKey(phone);
    
    // Get existing session data or initialize a new one
    const existingData = getUserSession(phone) || {
      cart: [],
      addresses: [],
      recentOrders: [],
      preferences: {},
    };
    
    // Merge the new data with existing data
    const updatedSession = {
      ...existingData,
      ...sessionData,
      // Ensure these properties are updated correctly without overwriting unrelated data
      preferences: {
        ...existingData.preferences,
        ...(sessionData.preferences || {})
      }
    };
    
    localStorage.setItem(sessionKey, JSON.stringify(updatedSession));
  } catch (error) {
    console.error('Failed to save user session:', error);
  }
};

// Get user session data
export const getUserSession = (phone: string): UserSession | null => {
  try {
    const sessionKey = getSessionKey(phone);
    const sessionData = localStorage.getItem(sessionKey);
    
    if (sessionData) {
      return JSON.parse(sessionData);
    }
    return null;
  } catch (error) {
    console.error('Failed to get user session:', error);
    return null;
  }
};

// Clear user session data (used for specific cleanup tasks)
export const clearUserSessionData = (phone: string, dataType?: keyof UserSession): void => {
  try {
    const sessionKey = getSessionKey(phone);
    const sessionData = getUserSession(phone);
    
    if (!sessionData) return;
    
    if (dataType) {
      // Clear only specific data type
      const updatedSession = { ...sessionData };
      
      if (dataType === 'cart' || dataType === 'addresses' || dataType === 'recentOrders') {
        updatedSession[dataType] = [];
      } else if (dataType === 'preferences') {
        updatedSession[dataType] = {};
      } else if (dataType === 'lastCheckoutStep') {
        delete updatedSession[dataType];
      }
      
      localStorage.setItem(sessionKey, JSON.stringify(updatedSession));
    } else {
      // Clear entire session
      localStorage.removeItem(sessionKey);
    }
  } catch (error) {
    console.error('Failed to clear user session data:', error);
  }
};

// Check if a user has session data
export const hasUserSession = (phone: string): boolean => {
  return getUserSession(phone) !== null;
};

// Save a specific part of the user session
export const saveUserSessionItem = <T>(
  phone: string, 
  key: keyof UserSession, 
  data: T
): void => {
  const sessionUpdate = {
    [key]: data
  } as Partial<UserSession>;
  
  saveUserSession(phone, sessionUpdate);
};

// Get a specific part of the user session
export const getUserSessionItem = <T>(
  phone: string,
  key: keyof UserSession
): T | null => {
  const session = getUserSession(phone);
  if (session && session[key] !== undefined) {
    return session[key] as T;
  }
  return null;
}; 