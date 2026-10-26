import React, { useState } from 'react';
import { X, Play, Scissors, Shuffle, CheckCircle2 } from 'lucide-react';
import { ScenarioPreset } from '../types/network';

interface ProcessBreakdownSectionProps {
  isModalOpen: boolean;
  onCloseModal: () => void;
  onRunScenario: (preset: ScenarioPreset) => void;
}

export const ProcessBreakdownSection: React.FC<ProcessBreakdownSectionProps> = ({
  isModalOpen,
  onCloseModal,
  onRunScenario,
}) => {
  const [imgError, setImgError] = useState(false);

  return (
    <>
      <section
        id="etapas-section"
        className="max-w-[1440px] mx-auto px-6 py-10 border-t border-slate-200"
      >
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left 7 Columns: 3-Stage Pedagogical Guide */}
          <div className="lg:col-span-7 space-y-6">
            <div>
              <div className="text-xs font-medium text-slate-500">
                Guía Conceptual del Modelo TCP/IP · Conmutación de Paquetes
              </div>
              <h2 className="text-2xl font-extrabold text-[#0B213F] mt-1">
                ¿Cómo trabajan juntos TCP e IP para entregar tus datos?
              </h2>
              <p className="text-sm text-slate-600 mt-1.5 leading-relaxed">
                Cada vez que envías un mensaje, una foto o cargas una página web, dos
                protocolos fundamentales dividen el trabajo en tres etapas sincronizadas:
              </p>
            </div>

            <div className="space-y-4">
              {/* Stage 1 Card */}
              <div className="bg-white border border-slate-200 rounded-xl p-5">
                <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                  <h3 className="text-base font-bold text-[#0B213F]">
                    01. Mensaje dividido (Segmentación TCP)
                  </h3>
                  <span className="text-xs text-slate-500 font-mono">
                    Capa 4 · Transporte · Tamaño Máximo (MTU)
                  </span>
                </div>
                <p className="text-sm text-slate-600 leading-relaxed mb-3">
                  Enviar un archivo grande de una sola vez bloquearía los enlaces para otros
                  usuarios y obligaría a reenviar todo desde cero si ocurre un microcorte. Por
                  eso, <strong className="text-[#0B213F]">TCP</strong> divide el mensaje en
                  pequeños bloques numerados (<span className="font-mono">Paquete 1, 2, 3...</span>) y
                  añade a cada uno su posición exacta (<span className="font-mono">SEQ</span>) y una
                  suma de verificación (<span className="font-mono">Checksum</span>).
                </p>
                <button
                  type="button"
                  onClick={() => {
                    onRunScenario('independent_routes');
                    window.scrollTo({ top: 180, behavior: 'smooth' });
                  }}
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#F97316] hover:text-[#EA580C] cursor-pointer"
                >
                  <Play className="w-3.5 h-3.5 fill-current" />
                  Probar fragmentación en el emulador
                </button>
              </div>

              {/* Stage 2 Card */}
              <div className="bg-white border border-slate-200 rounded-xl p-5">
                <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                  <h3 className="text-base font-bold text-[#0B213F]">
                    02. Rutas independientes (Enrutamiento Dinámico IP)
                  </h3>
                  <span className="text-xs text-slate-500 font-mono">
                    Capa 3 · Red · Malla de Routers
                  </span>
                </div>
                <p className="text-sm text-slate-600 leading-relaxed mb-3">
                  Internet está diseñada como una malla descentralizada de routers. El protocolo{' '}
                  <strong className="text-[#0B213F]">IP</strong> encabeza cada paquete con la
                  dirección de origen y destino, y cada router decide de forma independiente cuál
                  es el siguiente salto más despejado. Si un enlace cae, los paquetes toman otra
                  ruta automáticamente sin interrumpir la comunicación.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    onRunScenario('node_failure_reroute');
                    window.scrollTo({ top: 180, behavior: 'smooth' });
                  }}
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#F97316] hover:text-[#EA580C] cursor-pointer"
                >
                  <Scissors className="w-3.5 h-3.5" />
                  Simular caída de routers centrales y cambio de ruta
                </button>
              </div>

              {/* Stage 3 Card */}
              <div className="bg-white border border-slate-200 rounded-xl p-5">
                <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                  <h3 className="text-base font-bold text-[#0B213F]">
                    03. Reensamblado automático (Buffer y Orden TCP)
                  </h3>
                  <span className="text-xs text-slate-500 font-mono">
                    Capa 4 · Destino · Reordenamiento SEQ/ACK
                  </span>
                </div>
                <p className="text-sm text-slate-600 leading-relaxed mb-3">
                  Como cada paquete viajó por caminos con distinto número de saltos y tráfico, es
                  muy común que el <strong className="text-[#0B213F]">Paquete 2</strong> llegue
                  antes que el <strong className="text-[#0B213F]">Paquete 1</strong>. En la
                  computadora receptora, <strong className="text-[#0B213F]">TCP</strong> los
                  almacena temporalmente en un buffer, los ordena como piezas de rompecabezas según
                  su número de secuencia y entrega el mensaje intacto.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    onRunScenario('out_of_order_arrival');
                    window.scrollTo({ top: 180, behavior: 'smooth' });
                  }}
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#F97316] hover:text-[#EA580C] cursor-pointer"
                >
                  <Shuffle className="w-3.5 h-3.5" />
                  Experimentar llegada desordenada (2 → 3 → 1) y reordenamiento
                </button>
              </div>
            </div>
          </div>

          {/* Right 5 Columns: Reference Infographic Card */}
          <div id="infografia-section" className="lg:col-span-5">
            <div className="bg-white border border-slate-200 rounded-xl p-5">
              <div className="flex items-center justify-between gap-2 pb-3 mb-3 border-b border-slate-100">
                <div>
                  <div className="text-xs font-medium text-slate-500">
                    Esquema Visual Base
                  </div>
                  <h3 className="text-base font-bold text-[#0B213F]">
                    Infografía: El Viaje de los Datos (TCP/IP)
                  </h3>
                </div>
                <span className="text-xs text-emerald-700 font-semibold flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  Modelo Activo
                </span>
              </div>

              <div className="rounded-lg overflow-hidden border border-slate-200 bg-[#F8FAFC]">
                {!imgError ? (
                  <img
                    src="/assets/aistudio/image_b927dbdd.png"
                    alt="Infografía ¿Qué pasa realmente cuando envías un mensaje? El Viaje de los Datos TCP/IP"
                    referrerPolicy="no-referrer"
                    onError={() => setImgError(true)}
                    className="w-full h-auto object-contain max-h-[460px]"
                  />
                ) : (
                  <div className="p-8 text-center text-xs text-slate-500">
                    Esquema visual: 1. Mensaje dividido · 2. Rutas independientes · 3.
                    Reensamblado automático
                  </div>
                )}
              </div>

              <p className="text-xs text-slate-500 mt-3 leading-relaxed">
                Cada elemento gráfico de esta infografía —el sobre fragmentándose en paquetes
                naranjas, las tres rutas diferenciadas en la malla de routers y el documento
                tipo rompecabezas en el destino— está modelado de forma interactiva en el
                simulador superior.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Fullscreen Modal when clicking "Ver Infografía de Referencia" */}
      {isModalOpen && (
        <div
          className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-xs flex items-center justify-center p-4"
          onClick={onCloseModal}
        >
          <div
            className="bg-white border border-slate-200 rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto p-6 shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-200">
              <div>
                <h3 className="text-lg font-bold text-[#0B213F]">
                  Infografía Original: El Viaje de los Datos (TCP/IP)
                </h3>
                <p className="text-xs text-slate-500">
                  Diagrama base utilizado para el emulador de conmutación de paquetes
                </p>
              </div>
              <button
                type="button"
                onClick={onCloseModal}
                className="p-2 text-slate-500 hover:text-[#0B213F] rounded-lg hover:bg-slate-100 cursor-pointer"
                aria-label="Cerrar ventana"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="bg-[#F8FAFC] border border-slate-200 rounded-xl overflow-hidden flex justify-center p-3">
              <img
                src="/assets/aistudio/image_b927dbdd.png"
                alt="Infografía original El Viaje de los Datos (TCP/IP)"
                referrerPolicy="no-referrer"
                className="max-h-[70vh] w-auto object-contain rounded-lg"
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
};
