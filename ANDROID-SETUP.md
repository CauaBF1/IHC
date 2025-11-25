# Configuração de Desenvolvimento Android

## ✅ Deu certo! 

O `adb reverse` **permanece ativo enquanto o dispositivo estiver conectado**, mas algumas situações podem resetá-lo:

### 🔄 Quando precisa reconfigurar:

1. **Desconectar/reconectar dispositivo**
2. **Reiniciar Android Studio ou emulador**
3. **Reiniciar o computador**
4. **Trocar de dispositivo/emulador**

### 🚀 Script automático criado!

Execute este comando para configurar tudo automaticamente:

```bash
cd /home/borgescaua/IHC/IHC
./setup-dev.sh
```

**O script faz:**
- ✅ Verifica se ADB está disponível
- ✅ Detecta dispositivos conectados
- ✅ Configura `adb reverse tcp:3000 tcp:3000`
- ✅ Inicia backend se não estiver rodando
- ✅ Testa conectividade

### 📱 Comandos úteis:

```bash
# Ver dispositivos conectados
adb devices

# Ver reverse ports ativos
adb reverse --list

# Reconfigurar manualmente
adb reverse tcp:3000 tcp:3000

# Remover todos reverse ports (se quiser limpar)
adb reverse --remove-all
```

### 🔧 Para automatizar ainda mais:

**Adicione ao seu `.bashrc` ou `.zshrc`:**

```bash
# Alias para desenvolvimento Android
alias dev-android='cd /home/borgescaua/IHC/IHC && ./setup-dev.sh'
alias adb-setup='adb reverse tcp:3000 tcp:3000 && echo "✅ Reverse port configurado!"'
```

Depois só executar `dev-android` ou `adb-setup` sempre que precisar! 🎉

### ⚡ Dica pro:

O reverse port **geralmente permanece** entre builds do app (`ionic build && npx cap sync android`), então não precisa reconfigurar a cada build, só quando reconectar o dispositivo.