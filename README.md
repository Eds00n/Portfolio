# EC CODE - Portfólio

Portfólio pessoal desenvolvido com HTML, CSS e JavaScript puro.

## 🚀 Características

- Design moderno e responsivo
- Animação de carregamento com efeito "portão lateral"
- Gradiente animado no logo
- Totalmente responsivo (Desktop, Tablet e Mobile)

## 📁 Estrutura do Projeto

```
├── assets/
│   └── images/          # Imagens e recursos visuais
├── css/
│   └── styles.css       # Estilos CSS
├── js/
│   └── script.js        # Scripts JavaScript
├── index.html           # Página principal
├── package.json         # Configurações do projeto
└── README.md           # Documentação
```

## 🛠️ Tecnologias Utilizadas

- HTML5
- CSS3 (com animações e keyframes)
- JavaScript (Vanilla)
- Google Fonts (Poppins)

## ▶️ Como Executar

### ⚠️ Pré-requisito: Instalar Node.js

Para usar `npx serve`, você precisa do Node.js instalado:

1. **Baixe o Node.js**: Acesse [nodejs.org](https://nodejs.org/)
2. **Instale a versão LTS** (recomendada)
3. **Verifique a instalação**:
   ```bash
   node --version
   npm --version
   npx --version
   ```

### Opção 1: Usando npx serve (Recomendado)

Após instalar o Node.js, execute diretamente o comando:

```bash
npx serve .
```

O servidor iniciará automaticamente e você verá uma mensagem como:
```
   ┌─────────────────────────────────────────┐
   │                                         │
   │   Serving!                              │
   │                                         │
   │   Local:    http://localhost:3000       │
   │   Network:  http://192.168.x.x:3000     │
   │                                         │
   └─────────────────────────────────────────┘
```

Abra seu navegador e acesse `http://localhost:3000`

### Opção 2: Usando npm scripts

```bash
npm start      # Usa npx serve . na porta padrão
npm run dev    # Usa npx serve . na porta 3000
```

### ⚠️ Problema: "npm/npx não é reconhecido"

Se você receber o erro `npm : O termo 'npm' não é reconhecido` após instalar o Node.js:

**Solução 1**: Atualize o PATH na sessão atual do PowerShell:
```powershell
$env:Path = [System.Environment]::GetEnvironmentVariable("Path","Machine") + ";" + [System.Environment]::GetEnvironmentVariable("Path","User")
```

**Solução 2**: Execute o script automático:
```powershell
.\atualizar-path.ps1
```

**Solução 3**: Feche e reabra o PowerShell (ou reinicie o computador se necessário)

### Opção 3: Abrir direto no navegador

Para testes simples, você pode abrir o arquivo `index.html` diretamente no navegador:
- Duplo clique no arquivo `index.html`
- Ou arraste o arquivo para o navegador

### Opção 4: Usando serve globalmente (já instalado)

Como o `serve` já está instalado globalmente, você pode usar diretamente:

```bash
serve .
```

Ou especificar uma porta:

```bash
serve . -l 3000
```

### Opção 5: Outros métodos

```bash
# Usando Python (se instalado)
python -m http.server 8000
```

## 📱 Responsividade

O projeto foi desenvolvido com mobile-first e suporta:
- **Desktop**: Resoluções acima de 768px
- **Tablet**: Resoluções até 768px
- **Mobile**: Resoluções até 500px

## 🎨 Personalização

Os estilos podem ser facilmente modificados em `css/styles.css`. As cores principais podem ser ajustadas nas variáveis de gradiente do logo.

## 📄 Licença

MIT License
