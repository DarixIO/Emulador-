import React from 'react';
import { FileText, Image as ImageIcon, MessageSquare, Send, Layers } from 'lucide-react';
import { ContentMode, DataPacket, SimulationStage } from '../types/network';

interface SenderLaptopPanelProps {
  message: string;
  onChangeMessage: (val: string) => void;
  contentMode: ContentMode;
  onChangeContentMode: (mode: ContentMode) => void;
  packetCount: number;
  onChangePacketCount: (count: number) => void;
  packets: DataPacket[];
  selectedPacketId: number | null;
  onSelectPacket: (id: number) => void;
  stage: SimulationStage;
  onStartSimulation: () => void;
}

export const SenderLaptopPanel: React.FC<SenderLaptopPanelProps> = ({
  message,
  onChangeMessage,
  contentMode,
  onChangeContentMode,
  packetCount,
  onChangePacketCount,
  packets,
  selectedPacketId,
  onSelectPacket,
  stage,
  onStartSimulation,
}) => {
  const isFragmented = stage !== 'idle';

  return (
    <div className="bg-white border border-slate-200 rounded-xl p-5 flex flex-col justify-between h-full">
      <div>
        {/* Stage Header */}
        <div className="flex items-center justify-between gap-2 pb-3 mb-4 border-b border-slate-100">
          <div>
            <div className="text-xs font-medium text-slate-500">
              01. Estación Emisora · IP 192.168.1.10
            </div>
            <h2 className="text-lg font-bold text-[#0B213F] mt-0.5">
              Mensaje dividido
            </h2>
          </div>
          <span className="font-mono text-xs tabular-nums text-slate-500">
            MTU: {packetCount} seg.
          </span>
        </div>

        {/* Content Type Selector (Interactive Filter Tabs) */}
        <div className="mb-3">
          <label className="block text-xs font-medium text-slate-600 mb-1.5">
            Tipo de contenido a transmitir:
          </label>
          <div className="grid grid-cols-3 gap-1 p-1 bg-slate-100 rounded-lg">
            <button
              type="button"
              onClick={() => onChangeContentMode('text')}
              className={`flex items-center justify-center gap-1.5 px-2.5 py-1.5 text-xs font-semibold rounded-md transition-colors cursor-pointer whitespace-nowrap shrink-0 ${
                contentMode === 'text'
                  ? 'bg-white text-[#0B213F] shadow-xs'
                  : 'text-slate-600 hover:text-[#0B213F]'
              }`}
            >
              <MessageSquare className="w-3.5 h-3.5" />
              Texto
            </button>
            <button
              type="button"
              onClick={() => onChangeContentMode('image_puzzle')}
              className={`flex items-center justify-center gap-1.5 px-2.5 py-1.5 text-xs font-semibold rounded-md transition-colors cursor-pointer whitespace-nowrap shrink-0 ${
                contentMode === 'image_puzzle'
                  ? 'bg-white text-[#0B213F] shadow-xs'
                  : 'text-slate-600 hover:text-[#0B213F]'
              }`}
            >
              <ImageIcon className="w-3.5 h-3.5" />
              Imagen
            </button>
            <button
              type="button"
              onClick={() => onChangeContentMode('document')}
              className={`flex items-center justify-center gap-1.5 px-2.5 py-1.5 text-xs font-semibold rounded-md transition-colors cursor-pointer whitespace-nowrap shrink-0 ${
                contentMode === 'document'
                  ? 'bg-white text-[#0B213F] shadow-xs'
                  : 'text-slate-600 hover:text-[#0B213F]'
              }`}
            >
              <FileText className="w-3.5 h-3.5" />
              Archivo
            </button>
          </div>
        </div>

        {/* Input / Visual Laptop Illustration */}
        <div className="bg-[#F8FAFC] border border-slate-200 rounded-lg p-3.5 mb-4">
          {contentMode === 'text' ? (
            <div>
              <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
                <span>Escribe tu mensaje personalizado:</span>
                <span className="font-mono tabular-nums">{message.length} caracteres</span>
              </div>
              <textarea
                value={message}
                onChange={(e) => onChangeMessage(e.target.value)}
                rows={2}
                placeholder="Escribe cualquier mensaje para dividirlo en paquetes TCP/IP..."
                className="w-full text-xs text-[#0B213F] bg-white border border-slate-200 rounded-md p-2 focus:outline-none focus:border-orange-500 transition-colors resize-none font-medium"
              />
            </div>
          ) : contentMode === 'image_puzzle' ? (
            <div className="text-xs text-slate-600 space-y-1">
              <div className="font-semibold text-[#0B213F]">
                Postal Vectorial: Red Global de Telecomunicaciones (SVG)
              </div>
              <p className="text-[11px] text-slate-500">
                La imagen se divide en {packetCount} cuadrantes gráficos numerados para viajar
                por separado y reconstruirse en el monitor destino.
              </p>
            </div>
          ) : (
            <div className="text-xs text-slate-600 space-y-1">
              <div className="font-semibold text-[#0B213F]">
                Informe_Arquitectura_TCPIP.pdf (24 KB)
              </div>
              <p className="text-[11px] text-slate-500">
                El documento estructurado se segmenta en cabecera, cuerpo y firma de
                verificación CRC.
              </p>
            </div>
          )}

          {/* Visual Laptop + Splitting Document SVG (Matching Bottom-Left Infographic) */}
          <div className="mt-3 pt-2 border-t border-slate-200/70">
            <svg
              viewBox="0 0 270 120"
              className="w-full h-auto select-none"
              role="img"
              aria-label="Laptop emisora dividiendo el documento en paquetes numerados"
            >
              {/* Laptop Screen Frame */}
              <rect
                x="14"
                y="16"
                width="105"
                height="70"
                rx="5"
                fill="#0B213F"
                stroke="#0B213F"
                strokeWidth="2"
              />
              <rect x="19" y="21" width="95" height="60" rx="2" fill="#1E3A8A" />

              {/* Laptop Base */}
              <polygon
                points="6,86 127,86 138,98 2,98"
                fill="#CBD5E1"
                stroke="#0B213F"
                strokeWidth="2"
                strokeLinejoin="round"
              />
              <rect x="52" y="90" width="28" height="4" rx="1" fill="#64748B" />

              {/* Document Floating Out & Splitting */}
              <g
                className="transition-transform duration-300"
                style={{
                  transform: isFragmented ? 'translateX(3px)' : 'translateX(0px)',
                }}
              >
                {/* Left intact half of document */}
                <path
                  d="M 52 10 H 92 L 85 30 L 96 48 L 83 68 L 93 82 H 52 A 4 4 0 0 1 48 78 V 14 A 4 4 0 0 1 52 10 Z"
                  fill="#FFFFFF"
                  stroke="#0B213F"
                  strokeWidth="2.2"
                />
                {/* Lines inside document */}
                <line x1="56" y1="22" x2="80" y2="22" stroke="#0B213F" strokeWidth="2" strokeLinecap="round" />
                <line x1="56" y1="31" x2="77" y2="31" stroke="#64748B" strokeWidth="1.8" strokeLinecap="round" />
                <line x1="56" y1="40" x2="82" y2="40" stroke="#64748B" strokeWidth="1.8" strokeLinecap="round" />
                <line x1="56" y1="49" x2="75" y2="49" stroke="#F97316" strokeWidth="2" strokeLinecap="round" />
                <line x1="56" y1="58" x2="78" y2="58" stroke="#64748B" strokeWidth="1.8" strokeLinecap="round" />

                {/* Right fractured half of document */}
                <path
                  d="M 98 10 H 122 A 4 4 0 0 1 126 14 V 78 A 4 4 0 0 1 122 82 H 99 L 90 68 L 102 48 L 91 30 Z"
                  fill="#EFF6FF"
                  stroke="#0B213F"
                  strokeWidth="2"
                />
              </g>

              {/* Arrows pointing to Packets 1, 2, 3 */}
              <path d="M 132 32 L 164 20" stroke="#0B213F" strokeWidth="2" strokeLinecap="round" />
              <path d="M 134 47 L 164 47" stroke="#0B213F" strokeWidth="2" strokeLinecap="round" />
              <path d="M 132 62 L 164 74" stroke="#0B213F" strokeWidth="2" strokeLinecap="round" />

              {/* Packet [1] Box */}
              <g onClick={() => onSelectPacket(1)} className="cursor-pointer">
                <rect
                  x="170"
                  y="7"
                  width="26"
                  height="24"
                  rx="4"
                  fill="#FFEDD5"
                  stroke="#F97316"
                  strokeWidth="2.2"
                />
                <circle cx="183" cy="19" r="7.5" fill="#0B213F" />
                <text x="183" y="22.5" textAnchor="middle" className="font-mono text-[10px] font-bold fill-white">
                  1
                </text>
              </g>

              {/* Packet [2] Box */}
              <g onClick={() => onSelectPacket(2)} className="cursor-pointer">
                <rect
                  x="170"
                  y="35"
                  width="26"
                  height="24"
                  rx="4"
                  fill="#FFFFFF"
                  stroke="#0B213F"
                  strokeWidth="2.2"
                />
                <circle cx="183" cy="47" r="7.5" fill="#0B213F" />
                <text x="183" y="50.5" textAnchor="middle" className="font-mono text-[10px] font-bold fill-white">
                  2
                </text>
              </g>

              {/* Packet [3] Box */}
              <g onClick={() => onSelectPacket(3)} className="cursor-pointer">
                <rect
                  x="170"
                  y="63"
                  width="26"
                  height="24"
                  rx="4"
                  fill="#FFEDD5"
                  stroke="#F97316"
                  strokeWidth="2.2"
                  strokeDasharray="3 2"
                />
                <circle cx="183" cy="75" r="7.5" fill="#0B213F" />
                <text x="183" y="78.5" textAnchor="middle" className="font-mono text-[10px] font-bold fill-white">
                  3
                </text>
              </g>

              {/* Output Gateway Arrow */}
              <path d="M 206 47 H 254" stroke="#0B213F" strokeWidth="2.5" strokeLinecap="round" />
              <polygon points="254,42 264,47 254,52" fill="#0B213F" />
            </svg>
          </div>
        </div>

        {/* Packet Fragmentation Count Control */}
        <div className="flex items-center justify-between gap-2 mb-3">
          <span className="text-xs font-medium text-slate-600 flex items-center gap-1.5">
            <Layers className="w-3.5 h-3.5 text-slate-500" />
            Fragmentos TCP:
          </span>
          <div className="flex items-center gap-1 p-0.5 bg-slate-100 rounded-lg">
            {[3, 4, 6].map((cnt) => (
              <button
                key={cnt}
                type="button"
                onClick={() => onChangePacketCount(cnt)}
                className={`px-2.5 py-1 text-xs font-mono font-semibold rounded-md transition-colors cursor-pointer whitespace-nowrap shrink-0 ${
                  packetCount === cnt
                    ? 'bg-[#0B213F] text-white'
                    : 'text-slate-600 hover:text-[#0B213F]'
                }`}
              >
                {cnt} paq.
              </button>
            ))}
          </div>
        </div>

        {/* Fragmented Packets Queue List */}
        <div className="space-y-1.5 max-h-[210px] overflow-y-auto pr-0.5">
          {packets.map((pkt) => {
            const isSelected = selectedPacketId === pkt.id;
            const badgeStyle =
              pkt.style === 'orange-solid'
                ? 'bg-orange-500 text-white'
                : pkt.style === 'navy-solid'
                ? 'bg-[#0B213F] text-white'
                : 'bg-orange-100 text-orange-800 border border-orange-400 border-dashed';

            return (
              <button
                key={pkt.id}
                type="button"
                onClick={() => onSelectPacket(pkt.id)}
                className={`w-full text-left p-2.5 rounded-lg border transition-colors cursor-pointer flex items-center justify-between gap-2 ${
                  isSelected
                    ? 'bg-orange-50/70 border-orange-400'
                    : 'bg-slate-50/70 border-slate-200/80 hover:border-slate-300'
                }`}
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <span
                    className={`w-6 h-6 rounded-md font-mono text-xs font-bold flex items-center justify-center shrink-0 ${badgeStyle}`}
                  >
                    {pkt.id}
                  </span>
                  <div className="min-w-0">
                    <div className="text-xs font-semibold text-[#0B213F] truncate">
                      “{pkt.payloadText}”
                    </div>
                    <div className="text-[11px] font-mono tabular-nums text-slate-500">
                      SEQ {pkt.headers.seqNumber} · {pkt.headers.byteLength}B · Ruta:{' '}
                      {pkt.route.length - 1} saltos
                    </div>
                  </div>
                </div>

                <span className="text-[11px] font-mono tabular-nums font-medium shrink-0 text-slate-600">
                  {pkt.status === 'queued'
                    ? 'Listo'
                    : pkt.status === 'in_transit'
                    ? 'Viajando'
                    : pkt.status === 'arrived_waiting'
                    ? 'En Buffer'
                    : pkt.status === 'reassembled'
                    ? '✓ Unido'
                    : 'Sin ruta'}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Bottom Action Button */}
      <div className="pt-4 mt-4 border-t border-slate-100">
        <button
          type="button"
          onClick={onStartSimulation}
          className="w-full py-2.5 px-4 bg-[#0B213F] hover:bg-slate-800 text-white text-xs font-semibold rounded-lg flex items-center justify-center gap-2 transition-colors cursor-pointer whitespace-nowrap shrink-0"
        >
          <Send className="w-3.5 h-3.5" />
          Fragmentar y Lanzar Paquetes ({packetCount})
        </button>
      </div>
    </div>
  );
};
