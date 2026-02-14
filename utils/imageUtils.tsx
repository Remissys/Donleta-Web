import axios from "axios"

export const ImageUpload = async (origin: string, image: File) => {
    try {
        const formData = new FormData()
    
        formData.append('origin', origin)
        formData.append('image', image)
        
        const response = await axios.post('/image/', formData, {
                baseURL: process.env.NEXT_PUBLIC_DONLETA_URL,
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
        })

        return response.data.file_id
    } catch(err) {
        console.error(err)
    }
}

export const GetImage = (origin: string, image_key: string) => {
    return `${process.env.NEXT_PUBLIC_DONLETA_URL}/image/${image_key}?origin=${origin}`
}