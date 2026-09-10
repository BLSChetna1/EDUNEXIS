"""Capability metadata tests for supported and not-yet-integrated languages."""

import sys
from pathlib import Path

repo_root = Path(__file__).resolve().parent.parent.parent
ai_engine_path = repo_root / "ai-engine"
if str(ai_engine_path) not in sys.path:
    sys.path.insert(0, str(ai_engine_path))

from language.capabilities import SUPPORTED_LANGUAGE_CAPABILITIES


def test_jharkhand_languages_are_explicitly_unavailable_without_provider_data():
    for language_code in ("hoc", "unr", "sat"):
        capability = SUPPORTED_LANGUAGE_CAPABILITIES[language_code]
        assert capability["support_status"] == "unavailable"
        assert capability["vocabulary"] == {}


def test_existing_supported_languages_remain_supported():
    assert SUPPORTED_LANGUAGE_CAPABILITIES["en"]["support_status"] == "supported"
    assert SUPPORTED_LANGUAGE_CAPABILITIES["te"]["support_status"] == "supported"
