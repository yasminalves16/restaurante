from flask_sqlalchemy import SQLAlchemy
from datetime import datetime

db = SQLAlchemy()

class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), unique=True, nullable=True)  # Tornando opcional para clientes
    email = db.Column(db.String(120), unique=True, nullable=True)  # Tornando opcional para clientes

    # Campos de cliente
    customer_name = db.Column(db.String(100), nullable=True)  # Nome não é obrigatório
    customer_phone = db.Column(db.String(20), nullable=False, unique=True)  # Apenas telefone é único e obrigatório
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
        return f'<User {self.customer_phone}>'

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

    @classmethod
    def find_by_phone(cls, phone):
        """Busca um usuário pelo telefone"""
        return cls.query.filter_by(customer_phone=phone).first()

    @classmethod
    def find_or_create_by_phone(cls, phone, name=None, email=None, address=None):
        """Busca um usuário pelo telefone ou cria um novo se não existir"""
        user = cls.find_by_phone(phone)
        if user:
            # Atualiza informações opcionais se fornecidas
            if email and email != user.customer_email:
                user.customer_email = email
            if address and address != user.delivery_address:
                user.delivery_address = address
            # NÃO atualiza o nome - mantém o nome original do usuário
            db.session.commit()
            return user
        else:
            # Cria novo usuário
            user = cls(
                customer_name=name,
                customer_phone=phone,
                customer_email=email,
                delivery_address=address
            )
            db.session.add(user)
            db.session.commit()
            return user
