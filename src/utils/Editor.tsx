import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import { FIREBASE_STORE } from "../config/firebaseinit";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";

class MyUploadAdapter {
    loader: any;

    constructor(loader: any) {
        this.loader = loader;
    }

    upload() {
        return this.loader.file.then(
            (file: File) =>
                new Promise((resolve, reject) => {
                    const storageRef = ref(FIREBASE_STORE, `images/${file.name}`);
                    const uploadTask = uploadBytesResumable(storageRef, file);
                    uploadTask.on(
                        "state_changed",
                        (snapshot) => {
                            const progress =
                                Math.round(
                                    (snapshot.bytesTransferred / snapshot.totalBytes) * 100
                                );
                            console.log("Upload is " + progress + "% done");
                        },
                        (error) => {
                            switch (error.code) {
                                case "storage/unauthorized":
                                    reject("User doesn't have permission to access the object");
                                    break;
                                case "storage/canceled":
                                    reject("User canceled the upload");
                                    break;
                                case "storage/unknown":
                                    reject(
                                        "Unknown error occurred, inspect error.serverResponse"
                                    );
                                    break;
                            }
                        },
                        () => {
                            getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
                                resolve({
                                    default: downloadURL,
                                });
                            });
                        }
                    );
                })
        );
    }

    abort() {
        // Optional method
    }
}

interface EditorData{
    HTML: any;
    setDataEdit: any;
}

const Editor: React.FC<EditorData> = ({ HTML, setDataEdit }) => {

    function MyCustomUploadAdapterPlugin(editor: any) {
        editor.plugins.get("FileRepository").createUploadAdapter = (loader: any) => {
            return new MyUploadAdapter(loader);
        };
    }
    
    const handlerCKEDITOR = (_event: any, editor: any) => {
        const data = editor.getData();
        setDataEdit(data);
    };

    const custom_config = {
        extraPlugins: [MyCustomUploadAdapterPlugin],
        table: {
            contentToolbar: ["tableColumn", "tableRow", "mergeTableCells"],
        },
    };
    return (
        <>
            <CKEditor
                editor={ClassicEditor as any}
                config={custom_config}
                data={HTML}
                onReady={(editor) => {
                    console.log("Editor is ready to use!", editor);
                }}
                onChange={(event, editor) => handlerCKEDITOR(event, editor)}
            />
        </>
    )
}

export default Editor