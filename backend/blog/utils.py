# utils.py
from imagekitio import ImageKit
from django.conf import settings
import logging

logger = logging.getLogger(__name__)

def upload_to_imagekit(image_file):
    """
    Upload file to ImageKit with improved error handling and logging
    """
    try:
        # Initialize ImageKit
        imagekit = ImageKit(
            public_key=settings.IMAGEKIT_PUBLIC_KEY,
            private_key=settings.IMAGEKIT_PRIVATE_KEY,
            url_endpoint=settings.IMAGEKIT_URL_ENDPOINT
        )

        # Log file information
        logger.info(f"Attempting to upload file: {getattr(image_file, 'name', 'unnamed')}")
        logger.info(f"Content type: {getattr(image_file, 'content_type', 'unknown')}")

        # Reset file pointer
        if hasattr(image_file, 'seek'):
            image_file.seek(0)

        # Read file
        file_data = image_file.read()

        # Prepare upload parameters
        upload_params = {
            "file": file_data,
            "file_name": getattr(image_file, 'name', 'unknown_file'),
            "use_unique_file_name": True,
            "options": {
                "folder": "/blog_images/",
                "is_private_file": False,
            }
        }

        # Perform upload
        result = imagekit.upload_file(**upload_params)
        
        # Extract URL from result
        if result and hasattr(result, 'response_metadata'):
            response_data = result.response_metadata
            if isinstance(response_data, dict) and 'url' in response_data:
                return response_data['url']
            logger.error(f"Unexpected response format: {response_data}")
            raise ValueError("Invalid response format from ImageKit")
            
        logger.error(f"Upload failed. Result: {result}")
        raise ValueError("Failed to get URL from upload response")

    except Exception as e:
        logger.error(f"ImageKit upload error: {str(e)}")
        raise Exception(f"Image upload failed: {str(e)}")