from database import get_db
from models import KnowledgeNode, Chat

db = next(get_db())
nodes = db.query(KnowledgeNode).limit(20).all()
chats = db.query(Chat).limit(10).all()

print(f'KG Nodes total: {len(nodes)}')
if nodes:
    for n in nodes[:5]:
        print(f'  chat:{n.chat_id[:8]}.. section:{n.section} content:{n.content[:60]}')

print(f'\nChats ({len(chats)} total):')
for c in chats:
    cnt = db.query(KnowledgeNode).filter(KnowledgeNode.chat_id == c.id).count()
    print(f'  {c.id[:8]}.. title:"{c.title}" kg_nodes:{cnt}')
