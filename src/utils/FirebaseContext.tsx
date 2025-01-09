import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { FIREBASE_AUTH } from '../config/firebaseinit';
import {
    onAuthStateChanged,
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword,
    signOut,
    User,
} from 'firebase/auth';

// Define the context type
interface FirebaseContextType {
    user: User | null;
    loading: boolean;
    signIn: (email: string, password: string) => Promise<void>;
    signUp: (email: string, password: string) => Promise<void>;
    signOut: () => Promise<void>;
    errorMessage: string;
}

// Initialize the context
const FirebaseContext = createContext<FirebaseContextType | undefined>(undefined);

// Hook to use Firebase context
export const useFirebase = (): FirebaseContextType => {
    const context = useContext(FirebaseContext);
    if (!context) {
        throw new Error('useFirebase must be used within a FirebaseProvider');
    }
    return context;
};

// Provider component
export const FirebaseProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [errorMessage, setErrorMessage] = useState<string>('');

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(FIREBASE_AUTH, (authUser) => {
            setUser(authUser);
            setLoading(false);
        });
        return () => unsubscribe();
    }, []);

    const signIn = async (email: string, password: string): Promise<void> => {
        try {
            await signInWithEmailAndPassword(FIREBASE_AUTH, email, password);
            setErrorMessage(''); // Clear any existing error messages
        } catch (err: any) {
            setErrorMessage(err.message || 'Error signing in');
            console.error('Error Sign In:', err);
        }
    };

    const signUp = async (email: string, password: string): Promise<void> => {
        try {
            await createUserWithEmailAndPassword(FIREBASE_AUTH, email, password);
            setErrorMessage(''); // Clear any existing error messages
        } catch (err: any) {
            setErrorMessage(err.message || 'Error signing up');
            console.error('Error Sign Up:', err);
        }
    };

    const signOutUser = async (): Promise<void> => {
        try {
            await signOut(FIREBASE_AUTH);
            setErrorMessage(''); // Clear any existing error messages
        } catch (err: any) {
            setErrorMessage(err.message || 'Error signing out');
            console.error('Error Sign Out:', err);
        }
    };

    const value: FirebaseContextType = {
        user,
        loading,
        signIn,
        signUp,
        signOut: signOutUser,
        errorMessage,
    };

    return (
        <FirebaseContext.Provider value={value}>
            {children}
        </FirebaseContext.Provider>
    );
};
