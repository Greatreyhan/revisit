import { useState } from 'react'
import { ReactPhotoEditor } from 'react-photo-editor'
import 'react-photo-editor/dist/style.css'

function ImageEditor() {
 const [file, setFile] = useState<File | undefined>()
 const [showModal, setShowModal] = useState(false)

   // Show modal if file is selected
  const showModalHandler = () => {
    if (file) {
      setShowModal(true)
    }
  }

  // Hide modal
  const hideModal = () => {
    setShowModal(false)
  }

  // Save edited image
  const handleSaveImage = (editedFile: File) => {
    setFile(editedFile);
  };

  const setFileData = (e: React.ChangeEvent<HTMLInputElement> | null) => {
    if (e?.target?.files && e.target.files.length > 0) {
      setFile(e.target.files[0])
    }
  }

  return (
    <>
      <input 
          type="file" 
          onChange={(e) => setFileData(e)} 
          multiple={false} 
       />

      <button onClick={showModalHandler}>Edit</button>

      <ReactPhotoEditor
        open={showModal}
        onClose={hideModal}
        file={file}
        onSaveImage={handleSaveImage}
      />

    </>
  )
}

export default ImageEditor