import React from 'react';
import { Play, RotateCcw, Eye, Sparkles } from 'lucide-react';
import { SimulationStage } from '../types/network';

interface EnvelopeHeroBannerProps {
  stage: SimulationStage;
  packetCount: number;
  activePacketsCount: number;
  arrivedCount: number;
  rerouteEventsCount: number;
  onStartSimulation: () => void;
  onResetSimulation: () => void;
  onOpenInfographicModal: () => void;
}

export const EnvelopeHeroBanner: React.FC<EnvelopeHeroBannerProps> = ({
  stage,
  packetCount,
  activePacketsCount,
  arrivedCount,
  rerouteEventsCount,
  onStartSimulation,
  onResetSimulation,
  onOpenInfographicModal,
}) => {
  const isFragmented = stage !== 'idle';

  return (
    <section className="bg-white border-b border-slate-200">
      <div className="max-w-[1440px] mx-auto px-6 py-8 lg:py-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Left Column: Question Headline & Explanation */}
          <div className="lg:col-span-7 space-y-4">
            <div className="flex flex-wrap items-center gap-2 text-xs font-medium text-slate-500">
              <span>Arquitectura de Internet</span>
              <span aria-hidden="true">·</span>
              <span>Modelo TCP/IP en Tiempo Real</span>
              <span aria-hidden="true">·</span>
              <span>Conmutación de Paquetes</span>
            </div>

            <h1
              className="text-3xl sm:text-4xl lg:text-[42px] font-extrabold tracking-tight text-[#0B213F] leading-[1.12]"
              style={{ textWrap: 'balance' }}
            >
              ¿Qué pasa realmente cuando envías un mensaje?
            </h1>

            <p className="text-base text-slate-600 max-w-2xl leading-relaxed">
              Tu mensaje no viaja como una sola pieza por un cable directo. El protocolo{' '}
              <strong className="font-semibold text-[#0B213F]">TCP</strong> lo fragmenta en
              pequeños bloques numerados llamados paquetes, el protocolo{' '}
              <strong className="font-semibold text-[#0B213F]">IP</strong> guía cada paquete
              por rutas independientes a través de múltiples routers, y al llegar al destino se
              reensamblan automáticamente en su orden original.
            </p>

            <div className="pt-2 flex flex-wrap items-center gap-3">
              <button
                onClick={onStartSimulation}
                className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-white bg-[#F97316] hover:bg-[#EA580C] rounded-lg shadow-xs transition-colors cursor-pointer whitespace-nowrap shrink-0"
              >
                <Play className="w-4 h-4 fill-current" />
                {stage === 'idle' || stage === 'completed'
                  ? 'Enviar y Fragmentar Mensaje'
                  : 'Reiniciar Envío Ahora'}
              </button>

              <button
                onClick={onOpenInfographicModal}
                className="inline-flex items-center gap-2 px-4 py-2.5 text-sm font-semibold text-[#0B213F] bg-slate-100 hover:bg-slate-200/80 rounded-lg transition-colors cursor-pointer whitespace-nowrap shrink-0"
              >
                <Eye className="w-4 h-4" />
                Ver Infografía de Referencia
              </button>

              {stage !== 'idle' && (
                <button
                  onClick={onResetSimulation}
                  className="inline-flex items-center gap-1.5 px-3.5 py-2.5 text-sm font-medium text-slate-600 hover:text-[#0B213F] transition-colors cursor-pointer whitespace-nowrap shrink-0"
                >
                  <RotateCcw className="w-4 h-4" />
                  Restaurar Red
                </button>
              )}
            </div>
          </div>

          {/* Right Column: Interactive Disintegrating Envelope SVG (Directly inspired by Top Half of Infographic) */}
          <div className="lg:col-span-5">
            <div
              onClick={onStartSimulation}
              title="Haz clic para fragmentar y enviar el sobre digital"
              className="group relative bg-[#F8FAFC] border border-slate-200/90 rounded-xl p-5 cursor-pointer hover:border-orange-300 transition-colors overflow-hidden"
            >
              <div className="flex items-center justify-between text-xs text-slate-500 mb-2">
                <span className="font-medium text-[#0B213F]">
                  Visualización de Fragmentación de Datos
                </span>
                <span className="font-mono tabular-nums text-orange-600 font-semibold">
                  {stage === 'idle'
                    ? `Listo · ${packetCount} paquetes`
                    : stage === 'completed'
                    ? `Entregado · ${arrivedCount}/${packetCount} paquetes`
                    : `En tránsito · ${activePacketsCount} activos`}
                </span>
              </div>

              <svg
                viewBox="0 0 460 165"
                className="w-full h-auto select-none"
                role="img"
                aria-label="Ilustración de un sobre de mensaje dividiéndose en paquetes de datos naranjas"
              >
                <defs>
                  <filter id="orangeGlow" x="-20%" y="-20%" width="140%" height="140%">
                    <feDropShadow dx="0" dy="2" stdDeviation="3" floodColor="#F97316" floodOpacity="0.28" />
                  </filter>
                </defs>

                {/* Left intact half of the envelope */}
                <g
                  className="transition-transform duration-300"
                  style={{
                    transform: isFragmented ? 'translateX(-6px)' : 'translateX(0px)',
                  }}
                >
                  {/* Envelope main body */}
                  <path
                    d="M 28 32 H 195 L 182 58 L 198 84 L 178 112 L 194 140 H 28 A 8 8 0 0 1 20 132 V 40 A 8 8 0 0 1 28 32 Z"
                    fill="#FFFFFF"
                    stroke="#0B213F"
                    strokeWidth="3.2"
                    strokeLinejoin="round"
                  />
                  {/* Envelope flap lines */}
                  <path
                    d="M 22 35 L 116 98 L 184 54"
                    fill="none"
                    stroke="#0B213F"
                    strokeWidth="3.2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  {/* Bottom fold accent line */}
                  <path
                    d="M 24 136 L 86 84"
                    fill="none"
                    stroke="#0B213F"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                  />
                  <line
                    x1="45"
                    y1="132"
                    x2="92"
                    y2="132"
                    stroke="#0B213F"
                    strokeWidth="2.2"
                    strokeLinecap="round"
                  />

                  {/* Fracture zig-zag orange line */}
                  <path
                    d="M 195 32 L 182 58 L 198 84 L 178 112 L 194 140"
                    fill="none"
                    stroke="#F97316"
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </g>

                {/* Breaking Navy Shards near fracture */}
                <g
                  className="transition-transform duration-300"
                  style={{
                    transform: isFragmented ? 'translate(10px, -4px)' : 'translate(0px, 0px)',
                  }}
                >
                  <polygon
                    points="204,33 232,33 222,49 200,45"
                    fill="#FFFFFF"
                    stroke="#0B213F"
                    strokeWidth="2.6"
                    strokeLinejoin="round"
                  />
                  <polygon
                    points="238,44 254,36 262,53 244,58"
                    fill="#FFFFFF"
                    stroke="#0B213F"
                    strokeWidth="2.5"
                    strokeLinejoin="round"
                  />
                  <polygon
                    points="196,126 226,122 235,138 198,140"
                    fill="#FFFFFF"
                    stroke="#0B213F"
                    strokeWidth="2.6"
                    strokeLinejoin="round"
                  />
                </g>

                {/* Stream of Orange Data Packets dispersing to the right */}
                <g
                  filter="url(#orangeGlow)"
                  className="transition-transform duration-300 group-hover:translate-x-1.5"
                  style={{
                    transform: isFragmented ? 'translateX(14px)' : 'translateX(0px)',
                  }}
                >
                  {/* Large inner packets with numbers */}
                  <rect
                    x="198"
                    y="55"
                    width="24"
                    height="24"
                    rx="3"
                    fill="#FFEDD5"
                    stroke="#F97316"
                    strokeWidth="2.6"
                  />
                  <text
                    x="210"
                    y="71"
                    textAnchor="middle"
                    className="font-mono text-[11px] font-bold fill-[#0B213F]"
                  >
                    1
                  </text>

                  <rect
                    x="228"
                    y="78"
                    width="24"
                    height="24"
                    rx="3"
                    fill="#FFEDD5"
                    stroke="#F97316"
                    strokeWidth="2.6"
                  />
                  <text
                    x="240"
                    y="94"
                    textAnchor="middle"
                    className="font-mono text-[11px] font-bold fill-[#0B213F]"
                  >
                    2
                  </text>

                  <rect
                    x="205"
                    y="94"
                    width="20"
                    height="20"
                    rx="3"
                    fill="#FFEDD5"
                    stroke="#F97316"
                    strokeWidth="2.4"
                  />
                  <text
                    x="215"
                    y="108"
                    textAnchor="middle"
                    className="font-mono text-[10px] font-bold fill-[#0B213F]"
                  >
                    3
                  </text>

                  {/* Dispersing medium & small orange squares */}
                  <rect x="242" y="22" width="14" height="14" rx="2" fill="#FED7AA" stroke="#F97316" strokeWidth="2.2" />
                  <rect x="268" y="38" width="18" height="18" rx="2" fill="#FFEDD5" stroke="#F97316" strokeWidth="2.2" />
                  <rect x="260" y="64" width="22" height="22" rx="2.5" fill="#FED7AA" stroke="#F97316" strokeWidth="2.4" />
                  <rect x="262" y="96" width="18" height="18" rx="2.5" fill="#FFEDD5" stroke="#F97316" strokeWidth="2.2" />
                  <rect x="244" y="118" width="15" height="15" rx="2" fill="#FED7AA" stroke="#F97316" strokeWidth="2.2" />

                  <rect x="296" y="30" width="12" height="12" rx="2" fill="#FFEDD5" stroke="#F97316" strokeWidth="2" />
                  <rect x="294" y="54" width="16" height="16" rx="2" fill="#FED7AA" stroke="#F97316" strokeWidth="2.2" />
                  <rect x="292" y="82" width="15" height="15" rx="2" fill="#FFEDD5" stroke="#F97316" strokeWidth="2" />
                  <rect x="288" y="110" width="12" height="12" rx="2" fill="#FED7AA" stroke="#F97316" strokeWidth="2" />

                  <rect x="324" y="42" width="14" height="14" rx="2" fill="#FFEDD5" stroke="#F97316" strokeWidth="2" />
                  <rect x="322" y="70" width="18" height="18" rx="2" fill="#FED7AA" stroke="#F97316" strokeWidth="2.2" />
                  <rect x="326" y="98" width="10" height="10" rx="1.5" fill="#FFEDD5" stroke="#F97316" strokeWidth="1.8" />

                  <rect x="354" y="32" width="10" height="10" rx="1.5" fill="#FED7AA" stroke="#F97316" strokeWidth="1.8" />
                  <rect x="356" y="58" width="15" height="15" rx="2" fill="#FFEDD5" stroke="#F97316" strokeWidth="2" />
                  <rect x="352" y="86" width="12" height="12" rx="1.5" fill="#FED7AA" stroke="#F97316" strokeWidth="1.8" />

                  <rect x="384" y="24" width="8" height="8" rx="1.5" fill="#FFEDD5" stroke="#F97316" strokeWidth="1.8" />
                  <rect x="386" y="48" width="11" height="11" rx="1.5" fill="#FED7AA" stroke="#F97316" strokeWidth="1.8" />
                  <rect x="382" y="74" width="14" height="14" rx="2" fill="#FFEDD5" stroke="#F97316" strokeWidth="2" />

                  <rect x="412" y="16" width="7" height="7" rx="1" fill="#FED7AA" stroke="#F97316" strokeWidth="1.6" />
                  <rect x="416" y="38" width="9" height="9" rx="1.5" fill="#FFEDD5" stroke="#F97316" strokeWidth="1.6" />
                  <rect x="414" y="62" width="8" height="8" rx="1.5" fill="#FED7AA" stroke="#F97316" strokeWidth="1.6" />
                  <rect x="436" y="28" width="6" height="6" rx="1" fill="#FFEDD5" stroke="#F97316" strokeWidth="1.5" />
                </g>
              </svg>

              <div className="mt-2 pt-2 border-t border-slate-200/70 flex items-center justify-between text-xs text-slate-500">
                <span>
                  1. Mensaje dividido → 2. Rutas independientes → 3. Reensamblado automático
                </span>
                {rerouteEventsCount > 0 && (
                  <span className="font-mono tabular-nums text-amber-700 font-medium">
                    ▲ {rerouteEventsCount} reenrutamientos IP
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
