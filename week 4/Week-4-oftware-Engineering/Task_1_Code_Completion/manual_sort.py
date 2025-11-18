from typing import List, Dict, Any


def sort_dicts_by_key_manual(
    dicts: List[Dict[str, Any]], key: str
) -> List[Dict[str, Any]]:
    """Sort a list of dictionaries by a specified key, handling missing/null
    values.

    Args:
        dicts: List of dictionaries to sort
        key: Dictionary key to sort by

    Returns:
        List[Dict[str, Any]]: Sorted list with dicts containing the key first,
            sorted by their values, followed by dicts without the key or with
            None values.

    Notes:
        - Dicts with the specified key and non-None values are sorted first
        - If values are not comparable (mixed types), converts to strings
        - Dicts missing the key or with None values are appended unsorted
    """
    with_key = [d for d in dicts if key in d and d[key] is not None]
    without_key = [d for d in dicts if key not in d or d[key] is None]
    try:
        with_key_sorted = sorted(with_key, key=lambda d: d[key])
    except TypeError:
        with_key_sorted = sorted(with_key, key=lambda d: str(d[key]))
    return with_key_sorted + without_key
