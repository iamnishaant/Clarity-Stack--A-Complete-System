from sqlalchemy.orm import Session
from models import KnowledgeNode, KnowledgeEdge


def get_supporting_facts(db: Session, chat_id: str, decision_id: str):
    return db.query(KnowledgeNode).join(
        KnowledgeEdge, KnowledgeEdge.from_node_id == KnowledgeNode.id
    ).filter(
        KnowledgeEdge.chat_id == chat_id,          # 🔒 CHAT SCOPE
        KnowledgeEdge.to_node_id == decision_id,
        KnowledgeEdge.relation == "SUPPORTS"
    ).all()


def get_conflicts(db: Session, chat_id: str, decision_id: str):
    return db.query(KnowledgeNode).join(
        KnowledgeEdge, KnowledgeEdge.from_node_id == KnowledgeNode.id
    ).filter(
        KnowledgeEdge.chat_id == chat_id,
        KnowledgeEdge.to_node_id == decision_id,
        KnowledgeEdge.relation == "CONTRADICTS"
    ).all()


def get_blockers(db: Session, chat_id: str, decision_id: str):
    return db.query(KnowledgeNode).join(
        KnowledgeEdge, KnowledgeEdge.from_node_id == KnowledgeNode.id
    ).filter(
        KnowledgeEdge.chat_id == chat_id,
        KnowledgeEdge.to_node_id == decision_id,
        KnowledgeEdge.relation == "BLOCKS"
    ).all()


def get_alternatives(db: Session, chat_id: str, decision_id: str):
    return db.query(KnowledgeNode).join(
        KnowledgeEdge, KnowledgeEdge.from_node_id == KnowledgeNode.id
    ).filter(
        KnowledgeEdge.chat_id == chat_id,
        KnowledgeEdge.to_node_id == decision_id,
        KnowledgeEdge.relation == "ALTERNATIVE_OF"
    ).all()


def get_decision_explanation(db: Session, chat_id: str):
    # 1. Fetch ALL nodes for this chat
    all_nodes = db.query(KnowledgeNode).filter(
        KnowledgeNode.chat_id == chat_id
    ).all()

    if not all_nodes:
        return {
            "decision": [],
            "supports": [],
            "conflicts": [],
            "blockers": [],
            "alternatives": [],
            "others": [],
            "edges": []
        }

    # 2. Fetch ALL edges for this chat
    all_edges = db.query(KnowledgeEdge).filter(
        KnowledgeEdge.chat_id == chat_id
    ).all()

    # 3. Categorize nodes for the UI and Satellite engine
    # We use explicit checks for common sections to maintain legacy compatibility
    # but the 'others' list catches everything else.
    decision_nodes = [n for n in all_nodes if n.section == "DECISION"]
    supports       = [n for n in all_nodes if n.section == "FACT"]
    conflicts      = [n for n in all_nodes if n.section == "CONFLICT"]
    blockers       = [n for n in all_nodes if n.section in ["UNKNOWN", "BLOCKER"]]
    alternatives   = [n for n in all_nodes if n.section in ["OPTION", "ALTERNATIVE"]]
    
    # Catch-all for other sections (Assumptions, Constraints, etc.)
    known_sections = ["DECISION", "FACT", "CONFLICT", "UNKNOWN", "BLOCKER", "OPTION", "ALTERNATIVE"]
    others = [n for n in all_nodes if n.section not in known_sections]

    return {
        "decision": decision_nodes,
        "supports": supports,
        "conflicts": conflicts,
        "blockers": blockers,
        "alternatives": alternatives,
        "others": others,
        "edges": all_edges
    }
