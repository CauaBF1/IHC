#!/bin/bash

# Script para configurar automaticamente o ambiente de desenvolvimento Android + Backend

echo "🔧 Configurando ambiente de desenvolvimento..."

# Verifica se adb está disponível
if ! command -v adb &> /dev/null; then
    echo "❌ ADB não encontrado. Instale o Android SDK Platform Tools."
    exit 1
fi

# Verifica se há dispositivos conectados
DEVICES=$(adb devices | grep -v "List of devices" | grep "device$" | wc -l)
if [ $DEVICES -eq 0 ]; then
    echo "⚠️  Nenhum dispositivo Android conectado."
    echo "   Conecte um dispositivo ou inicie o emulador e tente novamente."
    exit 1
fi

echo "📱 Dispositivo(s) detectado(s): $DEVICES"

# Configura o reverse port
echo "🔄 Configurando reverse port tcp:3000..."
adb reverse tcp:3000 tcp:3000

# Verifica se funcionou
if adb reverse --list | grep -q "tcp:3000 tcp:3000"; then
    echo "✅ Reverse port configurado com sucesso!"
else
    echo "❌ Falha ao configurar reverse port."
    exit 1
fi

# Inicia o backend se não estiver rodando
if ! pgrep -f "node server.js" > /dev/null; then
    echo "🚀 Iniciando backend..."
    cd "$(dirname "$0")/backend"
    node server.js &
    BACKEND_PID=$!
    echo "Backend iniciado com PID: $BACKEND_PID"
    
    # Aguarda um momento para o backend inicializar
    sleep 3
    
    # Testa se o backend está respondendo
    if curl -s http://localhost:3000/health > /dev/null; then
        echo "✅ Backend rodando e respondendo!"
    else
        echo "⚠️  Backend iniciado mas pode estar com problemas."
    fi
else
    echo "✅ Backend já está rodando."
fi

echo ""
echo "🎉 Ambiente configurado com sucesso!"
echo ""
echo "📋 Para desenvolvimento:"
echo "   • Backend: http://localhost:3000"
echo "   • Reverse port ativo para Android"
echo "   • Para parar: pkill -f 'node server.js'"
echo ""
echo "🔄 Para reconfigurar o reverse port a qualquer momento:"
echo "   adb reverse tcp:3000 tcp:3000"