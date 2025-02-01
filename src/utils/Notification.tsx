import { useEffect } from 'react'
import { useFirebase } from './FirebaseContext'
import { MdDone, MdOutlineClose } from "react-icons/md";

const Notification = () => {
    const { message, setMessage, loading} = useFirebase()

    const clearMessage = ()=>{
        setMessage({message:"",type:""})
    }

    useEffect(() => {
        if (message.message !== "") {
            const timer = setInterval(() => {
                clearMessage();
            }, 3000);

            return () => clearInterval(timer);
        }
    }, [message, setMessage]);

    if(message.message !== ""){
        return (
            <div className='fixed z-50 top-0 w-full'>
                <div className={`${message.type === "info" || message.type === "done" ? "bg-green-600" : message.type === "error" ? "bg-pink-600" : message.type === "waiting" ? "bg-yellow-600" : ""}`}>
                    <div className="px-3 py-3 mx-auto max-w-7xl sm:px-6 lg:px-8">
                        <div className="flex flex-wrap items-center justify-between">
                            <div className="flex items-center flex-1 w-0">
                                <span className={`${message.type === "info" || message.type === "done" ? "bg-green-800" : message.type === "error" ? "bg-pink-800": message.type === "waiting" ? "bg-yellow-800" : ""} flex p-2 rounded-lg`}>
                                    <MdDone className='text-3xl text-white font-bold' />
                                </span>
                                <p className="ml-3 font-medium text-white truncate">
                                    <span className="hidden md:inline">
                                        {message.message}
                                    </span>
                                </p>
                            </div>
                            <div className="flex-shrink-0 order-2 sm:order-3 sm:ml-3">
                                <button type="button" className="flex p-2 -mr-1 rounded-md sm:-mr-2" onClick={clearMessage}>
                                    <span className="sr-only">
                                        Dismiss
                                    </span>
                                    <MdOutlineClose className='text-base-white text-3xl' />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }

    if(loading){
        return(
            <div className='w-screen h-screen z-50 justify-center items-center flex fixed top-0 left-0 bg-black bg-opacity-20'>
                <div className='loader'></div>
            </div>
        )
    }
    
}

export default Notification