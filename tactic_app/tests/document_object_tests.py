import pytest

import sys
sys.path.insert(0, '/Users/bls910/PycharmProjects/tactic/tactic_app/tile_container_env')

from document_object import remove_protected_fields_from_dict, remove_protected_fields_from_list


@pytest.fixture
def dict_with_protected_fields():
    return {"__filename__": "blah", "__id__": 0, "bling": "blip"}


@pytest.fixture
def list_with_protected_fields():
    return ["__filename__", "__id__", "bling"]


def test_utilities(dict_with_protected_fields, list_with_protected_fields):
    resdict = remove_protected_fields_from_dict(dict_with_protected_fields)
    assert resdict == {"bling": "blip"}
    reslist = remove_protected_fields_from_list(list_with_protected_fields)
    assert reslist == ["bling"]