from imagekitio import ImageKit
from django.conf import settings
import logging

logger = logging.getLogger(__name__)

def upload_to_imagekit(image_file):
    """
    Upload file to ImageKit and extract URL from UploadFileResult
    
    Args:
        image_file: File object to upload
        
    Returns:
        str: The URL of the uploaded image
    """
    try:
        imagekit = ImageKit(
            public_key=settings.IMAGEKIT_PUBLIC_KEY,
            private_key=settings.IMAGEKIT_PRIVATE_KEY,
            url_endpoint=settings.IMAGEKIT_URL_ENDPOINT
        )

        if hasattr(image_file, 'seek'):
            image_file.seek(0)
        file_name = getattr(image_file, 'name', None)
        if not file_name:
            import uuid
            file_name = f"upload_{uuid.uuid4()}.jpg"

        result = imagekit.upload_file(
            file=image_file,
            file_name=file_name
        )
        
        logger.debug(f"Upload result type: {type(result)}")
        logger.debug(f"Upload result: {result.__dict__ if hasattr(result, '__dict__') else result}")

        if hasattr(result, 'url'):
            return result.url
        elif hasattr(result, 'response') and hasattr(result.response, 'url'):
            return result.response.url
        elif hasattr(result, 'result') and hasattr(result.result, 'url'):
            return result.result.url
            
        raise ValueError(f"Could not find URL in response. Response type: {type(result)}")

    except Exception as e:
        logger.error(f"ImageKit upload error: {e}")
        raise Exception(f"Image upload failed: {e}")