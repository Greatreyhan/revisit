import { FIREBASE_STORE } from "../config/firebaseinit";
import { ref, uploadBytesResumable, getDownloadURL, deleteObject } from "firebase/storage";
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { FIREBASE_AUTH, FIREBASE_DB } from '../config/firebaseinit';
import imageCompression from "browser-image-compression";
import {
    onAuthStateChanged,
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword,
    signOut,
    User,
    updatePassword,
    updateEmail,
    sendEmailVerification
} from 'firebase/auth';
import { ref as rtdbRef, set, get, remove } from 'firebase/database';
import { AttachmentItem } from "../ui/interface/Report";

interface Message {
    message: string
    type: string
}

interface AuthDataProps {
    dealer: string
    location: string
    email: string
    type: string
    name: string
}

// Define the context type
interface FirebaseContextType {
    user: User | null;
    authData: AuthDataProps;
    loading: boolean;
    waiting: (state: boolean) => void
    signIn: (email: string, password: string) => Promise<void>;
    signUp: (email: string, password: string, dealer: string, username: string, location: string, authorization: string) => Promise<void>;
    signOut: () => Promise<void>;
    message: Message;
    setMessage: (obj: Message) => void;
    getFromDatabase: (path: string) => Promise<any>;
    saveToDatabase: (path: string, data: any) => Promise<void>;
    deleteFromDatabase: (path: string) => Promise<void>;
    setUpdatePassword: (lastPassword: string, newPassword: string) => Promise<void>
    uploadImage: (e: React.ChangeEvent<HTMLInputElement>, setImage: (value: string) => void) => void;  // New method signature
    uploadImageWithPath: (e: React.ChangeEvent<HTMLInputElement>, setImage: (value: string) => void, setId: (date: number) => void, pathReq: string) => void;  // New method signature
    uploadEditedImageWithPath: (file: File, setImage: (value: string) => void, setId: (date: number) => void, pathReq: string) => void;  // New method signature
    deleteImage: (filename: string) => Promise<void>
    deleteImageWithPath: (filename: string, id: string) => Promise<void>
    updateImage: (id: string, status: string) => Promise<void>
    updateUserEmail: (lastPassword: string, newEmail: string) => Promise<void>;
    verifyEmail: () => Promise<void>
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
    const [message, setMessage] = useState<Message>({ message: "", type: "" })
    const [authData, setAuthData] = useState<AuthDataProps>({ email: "", type: "", dealer: "", location: "", name: "" })


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

    const waiting = (state: boolean) => setLoading(state)

    const saveToDatabase = async (path: string, data: any): Promise<void> => {
        try {
            const dbRef = rtdbRef(FIREBASE_DB, path);
            await set(dbRef, data);
            setMessage({ message: "Succesfully Save Data", type: "info" })
        } catch (err: any) {
            setMessage({ message: "Error saving data :" + err.message, type: "error" })
            setLoading(false);
            throw new Error(err.message || 'Error saving data');
        }
    };


    const signIn = async (email: string, password: string): Promise<void> => {
        try {
            setLoading(true);
            await signInWithEmailAndPassword(FIREBASE_AUTH, email, password);
            setMessage({ message: "Succesfully Log In", type: "info" })
            setLoading(false);
        } catch (err: any) {
            setMessage({ message: "Error signing in:" + err.message, type: "error" })
            setLoading(false);
        }
    };


    const signUp = async (email: string, password: string, location: string, username: string, dealer: string, authorization: string): Promise<void> => {
        try {
            setLoading(true);
            console.log({ email, password, location, username, dealer, authorization })
            const dataUser = await createUserWithEmailAndPassword(FIREBASE_AUTH, email, password);
            await saveToDatabase(`user/${dataUser.user.uid}`, { email: dataUser.user.email, type: authorization, name: username, dealer: dealer, location: location });
            if (authData?.type === "Dealer") {
                console.log("save to dealer")
                await saveToDatabase(`cabang/${user?.uid}/${dataUser.user.uid}`, { email: dataUser.user.email, type: authorization, name: username, dealer: dealer, location: location });
            }
            await signOut(FIREBASE_AUTH);
            setMessage({ message: "Succesfully Sign Up", type: "info" })
            setLoading(false);
        } catch (err: any) {
            setMessage({ message: "Error signing up :" + err.message, type: "error" })
            setLoading(false);
        }
    };

