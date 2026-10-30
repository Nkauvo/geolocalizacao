# Geolocalização Mobile com React + Capacitor 📍

Projeto desenvolvido para demonstrar o uso do plugin nativo `@capacitor/geolocation` em uma aplicação móvel híbrida (React + Capacitor), integrando requisições de permissões do sistema Android, captura de coordenadas geográficas reais de alta precisão via GPS e redirecionamento para o Google Maps.

---

## 🎯 Funcionalidades

- **Captura Precisa de Coordenadas:** Obtém Latitude, Longitude e Precisão (em metros) utilizando o hardware do GPS (`enableHighAccuracy: true`).
- **Gerenciamento de Permissões Android:** Tratamento das permissões `ACCESS_FINE_LOCATION` e `ACCESS_COARSE_LOCATION` em tempo de execução.
- **Tratamento de Exceções:** Feedback visual em caso de permissão negada, GPS desativado ou timeout.
- **Integração com Google Maps:** Botão para abrir a localização diretamente no aplicativo externo do Google Maps ou navegador (`https://www.google.com/maps/search/?api=1&query=${lat},${lng}`).
- **Utilidades Extras:** Cópia rápida das coordenadas para a área de transferência e exibição de altitude/velocidade quando disponíveis.
- **Compatibilidade Híbrida:** Suporta execução tanto no ambiente Android nativo quanto no navegador Web de desenvolvimento com Error Boundary.

---

## 📱 Tecnologias Utilizadas

- [React](https://react.dev/) + [Vite](https://vitejs.dev/)
- [Capacitor](https://capacitorjs.com/) (Core, CLI e Android)
- [@capacitor/geolocation](https://capacitorjs.com/docs/apis/geolocation)
- [Lucide React](https://lucide.dev/) (Ícones)
- TypeScript

---

## ⚙️ Configurações Nativas (AndroidManifest.xml)

As seguintes permissões foram configuradas no arquivo `android/app/src/main/AndroidManifest.xml`:

```xml
<uses-permission android:name="android.permission.INTERNET" />
<uses-permission android:name="android.permission.ACCESS_COARSE_LOCATION" />
<uses-permission android:name="android.permission.ACCESS_FINE_LOCATION" />
<uses-feature android:name="android.hardware.location.gps" />
```

---

## 🚀 Como Executar o Projeto

### 1. Clonar o repositório
```bash
git clone https://github.com/Nkauvo/geolocalizacao.git
cd geolocalizacao
```

### 2. Instalar dependências
```bash
npm install
```

### 3. Rodar no navegador (Web Dev Server)
```bash
npm run dev
```
Acesse `http://localhost:5173`.

### 4. Compilar e Sincronizar com Android
```bash
npm run cap:sync
```

### 5. Executar no Smartphone / Android Studio
```bash
npm run cap:open
```
Conecte o smartphone via USB com Depuração USB ativada e clique em **Run** no Android Studio.
