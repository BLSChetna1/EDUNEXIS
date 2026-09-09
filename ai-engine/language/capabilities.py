"""Language capability metadata for replaceable speech and translation providers."""

SUPPORTED_LANGUAGE_CAPABILITIES = {
    "en": {
        "language": "English",
        "variants": [],
        "support_status": "supported",
        "vocabulary": {},
    },
    "hi": {
        "language": "Hindi",
        "variants": [],
        "support_status": "supported",
        "vocabulary": {},
    },
    "ta": {
        "language": "Tamil",
        "variants": [],
        "support_status": "supported",
        "vocabulary": {},
    },
    "te": {
        "language": "Telugu",
        "variants": [],
        "support_status": "supported",
        "vocabulary": {},
    },
    "bn": {
        "language": "Bengali",
        "variants": [],
        "support_status": "supported",
        "vocabulary": {},
    },
    "mr": {
        "language": "Marathi",
        "variants": [],
        "support_status": "supported",
        "vocabulary": {},
    },
    "gu": {
        "language": "Gujarati",
        "variants": [],
        "support_status": "supported",
        "vocabulary": {},
    },
    "kn": {
        "language": "Kannada",
        "variants": [],
        "support_status": "supported",
        "vocabulary": {},
    },
    "ml": {
        "language": "Malayalam",
        "variants": [],
        "support_status": "supported",
        "vocabulary": {},
    },
    "pa": {
        "language": "Punjabi",
        "variants": [],
        "support_status": "supported",
        "vocabulary": {},
    },
    # Reserved capability entries. No training data or provider is claimed yet.
    "hoc": {
        "language": "Ho",
        "variants": [],
        "support_status": "unavailable",
        "vocabulary": {},
    },
    "unr": {
        "language": "Mundari",
        "variants": [],
        "support_status": "unavailable",
        "vocabulary": {},
    },
    "sat": {
        "language": "Santali",
        "variants": [],
        "support_status": "unavailable",
        "vocabulary": {},
    },
}


def get_language_capabilities() -> list[dict]:
    """Return serializable capability metadata without fabricated vocabulary."""
    return [
        {"language_code": code, **details}
        for code, details in SUPPORTED_LANGUAGE_CAPABILITIES.items()
    ]
