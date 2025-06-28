#!/usr/bin/env python3

import sys
import os
sys.path.insert(0, 'src')

from main import app, db
from src.models.menu import MenuItem

def add_sample_data():
    with app.app_context():
        # Verificar se já existem itens no menu
        if MenuItem.query.count() > 0:
            print("✅ Dados de exemplo já existem no banco!")
            return

        # Criar itens do cardápio
        menu_items = [
            {
                'name': 'X-Burger',
                'description': 'Hambúrguer artesanal com queijo, alface, tomate e molho especial',
                'price': 18.90,
                'category': 'prato principal',
                'available_for_delivery': True,
                'available_for_local': True,
                'image_url': 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400'
            },
            {
                'name': 'X-Salada',
                'description': 'Hambúrguer com salada completa: alface, tomate, cebola, picles',
                'price': 22.50,
                'category': 'prato principal',
                'available_for_delivery': True,
                'available_for_local': True,
                'image_url': 'https://images.unsplash.com/photo-1571091718767-18b5b1457add?w=400'
            },
            {
                'name': 'Batata Frita',
                'description': 'Porção de batatas fritas crocantes com sal',
                'price': 12.90,
                'category': 'acompanhamento',
                'available_for_delivery': True,
                'available_for_local': True,
                'image_url': 'https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=400'
            },
            {
                'name': 'Refrigerante',
                'description': 'Coca-Cola, Pepsi, Sprite ou Fanta (350ml)',
                'price': 6.50,
                'category': 'bebida',
                'available_for_delivery': True,
                'available_for_local': True,
                'image_url': 'https://images.unsplash.com/photo-1629203851122-3726ecdf080e?w=400'
            },
            {
                'name': 'Suco Natural',
                'description': 'Suco de laranja, limão ou maracujá (300ml)',
                'price': 8.90,
                'category': 'bebida',
                'available_for_delivery': True,
                'available_for_local': True,
                'image_url': 'https://images.unsplash.com/photo-1622597489632-0c2f5e2c8038?w=400'
            },
            {
                'name': 'Sorvete',
                'description': 'Sorvete de creme, chocolate ou morango',
                'price': 9.90,
                'category': 'sobremesa',
                'available_for_delivery': False,  # Sorvete não disponível para delivery
                'available_for_local': True,
                'image_url': 'https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=400'
            }
        ]

        for item_data in menu_items:
            item = MenuItem(**item_data)
            db.session.add(item)

        db.session.commit()
        print("✅ Dados de exemplo adicionados com sucesso!")
        print(f"📋 {len(menu_items)} itens do cardápio criados")

if __name__ == '__main__':
    add_sample_data()