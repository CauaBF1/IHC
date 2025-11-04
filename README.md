# Aplicação front-end e back-end com API do Gemini
## Passos

### 1. Configurar ambiente (Ubuntu):
#### Ferramentas necessárias:
* ionic 7.2
* npm 10.9
* angular de 15 até 19
* nodeJS v23

#### 1.1. Instalar NVM (Node Version Manager)
`sudo apt install curl `

`curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.7/install.sh | bash`

Feche e reabra o terminal ou execute source ~/.bashrc para que o NVM seja carregado. 

#### 1.1. Instalar node e npm
Verificar versõoes disponíveis do node:

`nvm ls-remote`

Instalar versão:

`nvm install 23`

`nvm use 23`

Confirmar as versões:

node -v

npm -v

#### 1.2. Dentro do repositório do projeto instalar todos os pacotes importantes
Dentro dos repositórios do servidor (backend) e do cliente (chatbot):

`npm install`

Exemplo de como instalar bibliotecas específicas:

`npm install express axios cors dotenv`

`npm install @ionic/pwa-elements`

#### 1.3. Instalar o angular
`npm install -g @angular/cli`

#### 1.4. Instalar o @ionic/cli
`npm install -g @ionic/cli@7.2.1`

`ionic -version`

Se quiser desinstalar o ionic:

npm uninstall -g ionic

npm uninstall -g @ionic/cli

### 2. Abrir o projeto em um editor (VS Code)

### 3. Criar um arquivo .env
Criar o arquivo .env dentro da pasta do backend

#### 3.1. Inserir as variáveis globais

PORT=3000

GEMINI_API_KEY=

### 3.2. Criar chave da API:
Link para criar a chave gratuita: <https://aistudio.google.com/app/api-keys?hl=pt-br>

Copiar chave para o arquivo .env

### 4. Rodar a aplicação

#### 4.1. Abrir um terminal dentro da pasta do projeto

#### 4.2. Build da aplicação na pasta do cliente (chatbot)
`ionic build`

#### 4.2. Subir o servidor na pasta do servidor (backend)
`node server.js`

#### 4.3. Rodar a aplicação no computador na pasta do cliente (chatbot)
`ionic serve`


## Criar novas páginas ou componentes
 
### 1. criar uma page
No terminal

chatbot_gemini/chatbot$ `ionic generate page pages/login`

### 2. criar um component
No terminal

chatbot_gemini/chatbot$ `ionic generate component components/menu`
