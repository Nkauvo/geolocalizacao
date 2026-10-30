import React, { useState, useEffect } from 'react';
import { Geolocation, Position } from '@capacitor/geolocation';
import { Capacitor } from '@capacitor/core';
import {
  MapPin,
  Navigation,
  Compass,
  AlertCircle,
  ExternalLink,
  ShieldCheck,
  Check,
  Copy,
  Clock,
  Crosshair,
  Smartphone,
  Globe
} from 'lucide-react';

export default function App() {
  // Estados para armazenar as informações solicitadas
  const [latitude, setLatitude] = useState<number | null>(null);
  const [longitude, setLongitude] = useState<number | null>(null);
  const [accuracy, setAccuracy] = useState<number | null>(null);
  const [altitude, setAltitude] = useState<number | null>(null);
  const [speed, setSpeed] = useState<number | null>(null);
  const [timestamp, setTimestamp] = useState<string | null>(null);

  // Estados de controle e feedback
  const [loading, setLoading] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [permissionState, setPermissionState] = useState<string>('pronto');
  const [copied, setCopied] = useState<boolean>(false);

  const isNative = Capacitor.isNativePlatform();

  // 1. Verificar permissões ao iniciar o aplicativo
  useEffect(() => {
    checkCurrentPermission();
  }, []);

  /**
   * Verifica o status da permissão de forma segura para Web e Android Nativo
   */
  const checkCurrentPermission = async () => {
    try {
      if (isNative) {
        const status = await Geolocation.checkPermissions();
        setPermissionState(status.location || 'desconhecido');
      } else {
        // No navegador web
        if (navigator.permissions && navigator.permissions.query) {
          const result = await navigator.permissions.query({ name: 'geolocation' as PermissionName });
          setPermissionState(result.state);
          result.onchange = () => {
            setPermissionState(result.state);
          };
        } else {
          setPermissionState('suportado');
        }
      }
    } catch (err: any) {
      console.warn('Verificação de permissão:', err);
      setPermissionState('solicitar ao capturar');
    }
  };

  /**
   * Solicita as permissões do Android
   */
  const requestAndroidPermission = async (): Promise<boolean> => {
    if (!isNative) {
      // No navegador, a permissão é solicitada diretamente pelo navegador ao chamar getCurrentPosition
      return true;
    }

    try {
      const status = await Geolocation.checkPermissions();

      if (status.location === 'granted') {
        setPermissionState('granted');
        return true;
      }

      // Abre o diálogo nativo do Android solicitando permissão
      const requestResult = await Geolocation.requestPermissions({
        permissions: ['location']
      });

      setPermissionState(requestResult.location);
      return requestResult.location === 'granted';
    } catch (err: any) {
      console.error('Falha ao requisitar permissão nativa:', err);
      // Fallback: tenta continuar caso o erro seja irrelevante
      return true;
    }
  };

  /**
   * Captura a posição geográfica precisa através do GPS do dispositivo
   */
  const fetchCurrentLocation = async () => {
    setLoading(true);
    setErrorMessage(null);

    try {
      // 1. Se for nativo, valida/solicita permissão nativa
      if (isNative) {
        const hasPermission = await requestAndroidPermission();
        if (!hasPermission) {
          throw new Error('Permissão de localização negada pelo usuário no Android.');
        }
      }

      // 2. Captura as coordenadas com alta precisão (GPS)
      const position: Position = await Geolocation.getCurrentPosition({
        enableHighAccuracy: true, // Utiliza o hardware de GPS com precisão máxima
        timeout: 15000,           // 15 segundos de timeout
        maximumAge: 0             // Sem cache antigo
      });

      // 3. Atualiza os estados em React
      setLatitude(position.coords.latitude);
      setLongitude(position.coords.longitude);
      setAccuracy(position.coords.accuracy);
      setAltitude(position.coords.altitude);
      setSpeed(position.coords.speed);
      setTimestamp(new Date(position.timestamp).toLocaleTimeString());
      setPermissionState('granted');
    } catch (error: any) {
      console.error('Erro na captura do GPS:', error);
      
      const msg = error?.message?.toLowerCase() || '';
      if (msg.includes('denied') || msg.includes('negada') || error?.code === 1) {
        setErrorMessage('Permissão negada. Conceda permissão de localização no navegador/dispositivo.');
        setPermissionState('denied');
      } else if (msg.includes('timeout') || error?.code === 3) {
        setErrorMessage('Tempo esgotado ao buscar sinal do GPS. Verifique se o GPS está ativado.');
      } else if (msg.includes('disabled') || msg.includes('unavailable') || error?.code === 2) {
        setErrorMessage('O GPS/localização está desativado no aparelho. Por favor, ative nas configurações.');
      } else {
        setErrorMessage(error?.message || 'Erro ao capturar coordenadas do GPS.');
      }
    } finally {
      setLoading(false);
    }
  };

  /**
   * Abre no Google Maps
   */
  const handleOpenGoogleMaps = () => {
    if (latitude !== null && longitude !== null) {
      const url = `https://www.google.com/maps/search/?api=1&query=${latitude},${longitude}`;
      window.open(url, '_blank');
    }
  };

  /**
   * Copia as coordenadas para a área de transferência
   */
  const handleCopyCoordinates = () => {
    if (latitude && longitude) {
      const text = `${latitude}, ${longitude}`;
      navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="app-container">
      {/* Cabeçalho */}
      <header className="header-box">
        <div className="header-icon">
          <MapPin size={28} />
        </div>
        <h1 className="header-title">Geolocalização GPS</h1>
        <p className="header-subtitle">Capacitor Native Geolocation Plugin</p>

        {/* Indicador de Plataforma e Status de Permissão */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', flexWrap: 'wrap' }}>
          <div className="status-pill" style={{ background: 'rgba(255,255,255,0.08)', color: '#cbd5e1' }}>
            {isNative ? <Smartphone size={12} /> : <Globe size={12} />}
            <span>{isNative ? 'Android Nativo' : 'Navegador Web'}</span>
          </div>

          <div
            className={`status-pill ${
              permissionState === 'granted'
                ? 'status-granted'
                : permissionState === 'denied'
                ? 'status-denied'
                : 'status-prompt'
            }`}
          >
            <span className="pulse-dot"></span>
            <span>Permissão: {permissionState}</span>
          </div>
        </div>
      </header>

      {/* Caixa de Mensagem de Erro */}
      {errorMessage && (
        <div className="alert-error">
          <AlertCircle size={20} style={{ flexShrink: 0, marginTop: 2 }} />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Grid de Coordenadas Principais */}
      <div className="coords-grid">
        {/* Latitude */}
        <div className="coord-card">
          <div className="coord-header">
            <Compass size={16} />
            <span>Latitude</span>
          </div>
          <div className="coord-value">
            {latitude !== null ? latitude.toFixed(6) : '--'}
          </div>
        </div>

        {/* Longitude */}
        <div className="coord-card">
          <div className="coord-header">
            <Compass size={16} />
            <span>Longitude</span>
          </div>
          <div className="coord-value">
            {longitude !== null ? longitude.toFixed(6) : '--'}
          </div>
        </div>

        {/* Precisão (Accuracy) */}
        <div className="coord-card full-width">
          <div className="coord-header">
            <Crosshair size={16} />
            <span>Precisão do GPS</span>
          </div>
          <div className="coord-value">
            {accuracy !== null ? (
              <>
                ±{accuracy.toFixed(1)} <span className="coord-unit">metros</span>
              </>
            ) : (
              '--'
            )}
          </div>
        </div>
      </div>

      {/* Detalhes Adicionais de Telemetria */}
      {(latitude !== null || timestamp !== null) && (
        <div className="details-card">
          <div className="detail-row">
            <span className="detail-label">
              <Clock size={14} /> Última Leitura:
            </span>
            <span className="detail-value">{timestamp || 'Agora'}</span>
          </div>

          {altitude !== null && (
            <div className="detail-row">
              <span className="detail-label">Altitude:</span>
              <span className="detail-value">{altitude.toFixed(1)} m</span>
            </div>
          )}

          {speed !== null && speed > 0 && (
            <div className="detail-row">
              <span className="detail-label">Velocidade:</span>
              <span className="detail-value">{(speed * 3.6).toFixed(1)} km/h</span>
            </div>
          )}

          <div className="detail-row">
            <span className="detail-label">Hardware:</span>
            <span className="detail-value">{isNative ? 'GPS do Smartphone' : 'Geolocalização do Navegador'}</span>
          </div>
        </div>
      )}

      {/* Botões de Ação */}
      <div className="buttons-group">
        {/* Botão de Captura */}
        <button
          className="btn btn-primary"
          onClick={fetchCurrentLocation}
          disabled={loading}
        >
          {loading ? (
            <>
              <div className="spinner"></div>
              <span>Obtendo sinal GPS...</span>
            </>
          ) : (
            <>
              <Navigation size={18} />
              <span>{latitude ? 'Atualizar Localização' : 'Capturar Coordenadas GPS'}</span>
            </>
          )}
        </button>

        {/* Botão para abrir no Google Maps */}
        {latitude !== null && longitude !== null && (
          <>
            <button className="btn btn-maps" onClick={handleOpenGoogleMaps}>
              <ExternalLink size={18} />
              <span>Ver no Google Maps</span>
            </button>

            <button className="btn btn-secondary" onClick={handleCopyCoordinates}>
              {copied ? (
                <>
                  <Check size={18} color="#10b981" />
                  <span style={{ color: '#10b981' }}>Coordenadas Copiadas!</span>
                </>
              ) : (
                <>
                  <Copy size={18} />
                  <span>Copiar Latitude e Longitude</span>
                </>
              )}
            </button>
          </>
        )}
      </div>
    </div>
  );
}
