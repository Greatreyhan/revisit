import React, { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { onValue, ref as rtdbRef, set } from "firebase/database";
import { FIREBASE_STORE, FIREBASE_DB } from "../../config/firebaseinit";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { BiSave } from "react-icons/bi";

interface ServiceData {
    title: string;
    subtitle: string;
    description: string;
    image: string;
    icon: string;
    subservice: SubserviceData[]
}

interface SubserviceData {
    type: string;
    title: string;
    subtitle: string;
    description: string;
    image: string;
}

const AdminServiceEditor: React.FC = () => {
    const navigate = useNavigate();
    const { id } = useParams<{ id: string }>();
    const [title, setTitle] = useState<string>("");
    const [subtitle, setSubtitle] = useState<string>("");
    const [description, setDescription] = useState<string>("");
    const [image, setImage] = useState<string>("");
    const [icon, setIcon] = useState<string>("");
    const [isUpload, setIsUpload] = useState<boolean>(false);
    const [subservice, setSubservice] = useState<SubserviceData[]>([])

    const handleSendData = (e: React.FormEvent) => {
        e.preventDefault();

        if (!icon || !image) {
            console.log("Image can't be empty!");
            return;
        }

        setIsUpload(true);

        const timestamp = Date.now();
        const dbRef = rtdbRef(FIREBASE_DB, `service/${id || timestamp}`);

        const newData: ServiceData = {
            title,
            subtitle,
            description,
            image,
            icon,
            subservice
        };

        set(dbRef, newData)
            .then(() => {
                setIsUpload(false);
                navigate("/admin/service");
            })
            .catch((error) => {
                setIsUpload(false);
                console.error("Error sending data to Firebase:", error);
            });
    };

    const handleUploadGambar = (e: React.ChangeEvent<HTMLInputElement>) => {
        setIsUpload(true);
            const file = e.target.files?.[0];
            if (file) {
                const storageRef = ref(FIREBASE_STORE, `images/${file.name}`);
                const uploadTask = uploadBytesResumable(storageRef, file);
    
                uploadTask.on(
                    "state_changed",
                    (snapshot) => {
                        const progress =
                            Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100);
                        console.log("Upload is " + progress + "% done");
                    },
                    (error) => console.error(error),
                    () => {
                        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
                            setImage(downloadURL);
                            setIsUpload(false);
                        });
                    }
                );
            }
            setIsUpload(false);
        };

        const handleUploadIcon = (e: React.ChangeEvent<HTMLInputElement>) => {
            setIsUpload(true);
            const file = e.target.files?.[0];
            if (file) {
                const storageRef = ref(FIREBASE_STORE, `images/${file.name}`);
                const uploadTask = uploadBytesResumable(storageRef, file);
    
                uploadTask.on(
                    "state_changed",
                    (snapshot) => {
                        const progress =
                            Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100);
                        console.log("Upload is " + progress + "% done");
                    },
                    (error) => console.error(error),
                    () => {
                        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
                            setIcon(downloadURL);
                            setIsUpload(false);
                        });
                    }
                );
            }
            setIsUpload(false);
        };

    useEffect(() => {
        if (id) {
            onValue(rtdbRef(FIREBASE_DB, `service/${id}`), (snapshot) => {
                const data = snapshot.val() as ServiceData | null;
                if (data) {
                    setTitle(data.title);
                    setSubtitle(data.subtitle);
                    setDescription(data.description);
                    setImage(data.image)
                    setIcon(data.icon)
                    setSubservice(data.subservice)
                }
            });
        }
    }, [id]);


    return (
        <div className="App overflow-x-hidden">
            <div className="pt-16">
                {isUpload && (
                    <div className="w-full h-full fixed bg-black bg-opacity-50 z-50 top-0 flex justify-center items-center">
                        <div className="loader"></div>
                    </div>
                )}
                <form className="w-10/12 flex flex-col mx-auto my-8 justify-around items-center">
                    <div className="flex flex-col w-full">
                        <label className="mt-4 text-xs my-2" htmlFor="title">
                            Judul
                        </label>
                        <input
                            className="px-2 py-1 border-b-2 border-base-dark w-full"
                            required
                            value={title}
                            onChange={(e) => setTitle(e.currentTarget.value)}
                            name="title"
                            id="title"
                            type="text"
                            placeholder="Judul Service"
                        />
                    </div>
                    <div className="flex flex-col w-full">
                        <label className="mt-4 text-xs my-2" htmlFor="title">
                            Sub Judul
                        </label>
                        <input
                            className="px-2 py-1 border-b-2 border-base-dark w-full"
                            required
                            value={subtitle}
                            onChange={(e) => setSubtitle(e.currentTarget.value)}
                            name="subtitle"
                            id="subtitle"
                            type="text"
                            placeholder="Sub Judul Service"
                        />
                    </div>
                    <div className="flex flex-col w-full">
                        <label className="mt-4 text-xs my-2" htmlFor="description">
                            Description
                        </label>
                        <textarea
                            className="px-2 py-1 border-b-2 border-base-dark w-full"
                            required
                            value={description}
                            onChange={(e) => setDescription(e.currentTarget.value)}
                            name="description"
                            id="description"
                            placeholder="Desc Service"
                        ></textarea>
                    </div>
                    <div className="flex flex-col w-full">
                        <label className="text-xs my-2" htmlFor="image">
                            Gambar
                        </label>
                        <div className="flex items-center gap-x-5">
                            {image && (
                                <a href={image} target="_blank" rel="noreferrer">
                                    <img className="w-16 h-16" src={image} alt="Article" />
                                </a>
                            )}
                            <input
                                required
                                onChange={handleUploadGambar}
                                name="image"
                                id="image"
                                type="file"
                            />
                        </div>
                    </div>
                    <div className="flex flex-col w-full">
                        <label className="text-xs my-2" htmlFor="image">
                            Icon
                        </label>
                        <div className="flex items-center gap-x-5">
                            {icon && (
                                <a href={icon} target="_blank" rel="noreferrer">
                                    <img className="w-16 h-16" src={icon} alt="Article" />
                                </a>
                            )}
                            <input
                                required
                                onChange={handleUploadIcon}
                                name="icon"
                                id="icon"
                                type="file"
                            />
                        </div>
                    </div>
                    <div className="flex w-full justify-end items-center gap-x-5">
                        <Link
                            className="mt-4 px-6 py-2 inline-flex justify-center items-center bg-white text-primary border border-primary-light rounded-full font-semibold"
                            to="/admin/service"
                        >
                            Kembali
                        </Link>
                        <button
                            onClick={handleSendData}
                            className="mt-4 px-6 py-2 inline-flex justify-center items-center bg-primary rounded-full text-white font-semibold"
                        >
                            <BiSave className="mr-2" />
                            Save
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AdminServiceEditor;
