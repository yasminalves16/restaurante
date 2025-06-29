#!/usr/bin/env python3
"""
Script para adicionar campos específicos de comanda na tabela order
"""

import os
import sys
sys.path.insert(0, os.path.dirname(__file__))

from src.main import app
from src.models.user import db
from src.models.order import Order

def add_comanda_fields():
    """Adiciona campos específicos de comanda na tabela order"""
    with app.app_context():
        print("🔄 Adicionando campos de comanda...")

        try:
            # Verificar se as colunas já existem
            inspector = db.inspect(db.engine)
            existing_columns = [col['name'] for col in inspector.get_columns('order')]

            if 'is_comanda' not in existing_columns:
                print("  ➕ Adicionando coluna 'is_comanda'...")
                db.engine.execute('ALTER TABLE "order" ADD COLUMN is_comanda BOOLEAN DEFAULT false')
                print("  ✅ Coluna 'is_comanda' adicionada")
            else:
                print("  ✅ Coluna 'is_comanda' já existe")

            if 'mesa' not in existing_columns:
                print("  ➕ Adicionando coluna 'mesa'...")
                db.engine.execute('ALTER TABLE "order" ADD COLUMN mesa INTEGER')
                print("  ✅ Coluna 'mesa' adicionada")
            else:
                print("  ✅ Coluna 'mesa' já existe")

            if 'status_comanda' not in existing_columns:
                print("  ➕ Adicionando coluna 'status_comanda'...")
                db.engine.execute('ALTER TABLE "order" ADD COLUMN status_comanda VARCHAR(20) DEFAULT \'aberta\'')
                print("  ✅ Coluna 'status_comanda' adicionada")
            else:
                print("  ✅ Coluna 'status_comanda' já existe")

            # Atualizar pedidos existentes de comanda
            print("  🔄 Atualizando pedidos existentes de comanda...")
            orders_to_update = Order.query.filter_by(order_type='comanda').all()

            for order in orders_to_update:
                order.is_comanda = True
                if not order.status_comanda:
                    order.status_comanda = 'aberta'

            db.session.commit()
            print(f"  ✅ {len(orders_to_update)} pedidos de comanda atualizados")

            print("✅ Migração de campos de comanda concluída!")

        except Exception as e:
            print(f"❌ Erro durante a migração: {str(e)}")
            db.session.rollback()

def show_comanda_stats():
    """Mostra estatísticas das comandas"""
    print("\n📊 Estatísticas das Comandas:")
    print("=" * 40)

    try:
        total_comandas = Order.query.filter_by(is_comanda=True).count()
        comandas_abertas = Order.query.filter_by(is_comanda=True, status_comanda='aberta').count()
        comandas_encerradas = Order.query.filter_by(is_comanda=True, status_comanda='encerrada').count()

        print(f"🍽️  Total de comandas: {total_comandas}")
        print(f"🟢 Comandas abertas: {comandas_abertas}")
        print(f"🔴 Comandas encerradas: {comandas_encerradas}")

        # Mostrar mesas com comandas abertas
        mesas_ativas = db.session.query(Order.mesa).filter(
            Order.is_comanda == True,
            Order.status_comanda == 'aberta'
        ).distinct().all()

        if mesas_ativas:
            print(f"\n🪑 Mesas com comandas abertas: {[mesa[0] for mesa in mesas_ativas]}")

    except Exception as e:
        print(f"❌ Erro ao mostrar estatísticas: {str(e)}")

if __name__ == '__main__':
    with app.app_context():
        print("🚀 Script de Migração de Campos de Comanda")
        print("=" * 50)

        # Adicionar campos de comanda
        add_comanda_fields()

        # Mostrar estatísticas
        show_comanda_stats()

        print("\n✅ Processo concluído!")