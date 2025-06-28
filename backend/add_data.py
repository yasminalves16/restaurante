#!/usr/bin/env python3
"""
Script para migrar dados existentes e atualizar estatísticas dos usuários
"""

import os
import sys
sys.path.insert(0, os.path.dirname(__file__))

from src.main import app
from src.models.user import db, User
from src.models.order import Order

def migrate_existing_data():
    """Migra dados existentes de pedidos para usuários"""
    with app.app_context():
        print("🔄 Iniciando migração de dados...")

        # Buscar todos os pedidos que não têm user_id
        orders_without_user = Order.query.filter(Order.user_id.is_(None)).all()

        if not orders_without_user:
            print("✅ Nenhum pedido para migrar encontrado.")
            return

        print(f"📋 Encontrados {len(orders_without_user)} pedidos para migrar...")

        migrated_count = 0

        for order in orders_without_user:
            try:
                # Buscar ou criar usuário baseado no telefone ou email
                user = None

                if order.customer_phone:
                    user = User.query.filter_by(customer_phone=order.customer_phone).first()

                if not user and order.customer_email:
                    user = User.query.filter_by(customer_email=order.customer_email).first()

                if user:
                    # Atualizar informações do usuário existente
                    user.customer_name = order.customer_name
                    if order.customer_phone:
                        user.customer_phone = order.customer_phone
                    if order.customer_email:
                        user.customer_email = order.customer_email
                    if order.delivery_address:
                        user.delivery_address = order.delivery_address
                else:
                    # Criar novo usuário
                    user = User(
                        customer_name=order.customer_name,
                        customer_phone=order.customer_phone or '',
                        customer_email=order.customer_email or '',
                        delivery_address=order.delivery_address or '',
                        total_orders=0,
                        total_spent=0.0
                    )
                    db.session.add(user)
                    db.session.flush()  # Para obter o ID do usuário

                # Associar pedido ao usuário
                order.user_id = user.id
                migrated_count += 1

                print(f"  ✅ Pedido #{order.id} migrado para usuário {user.customer_name}")

            except Exception as e:
                print(f"  ❌ Erro ao migrar pedido #{order.id}: {str(e)}")
                continue

        # Commit das mudanças
        try:
            db.session.commit()
            print(f"✅ {migrated_count} pedidos migrados com sucesso!")
        except Exception as e:
            db.session.rollback()
            print(f"❌ Erro ao salvar migração: {str(e)}")
            return

        # Atualizar estatísticas de todos os usuários
        update_user_statistics()

def update_user_statistics():
    """Atualiza as estatísticas de todos os usuários"""
    print("📊 Atualizando estatísticas dos usuários...")

    try:
        users = User.query.all()
        updated_count = 0

        for user in users:
            try:
                user.update_stats()
                updated_count += 1
                print(f"  ✅ Estatísticas atualizadas para {user.customer_name}: {user.total_orders} pedidos, R$ {user.total_spent:.2f}")
            except Exception as e:
                print(f"  ❌ Erro ao atualizar estatísticas para {user.customer_name}: {str(e)}")
                continue

        db.session.commit()
        print(f"✅ Estatísticas atualizadas para {updated_count} usuários!")

    except Exception as e:
        db.session.rollback()
        print(f"❌ Erro ao atualizar estatísticas: {str(e)}")

def show_statistics():
    """Mostra estatísticas atuais do sistema"""
    print("\n📈 Estatísticas do Sistema:")
    print("=" * 50)

    total_users = User.query.count()
    users_with_orders = User.query.filter(User.total_orders > 0).count()
    total_orders = Order.query.count()
    total_revenue = db.session.query(db.func.sum(User.total_spent)).scalar() or 0

    print(f"👥 Total de usuários: {total_users}")
    print(f"🛒 Usuários com pedidos: {users_with_orders}")
    print(f"📋 Total de pedidos: {total_orders}")
    print(f"💰 Receita total: R$ {total_revenue:.2f}")

    # Top 5 clientes
    top_spenders = User.query.filter(User.total_spent > 0).order_by(User.total_spent.desc()).limit(5).all()

    if top_spenders:
        print("\n🏆 Top 5 Clientes por Valor Gasto:")
        for i, user in enumerate(top_spenders, 1):
            print(f"  {i}. {user.customer_name} - R$ {user.total_spent:.2f} ({user.total_orders} pedidos)")

if __name__ == '__main__':
    with app.app_context():
        print("🚀 Script de Migração de Dados")
        print("=" * 50)

        # Migrar dados existentes
        migrate_existing_data()

        # Mostrar estatísticas
        show_statistics()

        print("\n✅ Migração concluída!")