    const signOutUser = async (): Promise<void> => {
        try {
            setLoading(true);
            await signOut(FIREBASE_AUTH);
            setMessage({ message: "Succesfully Sign Out", type: "info" })
            setLoading(false);
        } catch (err: any) {
            setMessage({ message: "Error signing out :" + err.message, type: "error" })
            setLoading(false);
        }
    };

    const getFromDatabase = async (path: string): Promise<any> => {
        try {
            const dbRef = rtdbRef(FIREBASE_DB, path);
            const snapshot = await get(dbRef);
            return snapshot.exists() ? snapshot.val() : null;
        } catch (err: any) {
            setMessage({ message: "Error fetch data :" + err.message, type: "error" })
            throw new Error(err.message || 'Error fetching data');
        }
    };

    const deleteFromDatabase = async (path: string): Promise<void> => {
        try {
            setLoading(true);
            const recordRef = rtdbRef(FIREBASE_DB, path);
            const data = await getFromDatabase(path)
            data?.attachments?.map(async (e: AttachmentItem) => {
                if (e?.imageId) {
                    await remove(rtdbRef(FIREBASE_DB, `images/${user?.uid}/${e.imageId.toString()}`));
                }
            })
            await remove(recordRef);
            setMessage({ message: "Succesfully Delete Data", type: "info" })
            setLoading(false);
            window.location.reload();
        } catch (err: any) {
            setMessage({ message: "Error deleting data :" + err.message, type: "error" })
            setLoading(false);
        }
    };

    const uploadImage = async (e: React.ChangeEvent<HTMLInputElement>, setImage: (value: string) => void): Promise<void> => {
        const file = e.target.files?.[0];
        setLoading(true);

        if (!file) return;

        try {
            // Konfigurasi kompresi
            const options = {
                maxSizeMB: 2, // Maksimum ukuran 2MB
                maxWidthOrHeight: 1024, // Resolusi maksimum
                useWebWorker: true, // Gunakan WebWorker untuk performa
            };

            // Kompres gambar
            const compressedFile = await imageCompression(file, options);

            console.log("Original File Size:", (file.size / 1024).toFixed(2) + " KB");
            console.log("Compressed File Size:", (compressedFile.size / 1024).toFixed(2) + " KB");

            // Buat nama file baru dengan Date.now() dan pertahankan ekstensi file
            const fileExtension = file.name.split('.').pop();
            const dateTime = Date.now()
            const newFileName = `${dateTime}.${fileExtension}`;

            // Upload ke Firebase Storage menggunakan nama file baru
            const storageRef = ref(FIREBASE_STORE, `images/${newFileName}`);
            const uploadTask = uploadBytesResumable(storageRef, compressedFile);

            uploadTask.on(
                "state_changed",
                (snapshot) => {
                    const progress = Math.round(
                        (snapshot.bytesTransferred / snapshot.totalBytes) * 100
                    );
                    console.log("Upload is " + progress + "% done");
                },
                (error) => console.error(error),
                () => {
                    getDownloadURL(uploadTask.snapshot.ref).then(async (downloadURL) => {
                        // const dbRef = rtdbRef(FIREBASE_DB, `images/${dateTime}`);
                        // await set(dbRef, {url: downloadURL, status:"pending"});
                        setImage(downloadURL);
                    });
                }
            );
            setLoading(false);
        } catch (error) {
            console.error("Image compression error:", error);
            setLoading(false);
        }

    };

