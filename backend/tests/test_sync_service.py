import pytest
from unittest.mock import MagicMock, patch
from backend.data_services.sync.mongo_to_neo4j_sync import sync_collection, COLLECTION_LABEL_MAP, RELATIONSHIP_MAP

class DummyStream:
    def __init__(self, changes):
        self.changes = changes
    def __enter__(self):
        return iter(self.changes)
    def __exit__(self, exc_type, exc_val, exc_tb):
        pass

def make_change(op, doc, doc_id=None, updated_fields=None):
    change = {
        "operationType": op,
        "documentKey": {"_id": doc_id or doc.get("_id")},
    }
    if op in ("insert", "replace"):
        change["fullDocument"] = doc
    if op == "update":
        change["updateDescription"] = {"updatedFields": updated_fields or {}}
    return change

@patch("data_services.sync.mongo_to_neo4j_sync.Neo4jWrapper")
def test_sync_insert_update_delete(mock_neo4j):
    # Setup
    db = {"users": MagicMock()}
    neo4j = mock_neo4j()
    user_doc = {"_id": "abc123", "email": "test@example.com", "name": "Test User"}
    changes = [
        make_change("insert", user_doc, doc_id="abc123"),
        make_change("update", user_doc, doc_id="abc123", updated_fields={"name": "Updated User"}),
        make_change("delete", user_doc, doc_id="abc123"),
    ]
    db["users"].watch.return_value = DummyStream(changes)
    # Run
    sync_collection("users", db, neo4j)
    # Assert
    assert neo4j.create_node.called
    assert neo4j.update_node.called
    assert neo4j.delete_node.called

@patch("data_services.sync.mongo_to_neo4j_sync.Neo4jWrapper")
def test_sync_relationships(mock_neo4j):
    db = {"contacts": MagicMock()}
    neo4j = mock_neo4j()
    contact_doc = {"_id": "c1", "user_id": "u1", "name": "Contact"}
    changes = [make_change("insert", contact_doc, doc_id="c1")]
    db["contacts"].watch.return_value = DummyStream(changes)
    sync_collection("contacts", db, neo4j)
    # Should create node and relationship
    assert neo4j.create_node.called
    assert neo4j.create_relationship.called 