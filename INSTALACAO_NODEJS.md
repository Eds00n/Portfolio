# 📦 Instalação do Node.js para usar `npx serve .`

## ⚠️ Problema Identificado

O comando `npx` não está disponível porque o Node.js não está instalado no seu sistema.

## ✅ Solução: Instalar Node.js

### Passo 1: Baixar o Node.js

1. Acesse: **https://nodejs.org/**
2. Clique no botão verde **"LTS"** (versão recomendada)
   - A versão LTS é a mais estável e recomendada
   - Atualmente: v20.x.x ou v22.x.x

### Passo 2: Instalar

1. Execute o arquivo `.msi` baixado
2. Clique em **"Next"** nas telas de instalação
3. **Importante**: Marque a opção **"Automatically install the necessary tools"** (se aparecer)
4. Complete a instalação clicando em **"Install"**
5. Aguarde a conclusão da instalação
6. Clique em **"Finish"**

### Passo 3: Verificar a Instalação

**IMPORTANTE**: Feche e reabra o PowerShell/terminal após a instalação!

Depois, execute no PowerShell:

```powershell
node --version
npm --version
npx --version
```

Se aparecerem números de versão (ex: `v20.11.0`), está funcionando! ✅

### Passo 4: Executar o Projeto

Depois que o Node.js estiver instalado, navegue até a pasta do projeto:

```powershell
cd "C:\Users\edson\Documents\Edson projetos"
```

Execute o servidor:

```powershell
npx serve .
```

## 🚀 Alternativa Temporária (Sem Node.js)

Se você quiser testar o projeto AGORA, sem instalar o Node.js:

### Opção 1: Abrir direto no navegador
- Dê um **duplo clique** no arquivo `index.html`
- O navegador abrirá o site

### Opção 2: Usar Python (se tiver instalado)
```powershell
python -m http.server 8000
```
Depois acesse: `http://localhost:8000`

### Opção 3: Usar PHP (se tiver instalado)
```powershell
php -S localhost:8000
```

## ❓ Dúvidas Frequentes

**P: Preciso instalar o Node.js mesmo que só queira ver o site?**
R: Não! Você pode abrir o `index.html` diretamente. Mas se quiser usar `npx serve .`, precisa instalar.

**P: A instalação do Node.js é pesada?**
R: Não, é rápida (aprox. 5-10 minutos) e ocupa ~200MB.

**P: Vou conseguir usar o comando após instalar?**
R: Sim! Mas **lembre-se de fechar e reabrir o PowerShell** após a instalação.

## 📞 Precisa de Ajuda?

Se tiver problemas na instalação:
1. Certifique-se de estar executando como administrador
2. Desative temporariamente o antivírus durante a instalação
3. Verifique se há espaços no caminho da instalação
