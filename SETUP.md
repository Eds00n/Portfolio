# 🚀 Guia de Instalação e Execução

## Passo 1: Instalar Node.js (se ainda não tiver)

1. Acesse: https://nodejs.org/
2. Baixe a versão **LTS** (Long Term Support)
3. Execute o instalador
4. Siga o assistente de instalação
5. Reinicie o terminal/PowerShell após a instalação

## Passo 2: Verificar Instalação

Abra o terminal/PowerShell e execute:

```bash
node --version
npm --version
npx --version
```

Se todos os comandos retornarem números de versão, está tudo OK! ✅

## Passo 3: Executar o Projeto

Navegue até a pasta do projeto no terminal:

```bash
cd "C:\Users\edson\Documents\Edson projetos"
```

Execute o servidor:

```bash
npx serve .
```

## Passo 4: Abrir no Navegador

Depois que o servidor iniciar, você verá uma mensagem como:

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

Abra seu navegador e acesse: **http://localhost:3000**

## 🛑 Parar o Servidor

Para parar o servidor, pressione `Ctrl + C` no terminal.

## ❓ Problemas Comuns

### "npx não é reconhecido"
- Instale o Node.js: https://nodejs.org/
- Reinicie o terminal após instalar

### "Porta já está em uso"
- Use outra porta: `npx serve . -l 5000`
- Ou encerre o processo que está usando a porta 3000

### Outros problemas
- Certifique-se de estar na pasta correta do projeto
- Verifique se todos os arquivos estão presentes (index.html, css/, js/, etc.)
