from flask import Blueprint, jsonify, request
from src.models.user import User, db
from src.models.order import Order

user_bp = Blueprint('user', __name__)

@user_bp.route('/users', methods=['GET'])
def get_users():
    """Obter todos os usuários/clientes com filtros opcionais"""
    search = request.args.get('search', '')
    sort_by = request.args.get('sort_by', 'created_at')
    sort_order = request.args.get('sort_order', 'desc')

    query = User.query

    # Filtro de busca
    if search:
        search_term = f'%{search}%'
        query = query.filter(
            db.or_(
                User.customer_name.ilike(search_term),
                User.customer_phone.ilike(search_term),
                User.customer_email.ilike(search_term),
                User.delivery_address.ilike(search_term)
            )
        )

    # Ordenação
    if sort_by == 'name':
        order_column = User.customer_name
    elif sort_by == 'total_orders':
        order_column = User.total_orders
    elif sort_by == 'total_spent':
        order_column = User.total_spent
    else:
        order_column = User.created_at

    if sort_order == 'asc':
        query = query.order_by(order_column.asc())
    else:
        query = query.order_by(order_column.desc())

    users = query.all()

    return jsonify({
        'success': True,
        'users': [user.to_dict() for user in users]
    })

@user_bp.route('/users', methods=['POST'])
def create_user():

    data = request.json
    user = User(username=data['username'], email=data['email'])
    db.session.add(user)
    db.session.commit()
    return jsonify(user.to_dict()), 201

@user_bp.route('/users/<int:user_id>', methods=['GET'])
def get_user(user_id):
    """Obter detalhes de um usuário específico"""
    user = User.query.get_or_404(user_id)

    return jsonify({
        'success': True,
        'user': user.to_dict()
    })

@user_bp.route('/users/<int:user_id>/orders', methods=['GET'])
def get_user_orders(user_id):
    """Obter histórico de pedidos de um usuário"""
    user = User.query.get_or_404(user_id)

    # Buscar pedidos do usuário
    orders = Order.query.filter_by(user_id=user_id).order_by(Order.created_at.desc()).all()

    return jsonify({
        'success': True,
        'user': user.to_dict(),
        'orders': [order.to_dict() for order in orders]
    })

@user_bp.route('/users/stats', methods=['GET'])
def get_user_stats():
    """Obter estatísticas dos usuários"""
    try:
        total_users = User.query.count()
        users_with_orders = User.query.filter(User.total_orders > 0).count()
        total_revenue = db.session.query(db.func.sum(User.total_spent)).scalar() or 0

        # Top 5 clientes por valor gasto
        top_spenders = User.query.filter(User.total_spent > 0).order_by(User.total_spent.desc()).limit(5).all()

        return jsonify({
            'success': True,
            'stats': {
                'total_users': total_users,
                'users_with_orders': users_with_orders,
                'total_revenue': total_revenue,
                'top_spenders': [user.to_dict() for user in top_spenders]
            }
        })

    except Exception as e:
        return jsonify({'success': False, 'message': f'Erro ao obter estatísticas: {str(e)}'}), 500

@user_bp.route('/users/<int:user_id>', methods=['PUT'])
def update_user(user_id):
    """Atualizar informações do usuário"""
    user = User.query.get_or_404(user_id)
    data = request.get_json()

    if not data:
        return jsonify({'success': False, 'message': 'Dados não fornecidos'}), 400

    try:
        if 'customer_name' in data:
            user.customer_name = data['customer_name']
        if 'customer_phone' in data:
            user.customer_phone = data['customer_phone']
        if 'customer_email' in data:
            user.customer_email = data['customer_email']
        if 'delivery_address' in data:
            user.delivery_address = data['delivery_address']

        db.session.commit()

        return jsonify({
            'success': True,
            'message': 'Usuário atualizado com sucesso',
            'user': user.to_dict()
        })

    except Exception as e:
        db.session.rollback()
        return jsonify({'success': False, 'message': f'Erro ao atualizar usuário: {str(e)}'}), 500

@user_bp.route('/users/<int:user_id>', methods=['DELETE'])
def delete_user(user_id):
    user = User.query.get_or_404(user_id)
    db.session.delete(user)
    db.session.commit()
    return '', 204
