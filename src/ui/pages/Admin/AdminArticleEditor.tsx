import React, { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { BiSave } from "react-icons/bi";
import { Article } from "../../interface/Article";
import Editor from "../../../utils/Editor";
import { useFirebase } from "../../../utils/FirebaseContext";

const ArticleEditor: React.FC = () => {
    const {saveToDatabase, getFromDatabase, uploadImage} = useFirebase()
    const navigate = useNavigate();
    const { id } = useParams<{ id: string }>();
    const [dataEdit, setDataEdit] = useState<string>("");
    const [title, setTitle] = useState<string>("");
    const [subtitle, setSubTitle] = useState<string>("");
    const [tag, setTag] = useState<string>("");
    const [description, setDescription] = useState<string>("");
    const [img, setImg] = useState<string>("");
    const [HTML, setHTML] = useState<string>("");
    const [isUpload, setIsUpload] = useState<boolean>(false);

    
    const handleSendData = (e: React.FormEvent) => {
        e.preventDefault();
        if (!img) {
            console.log("Image can't be empty!");
            return;
        }

        setIsUpload(true);
        const newData: Article = {
            title,
            subtitle,
            tag,
            article: dataEdit,
            desc: description,
            image: img,
        };

        saveToDatabase(`article/${id || Date.now()}`, newData)
            .then(() => {
                setIsUpload(false);
                navigate("/admin/article");
            })
            .catch((error) => {
                console.error("Error sending data to Firebase:", error);
                setIsUpload(false);
            });
    };

    useEffect(() => {
        if (id) {
            getFromDatabase(`article/${id}`).then(data => {
                if (data) {
                    setHTML(data.article);
                    setDataEdit(data.article);
                    setTitle(data.title);
                    setSubTitle(data.subtitle);
                    setTag(data.tag);
                    setDescription(data.desc);
                    setImg(data.image);
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
                <form className="w-10/12 flex flex-col mx-auto my-8 justify-around items-center" onSubmit={handleSendData}>
                    <div className="flex flex-col w-full">
                        <label className="mt-4 text-xs my-2" htmlFor="title">
                            Judul
                        </label>
                        <input
                            className="px-2 py-1 border-b-2 border-base-dark w-full"
                            required={true}
                            value={title}
                            onChange={(e) => setTitle(e.currentTarget.value)}
                            name="title"
                            id="title"
                            type="text"
                            placeholder="Judul Article"
                        />
                    </div>
                    <div className="flex flex-col w-full">
                        <label className="mt-4 text-xs my-2" htmlFor="subtitle">
                            Sub Judul
                        </label>
                        <input
                            className="px-2 py-1 border-b-2 border-base-dark w-full"
                            required={true}
                            value={subtitle}
                            onChange={(e) => setSubTitle(e.currentTarget.value)}
                            name="subtitle"
                            id="subtitle"
                            type="text"
                            placeholder="Sub Judul Article"
                        />
                    </div>
                    <div className="flex flex-col w-full">
                        <label className="mt-4 text-xs my-2" htmlFor="tag">
                            Tag
                        </label>
                        <input
                            className="px-2 py-1 border-b-2 border-base-dark w-full"
                            required={true}
                            value={tag}
                            onChange={(e) => setTag(e.currentTarget.value)}
                            name="tag"
                            id="tag"
                            type="text"
                            placeholder="Tag Article"
                        />
                    </div>
                    <div className="flex flex-col w-full">
                        <label className="mt-4 text-xs my-2" htmlFor="description">
                            Desc
                        </label>
                        <textarea
                            className="px-2 py-1 border-b-2 border-base-dark w-full"
                            
                            required={true}
                            value={description}
                            onChange={(e) => setDescription(e.currentTarget.value)}
                            name="description"
                            id="description"
                            placeholder="Desc Article"
                        ></textarea>
                    </div>
                    <div className="flex flex-col w-full">
                        <label className="text-xs my-2" htmlFor="image">
                            Gambar
                        </label>
                        <div className="flex items-center gap-x-5">
                            {img && (
                                <a href={img} target="_blank" rel="noreferrer">
                                    <img className="w-16 h-16" src={img} alt="Article" />
                                </a>
                            )}
                            <input
                                required={true}
                                onChange={(e)=>uploadImage(e,setImg)}
                                name="image"
                                id="image"
                                type="file"
                            />
                        </div>
                    </div>
                    <div className="mt-8 w-full">
                        <Editor HTML={HTML} setDataEdit={setDataEdit} />
                    </div>
                    <div className="flex w-full justify-end items-center gap-x-5">
                        <Link
                            className="mt-4 px-6 py-2 inline-flex justify-center items-center bg-white text-primary border border-primary rounded-full font-semibold"
                            to="/admin/Article"
                        >
                            Kembali
                        </Link>
                        <button
                            type="submit"
                            className="mt-4 cursor-pointer px-6 py-2 inline-flex justify-center items-center bg-primary rounded-full text-white font-semibold"
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

export default ArticleEditor;