from flask_sqlalchemy import SQLAlchemy
from datetime import datetime

db = SQLAlchemy()

class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), unique=True, nullable=True)  # Tornando opcional para clientes
    email = db.Column(db.String(120), unique=True, nullable=True)  # Tornando opcional para clientes

    # Campos de cliente
    customer_name = db.Column(db.String(100), nullable=False)
    customer_phone = db.Column(db.String(20), nullable=True)
    customer_email = db.Column(db.String(120), nullable=True)
    delivery_address = db.Column(db.Text, nullable=True)

    # Estatísticas do cliente
    total_orders = db.Column(db.Integer, default=0)
    total_spent = db.Column(db.Float, default=0.0)

    # Timestamps
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    # Relacionamento com pedidos
    orders = db.relationship('Order', backref='user', lazy=True, foreign_keys='Order.user_id')

    def __repr__(self):
        return f'<User {self.customer_name}>'

    def to_dict(self):
        return {
            'id': self.id,
            'username': self.username,
            'email': self.email,
            'customer_name': self.customer_name,
            'customer_phone': self.customer_phone,
            'customer_email': self.customer_email,
            'delivery_address': self.delivery_address,
            'total_orders': self.total_orders,
            'total_spent': self.total_spent,
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'updated_at': self.updated_at.isoformat() if self.updated_at else None
        }

    def update_stats(self):
        """Atualiza as estatísticas do cliente baseado nos pedidos"""
        from src.models.order import Order
        orders = Order.query.filter_by(user_id=self.id).all()
        self.total_orders = len(orders)
        self.total_spent = sum(order.total_amount for order in orders)
        return self
