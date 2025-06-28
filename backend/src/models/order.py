from src.models.user import db
from datetime import datetime

class Order(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=True)  # Relacionamento com usuário
    customer_name = db.Column(db.String(100), nullable=False)
    customer_phone = db.Column(db.String(20))
    customer_email = db.Column(db.String(120))
    order_type = db.Column(db.String(20), nullable=False)  # "delivery" ou "local"
    status = db.Column(db.String(20), default="pendente")  # "pendente", "preparando", "pronto", "entregue", "cancelado"
    total_amount = db.Column(db.Float, nullable=False)
    delivery_address = db.Column(db.Text)  # apenas para delivery
    notes = db.Column(db.Text)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    # Relacionamento com itens do pedido
    items = db.relationship('OrderItem', backref='order', lazy=True, cascade='all, delete-orphan')

    def __repr__(self):
        return f'<Order {self.id} - {self.customer_name}>'

    def to_dict(self):
        return {
            'id': self.id,
            'user_id': self.user_id,
            'customer_name': self.customer_name,
            'customer_phone': self.customer_phone,
            'customer_email': self.customer_email,
            'order_type': self.order_type,
            'status': self.status,
            'total_amount': self.total_amount,
            'delivery_address': self.delivery_address,
            'notes': self.notes,
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'updated_at': self.updated_at.isoformat() if self.updated_at else None,
            'items': [item.to_dict() for item in self.items]
        }

class OrderItem(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    order_id = db.Column(db.Integer, db.ForeignKey('order.id'), nullable=False)
    menu_item_id = db.Column(db.Integer, db.ForeignKey('menu_item.id'), nullable=False)
    quantity = db.Column(db.Integer, nullable=False)
    unit_price = db.Column(db.Float, nullable=False)
    subtotal = db.Column(db.Float, nullable=False)
    notes = db.Column(db.Text)  # observações específicas do item

    # Relacionamento com item do menu
    menu_item = db.relationship('MenuItem', backref='order_items', lazy=True)

    def __repr__(self):
        return f'<OrderItem {self.id} - Order {self.order_id}>'

    def to_dict(self):
        return {
            'id': self.id,
            'order_id': self.order_id,
            'menu_item_id': self.menu_item_id,
            'menu_item': self.menu_item.to_dict() if self.menu_item else None,
            'quantity': self.quantity,
            'unit_price': self.unit_price,
            'subtotal': self.subtotal,
            'notes': self.notes
        }

