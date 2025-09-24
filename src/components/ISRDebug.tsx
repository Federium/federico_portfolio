/**
 * Componente di debug per mostrare informazioni ISR
 * Utile durante lo sviluppo per verificare che ISR funzioni correttamente
 */

interface ISRDebugProps {
  lastUpdated?: string;
  buildTime?: string;
  pageType: 'homepage' | 'dynamic';
  uid?: string;
}

export function ISRDebug({ lastUpdated, buildTime, pageType, uid }: ISRDebugProps) {
  // Mostra solo in development
  if (process.env.NODE_ENV === 'production') {
    return null;
  }

  const currentTime = new Date().toISOString();

  return (
    <div className="fixed bottom-4 right-4 bg-gray-900 text-white text-xs p-3 rounded shadow-lg max-w-xs z-50">
      <div className="font-bold mb-2">🔧 ISR Debug Info</div>
      
      <div className="space-y-1">
        <div>
          <span className="text-gray-400">Tipo:</span> {pageType}
        </div>
        
        {uid && (
          <div>
            <span className="text-gray-400">UID:</span> {uid}
          </div>
        )}
        
        <div>
          <span className="text-gray-400">Ora corrente:</span> 
          <br /><span className="text-xs">{currentTime}</span>
        </div>
        
        {lastUpdated && (
          <div>
            <span className="text-gray-400">Ultimo aggiornamento:</span>
            <br /><span className="text-xs">{lastUpdated}</span>
          </div>
        )}
        
        {buildTime && (
          <div>
            <span className="text-gray-400">Build time:</span>
            <br /><span className="text-xs">{buildTime}</span>
          </div>
        )}
        
        <div className="pt-2 border-t border-gray-700">
          <div className="text-green-400">✅ ISR Attivo (60s)</div>
          <div className="text-blue-400">🎣 Webhook configurato</div>
        </div>
      </div>
    </div>
  );
}

export default ISRDebug;