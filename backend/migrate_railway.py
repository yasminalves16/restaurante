#!/usr/bin/env python3
"""
Script de migração para Railway - Migra pedidos existentes para o novo modelo de usuários
Execute este script no Railway para migrar dados de produção
"""

import os
import sys
sys.path.insert(0, os.path.dirname(__file__))

from src.main import app
from src.models.user import db, User
from src.models.order import Order
from datetime import datetime

def migrate_railway_data():
    """Migra dados existentes do Railway para o novo modelo de usuários"""
    with app.app_context():
        print("🚀 Iniciando migração no Railway...")
        print("=" * 60)

        # Verificar se há pedidos para migrar
        total_orders = Order.query.count()
        print(f"📊 Total de pedidos no banco: {total_orders}")

        if total_orders == 0:
            print("❌ Nenhum pedido encontrado para migrar!")
            return

        # Buscar pedidos que não têm user_id
        orders_without_user = Order.query.filter(Order.user_id.is_(None)).all()
        print(f"📋 Pedidos sem usuário: {len(orders_without_user)}")

        if not orders_without_user:
            print("✅ Todos os pedidos já estão migrados!")
            return

        print(f"🔄 Migrando {len(orders_without_user)} pedidos...")
        print("-" * 60)

        migrated_count = 0
        users_created = 0
        users_updated = 0

        for order in orders_without_user:
            try:
                print(f"📦 Processando pedido #{order.id} - {order.customer_name}")

                # Buscar ou criar usuário baseado no telefone ou email
                user = None
                customer_phone = order.customer_phone.strip() if order.customer_phone else ''
                customer_email = order.customer_email.strip() if order.customer_email else ''

                if customer_phone:
                    user = User.query.filter_by(customer_phone=customer_phone).first()
                    if user:
                        print(f"  👤 Usuário encontrado por telefone: {user.customer_name}")

                if not user and customer_email:
                    user = User.query.filter_by(customer_email=customer_email).first()
                    if user:
                        print(f"  👤 Usuário encontrado por email: {user.customer_name}")

                if user:
                    # Atualizar informações do usuário existente
                    user.customer_name = order.customer_name
                    if customer_phone:
                        user.customer_phone = customer_phone
                    if customer_email:
                        user.customer_email = customer_email
                    if order.delivery_address:
                        user.delivery_address = order.delivery_address
                    users_updated += 1
                    print(f"  ✅ Usuário atualizado: {user.customer_name}")
                else:
                    # Criar novo usuário
                    user = User(
                        customer_name=order.customer_name,
                        customer_phone=customer_phone,
                        customer_email=customer_email,
                        delivery_address=order.delivery_address or '',
                        total_orders=0,
                        total_spent=0.0
                    )
                    db.session.add(user)
                    db.session.flush()  # Para obter o ID do usuário
                    users_created += 1
                    print(f"  ✅ Novo usuário criado: {user.customer_name}")

                # Associar pedido ao usuário
                order.user_id = user.id
                migrated_count += 1

            except Exception as e:
                print(f"  ❌ Erro ao migrar pedido #{order.id}: {str(e)}")
                continue

        # Commit das mudanças
        try:
            db.session.commit()
            print("-" * 60)
            print(f"✅ Migração concluída!")
            print(f"📦 Pedidos migrados: {migrated_count}")
            print(f"👤 Usuários criados: {users_created}")
            print(f"👤 Usuários atualizados: {users_updated}")
        except Exception as e:
            db.session.rollback()
            print(f"❌ Erro ao salvar migração: {str(e)}")
            return

        # Atualizar estatísticas de todos os usuários
        update_user_statistics()

def update_user_statistics():
    """Atualiza as estatísticas de todos os usuários"""
    print("\n📊 Atualizando estatísticas dos usuários...")
    print("-" * 60)

    try:
        users = User.query.all()
        updated_count = 0

        for user in users:
            try:
                user.update_stats()
                updated_count += 1
                print(f"  ✅ {user.customer_name}: {user.total_orders} pedidos, R$ {user.total_spent:.2f}")
            except Exception as e:
                print(f"  ❌ Erro ao atualizar {user.customer_name}: {str(e)}")
                continue

        db.session.commit()
        print(f"\n✅ Estatísticas atualizadas para {updated_count} usuários!")

    except Exception as e:
        db.session.rollback()
        print(f"❌ Erro ao atualizar estatísticas: {str(e)}")

def show_final_statistics():
    """Mostra estatísticas finais do sistema"""
    print("\n📈 Estatísticas Finais do Sistema:")
    print("=" * 60)

    total_users = User.query.count()
    users_with_orders = User.query.filter(User.total_orders > 0).count()
    total_orders = Order.query.count()
    orders_with_users = Order.query.filter(Order.user_id.isnot(None)).count()
    total_revenue = db.session.query(db.func.sum(User.total_spent)).scalar() or 0

    print(f"👥 Total de usuários: {total_users}")
    print(f"🛒 Usuários com pedidos: {users_with_orders}")
    print(f"📋 Total de pedidos: {total_orders}")
    print(f"🔗 Pedidos com usuário: {orders_with_users}")
    print(f"💰 Receita total: R$ {total_revenue:.2f}")

    # Top 5 clientes
    top_spenders = User.query.filter(User.total_spent > 0).order_by(User.total_spent.desc()).limit(5).all()

    if top_spenders:
        print("\n🏆 Top 5 Clientes por Valor Gasto:")
        for i, user in enumerate(top_spenders, 1):
            print(f"  {i}. {user.customer_name} - R$ {user.total_spent:.2f} ({user.total_orders} pedidos)")

    # Verificar se há pedidos sem usuário
    orders_without_user = Order.query.filter(Order.user_id.is_(None)).count()
    if orders_without_user > 0:
        print(f"\n⚠️  ATENÇÃO: {orders_without_user} pedidos ainda não têm usuário associado!")

if __name__ == '__main__':
    print("🚀 Script de Migração Railway")
    print("=" * 60)
    print(f"⏰ Iniciado em: {datetime.now().strftime('%d/%m/%Y %H:%M:%S')}")
    print(f"🌐 Ambiente: {'Produção' if os.environ.get('RAILWAY_ENVIRONMENT') else 'Desenvolvimento'}")
    print(f"🗄️  Banco: {app.config.get('SQLALCHEMY_DATABASE_URI', 'Não configurado')[:50]}...")
    print("=" * 60)

    try:
        # Migrar dados existentes
        migrate_railway_data()

        # Mostrar estatísticas finais
        show_final_statistics()

        print("\n✅ Migração concluída com sucesso!")
        print("🎉 Agora você pode usar o histórico de clientes no admin!")

    except Exception as e:
        print(f"\n❌ Erro durante a migração: {str(e)}")
        print("🔧 Verifique os logs e tente novamente.")
        sys.exit(1)