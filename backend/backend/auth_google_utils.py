import hashlib
import os
import base64
import json
import string
import secrets
from urllib.parse import quote

def decode_jwt(token: str):
    header, payload, signature = token.split(".")
    decoded_payload = base64.urlsafe_b64decode(payload + "==")  # Padding fix
    return json.loads(decoded_payload)

def create_anti_forgery_state_token(request):
    state = hashlib.sha256(os.urandom(1024)).hexdigest()
    return state

def generate_secure_random_string(length=6):
    alphabet = string.ascii_letters + string.digits  # A-Z, a-z, 0-9
    return ''.join(secrets.choice(alphabet) for _ in range(length))


def base62_encode(num: int, length=5):
    """Encodes a number into a Base62 string."""
    alphabet = string.ascii_letters + string.digits  # a-z, A-Z, 0-9 (62 chars)
    base = len(alphabet)
    encoded = []
    for _ in range(length):
        num, rem = divmod(num, base)
        encoded.append(alphabet[rem])
    return ''.join(encoded)

def deterministic_hash(s: str):
    hash_digest = hashlib.sha256(s.encode()).hexdigest()
    hash_int = int(hash_digest, 16)
    return base62_encode(hash_int, length=5)

def make_nickname(name, sub):
    nickname = name.split()[0].lower()
    return f"{nickname}_{deterministic_hash(sub)}"

def make_uri_safe(input_string):
    return quote(input_string, safe='')