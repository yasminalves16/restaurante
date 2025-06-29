from flask import Blueprint, request, jsonify
from src.models.user import db, User
from src.models.order import Order, OrderItem
from src.models.menu import MenuItem

order_bp = Blueprint('order', __name__)

@order_bp.route('/orders', methods=['GET'])
def get_orders():
    """Obter todos os pedidos com filtros opcionais"""
    status = request.args.get('status')
    order_type = request.args.get('type')
    payment_status = request.args.get('payment_status')

    query = Order.query

    if status:
        query = query.filter(Order.status == status)
    if order_type:
        query = query.filter(Order.order_type == order_type)
    if payment_status:
        query = query.filter(Order.payment_status == payment_status)

    orders = query.order_by(Order.created_at.desc()).all()

    return jsonify({
        'success': True,
        'orders': [order.to_dict() for order in orders]
    })

@order_bp.route('/orders/<int:order_id>', methods=['GET'])
def get_order(order_id):
    """Obter detalhes de um pedido específico"""
    order = Order.query.get_or_404(order_id)

    return jsonify({
        'success': True,
        'order': order.to_dict()
    })

@order_bp.route('/orders', methods=['POST'])
def create_order():
    """Criar novo pedido"""
    data = request.get_json()

    if not data or not data.get('order_type') or not data.get('items'):
        return jsonify({
            'success': False,
            'message': 'Tipo de pedido e itens são obrigatórios'
        }), 400

    try:
        is_comanda = data.get('is_comanda', False)
        mesa = data.get('mesa')
        # Forçar tipos corretos
        if data.get('order_type') == 'comanda':
            is_comanda = True
            try:
                mesa = int(mesa)
            except (TypeError, ValueError):
                mesa = None
        print('DEBUG NOVO PEDIDO:', data, 'is_comanda:', is_comanda, 'mesa:', mesa)

        if is_comanda and mesa:
            customer_name = str(mesa)
            customer_phone = f"mesa {mesa}"
        else:
            customer_name = data.get('customer_name')
            customer_phone = data.get('customer_phone')

        # Calcular total dos novos itens
        total_amount = 0
        order_items_data = []

        for item_data in data['items']:
            menu_item = MenuItem.query.get(item_data['menu_item_id'])
            if not menu_item or not menu_item.is_active:
                return jsonify({
                    'success': False,
                    'message': f'Item do cardápio {item_data["menu_item_id"]} não encontrado ou inativo'
                }), 400

            # Verificar disponibilidade para o tipo de pedido
            if data['order_type'] == 'delivery' and not menu_item.available_for_delivery:
                return jsonify({
                    'success': False,
                    'message': f'Item "{menu_item.name}" não disponível para delivery'
                }), 400
            elif data['order_type'] == 'local' and not menu_item.available_for_local:
                return jsonify({
                    'success': False,
                    'message': f'Item "{menu_item.name}" não disponível para consumo local'
                }), 400
            elif data['order_type'] == 'comanda' and not menu_item.available_for_comanda:
                return jsonify({
                    'success': False,
                    'message': f'Item "{menu_item.name}" não disponível para comanda'
                }), 400

            quantity = int(item_data['quantity'])
            unit_price = menu_item.price
            subtotal = quantity * unit_price
            total_amount += subtotal

            order_items_data.append({
                'menu_item_id': menu_item.id,
                'quantity': quantity,
                'unit_price': unit_price,
                'subtotal': subtotal,
                'notes': item_data.get('notes', '')
            })

        # Buscar ou criar usuário
        user = None
        if customer_phone:
            user = User.find_by_phone(customer_phone)
            if not user:
                user = User(
                    customer_phone=customer_phone,
                    customer_name=customer_name,
                    customer_email=data.get('customer_email'),
                    delivery_address=data.get('delivery_address')
                )
                db.session.add(user)
                db.session.flush()  # Para obter o ID do usuário

        # --- NOVA LÓGICA PARA COMANDA ---
        if is_comanda and mesa:
            # Buscar comanda aberta existente
            order = Order.query.filter_by(mesa=mesa, is_comanda=True, status_comanda='aberta').first()
            if order:
                # Adicionar itens à comanda existente
                for item_data in order_items_data:
                    order_item = OrderItem(
                        order_id=order.id,
                        **item_data
                    )
                    db.session.add(order_item)
                    order.total_amount += item_data['subtotal']
                order.status_comanda = 'aberta'  # Garante que a comanda fique aberta
                order.is_comanda = True
                order.mesa = mesa
                db.session.commit()
                return jsonify({
                    'success': True,
                    'message': 'Itens adicionados à comanda existente',
                    'order': order.to_dict()
                }), 200
        # --- FIM DA NOVA LÓGICA ---

        # Criar pedido (caso não exista comanda aberta)
        if is_comanda and mesa:
            is_comanda = True
            try:
                mesa = int(mesa)
            except (TypeError, ValueError):
                mesa = None
        order = Order(
            user_id=user.id if user else None,
            customer_name=customer_name,
            customer_phone=customer_phone,
            customer_email=data.get('customer_email'),
            order_type=data['order_type'],
            is_comanda=is_comanda,
            mesa=mesa,
            status_comanda=data.get('status_comanda', 'aberta') if is_comanda else None,
            payment_status=data.get('payment_status', 'nao_pago'),
            total_amount=total_amount,
            delivery_address=data.get('delivery_address'),
            notes=data.get('notes')
        )

        db.session.add(order)
        db.session.flush()  # Para obter o ID do pedido

        # Criar itens do pedido
        for item_data in order_items_data:
            order_item = OrderItem(
                order_id=order.id,
                **item_data
            )
            db.session.add(order_item)

        # Atualizar estatísticas do usuário
        if user:
            user.total_orders += 1
            user.total_spent += total_amount

        db.session.commit()

        return jsonify({
            'success': True,
            'message': 'Pedido criado com sucesso',
            'order': order.to_dict()
        }), 201

    except Exception as e:
        db.session.rollback()
        return jsonify({
            'success': False,
            'message': f'Erro ao criar pedido: {str(e)}'
        }), 500

