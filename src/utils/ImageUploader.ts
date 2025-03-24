import imageCompression from "browser-image-compression";
import { FIREBASE_STORE } from "../config/firebaseinit";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";

export const handleUpload = async (
    e: React.ChangeEvent<HTMLInputElement>,
    setImage: (value: string) => void
) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
        // Konfigurasi kompresi
        const options = {
            maxSizeMB: 2, // Maksimum ukuran 0.5MB
            maxWidthOrHeight: 1024, // Resolusi maksimum
            useWebWorker: true, // Gunakan WebWorker untuk performa
        };

        // Kompres gambar
        const compressedFile = await imageCompression(file, options);

        console.log("Original File Size:", (file.size / 1024).toFixed(2) + " KB");
        console.log("Compressed File Size:", (compressedFile.size / 1024).toFixed(2) + " KB");

        // Upload ke Firebase Storage
        const storageRef = ref(FIREBASE_STORE, `images/${Date.now()}/${compressedFile.name}`);
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
                getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
                    setImage(downloadURL);
                });
            }
        );
    } catch (error) {
        console.error("Image compression error:", error);
    }
};
