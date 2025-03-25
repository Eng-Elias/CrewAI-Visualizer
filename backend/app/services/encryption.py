import os
import logging
from cryptography.fernet import Fernet, InvalidToken
import base64


# Set up logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


class EncryptionService:
    """Service for encrypting and decrypting sensitive data like API keys"""
    
    def __init__(self):
        # Get encryption key from environment or generate one
        self.encryption_key = os.getenv("ENCRYPTION_KEY")
        if not self.encryption_key:
            # Generate a key and warn that it should be set in environment
            logger.warning("ENCRYPTION_KEY not found in environment. Generating temporary key.")
            logger.warning("For production, set a persistent ENCRYPTION_KEY in your environment variables.")
            self.encryption_key = self._generate_key()
            # Store the generated key in environment for this session
            os.environ["ENCRYPTION_KEY"] = self.encryption_key.decode()
        
        # Convert the key to bytes if it's a string
        if isinstance(self.encryption_key, str):
            try:
                # Try to decode the key as base64
                base64.b64decode(self.encryption_key)
                self.encryption_key = self.encryption_key.encode()
            except Exception as e:
                logger.error(f"Invalid encryption key format: {str(e)}")
                logger.warning("Generating a new encryption key")
                self.encryption_key = self._generate_key()
                os.environ["ENCRYPTION_KEY"] = self.encryption_key.decode()
            
        # Initialize Fernet cipher
        try:
            self.cipher = Fernet(self.encryption_key)
            logger.info("Encryption service initialized successfully")
        except Exception as e:
            logger.error(f"Failed to initialize Fernet cipher: {str(e)}")
            logger.warning("Generating a new encryption key")
            self.encryption_key = self._generate_key()
            os.environ["ENCRYPTION_KEY"] = self.encryption_key.decode()
            self.cipher = Fernet(self.encryption_key)
    
    def _generate_key(self) -> bytes:
        """Generate a Fernet key for encryption"""
        key = Fernet.generate_key()
        return key
    
    def encrypt(self, data: str) -> str:
        """Encrypt a string and return the encrypted data as a string"""
        if not data:
            return None
        
        try:
            # Convert string to bytes, encrypt, and convert back to string
            encrypted_data = self.cipher.encrypt(data.encode())
            return encrypted_data.decode()
        except Exception as e:
            logger.error(f"Encryption error: {str(e)}")
            # Return the original data if encryption fails
            # This is a fallback for development only
            logger.warning("Returning unencrypted data due to encryption failure")
            return data
    
    def decrypt(self, encrypted_data: str) -> str:
        """Decrypt an encrypted string and return the original data"""
        if not encrypted_data:
            return None
        
        try:
            # Convert string to bytes, decrypt, and convert back to string
            decrypted_data = self.cipher.decrypt(encrypted_data.encode())
            return decrypted_data.decode()
        except InvalidToken:
            logger.error("Invalid token during decryption. Data might not be encrypted with the current key.")
            # Return the original data if it's not properly encrypted
            # This is a fallback for development only
            logger.warning("Returning original data as decryption failed")
            return encrypted_data
        except Exception as e:
            logger.error(f"Decryption error: {str(e)}")
            # Return the original data if decryption fails
            # This is a fallback for development only
            logger.warning("Returning original data due to decryption failure")
            return encrypted_data


# Create a singleton instance
encryption_service = EncryptionService()
