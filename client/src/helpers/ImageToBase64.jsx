import imageCompression from 'browser-image-compression'

const compressImage = async(image, {maxSizeMB, maxWidthOrHeight, initialQuality}={}) =>{
    const imageFile = image

    const options = {
        // maxSizeMB: 1,
        // maxWidthOrHeight: 800,
        // useWebWorker: true,
        // initialQuality: 0.7, // helps control compression
        maxSizeMB,
        maxWidthOrHeight,
        useWebWorker: true,
        initialQuality, // helps control compression
    }

    try{
        const compressedFile = await imageCompression(imageFile, options)
        console.log("Compressed file size:", compressedFile.size / 1024, "KB")
        return compressedFile
    }
    catch(err) {
        console.error("Error handling image upload:", err)
    }
}

const ImageToBase64 = async(image, {maxSizeMB, maxWidthOrHeight, initialQuality}={}) =>{
    const compressedImage = await compressImage(image, {maxSizeMB, maxWidthOrHeight, initialQuality})

    const reader = new FileReader()
    reader.readAsDataURL(compressedImage) //converts to base 64

    const data = await new Promise((resolve, reject)=>{
        reader.onloadend = () => resolve(reader.result)
        reader.onerror = (error) => reject(error)
    })
    return data
}

export default ImageToBase64