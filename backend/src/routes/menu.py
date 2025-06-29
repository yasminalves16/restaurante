from flask import Blueprint, request, jsonify
from src.models.user import db
from src.models.menu import MenuItem

menu_bp = Blueprint('menu', __name__)

def str_to_bool(val):
    if isinstance(val, bool):
        return val
    if isinstance(val, str):
        return val.lower() in ['true', '1', 'yes']
    return bool(val)

@menu_bp.route('/menu', methods=['GET'])
def get_menu():
    """Obter cardápio filtrado por tipo (delivery/local/comanda) e categoria"""
    order_type = request.args.get('type', 'local')  # 'delivery', 'local' ou 'comanda'
    category = request.args.get('category')

    query = MenuItem.query.filter(MenuItem.is_active == True)

    # Filtrar por tipo de pedido
    if order_type == 'delivery':
        query = query.filter(MenuItem.available_for_delivery == True)
    elif order_type == 'comanda':
        query = query.filter(MenuItem.available_for_comanda == True)
    else:  # local
        query = query.filter(MenuItem.available_for_local == True)

    # Filtrar por categoria se especificada
    if category:
        query = query.filter(MenuItem.category == category)

    items = query.order_by(MenuItem.category, MenuItem.name).all()

    return jsonify({
        'success': True,
        'items': [item.to_dict() for item in items]
    })

@menu_bp.route('/menu/categories', methods=['GET'])
def get_categories():
    """Obter todas as categorias disponíveis"""
    categories = db.session.query(MenuItem.category).filter(MenuItem.is_active == True).distinct().all()
    return jsonify({
        'success': True,
        'categories': [cat[0] for cat in categories]
    })

@menu_bp.route('/menu', methods=['POST'])
def create_menu_item():
    """Criar novo item do cardápio"""
    data = request.get_json()

    if not data or not data.get('name') or not data.get('price') or not data.get('category'):
        return jsonify({'success': False, 'message': 'Nome, preço e categoria são obrigatórios'}), 400

    try:
        item = MenuItem(
            name=data['name'],
            description=data.get('description', ''),
            price=float(data['price']),
            category=data['category'],
            available_for_delivery=data.get('available_for_delivery', True),
            available_for_local=data.get('available_for_local', True),
            available_for_comanda=data.get('available_for_comanda', True),
            image_url=data.get('image_url', '')
        )

        db.session.add(item)
        db.session.commit()

        return jsonify({
            'success': True,
            'message': 'Item criado com sucesso',
            'item': item.to_dict()
        }), 201

    except Exception as e:
        db.session.rollback()
        return jsonify({'success': False, 'message': f'Erro ao criar item: {str(e)}'}), 500

@menu_bp.route('/menu/<int:item_id>', methods=['PUT'])
def update_menu_item(item_id):
    """Atualizar item do cardápio"""
    item = MenuItem.query.get_or_404(item_id)
    data = request.get_json()

    if not data:
        return jsonify({'success': False, 'message': 'Dados não fornecidos'}), 400

    try:
        if 'name' in data:
            item.name = data['name']
        if 'description' in data:
            item.description = data['description']
        if 'price' in data:
            item.price = float(data['price'])
        if 'category' in data:
            item.category = data['category']
        if 'available_for_delivery' in data:
            item.available_for_delivery = str_to_bool(data['available_for_delivery'])
        if 'available_for_local' in data:
            item.available_for_local = str_to_bool(data['available_for_local'])
        if 'available_for_comanda' in data:
            item.available_for_comanda = str_to_bool(data['available_for_comanda'])
        if 'is_active' in data:
            item.is_active = str_to_bool(data['is_active'])
        if 'image_url' in data:
            item.image_url = data['image_url']

        db.session.commit()

        return jsonify({
            'success': True,
            'message': 'Item atualizado com sucesso',
            'item': item.to_dict()
        })

    except Exception as e:
        db.session.rollback()
        return jsonify({'success': False, 'message': f'Erro ao atualizar item: {str(e)}'}), 500

@menu_bp.route('/menu/<int:item_id>', methods=['DELETE'])
def delete_menu_item(item_id):
    """Deletar item do cardápio (soft delete)"""
    item = MenuItem.query.get_or_404(item_id)

    try:
        item.is_active = False
        db.session.commit()

        return jsonify({
            'success': True,
            'message': 'Item removido com sucesso'
        })

    except Exception as e:
        db.session.rollback()
        return jsonify({'success': False, 'message': f'Erro ao remover item: {str(e)}'}), 500

@menu_bp.route('/menu/admin', methods=['GET'])
def get_admin_menu():
    """Obter todos os itens do cardápio para administração (incluindo inativos)"""
    items = MenuItem.query.order_by(MenuItem.category, MenuItem.name).all()

    return jsonify({
        'success': True,
        'items': [item.to_dict() for item in items]
    })

