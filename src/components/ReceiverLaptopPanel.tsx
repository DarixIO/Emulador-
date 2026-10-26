import React from 'react';
import { CheckCircle2, Clock, ArrowDownUp, ShieldCheck } from 'lucide-react';
import { ContentMode, DataPacket, SimulationStage } from '../types/network';

interface ReceiverLaptopPanelProps {
  packets: DataPacket[];
  contentMode: ContentMode;
  originalMessage: string;
  selectedPacketId: number | null;
  onSelectPacket: (id: number) => void;
  stage: SimulationStage;
}

export const ReceiverLaptopPanel: React.FC<ReceiverLaptopPanelProps> = ({
  packets,
  contentMode,
  originalMessage,
  selectedPacketId,
  onSelectPacket,
  stage,
}) => {
  // Packets sorted by physical arrival order
  const arrivedPacketsByRank = [...packets]
    .filter((p) => p.arrivalRank !== null)
    .sort((a, b) => (a.arrivalRank || 99) - (b.arrivalRank || 99));

  // Detect if physical arrival order differs from sequence 1..N
  const isOutOfOrderDetected = arrivedPacketsByRank.some(
    (pkt, idx) => pkt.id !== idx + 1
  );

  const allReassembled =
    packets.length > 0 && packets.every((p) => p.status === 'reassembled');

  return (
    <div className="bg-white border border-slate-200 rounded-xl p-5 flex flex-col justify-between h-full">
      <div>
        {/* Stage Header */}
        <div className="flex items-center justify-between gap-2 pb-3 mb-4 border-b border-slate-100">
          <div>
            <div className="text-xs font-medium text-slate-500">
              03. Estación Receptora · IP 203.0.113.50
            </div>
            <h2 className="text-lg font-bold text-[#0B213F] mt-0.5">
              Reensamblado automático
            </h2>
          </div>

          <span
            className={`font-mono text-xs tabular-nums font-semibold ${
              allReassembled ? 'text-emerald-700' : 'text-slate-500'
            }`}
          >
            {allReassembled
              ? '● COMPLETADO'
              : `${arrivedPacketsByRank.length}/${packets.length} recibidos`}
          </span>
        </div>

        {/* Receiver Laptop + Puzzle Document Illustration (Matching Bottom-Right Infographic) */}
        <div className="bg-[#F8FAFC] border border-slate-200 rounded-lg p-3.5 mb-4">
          <svg
            viewBox="0 0 270 120"
            className="w-full h-auto select-none"
            role="img"
            aria-label="Laptop receptora uniendo los paquetes como piezas de rompecabezas"
          >
            {/* Arriving Packet Boxes on the Left [1], [2], [3] */}
            <g onClick={() => onSelectPacket(1)} className="cursor-pointer">
              <rect
                x="12"
                y="8"
                width="26"
                height="24"
                rx="4"
                fill={
                  packets[0]?.status === 'arrived_waiting' ||
                  packets[0]?.status === 'reassembled'
                    ? '#FFEDD5'
                    : '#F1F5F9'
                }
                stroke={
                  packets[0]?.status === 'arrived_waiting' ||
                  packets[0]?.status === 'reassembled'
                    ? '#F97316'
                    : '#94A3B8'
                }
                strokeWidth="2.2"
              />
              <circle cx="25" cy="20" r="7.5" fill="#0B213F" />
              <text
                x="25"
                y="23.5"
                textAnchor="middle"
                className="font-mono text-[10px] font-bold fill-white"
              >
                1
              </text>
            </g>

            <g onClick={() => onSelectPacket(2)} className="cursor-pointer">
              <rect
                x="6"
                y="37"
                width="26"
                height="24"
                rx="4"
                fill={
                  packets[1]?.status === 'arrived_waiting' ||
                  packets[1]?.status === 'reassembled'
                    ? '#FFFFFF'
                    : '#F1F5F9'
                }
                stroke={
                  packets[1]?.status === 'arrived_waiting' ||
                  packets[1]?.status === 'reassembled'
                    ? '#0B213F'
                    : '#94A3B8'
                }
                strokeWidth="2.2"
              />
              <circle cx="19" cy="49" r="7.5" fill="#0B213F" />
              <text
                x="19"
                y="52.5"
                textAnchor="middle"
                className="font-mono text-[10px] font-bold fill-white"
              >
                2
              </text>
            </g>

            <g onClick={() => onSelectPacket(3)} className="cursor-pointer">
              <rect
                x="12"
                y="66"
                width="26"
                height="24"
                rx="4"
                fill={
                  packets[2]?.status === 'arrived_waiting' ||
                  packets[2]?.status === 'reassembled'
                    ? '#FFEDD5'
                    : '#F1F5F9'
                }
                stroke={
                  packets[2]?.status === 'arrived_waiting' ||
                  packets[2]?.status === 'reassembled'
                    ? '#F97316'
                    : '#94A3B8'
                }
                strokeWidth="2.2"
                strokeDasharray="3 2"
              />
              <circle cx="25" cy="78" r="7.5" fill="#0B213F" />
              <text
                x="25"
                y="81.5"
                textAnchor="middle"
                className="font-mono text-[10px] font-bold fill-white"
              >
                3
              </text>
            </g>

            {/* Arrows Converging into the Puzzle Document */}
            <path
              d="M 44 20 L 76 32"
              stroke="#0B213F"
              strokeWidth="2"
              strokeLinecap="round"
            />
            <path
              d="M 38 49 L 76 49"
              stroke="#0B213F"
              strokeWidth="2"
              strokeLinecap="round"
            />
            <path
              d="M 44 78 L 76 66"
              stroke="#0B213F"
              strokeWidth="2"
              strokeLinecap="round"
            />

            {/* Receiver Laptop Screen Frame */}
            <rect
              x="146"
              y="16"
              width="105"
              height="70"
              rx="5"
              fill="#0B213F"
              stroke="#0B213F"
              strokeWidth="2"
            />
            <rect x="151" y="21" width="95" height="60" rx="2" fill="#1E3A8A" />

            {/* Receiver Laptop Base */}
            <polygon
              points="138,86 259,86 266,98 128,98"
              fill="#CBD5E1"
              stroke="#0B213F"
              strokeWidth="2"
              strokeLinejoin="round"
            />
            <rect x="184" y="90" width="28" height="4" rx="1" fill="#64748B" />

            {/* Jigsaw Puzzle Document Reassembling on Screen (Identical to Infographic) */}
            <g>
              {/* Top-left Orange Tint Puzzle Piece (Packet 1) */}
              <rect
                x="88"
                y="10"
                width="36"
                height="36"
                rx="3"
                fill={
                  packets[0]?.status === 'arrived_waiting' ||
                  packets[0]?.status === 'reassembled'
                    ? '#FDBA74'
                    : '#E2E8F0'
                }
                stroke="#0B213F"
                strokeWidth="2"
              />
              {/* Bottom-left Vibrant Orange Puzzle Piece (Packet 3) */}
              <rect
                x="88"
                y="46"
                width="36"
                height="36"
                rx="3"
                fill={
                  packets[2]?.status === 'arrived_waiting' ||
                  packets[2]?.status === 'reassembled'
                    ? '#F97316'
                    : '#E2E8F0'
                }
                stroke="#0B213F"
                strokeWidth="2"
              />
              {/* Right Side Blue/White Document Piece (Packet 2) */}
              <rect
                x="124"
                y="10"
                width="38"
                height="72"
                rx="3"
                fill={
                  packets[1]?.status === 'arrived_waiting' ||
                  packets[1]?.status === 'reassembled'
                    ? '#DBEAFE'
                    : '#F1F5F9'
                }
                stroke="#0B213F"
                strokeWidth="2"
              />
              {/* Jigsaw interlocking tabs */}
              <circle
                cx="124"
                cy="28"
                r="5"
                fill={
                  packets[0]?.status === 'arrived_waiting' ||
                  packets[0]?.status === 'reassembled'
                    ? '#FDBA74'
                    : '#E2E8F0'
                }
                stroke="#0B213F"
                strokeWidth="1.8"
              />
              <circle
                cx="106"
                cy="46"
                r="5"
                fill={
                  packets[2]?.status === 'arrived_waiting' ||
                  packets[2]?.status === 'reassembled'
                    ? '#F97316'
                    : '#E2E8F0'
                }
                stroke="#0B213F"
                strokeWidth="1.8"
              />
              {/* Document lines on right side */}
              <line x1="133" y1="24" x2="154" y2="24" stroke="#0B213F" strokeWidth="2" strokeLinecap="round" />
              <line x1="133" y1="34" x2="154" y2="34" stroke="#0B213F" strokeWidth="2" strokeLinecap="round" />
              <line x1="133" y1="44" x2="150" y2="44" stroke="#0B213F" strokeWidth="2" strokeLinecap="round" />
              <line x1="133" y1="54" x2="154" y2="54" stroke="#0B213F" strokeWidth="2" strokeLinecap="round" />
              <line x1="133" y1="64" x2="148" y2="64" stroke="#0B213F" strokeWidth="2" strokeLinecap="round" />
            </g>
          </svg>
        </div>

        {/* Physical Arrival Order vs Logical Sequence Order */}
        <div className="mb-3 p-2.5 bg-slate-50 border border-slate-200/80 rounded-lg">
          <div className="flex items-center justify-between text-xs mb-1.5">
            <span className="font-semibold text-[#0B213F] flex items-center gap-1.5">
              <ArrowDownUp className="w-3.5 h-3.5 text-orange-600" />
              Orden de Llegada a la Tarjeta de Red:
            </span>
            {isOutOfOrderDetected && (
              <span className="font-mono text-[11px] font-semibold text-amber-700">
                ▲ Desorden Detectado
              </span>
            )}
          </div>

          {arrivedPacketsByRank.length === 0 ? (
            <div className="text-xs text-slate-500 py-1">
              Esperando llegada de los primeros paquetes desde la malla IP...
            </div>
          ) : (
            <div className="flex flex-wrap items-center gap-1.5">
              {arrivedPacketsByRank.map((pkt, idx) => (
                <React.Fragment key={pkt.id}>
                  <button
                    type="button"
                    onClick={() => onSelectPacket(pkt.id)}
                    className="inline-flex items-center gap-1 px-2 py-0.5 bg-white border border-slate-200 rounded text-xs font-mono font-semibold text-[#0B213F] hover:border-orange-400 cursor-pointer"
                  >
                    <span className="text-slate-400">{idx + 1}º:</span>
                    <span className="text-orange-600">Paq [{pkt.id}]</span>
                  </button>
                  {idx < arrivedPacketsByRank.length - 1 && (
                    <span className="text-slate-400 text-xs">→</span>
                  )}
                </React.Fragment>
              ))}
            </div>
          )}
        </div>

        {/* TCP Sequence Reordering Buffer Slots */}
        <div className="mb-3">
          <div className="flex items-center justify-between text-xs text-slate-600 mb-1.5">
            <span className="font-medium">
              Buffer de Reordenamiento TCP (Orden por SEQ):
            </span>
            <span className="font-mono text-[11px] text-slate-500">
              Secuencia 1 → {packets.length}
            </span>
          </div>

          <div className="grid grid-cols-3 gap-1.5">
            {packets.map((pkt) => {
              const hasArrived =
                pkt.status === 'arrived_waiting' || pkt.status === 'reassembled';
              const isSelected = selectedPacketId === pkt.id;

              return (
                <button
                  key={pkt.id}
                  type="button"
                  onClick={() => onSelectPacket(pkt.id)}
                  className={`p-2 rounded-lg border text-left transition-all cursor-pointer ${
                    hasArrived
                      ? pkt.status === 'reassembled'
                        ? 'bg-emerald-50/70 border-emerald-400'
                        : 'bg-orange-50/80 border-orange-400'
                      : 'bg-slate-50 border-slate-200 border-dashed opacity-75'
                  } ${isSelected ? 'ring-2 ring-orange-500' : ''}`}
                >
                  <div className="flex items-center justify-between text-[11px] font-mono font-bold mb-0.5">
                    <span className="text-[#0B213F]">Ranura #{pkt.id}</span>
                    {hasArrived ? (
                      <span className="text-emerald-700">ACK ✓</span>
                    ) : (
                      <Clock className="w-3 h-3 text-slate-400" />
                    )}
                  </div>
                  <div className="text-[11px] text-slate-700 truncate font-medium">
                    {hasArrived ? pkt.payloadText : 'Esperando...'}
                  </div>
                  <div className="text-[10px] font-mono text-slate-400 mt-0.5">
                    SEQ {pkt.headers.seqNumber}
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Final Reassembled Output Box */}
      <div
        className={`p-3.5 rounded-xl border transition-colors ${
          allReassembled
            ? 'bg-emerald-50/50 border-emerald-300'
            : 'bg-[#F8FAFC] border-slate-200'
        }`}
      >
        <div className="flex items-center justify-between text-xs mb-1.5">
          <span className="font-bold text-[#0B213F] flex items-center gap-1.5">
            {allReassembled ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            ) : (
              <ShieldCheck className="w-4 h-4 text-slate-400" />
            )}
            Resultado en Aplicación Destino:
          </span>
          <span className="font-mono text-[11px] text-slate-500">
            {allReassembled ? 'Integridad CRC Verificada' : 'Ensamblando piezas...'}
          </span>
        </div>

        {allReassembled ? (
          <div className="p-2.5 bg-white border border-emerald-200 rounded-lg text-xs text-[#0B213F] font-medium leading-relaxed">
            {contentMode === 'text' ? (
              <span>“{originalMessage}”</span>
            ) : contentMode === 'image_puzzle' ? (
              <div className="flex items-center justify-between">
                <span>
                  🖼️ Postal Vectorial reconstruida sin pérdida ({packets.length}/
                  {packets.length} bloques unidos en orden).
                </span>
                <span className="font-mono text-[11px] text-emerald-700 font-bold">
                  100% OK
                </span>
              </div>
            ) : (
              <div className="flex items-center justify-between">
                <span>
                  📄 Informe_Arquitectura_TCPIP.pdf reensamblado y validado con
                  Checksum.
                </span>
                <span className="font-mono text-[11px] text-emerald-700 font-bold">
                  SHA-256 OK
                </span>
              </div>
            )}
          </div>
        ) : (
          <div className="p-2.5 bg-white/80 border border-slate-200/80 rounded-lg text-xs text-slate-500">
            {stage === 'idle'
              ? 'Presiona "Enviar y Fragmentar Mensaje" para iniciar el viaje de los paquetes.'
              : isOutOfOrderDetected
              ? 'TCP retiene los paquetes adelantados en el buffer esperando a que lleguen las piezas faltantes para unirlos en el orden correcto (1 → 2 → 3)...'
              : 'Recibiendo fragmentos por la red y verificando números de secuencia TCP...'}
          </div>
        )}
      </div>
    </div>
  );
};
