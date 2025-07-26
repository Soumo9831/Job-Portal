import multer from 'multer';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import cloudinary from '../config/cloudinary.js'; // adjust path if needed

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: async (req, file) => {
    let folder = 'job_portal_profiles';

    if (file.fieldname === 'profilePhoto') folder += '/profile_photos';
    else if (file.fieldname === 'resume') folder += '/resumes';

    return {
      folder: folder,
      allowed_formats: ['jpg', 'jpeg', 'png', 'pdf', 'doc', 'docx'],
      resource_type: file.fieldname === 'resume' ? 'raw' : 'image',
      public_id: `${Date.now()}-${file.originalname}`,
    };
  },
});

const upload = multer({ storage });

export default upload;
