from neo4j import GraphDatabase
from ..config import get_settings

class Neo4jWrapper:
    def __init__(self):
        settings = get_settings()
        self.driver = GraphDatabase.driver(
            settings.NEO4J_URI,
            auth=(settings.NEO4J_USER, settings.NEO4J_PASSWORD)
        )
    
    def close(self):
        self.driver.close()
    
    def create_node(self, label: str, properties: dict):
        with self.driver.session() as session:
            query = (
                f"CREATE (n:{label} $properties) "
                "RETURN n"
            )
            result = session.run(query, properties=properties)
            return result.single()
    
    def create_relationship(self, from_label: str, to_label: str, rel_type: str, 
                          from_props: dict, to_props: dict, rel_props: dict = None):
        with self.driver.session() as session:
            query = (
                f"MATCH (a:{from_label}), (b:{to_label}) "
                "WHERE a.id = $from_id AND b.id = $to_id "
                f"CREATE (a)-[r:{rel_type} $rel_props]->(b) "
                "RETURN r"
            )
            result = session.run(query, 
                               from_id=from_props['id'],
                               to_id=to_props['id'],
                               rel_props=rel_props or {})
            return result.single() 