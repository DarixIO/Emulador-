import React from 'react';
import {
  Play,
  Pause,
  StepForward,
  RotateCcw,
  Cpu,
  Activity,
  BookOpen,
} from 'lucide-react';
import {
  DataPacket,
  RouterNode,
  SimulationLogEntry,
  SimulationStage,
} from '../types/network';

interface PacketInspectorPanelProps {
  packets: DataPacket[];
  nodes: RouterNode[];
  selectedPacketId: number | null;
  onSelectPacket: (id: number) => void;
  stage: SimulationStage;
  isPlaying: boolean;
  onTogglePlay: () => void;
  onStepForward: () => void;
  onReset: () => void;
  playbackSpeed: number;
  onChangeSpeed: (speed: number) => void;
  logs: SimulationLogEntry[];
}

export const PacketInspectorPanel: React.FC<PacketInspectorPanelProps> = ({
  packets,
  nodes,
  selectedPacketId,
  onSelectPacket,
  stage,
  isPlaying,
  onTogglePlay,
  onStepForward,
  onReset,
  playbackSpeed,
  onChangeSpeed,
  logs,
}) => {
  const selectedPacket =
    packets.find((p) => p.id === selectedPacketId) || packets[0] || null;

  const nodeLabelMap = React.useMemo(() => {
    const map: Record<string, string> = {};
    for (const n of nodes) map[n.id] = n.id.replace('N', 'R');
    return map;
  }, [nodes]);

  const getStageExplanation = () => {
    switch (stage) {
      case 'idle':
        return {
          step: 'Listo para Iniciar',
          title: 'Prepara tu mensaje y lánzalo a la red TCP/IP',
          description:
            'Escribe cualquier mensaje en la laptop emisora (izquierda), elige en cuántos paquetes deseas dividirlo y presiona "Enviar y Fragmentar Mensaje". También puedes cortar routers en la malla central para ver cómo cambian de ruta.',
        };
      case 'fragmenting':
        return {
          step: 'Etapa 1 · Capa de Transporte (TCP)',
          title: 'El mensaje se divide en paquetes numerados',
          description:
            'Un archivo o mensaje completo sería demasiado grande para acaparar un cable. TCP lo corta en segmentos pequeños y estampa en cada uno un Número de Secuencia (SEQ) y un código de verificación (Checksum).',
        };
      case 'routing':
        return {
          step: 'Etapa 2 · Capa de Red (IP)',
          title: 'Cada paquete viaja por una ruta independiente',
          description:
            'El protocolo IP evalúa el tráfico en cada router intermedio. El Paquete 1 puede ir por el norte mientras el Paquete 2 va por el centro. Si cortas un nodo o cable ahora mismo, los paquetes recalcularán otra ruta al instante.',
        };
      case 'reassembling':
        return {
          step: 'Etapa 3 · Buffer de Recepción TCP',
          title: 'Reordenando paquetes que llegaron por distintos caminos',
          description:
            'Como viajaron por rutas de diferente longitud, algunos paquetes llegan desordenados (ej. llega el 2 antes que el 1). El receptor lee el número de secuencia TCP y espera las piezas faltantes para armar el rompecabezas.',
        };
      case 'completed':
        return {
          step: 'Proceso Completado · Confirmación ACK',
          title: 'Mensaje reensamblado de forma íntegra en el destino',
          description:
            'Todos los paquetes han llegado, el receptor envió los acuses de recibo (ACK) correspondientes y las piezas se unieron en su orden exacto (1 → 2 → 3) sin que el usuario final note que viajaron separadas.',
        };
    }
  };

  const narrator = getStageExplanation();

  return (
    <section
      id="inspector-section"
      className="bg-white border border-slate-200 rounded-xl p-5"
    >
      {/* Top Playback Controls & Step-by-Step Narrator Bar */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-5 mb-5 border-b border-slate-200">
        <div className="flex items-start gap-3.5 max-w-3xl">
          <div className="w-9 h-9 rounded-lg bg-orange-50 border border-orange-200 flex items-center justify-center shrink-0 mt-0.5">
            <BookOpen className="w-4 h-4 text-[#F97316]" />
          </div>
          <div>
            <div className="text-xs font-semibold text-orange-600">
              {narrator.step}
            </div>
            <h3 className="text-base font-bold text-[#0B213F]">
              {narrator.title}
            </h3>
            <p className="text-xs text-slate-600 mt-0.5 leading-relaxed">
              {narrator.description}
            </p>
          </div>
        </div>

        {/* Simulation Playback Toolbar */}
        <div className="flex flex-wrap items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={onTogglePlay}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-white bg-[#0B213F] hover:bg-slate-800 rounded-lg transition-colors cursor-pointer whitespace-nowrap shrink-0"
          >
            {isPlaying ? (
              <>
                <Pause className="w-3.5 h-3.5" />
                Pausar Simulación
              </>
            ) : (
              <>
                <Play className="w-3.5 h-3.5 fill-current" />
                {stage === 'idle' || stage === 'completed'
                  ? 'Reproducir Viaje'
                  : 'Reanudar'}
              </>
            )}
          </button>

          <button
            type="button"
            onClick={onStepForward}
            disabled={isPlaying}
            title="Avanzar un salto paso a paso (pausa primero para usar)"
            className={`inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-lg border transition-colors whitespace-nowrap shrink-0 ${
              isPlaying
                ? 'bg-slate-50 text-slate-400 border-slate-200 cursor-not-allowed'
                : 'bg-white text-[#0B213F] border-slate-200 hover:bg-slate-50 cursor-pointer'
            }`}
          >
            <StepForward className="w-3.5 h-3.5" />
            Paso a Paso
          </button>

          <button
            type="button"
            onClick={onReset}
            className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-slate-600 bg-white border border-slate-200 hover:bg-slate-50 rounded-lg transition-colors cursor-pointer whitespace-nowrap shrink-0"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Reiniciar
          </button>

          {/* Speed Selector */}
          <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-lg">
            {[0.5, 1, 2].map((spd) => (
              <button
                key={spd}
                type="button"
                onClick={() => onChangeSpeed(spd)}
                className={`px-2 py-1 text-xs font-mono font-semibold rounded-md transition-colors cursor-pointer whitespace-nowrap shrink-0 ${
                  playbackSpeed === spd
                    ? 'bg-white text-[#0B213F] shadow-xs'
                    : 'text-slate-600 hover:text-[#0B213F]'
                }`}
              >
                {spd}x
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Split: Left = TCP/IP Packet Header Inspector, Right = Live Event Log */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left 7 Columns: Deep Packet Header Inspector */}
        <div className="lg:col-span-7">
          <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
            <div className="flex items-center gap-2">
              <Cpu className="w-4 h-4 text-[#0B213F]" />
              <h4 className="text-sm font-bold text-[#0B213F]">
                Inspector de Cabeceras TCP/IP (Haz clic en un paquete)
              </h4>
            </div>

            {/* Packet Selector Tabs */}
            <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-lg">
              {packets.map((pkt) => (
                <button
                  key={pkt.id}
                  type="button"
                  onClick={() => onSelectPacket(pkt.id)}
                  className={`px-2.5 py-1 text-xs font-mono font-semibold rounded-md transition-colors cursor-pointer whitespace-nowrap shrink-0 ${
                    selectedPacket?.id === pkt.id
                      ? 'bg-[#0B213F] text-white'
                      : 'text-slate-600 hover:text-[#0B213F]'
                  }`}
                >
                  Paq #{pkt.id}
                </button>
              ))}
            </div>
          </div>

          {selectedPacket && (
            <div className="bg-[#F8FAFC] border border-slate-200 rounded-xl p-4 space-y-3">
              {/* Layer 3 IP Header Row */}
              <div>
                <div className="flex items-center justify-between text-xs text-slate-500 mb-1.5">
                  <span className="font-semibold text-[#0B213F]">
                    Capa 3 · Cabecera IP (Enrutamiento Independiente)
                  </span>
                  <span className="font-mono text-[11px]">
                    Protocolo 0x06 (TCP) · {selectedPacket.headers.version}
                  </span>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 font-mono text-xs tabular-nums">
                  <div className="bg-white border border-slate-200/80 rounded-lg p-2">
                    <div className="text-[10px] text-slate-400">IP ORIGEN</div>
                    <div className="font-semibold text-[#0B213F]">
                      {selectedPacket.headers.sourceIp}
                    </div>
                  </div>
                  <div className="bg-white border border-slate-200/80 rounded-lg p-2">
                    <div className="text-[10px] text-slate-400">IP DESTINO</div>
                    <div className="font-semibold text-[#0B213F]">
                      {selectedPacket.headers.destIp}
                    </div>
                  </div>
                  <div className="bg-white border border-slate-200/80 rounded-lg p-2">
                    <div className="text-[10px] text-slate-400">
                      TTL (SALTOS VIDA)
                    </div>
                    <div className="font-semibold text-orange-600">
                      {selectedPacket.headers.ttl} / {selectedPacket.headers.initialTtl}
                    </div>
                  </div>
                  <div className="bg-white border border-slate-200/80 rounded-lg p-2">
                    <div className="text-[10px] text-slate-400">
                      REENRUTAMIENTOS
                    </div>
                    <div className="font-semibold text-[#0B213F]">
                      {selectedPacket.reroutedCount} cambios
                    </div>
                  </div>
                </div>
              </div>

              {/* Layer 4 TCP Header Row */}
              <div>
                <div className="flex items-center justify-between text-xs text-slate-500 mb-1.5">
                  <span className="font-semibold text-[#0B213F]">
                    Capa 4 · Cabecera TCP (Orden, Fragmentación y Fiabilidad)
                  </span>
                  <span className="font-mono text-[11px]">
                    Flags: [{selectedPacket.headers.flags.join(', ')}]
                  </span>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 font-mono text-xs tabular-nums">
                  <div className="bg-white border border-slate-200/80 rounded-lg p-2">
                    <div className="text-[10px] text-slate-400">
                      SECUENCIA (SEQ)
                    </div>
                    <div className="font-semibold text-[#0B213F]">
                      #{selectedPacket.headers.seqNumber} ({selectedPacket.id} de{' '}
                      {selectedPacket.totalPackets})
                    </div>
                  </div>
                  <div className="bg-white border border-slate-200/80 rounded-lg p-2">
                    <div className="text-[10px] text-slate-400">PUERTOS</div>
                    <div className="font-semibold text-[#0B213F]">
                      {selectedPacket.headers.sourcePort} →{' '}
                      {selectedPacket.headers.destPort}
                    </div>
                  </div>
                  <div className="bg-white border border-slate-200/80 rounded-lg p-2">
                    <div className="text-[10px] text-slate-400">CHECKSUM CRC</div>
                    <div className="font-semibold text-emerald-700">
                      {selectedPacket.headers.checksum}
                    </div>
                  </div>
                  <div className="bg-white border border-slate-200/80 rounded-lg p-2">
                    <div className="text-[10px] text-slate-400">
                      ORDEN LLEGADA
                    </div>
                    <div className="font-semibold text-[#0B213F]">
                      {selectedPacket.arrivalRank
                        ? `${selectedPacket.arrivalRank}º en llegar`
                        : 'En camino'}
                    </div>
                  </div>
                </div>
              </div>

              {/* Assigned Route & Payload */}
              <div className="pt-2 border-t border-slate-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
                <div className="font-mono text-slate-600">
                  <span className="font-semibold text-[#0B213F]">Ruta IP: </span>
                  {selectedPacket.route
                    .map((nId, idx) => {
                      const label = nodeLabelMap[nId] || nId;
                      const isCurrent = idx === selectedPacket.currentHopIndex;
                      return isCurrent ? `[${label}]` : label;
                    })
                    .join(' → ')}
                </div>
                <div className="font-mono text-[#0B213F] bg-orange-100/70 px-2.5 py-1 rounded text-xs truncate max-w-xs">
                  Datos: “{selectedPacket.payloadText}”
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Right 5 Columns: Live Network Activity & Routing Log */}
        <div className="lg:col-span-5 flex flex-col">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Activity className="w-4 h-4 text-[#F97316]" />
              <h4 className="text-sm font-bold text-[#0B213F]">
                Bitácora de Eventos TCP/IP en Vivo
              </h4>
            </div>
            <span className="text-xs font-mono tabular-nums text-slate-500">
              {logs.length} eventos
            </span>
          </div>

          <div className="bg-[#F8FAFC] border border-slate-200 rounded-xl p-3.5 flex-1 max-h-[235px] overflow-y-auto space-y-2">
            {logs.length === 0 ? (
              <div className="text-xs text-slate-500 py-8 text-center">
                Inicia la simulación o haz clic en un nodo de la malla para
                registrar el comportamiento de los protocolos TCP e IP.
              </div>
            ) : (
              logs.map((entry) => (
                <div
                  key={entry.id}
                  className="bg-white border border-slate-200/80 rounded-lg p-2.5 text-xs"
                >
                  <div className="flex items-center justify-between text-[11px] text-slate-500 mb-0.5">
                    <span className="font-mono font-semibold text-[#0B213F]">
                      {entry.layer}
                    </span>
                    <span className="font-mono tabular-nums">
                      {entry.timestamp}
                    </span>
                  </div>
                  <div
                    className={`font-semibold ${
                      entry.type === 'warning'
                        ? 'text-amber-700'
                        : entry.type === 'success'
                        ? 'text-emerald-700'
                        : 'text-[#0B213F]'
                    }`}
                  >
                    {entry.title}
                  </div>
                  <p className="text-slate-600 text-[11px] mt-0.5 leading-snug">
                    {entry.detail}
                  </p>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </section>
  );
};
