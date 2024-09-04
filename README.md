# Teste-MovieApp
 Esta é uma aplicação web construída usando Angular e Django. O frontend é desenvolvido com Angular, e o backend é por Django. A aplicação permite que os usuários busquem por filmes, visualizem detalhes dos filmes e gerenciem uma lista de filmes favoritos ligada ao seu usuário.
 
Features:

-Autenticação de usuários (login e cadastro)

-Busca de filmes utilizando a API do TMDB

-Visualização de detalhes dos filmes

-Adição ou remoção de filmes da lista de favoritos

-Compartilhamento de sua lista de favoritos através de um link

Para executar localmente:

## Instalação
### Backend (Django)

git clone https://github.com/AyrtonOuriques/Teste-MovieApp.git

cd Teste-MovieApp/backend

python -m venv env

env\Scripts\activate

pip install -r requirements.txt

python manage.py migrate

python manage.py createsuperuser

python manage.py runserver

### Frontend (Angular)

Vá para o diretório principal

npm install

ng serve

## Configuração

### Backend (Django)

django-admin shell

from django.core.management.utils import get_random_secret_key  

get_random_secret_key()

Use esse chave e coloque-a no arquivo settings.py na váriavel SECRET-KEY.

### Frontend (Angular)

No arquivo auth.service.ts, substitua   "private apiUrl = 'https://emerging-dynamic-opossum.ngrok-free.app';" 
por "private apiUrl = 'https://127.0.0.1/8000';" 

## Testing

### Backend (Django)

cd Teste-MovieApp/backend

python manage.py test


### Frontend (Angular)

Vá para o diretório principal

ng test
