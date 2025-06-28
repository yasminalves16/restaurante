import os
import sys
# DON'T CHANGE THIS !!!
sys.path.insert(0, os.path.dirname(os.path.dirname(__file__)))

from flask import Flask, send_from_directory
from flask_cors import CORS
from src.models.user import db
from src.routes.user import user_bp
from src.routes.menu import menu_bp
from src.routes.order import order_bp

app = Flask(__name__, static_folder=os.path.join(os.path.dirname(__file__), 'static'))
app.config['SECRET_KEY'] = os.environ.get('SECRET_KEY', 'asdf#FGSgvasgf$5$WGT')

# Configurar CORS para permitir acesso dos frontends
CORS(app, origins=[
    "http://localhost:3000",
    "http://localhost:5173",
    "http://localhost:5174",
    "https://cliente-casadonorte-f44g6ad8w-yasmin-alves-projects-95c82c0c.vercel.app",
    "https://restaurante-casadonorte-c4o3ymzy7.vercel.app",
    "https://seu-dominio.com",  # Substitua pelo seu domínio
    "https://www.seu-dominio.com"
])

app.register_blueprint(user_bp, url_prefix='/api')
app.register_blueprint(menu_bp, url_prefix='/api')
app.register_blueprint(order_bp, url_prefix='/api')

# Configuração do banco de dados
if os.environ.get('DATABASE_URL'):
    app.config['SQLALCHEMY_DATABASE_URI'] = os.environ.get('DATABASE_URL')
else:
    app.config['SQLALCHEMY_DATABASE_URI'] = f"sqlite:///{os.path.join(os.path.dirname(__file__), 'database', 'app.db')}"

app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
db.init_app(app)

# Importar todos os modelos para que sejam criados no banco
from src.models.menu import MenuItem
from src.models.order import Order, OrderItem

with app.app_context():
    db.create_all()

    # Adicionar dados de exemplo se o banco estiver vazio
    if MenuItem.query.count() == 0:
        print("📋 Inicializando banco de dados com dados de exemplo...")

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
        print(f"✅ {len(menu_items)} itens do cardápio criados com sucesso!")

# Rotas para servir os frontends
@app.route('/client/')
@app.route('/client/<path:path>')
def serve_client(path='index.html'):
    client_folder = os.path.join(app.static_folder, 'client')
    if not os.path.exists(client_folder):
        return "Client frontend not found", 404

    if path == '' or path == 'index.html':
        return send_from_directory(client_folder, 'index.html')
    else:
        return send_from_directory(client_folder, path)

@app.route('/restaurant/')
@app.route('/restaurant/<path:path>')
def serve_restaurant(path='index.html'):
    restaurant_folder = os.path.join(app.static_folder, 'restaurant')
    if not os.path.exists(restaurant_folder):
        return "Restaurant frontend not found", 404

    if path == '' or path == 'index.html':
        return send_from_directory(restaurant_folder, 'index.html')
    else:
        return send_from_directory(restaurant_folder, path)

@app.route('/', defaults={'path': ''})
@app.route('/<path:path>')
def serve(path):
    static_folder_path = app.static_folder
    if static_folder_path is None:
            return "Static folder not configured", 404

    if path != "" and os.path.exists(os.path.join(static_folder_path, path)):
        return send_from_directory(static_folder_path, path)
    else:
        index_path = os.path.join(static_folder_path, 'index.html')
        if os.path.exists(index_path):
            return send_from_directory(static_folder_path, 'index.html')
        else:
            return "index.html not found", 404

@app.route('/health')
def health_check():
    return {'status': 'healthy', 'message': 'API is running'}

if __name__ == '__main__':
    debug = os.environ.get('FLASK_ENV') == 'development'
    app.run(host='0.0.0.0', port=int(os.environ.get('PORT', 5000)), debug=debug)
