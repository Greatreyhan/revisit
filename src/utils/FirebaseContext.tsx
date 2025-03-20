import { FIREBASE_STORE } from "../config/firebaseinit";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { FIREBASE_AUTH, FIREBASE_DB } from '../config/firebaseinit';
import {
    onAuthStateChanged,
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword,
    signOut,
    User,
    updatePassword,
} from 'firebase/auth';
import { ref as rtdbRef, set, get, remove } from 'firebase/database';

interface Message{
    message: string
    type : string
}

interface AuthDataProps{
    dealer: string
    location: string
    email: string
    type : string
    name : string
}

// Define the context type
interface FirebaseContextType {
    user: User | null;
    authData: AuthDataProps;
    loading: boolean;
    waiting: (state:boolean) => void
    signIn: (email: string, password: string) => Promise<void>;
    signUp: (email: string, password: string, dealer: string, username: string, location: string, authorization: string) => Promise<void>;
    signOut: () => Promise<void>;
    message: Message;
    setMessage : (obj:Message) => void;
    getFromDatabase: (path: string) => Promise<any>;
    saveToDatabase: (path: string, data: any) => Promise<void>;
    deleteFromDatabase: (path: string) => Promise<void>;
    setUpdatePassword: (lastPassword:string,newPassword: string) => Promise<void>
    uploadImage: (e: React.ChangeEvent<HTMLInputElement>, setImage: (value: string) => void) => void;  // New method signature
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
    const [message, setMessage]  = useState<Message>({message:"",type:""})
    const [authData, setAuthData] = useState<AuthDataProps>({email:"", type:"", dealer:"",location:"",name:""})

    useEffect(() => {
        setLoading(true);
        const unsubscribe = onAuthStateChanged(FIREBASE_AUTH, async (authUser) => {
            await getFromDatabase(`user/${authUser?.uid}`).then(data => {
                if (data) {
                    setAuthData(data)
                }
            });
            setUser(authUser);
            setLoading(false);
        });
        return () => unsubscribe();
        
    }, []);

    const waiting = (state:boolean) => setLoading(state)

    const saveToDatabase = async (path: string, data: any): Promise<void> => {
        try {
            const dbRef = rtdbRef(FIREBASE_DB, path);
            await set(dbRef, data);
            setMessage({message:"Succesfully Save Data",type:"info"})
        } catch (err: any) {
            setMessage({message:"Error saving data :" + err.message,type:"error"})
            setLoading(false);
            throw new Error(err.message || 'Error saving data');
        }
    };


    const signIn = async (email: string, password: string): Promise<void> => {
        try {
            setLoading(true);
            await signInWithEmailAndPassword(FIREBASE_AUTH, email, password);
            setMessage({message:"Succesfully Log In",type:"info"})
            setLoading(false);
        } catch (err: any) {
            setMessage({message:"Error signing in:"+err.message,type:"error"})
            setLoading(false);
        }
    };


    const signUp = async (email: string, password: string, location: string, username: string, dealer: string, authorization: string): Promise<void> => {
        try {
            setLoading(true);
            const dataUser = await createUserWithEmailAndPassword(FIREBASE_AUTH, email, password);
            await saveToDatabase(`user/${dataUser.user.uid}`, {email: dataUser.user.email ,type:authorization, name:username, dealer: dealer, location: location});
            if(authData?.type === "dealer"){
                await saveToDatabase(`cabang/${user?.uid}/${dataUser.user.uid}`, {email: dataUser.user.email ,type:authorization, name:username, dealer: dealer, location: location});
            }
            await signOut(FIREBASE_AUTH);
            setMessage({message:"Succesfully Sign Up",type:"info"})
            setLoading(false);
        } catch (err: any) {
            setMessage({message:"Error signing up :" + err.message,type:"error"})
            setLoading(false);
        }
    };

    const signOutUser = async (): Promise<void> => {
        try {
            setLoading(true);
            await signOut(FIREBASE_AUTH);
            setMessage({message:"Succesfully Sign Out",type:"info"})
            setLoading(false);
        } catch (err: any) {
            setMessage({message:"Error signing out :" + err.message,type:"error"})
            setLoading(false);
        }
    };

    const getFromDatabase = async (path: string): Promise<any> => {
        try {
            const dbRef = rtdbRef(FIREBASE_DB, path);
            const snapshot = await get(dbRef);
            return snapshot.exists() ? snapshot.val() : null;
        } catch (err: any) {
            setMessage({message:"Error fetch data :" + err.message,type:"error"})
            throw new Error(err.message || 'Error fetching data');
        }
    };

    const deleteFromDatabase = async (path: string): Promise<void> => {
        try {
            setLoading(true);
            const recordRef = rtdbRef(FIREBASE_DB, path);
            await remove(recordRef);
            setMessage({message:"Succesfully Delete Data",type:"info"})
            setLoading(false);
            window.location.reload();
        } catch (err: any) {
            setMessage({message:"Error deleting data :" + err.message,type:"error"})
            setLoading(false);
        }
    };

    const uploadImage = (e: React.ChangeEvent<HTMLInputElement>, setImage: (value: string) => void): void => {
        const file = e.target.files?.[0];
        if (file) {
            setLoading(true);
            const storageRef = ref(FIREBASE_STORE, `images/${file.name}`);
            const uploadTask = uploadBytesResumable(storageRef, file);
            setMessage({message:"Uploading image, please wait",type:"waiting"})
            uploadTask.on(
                "state_changed",
                (snapshot) => {
                    const progress =
                    Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100);
                    setMessage({message:"Uploading image,"+ progress + "% done",type:"waiting"})
                },
                (err) => {
                    setMessage({message:"Error uploading image :" + err.message,type:"error"})
                },
                () => {
                    getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
                        setMessage({message:"Succesfully Upload Image",type:"done"})
                        setImage(downloadURL);
                    });
                }
            );
            setLoading(false);
        }
    };

    const setUpdatePassword = async (lastPassword:string, newPassword:string) =>{
        setLoading(true);
        if (user) {
            try {
                signIn((user?.email || ""), lastPassword);
                await updatePassword(user, newPassword);
                setLoading(false);
                setMessage({message:"Succesfully Change Password",type:"info"})
            } catch (err:any) {
                setLoading(false);
                setMessage({message:"Error update password :" + err.message,type:"error"})
            }
        } else {
            setMessage({message:"User Not Found!",type:"error"})
        }
        setLoading(false);
    }
    

    const value: FirebaseContextType = {
        user,
        authData,
        loading,
        signIn,
        signUp,
        signOut: signOutUser,
        message,
        waiting,
        setMessage,
        setUpdatePassword,
        getFromDatabase,
        saveToDatabase,
        deleteFromDatabase,
        uploadImage, 
    };

    return (
        <FirebaseContext.Provider value={value} >
            {children}
        </FirebaseContext.Provider>
    );
};