@order_bp.route('/orders/<int:order_id>/status', methods=['PUT'])
def update_order_status(order_id):
    """Atualizar status do pedido"""
    order = Order.query.get_or_404(order_id)
    data = request.get_json()

    if not data or 'status' not in data:
        return jsonify({'success': False, 'message': 'Status é obrigatório'}), 400

    valid_statuses = ['pendente', 'preparando', 'pronto', 'entregue', 'cancelado']
    if data['status'] not in valid_statuses:
        return jsonify({
            'success': False,
            'message': f'Status inválido. Valores válidos: {", ".join(valid_statuses)}'
        }), 400

    try:
        order.status = data['status']
        db.session.commit()

        return jsonify({
            'success': True,
            'message': 'Status atualizado com sucesso',
            'order': order.to_dict()
        })

    except Exception as e:
        db.session.rollback()
        return jsonify({'success': False, 'message': f'Erro ao atualizar status: {str(e)}'}), 500

@order_bp.route('/orders/<int:order_id>/payment', methods=['PUT'])
def update_payment_status(order_id):
    """Atualizar status de pagamento do pedido"""
    order = Order.query.get_or_404(order_id)
    data = request.get_json()

    if not data or 'payment_status' not in data:
        return jsonify({'success': False, 'message': 'Status de pagamento é obrigatório'}), 400

    valid_payment_statuses = ['pago', 'nao_pago']
    if data['payment_status'] not in valid_payment_statuses:
        return jsonify({
            'success': False,
            'message': f'Status de pagamento inválido. Valores válidos: {", ".join(valid_payment_statuses)}'
        }), 400

    try:
        order.payment_status = data['payment_status']
        db.session.commit()

        return jsonify({
            'success': True,
            'message': 'Status de pagamento atualizado com sucesso',
            'order': order.to_dict()
        })

    except Exception as e:
        db.session.rollback()
        return jsonify({'success': False, 'message': f'Erro ao atualizar status de pagamento: {str(e)}'}), 500

@order_bp.route('/orders/<int:order_id>', methods=['PUT'])
def update_order(order_id):
    """Atualizar informações do pedido"""
    order = Order.query.get_or_404(order_id)
    data = request.get_json()

    if not data:
        return jsonify({'success': False, 'message': 'Dados não fornecidos'}), 400

    try:
        if 'customer_name' in data:
            order.customer_name = data['customer_name']
        if 'customer_phone' in data:
            order.customer_phone = data['customer_phone']
        if 'customer_email' in data:
            order.customer_email = data['customer_email']
        if 'delivery_address' in data:
            order.delivery_address = data['delivery_address']
        if 'notes' in data:
            order.notes = data['notes']

        db.session.commit()

        return jsonify({
            'success': True,
            'message': 'Pedido atualizado com sucesso',
            'order': order.to_dict()
        })

    except Exception as e:
        db.session.rollback()
        return jsonify({'success': False, 'message': f'Erro ao atualizar pedido: {str(e)}'}), 500

@order_bp.route('/orders/stats', methods=['GET'])
def get_order_stats():
    """Obter estatísticas dos pedidos"""
    try:
        total_orders = Order.query.count()
        pending_orders = Order.query.filter(Order.status == 'pendente').count()
        preparing_orders = Order.query.filter(Order.status == 'preparando').count()
        ready_orders = Order.query.filter(Order.status == 'pronto').count()

        return jsonify({
            'success': True,
            'stats': {
                'total_orders': total_orders,
                'pending_orders': pending_orders,
                'preparing_orders': preparing_orders,
                'ready_orders': ready_orders
            }
        })

    except Exception as e:
        return jsonify({'success': False, 'message': f'Erro ao obter estatísticas: {str(e)}'}), 500

@order_bp.route('/comanda/<int:mesa>', methods=['GET'])
def get_comanda_by_mesa(mesa):
    """Buscar todos os pedidos de uma comanda/mesa específica que estejam abertos"""
    orders = Order.query.filter_by(mesa=mesa, is_comanda=True, status_comanda='aberta').all()
    return jsonify({
        'success': True,
        'orders': [order.to_dict() for order in orders]
    })