    const uploadImageWithPath = async (e: React.ChangeEvent<HTMLInputElement>, setImage: (value: string) => void, setId: (date: number) => void, pathReq: string): Promise<void> => {
        const file = e.target.files?.[0];
        setLoading(true);

        if (!file) return;

        try {
            // Konfigurasi kompresi
            const options = {
                maxSizeMB: 2, // Maksimum ukuran 2MB
                maxWidthOrHeight: 1024, // Resolusi maksimum
                useWebWorker: true, // Gunakan WebWorker untuk performa
            };

            // Kompres gambar
            const compressedFile = await imageCompression(file, options);

            console.log("Original File Size:", (file.size / 1024).toFixed(2) + " KB");
            console.log("Compressed File Size:", (compressedFile.size / 1024).toFixed(2) + " KB");

            // Buat nama file baru dengan Date.now() dan pertahankan ekstensi file
            const fileExtension = file.name.split('.').pop();
            const dateTime = Date.now()
            const newFileName = `${dateTime}.${fileExtension}`;

            // Upload ke Firebase Storage menggunakan nama file baru
            const storageRef = ref(FIREBASE_STORE, `images/${newFileName}`);
            const uploadTask = uploadBytesResumable(storageRef, compressedFile);

            uploadTask.on(
                "state_changed",
                (snapshot) => {
                    const progress = Math.round(
                        (snapshot.bytesTransferred / snapshot.totalBytes) * 100
                    );
                    console.log("Upload is " + progress + "% done");
                },
                (error) => console.error(error),
                () => {
                    getDownloadURL(uploadTask.snapshot.ref).then(async (downloadURL) => {
                        const dbRef = rtdbRef(FIREBASE_DB, `images/${pathReq}/${dateTime}`);
                        await set(dbRef, { url: downloadURL, status: "pending" });
                        setImage(downloadURL);
                        setId(dateTime)
                    });
                }
            );
            setLoading(false);
        } catch (error) {
            console.error("Image compression error:", error);
            setLoading(false);
        }

    };

    const uploadEditedImageWithPath = async (file: File, setImage: (value: string) => void, setId: (date: number) => void, pathReq: string): Promise<void> => {
        setLoading(true);
        if (!file) return;

        try {
            // Konfigurasi kompresi
            const options = {
                maxSizeMB: 2, // Maksimum ukuran 2MB
                maxWidthOrHeight: 1024, // Resolusi maksimum
                useWebWorker: true, // Gunakan WebWorker untuk performa
            };

            // Kompres gambar
            const compressedFile = await imageCompression(file, options);

            console.log("Original File Size:", (file.size / 1024).toFixed(2) + " KB");
            console.log("Compressed File Size:", (compressedFile.size / 1024).toFixed(2) + " KB");

            // Buat nama file baru dengan Date.now() dan pertahankan ekstensi file
            const fileExtension = file.name.split('.').pop();
            const dateTime = Date.now()
            const newFileName = `${dateTime}.${fileExtension}`;

            // Upload ke Firebase Storage menggunakan nama file baru
            const storageRef = ref(FIREBASE_STORE, `images/${newFileName}`);
            const uploadTask = uploadBytesResumable(storageRef, compressedFile);

            uploadTask.on(
                "state_changed",
                (snapshot) => {
                    const progress = Math.round(
                        (snapshot.bytesTransferred / snapshot.totalBytes) * 100
                    );
                    console.log("Upload is " + progress + "% done");
                },
                (error) => console.error(error),
                () => {
                    getDownloadURL(uploadTask.snapshot.ref).then(async (downloadURL) => {
                        const dbRef = rtdbRef(FIREBASE_DB, `images/${pathReq}/${dateTime}`);
                        await set(dbRef, { url: downloadURL, status: "pending" });
                        setImage(downloadURL);
                        setId(dateTime)
                    });
                }
            );
            setLoading(false);
        } catch (error) {
            console.error("Image compression error:", error);
            setLoading(false);
        }

    };

    const updateImage = async (id: string, status: string) => {
        try {
            const dbRef = rtdbRef(FIREBASE_DB, `images/${user?.uid}/${id}/status`);
            await set(dbRef, status);
        } catch (error: any) {
            setMessage({ message: "Error update image status: " + error.message, type: "error" });
        } finally {
            setLoading(false);
        }
    }

