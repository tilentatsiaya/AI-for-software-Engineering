def sort_dicts_by_key_ai(dicts, key):
    """AI-suggested version using tuple trick to handle missing keys."""
    return sorted(dicts, key=lambda d: (d.get(key) is None, d.get(key)))
