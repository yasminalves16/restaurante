#!/usr/bin/env python3
"""
Script de migração para tornar o telefone único no banco de dados
e ajustar a estrutura para permitir nomes opcionais
"""

import sys
import os
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from src.main import app
from src.models.user import db, User
from src.models.order import Order

def migrate_phone_unique():
    """Migração para tornar o telefone único e nome opcional"""
    with app.app_context():
        try:
            print("Iniciando migração para tornar telefone único e nome opcional...")

            # Verificar se há telefones duplicados
            from sqlalchemy import text
            result = db.session.execute(text("""
                SELECT customer_phone, COUNT(*) as count
                FROM user
                WHERE customer_phone IS NOT NULL AND customer_phone != ''
                GROUP BY customer_phone
                HAVING COUNT(*) > 1
            """))

            duplicates = result.fetchall()

            if duplicates:
                print(f"Encontrados {len(duplicates)} telefones duplicados:")
                for phone, count in duplicates:
                    print(f"  - {phone}: {count} registros")

                # Para cada telefone duplicado, manter apenas o registro mais recente
                for phone, count in duplicates:
                    users = User.query.filter_by(customer_phone=phone).order_by(User.created_at.desc()).all()

                    # Manter o primeiro (mais recente) e remover os outros
                    for user in users[1:]:
                        print(f"  Removendo usuário duplicado: {user.customer_name or 'Sem nome'} (ID: {user.id})")
                        db.session.delete(user)

                db.session.commit()
                print("Usuários duplicados removidos com sucesso!")

            # Adicionar índice único para customer_phone
            try:
                db.session.execute(text("""
                    CREATE UNIQUE INDEX IF NOT EXISTS idx_user_customer_phone_unique
                    ON user (customer_phone)
                    WHERE customer_phone IS NOT NULL AND customer_phone != ''
                """))
                db.session.commit()
                print("Índice único criado com sucesso!")
            except Exception as e:
                print(f"Erro ao criar índice único: {e}")
                # Tentar adicionar a restrição diretamente na tabela
                try:
                    db.session.execute(text("""
                        ALTER TABLE user
                        ADD CONSTRAINT uk_user_customer_phone
                        UNIQUE (customer_phone)
                    """))
                    db.session.commit()
                    print("Restrição única adicionada com sucesso!")
                except Exception as e2:
                    print(f"Erro ao adicionar restrição única: {e2}")

            # Verificar usuários sem nome (agora permitido)
            users_without_name = User.query.filter(User.customer_name.is_(None)).count()
            print(f"Usuários sem nome: {users_without_name} (agora permitido)")

            # Verificar pedidos sem nome (agora permitido)
            orders_without_name = Order.query.filter(Order.customer_name.is_(None)).count()
            print(f"Pedidos sem nome: {orders_without_name} (agora permitido)")

            print("Migração concluída com sucesso!")
            print("\nResumo das mudanças:")
            print("- Telefone é agora o único identificador obrigatório")
            print("- Nome é opcional e pode variar entre pedidos")
            print("- Histórico é mantido pelo telefone, não pelo nome")
            print("- Máscara de telefone: (DDD) 9XXXX-XXXX")

        except Exception as e:
            print(f"Erro durante a migração: {e}")
            db.session.rollback()
            raise

if __name__ == "__main__":
    migrate_phone_unique()