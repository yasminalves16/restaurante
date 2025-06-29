from src.models.user import db
from datetime import datetime
from src.models.menu import MenuItem
from backend.src.main import app

class MenuItem(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    description = db.Column(db.Text)
    price = db.Column(db.Float, nullable=False)
    category = db.Column(db.String(50), nullable=False)
    available_for_delivery = db.Column(db.Boolean, default=True)
    available_for_local = db.Column(db.Boolean, default=True)
    available_for_comanda = db.Column(db.Boolean, default=True)
    is_active = db.Column(db.Boolean, default=True)
    image_url = db.Column(db.String(200))
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    def __repr__(self):
        return f'<MenuItem {self.name}>'

    def to_dict(self):
        return {
            'id': self.id,
            'name': self.name,
            'description': self.description,
            'price': self.price,
            'category': self.category,
            'available_for_delivery': self.available_for_delivery,
            'available_for_local': self.available_for_local,
            'available_for_comanda': self.available_for_comanda,
            'is_active': self.is_active,
            'image_url': self.image_url,
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'updated_at': self.updated_at.isoformat() if self.updated_at else None
        }

ctx = app.app_context()
ctx.push()