    const deleteImage = async (filename: string): Promise<void> => {
        try {
            setLoading(true);
            // Buat storage path: menggunakan filename (termasuk ekstensi)
            const storagePath = `images/${filename}`;
            // Buat database path: filename tanpa ekstensi
            // const filenameWithoutExt = filename.split('.').slice(0, -1).join('.');
            // const databasePath = `images/${filenameWithoutExt}`;

            // Hapus file dari Firebase Storage
            const imageRef = ref(FIREBASE_STORE, storagePath);
            await deleteObject(imageRef);

            // Hapus data referensi di Realtime Database
            // const dbRef = rtdbRef(FIREBASE_DB, databasePath);
            // await remove(dbRef);

            setMessage({ message: "Successfully deleted image", type: "info" });
        } catch (error: any) {
            setMessage({ message: "Error deleting image: " + error.message, type: "error" });
        } finally {
            setLoading(false);
        }
    };

    const deleteImageWithPath = async (filename: string, id: string): Promise<void> => {
        try {
            setLoading(true);
            // Buat storage path: menggunakan filename (termasuk ekstensi)
            const storagePath = `images/${filename}`;
            // Buat database path: filename tanpa ekstensi
            // const filenameWithoutExt = filename.split('.').slice(0, -1).join('.');

            // Hapus file dari Firebase Storage
            const imageRef = ref(FIREBASE_STORE, storagePath);
            await deleteObject(imageRef);

            // Hapus data referensi di Realtime Database
            const dbRef = rtdbRef(FIREBASE_DB, `images/${user?.uid}/${id}`);
            await remove(dbRef);

            setMessage({ message: "Successfully deleted image", type: "info" });
        } catch (error: any) {
            setMessage({ message: "Error deleting image: " + error.message, type: "error" });
        } finally {
            setLoading(false);
        }
    };

    const setUpdatePassword = async (lastPassword: string, newPassword: string) => {
        setLoading(true);
        if (user) {
            try {
                signIn((user?.email || ""), lastPassword);
                await updatePassword(user, newPassword);
                setLoading(false);
                setMessage({ message: "Succesfully Change Password", type: "info" })
            } catch (err: any) {
                setLoading(false);
                setMessage({ message: "Error update password :" + err.message, type: "error" })
            }
        } else {
            setMessage({ message: "User Not Found!", type: "error" })
        }
        setLoading(false);
    }

    const updateUserEmail = async (lastPassword: string, newEmail: string): Promise<void> => {
        setLoading(true);
        if (user) {
            try {
                signIn((user?.email || ""), lastPassword);
                // Update email di Firebase Auth
                await updateEmail(user, newEmail);
                // Jika ingin, update email pada data di Realtime Database
                const dbRef = rtdbRef(FIREBASE_DB, `user/${user.uid}`);
                await set(dbRef, { ...authData, email: newEmail });
                setMessage({ message: "Email berhasil diupdate", type: "info" });
            } catch (error: any) {
                setMessage({ message: "Error update email: " + error.message, type: "error" });
            } finally {
                setLoading(false);
            }
        } else {
            setMessage({ message: "User tidak ditemukan", type: "error" });
            setLoading(false);
        }
    };

    const verifyEmail = async (): Promise<void> => {
        if (user) {
            try {
                await sendEmailVerification(user);
                setMessage({ message: "Verification email has been sent.", type: "info" });
            } catch (error: any) {
                setMessage({ message: "Error sending verification email: " + error.message, type: "error" });
            }
        } else {
            setMessage({ message: "User tidak ditemukan", type: "error" });
        }
    };

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
        uploadImageWithPath,
        uploadEditedImageWithPath,
        deleteImage,
        deleteImageWithPath,
        updateImage,
        updateUserEmail,
        verifyEmail
    };

    return (
        <FirebaseContext.Provider value={value} >
            {children}
        </FirebaseContext.Provider>
    );
};
