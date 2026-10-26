import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
  ContentMode,
  DataPacket,
  NetworkEdge,
  RouterNode,
  ScenarioPreset,
  SimulationLogEntry,
  SimulationStage,
} from './types/network';
import {
  INITIAL_EDGES,
  INITIAL_NODES,
  createPacketsForSimulation,
  findBestRoute,
  getEdgeBetween,
} from './utils/networkEngine';
import { EnvelopeHeroBanner } from './components/EnvelopeHeroBanner';
import { SenderLaptopPanel } from './components/SenderLaptopPanel';
import { NetworkMeshCanvas } from './components/NetworkMeshCanvas';
import { ReceiverLaptopPanel } from './components/ReceiverLaptopPanel';
import { PacketInspectorPanel } from './components/PacketInspectorPanel';
import { ProcessBreakdownSection } from './components/ProcessBreakdownSection';

function getTimeString(): string {
  const now = new Date();
  return now.toLocaleTimeString('es-ES', {
    hour12: false,
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  });
}

export default function App() {
  const [message, setMessage] = useState<string>(
    '¡Hola! Así viajan tus mensajes divididos en paquetes por Internet.'
  );
  const [contentMode, setContentMode] = useState<ContentMode>('text');
  const [packetCount, setPacketCount] = useState<number>(3);
  const [activePreset, setActivePreset] = useState<ScenarioPreset>('independent_routes');

  const [nodes, setNodes] = useState<RouterNode[]>(INITIAL_NODES);
  const [edges, setEdges] = useState<NetworkEdge[]>(INITIAL_EDGES);
  const [packets, setPackets] = useState<DataPacket[]>(() =>
    createPacketsForSimulation(
      '¡Hola! Así viajan tus mensajes divididos en paquetes por Internet.',
      3,
      'text',
      INITIAL_NODES,
      INITIAL_EDGES,
      'independent_routes'
    )
  );

  const [selectedPacketId, setSelectedPacketId] = useState<number | null>(1);
  const [stage, setStage] = useState<SimulationStage>('idle');
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(1);
  const [rerouteEventsCount, setRerouteEventsCount] = useState<number>(0);
  const [isInfographicModalOpen, setIsInfographicModalOpen] = useState<boolean>(false);
  const [logs, setLogs] = useState<SimulationLogEntry[]>([
    {
      id: 'init-1',
      timestamp: getTimeString(),
      layer: 'APLICACIÓN',
      title: 'Emulador TCP/IP preparado',
      detail:
        'Mensaje listo para fragmentarse en 3 paquetes con rutas independientes a través de la malla de 13 nodos.',
      type: 'info',
    },
  ]);

  const arrivalCounterRef = useRef<number>(0);

  const appendLog = useCallback(
    (
      layer: SimulationLogEntry['layer'],
      title: string,
      detail: string,
      type: SimulationLogEntry['type'] = 'info'
    ) => {
      setLogs((prev) => [
        {
          id: `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
          timestamp: getTimeString(),
          layer,
          title,
          detail,
          type,
        },
        ...prev.slice(0, 29),
      ]);
    },
    []
  );

  // Rebuild packets when user changes message, contentMode, or packetCount while idle/completed
  const rebuildPackets = useCallback(
    (
      nextMsg: string,
      nextCount: number,
      nextMode: ContentMode,
      currentNodes: RouterNode[],
      currentEdges: NetworkEdge[],
      preset: ScenarioPreset,
      autoStart: boolean = false
    ) => {
      arrivalCounterRef.current = 0;
      const fresh = createPacketsForSimulation(
        nextMsg,
        nextCount,
        nextMode,
        currentNodes,
        currentEdges,
        preset
      );

      if (autoStart) {
        const started = fresh.map((p) => ({
          ...p,
          status: 'in_transit' as const,
          hopProgress: 0.04,
        }));
        setPackets(started);
        setStage('routing');
        setIsPlaying(true);
      } else {
        setPackets(fresh);
        setStage('idle');
        setIsPlaying(false);
      }
    },
    []
  );

  // Start or restart the simulation
  const handleStartSimulation = useCallback(() => {
    arrivalCounterRef.current = 0;
    const fresh = createPacketsForSimulation(
      message,
      packetCount,
      contentMode,
      nodes,
      edges,
      activePreset
    );

    const inTransit = fresh.map((p) => ({
      ...p,
      status: 'in_transit' as const,
      hopProgress: 0.02,
    }));

    setPackets(inTransit);
    setSelectedPacketId(1);
    setStage('routing');
    setIsPlaying(true);

    appendLog(
      'TCP (Transporte)',
      `Mensaje dividido en ${packetCount} paquetes numerados`,
      `Se asignaron números de secuencia SEQ #1000..#${
        inTransit[inTransit.length - 1]?.headers.seqNumber || 1200
      } y se enviaron al Gateway de salida.`,
      'info'
    );

    appendLog(
      'IP (Red)',
      'Rutas independientes calculadas en la malla',
      inTransit
        .map(
          (p) =>
            `Paq [${p.id}]: ${p.route.map((n) => n.replace('N', 'R')).join('→')}`
        )
        .join(' · '),
      'route'
    );
  }, [message, packetCount, contentMode, nodes, edges, activePreset, appendLog]);

  // Reset topology and simulation
  const handleResetSimulation = useCallback(() => {
    setNodes(INITIAL_NODES);
    setEdges(INITIAL_EDGES);
    setRerouteEventsCount(0);
    setActivePreset('independent_routes');
    rebuildPackets(
      message,
      packetCount,
      contentMode,
      INITIAL_NODES,
      INITIAL_EDGES,
      'independent_routes',
      false
    );
    appendLog(
      'IP (Red)',
      'Topología de red restaurada',
      'Todos los routers y cables están operativos al 100%.',
      'info'
    );
  }, [message, packetCount, contentMode, rebuildPackets, appendLog]);

  // Apply scenario preset
  const handleApplyPreset = useCallback(
    (preset: ScenarioPreset) => {
      setActivePreset(preset);
      let nextNodes = INITIAL_NODES.map((n) => ({ ...n, status: 'active' as const }));
      let nextEdges = INITIAL_EDGES.map((e) => ({ ...e, status: 'active' as const }));

      if (preset === 'node_failure_reroute') {
        // Cut central router N7 and link E6-8 so packets must route around the perimeter
        nextNodes = nextNodes.map((n) =>
          n.id === 'N7' ? { ...n, status: 'offline' as const } : n
        );
        nextEdges = nextEdges.map((e) =>
          e.id === 'E6-8' ? { ...e, status: 'cut' as const } : e
        );
        setRerouteEventsCount((c) => c + 1);
        appendLog(
          'IP (Red)',
          'Escenario: Corte de Routers Centrales (R7 y enlace R6-R8)',
          'El protocolo IP evita la zona central caída y desvía los paquetes por los anillos norte y sur.',
          'warning'
        );
      } else if (preset === 'out_of_order_arrival') {
        // Add congestion on upper route so Packet 1 arrives after Packet 2 and Packet 3
        nextEdges = nextEdges.map((e) =>
          e.id === 'E2-3' || e.id === 'E3-4'
            ? { ...e, status: 'congested' as const }
            : e
        );
        appendLog(
          'TCP (Transporte)',
          'Escenario: Llegada Desordenada (Paquete 2 → 3 → 1)',
          'La ruta norte presenta mayor latencia; el Paquete 2 llegará primero al destino y esperará en el Buffer TCP.',
          'warning'
        );
      } else {
        appendLog(
          'IP (Red)',
          'Escenario: Rutas Independientes Estándar',
          'Cada paquete elige un camino distinto (Norte, Centro y Sur) hacia la laptop receptora.',
          'info'
        );
      }

      setNodes(nextNodes);
      setEdges(nextEdges);
      rebuildPackets(
        message,
        packetCount,
        contentMode,
        nextNodes,
        nextEdges,
        preset,
        true
      );
    },
    [message, packetCount, contentMode, rebuildPackets, appendLog]
  );

  // Dynamically reroute active packets when user clicks a node or edge
  const reroutePacketsForTopology = useCallback(
    (updatedNodes: RouterNode[], updatedEdges: NetworkEdge[], reason: string) => {
      let reroutedAny = false;
      const usedEdges = new Set<string>();

      setPackets((prevPackets) =>
        prevPackets.map((pkt) => {
          if (pkt.status === 'arrived_waiting' || pkt.status === 'reassembled') {
            return pkt;
          }

          const currentNodeId =
            pkt.route[Math.min(pkt.currentHopIndex, pkt.route.length - 1)] || 'N1';

          // Check if any remaining node or edge in pkt.route is now offline/cut
          let routeBroken = false;
          for (let i = pkt.currentHopIndex; i < pkt.route.length; i++) {
            const nObj = updatedNodes.find((n) => n.id === pkt.route[i]);
            if (i > pkt.currentHopIndex && nObj?.status === 'offline') {
              routeBroken = true;
              break;
            }
            if (i < pkt.route.length - 1) {
              const eObj = getEdgeBetween(
                updatedEdges,
                pkt.route[i],
                pkt.route[i + 1]
              );
              if (!eObj || eObj.status === 'cut') {
                routeBroken = true;
                break;
              }
            }
          }

          if (!routeBroken && pkt.status === 'in_transit') {
            return pkt;
          }

          // Calculate new route from currentNodeId to N13
          const newSubRoute =
            findBestRoute(
              currentNodeId,
              'N13',
              updatedNodes,
              updatedEdges,
              usedEdges
            ) || findBestRoute(currentNodeId, 'N13', updatedNodes, updatedEdges);

          if (newSubRoute && newSubRoute.length > 1) {
            reroutedAny = true;
            for (let r = 0; r < newSubRoute.length - 1; r++) {
              const edge = getEdgeBetween(
                updatedEdges,
                newSubRoute[r],
                newSubRoute[r + 1]
              );
              if (edge) usedEdges.add(edge.id);
            }

            const combinedRoute = [
              ...pkt.route.slice(0, pkt.currentHopIndex),
              ...newSubRoute,
            ];

            return {
              ...pkt,
              route: combinedRoute,
              hopProgress: 0,
              reroutedCount: pkt.reroutedCount + 1,
              lastRerouteReason: reason,
            };
          }

          return pkt;
        })
      );

      if (reroutedAny) {
        setRerouteEventsCount((c) => c + 1);
        appendLog(
          'IP (Red)',
          `Reenrutamiento dinámico IP activado (${reason})`,
          'Los paquetes afectados recalcularon automáticamente una ruta alternativa hacia GW-Destino.',
          'warning'
        );
      }
    },
    [appendLog]
  );

  // Toggle router node active/offline
  const handleToggleNodeStatus = useCallback(
    (nodeId: string) => {
      setNodes((prevNodes) => {
        const nextNodes = prevNodes.map((n) =>
          n.id === nodeId
            ? {
                ...n,
                status:
                  n.status === 'active'
                    ? ('offline' as const)
                    : ('active' as const),
              }
            : n
        );
        const target = nextNodes.find((n) => n.id === nodeId);
        const actionLabel =
          target?.status === 'offline'
            ? `Router ${nodeId.replace('N', 'R')} desactivado`
            : `Router ${nodeId.replace('N', 'R')} restaurado`;

        reroutePacketsForTopology(nextNodes, edges, actionLabel);
        return nextNodes;
      });
    },
    [edges, reroutePacketsForTopology]
  );

  // Toggle edge cut or congested
  const handleToggleEdgeStatus = useCallback(
    (edgeId: string, toolMode: 'cut' | 'congest') => {
      setEdges((prevEdges) => {
        const nextEdges = prevEdges.map((e) => {
          if (e.id !== edgeId) return e;
          if (toolMode === 'cut') {
            return {
              ...e,
              status:
                e.status === 'cut' ? ('active' as const) : ('cut' as const),
            };
          } else {
            return {
              ...e,
              status:
                e.status === 'congested'
                  ? ('active' as const)
                  : ('congested' as const),
            };
          }
        });

        const target = nextEdges.find((e) => e.id === edgeId);
        const label = `${target?.from.replace('N', 'R')}↔${target?.to.replace(
          'N',
          'R'
        )}`;
        reroutePacketsForTopology(
          nodes,
          nextEdges,
          target?.status === 'cut'
            ? `Enlace ${label} cortado`
            : target?.status === 'congested'
            ? `Congestión en ${label}`
            : `Enlace ${label} restaurado`
        );
        return nextEdges;
      });
    },
    [nodes, reroutePacketsForTopology]
  );

  // Advance simulation tick
  const advanceSimulationStep = useCallback(
    (stepDelta: number) => {
      setPackets((prevPackets) => {
        let newlyArrivedPacket: DataPacket | null = null;

        const updated = prevPackets.map((pkt) => {
          if (pkt.status !== 'in_transit') return pkt;

          const fromId = pkt.route[pkt.currentHopIndex];
          const toId = pkt.route[pkt.currentHopIndex + 1];
          const edge = getEdgeBetween(edges, fromId, toId);

          // Slow down if current link is congested
          const congestionFactor = edge?.status === 'congested' ? 0.42 : 1;
          const delta =
            stepDelta * pkt.speedMultiplier * congestionFactor * playbackSpeed;

          const nextProgress = pkt.hopProgress + delta;

          if (nextProgress >= 1) {
            const nextHopIndex = pkt.currentHopIndex + 1;
            const nextTtl = Math.max(1, pkt.headers.ttl - 1);

            // Reached destination gateway (last node in route)
            if (nextHopIndex >= pkt.route.length - 1) {
              arrivalCounterRef.current += 1;
              const rank = arrivalCounterRef.current;
              const arrivedPkt: DataPacket = {
                ...pkt,
                currentHopIndex: pkt.route.length - 1,
                hopProgress: 1,
                status: 'arrived_waiting',
                arrivalRank: rank,
                arrivalTimestampMs: Date.now(),
                ackSent: true,
                headers: {
                  ...pkt.headers,
                  ttl: nextTtl,
                },
              };
              newlyArrivedPacket = arrivedPkt;
              return arrivedPkt;
            }

            return {
              ...pkt,
              currentHopIndex: nextHopIndex,
              hopProgress: nextProgress - 1,
              headers: {
                ...pkt.headers,
                ttl: nextTtl,
              },
            };
          }

          return {
            ...pkt,
            hopProgress: nextProgress,
          };
        });

        if (newlyArrivedPacket) {
          const p = newlyArrivedPacket as DataPacket;
          appendLog(
            'TCP (Transporte)',
            `Paquete [${p.id}] llegó al destino (${p.arrivalRank}º en llegar)`,
            `Recibido con SEQ #${p.headers.seqNumber} tras ${
              p.route.length - 1
            } saltos (TTL=${p.headers.ttl}). Enviando confirmación ACK.`,
            'info'
          );
        }

        // Check if all packets have arrived
        const allArrived =
          updated.length > 0 &&
          updated.every(
            (p) => p.status === 'arrived_waiting' || p.status === 'reassembled'
          );

        if (allArrived && updated.some((p) => p.status !== 'reassembled')) {
          setIsPlaying(false);
          setStage('completed');
          const arrivalSequence = [...updated]
            .sort((a, b) => (a.arrivalRank || 0) - (b.arrivalRank || 0))
            .map((p) => `[${p.id}]`)
            .join(' → ');

          appendLog(
            'REENSAMBLADO',
            '¡Reensamblado automático TCP completado con éxito!',
            `Orden físico de llegada: ${arrivalSequence}. El buffer TCP reordenó las piezas a [1 → .. → ${updated.length}] y entregó el mensaje intacto.`,
            'success'
          );

          return updated.map((p) => ({
            ...p,
            status: 'reassembled' as const,
          }));
        }

        if (
          updated.some((p) => p.status === 'arrived_waiting') &&
          updated.some((p) => p.status === 'in_transit')
        ) {
          setStage('reassembling');
        }

        return updated;
      });
    },
    [edges, playbackSpeed, appendLog]
  );

  // Main animation timer when isPlaying is true
  useEffect(() => {
    if (!isPlaying) return;
    const interval = setInterval(() => {
      advanceSimulationStep(0.045);
    }, 50);
    return () => clearInterval(interval);
  }, [isPlaying, advanceSimulationStep]);

  // Step-by-step manual button handler
  const handleStepForward = () => {
    if (stage === 'idle' || stage === 'completed') {
      handleStartSimulation();
      setIsPlaying(false);
      return;
    }
    advanceSimulationStep(0.34);
  };

  const activePacketsCount = packets.filter((p) => p.status === 'in_transit').length;
  const arrivedCount = packets.filter(
    (p) => p.status === 'arrived_waiting' || p.status === 'reassembled'
  ).length;

  return (
    <div className="min-h-screen flex flex-col bg-[#F8FAFC] text-[#0B213F]">
      {/* Strict 3-Zone Top Navigation Bar Contract */}
      <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-xs border-b border-slate-200">
        <div className="max-w-[1440px] mx-auto flex items-center justify-between gap-8 px-6 py-3.5">
          {/* Zone 1: Single text element wordmark */}
          <a
            href="#top"
            className="text-lg font-extrabold tracking-tight text-[#0B213F] whitespace-nowrap shrink-0 font-display"
          >
            El Viaje de los Datos (TCP/IP)
          </a>

          {/* Zone 2: 4 concise single-line navigation links */}
          <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-600">
            <a
              href="#simulador-sandbox"
              className="hover:text-[#0B213F] hover:underline underline-offset-4 transition-colors whitespace-nowrap shrink-0"
            >
              Simulador
            </a>
            <a
              href="#inspector-section"
              className="hover:text-[#0B213F] hover:underline underline-offset-4 transition-colors whitespace-nowrap shrink-0"
            >
              Inspector TCP/IP
            </a>
            <a
              href="#etapas-section"
              className="hover:text-[#0B213F] hover:underline underline-offset-4 transition-colors whitespace-nowrap shrink-0"
            >
              Etapas del Proceso
            </a>
            <a
              href="#infografia-section"
              className="hover:text-[#0B213F] hover:underline underline-offset-4 transition-colors whitespace-nowrap shrink-0"
            >
              Infografía Base
            </a>
          </nav>

          {/* Zone 3: 1 Primary Action Button */}
          <div className="flex items-center shrink-0">
            <button
              type="button"
              onClick={handleStartSimulation}
              className="px-4 py-2 text-xs font-semibold text-white bg-[#0B213F] hover:bg-slate-800 rounded-lg transition-colors cursor-pointer whitespace-nowrap shrink-0"
            >
              Enviar Mensaje
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main id="top" className="flex-1">
        {/* Top Interactive Question & Disintegrating Envelope Banner */}
        <EnvelopeHeroBanner
          stage={stage}
          packetCount={packetCount}
          activePacketsCount={activePacketsCount}
          arrivedCount={arrivedCount}
          rerouteEventsCount={rerouteEventsCount}
          onStartSimulation={handleStartSimulation}
          onResetSimulation={handleResetSimulation}
          onOpenInfographicModal={() => setIsInfographicModalOpen(true)}
        />

        {/* Core Interactive 3-Stage TCP/IP Sandbox */}
        <section
          id="simulador-sandbox"
          className="max-w-[1440px] mx-auto px-6 py-8 space-y-6"
        >
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
            {/* Stage 1: Left Station (Sender Laptop & Message Splitter) */}
            <div className="lg:col-span-3">
              <SenderLaptopPanel
                message={message}
                onChangeMessage={(val) => {
                  setMessage(val);
                  rebuildPackets(
                    val,
                    packetCount,
                    contentMode,
                    nodes,
                    edges,
                    activePreset,
                    false
                  );
                }}
                contentMode={contentMode}
                onChangeContentMode={(mode) => {
                  setContentMode(mode);
                  rebuildPackets(
                    message,
                    packetCount,
                    mode,
                    nodes,
                    edges,
                    activePreset,
                    false
                  );
                }}
                packetCount={packetCount}
                onChangePacketCount={(cnt) => {
                  setPacketCount(cnt);
                  rebuildPackets(
                    message,
                    cnt,
                    contentMode,
                    nodes,
                    edges,
                    activePreset,
                    false
                  );
                }}
                packets={packets}
                selectedPacketId={selectedPacketId}
                onSelectPacket={setSelectedPacketId}
                stage={stage}
                onStartSimulation={handleStartSimulation}
              />
            </div>

            {/* Stage 2: Center Interactive Mesh Network (Independent Routes & Live Node Cutting) */}
            <div className="lg:col-span-6">
              <NetworkMeshCanvas
                nodes={nodes}
                edges={edges}
                packets={packets}
                selectedPacketId={selectedPacketId}
                onSelectPacket={setSelectedPacketId}
                onToggleNodeStatus={handleToggleNodeStatus}
                onToggleEdgeStatus={handleToggleEdgeStatus}
                onApplyPreset={handleApplyPreset}
                onRestoreTopology={handleResetSimulation}
                activePreset={activePreset}
                stage={stage}
              />
            </div>

            {/* Stage 3: Right Station (Receiver Laptop, Out-of-Order Buffer & Puzzle Reassembly) */}
            <div className="lg:col-span-3">
              <ReceiverLaptopPanel
                packets={packets}
                contentMode={contentMode}
                originalMessage={message}
                selectedPacketId={selectedPacketId}
                onSelectPacket={setSelectedPacketId}
                stage={stage}
              />
            </div>
          </div>

          {/* Bottom Deck: Step-by-Step Narrator, Playback Controls & Deep TCP/IP Packet Inspector */}
          <PacketInspectorPanel
            packets={packets}
            nodes={nodes}
            selectedPacketId={selectedPacketId}
            onSelectPacket={setSelectedPacketId}
            stage={stage}
            isPlaying={isPlaying}
            onTogglePlay={() => {
              if (stage === 'idle' || stage === 'completed') {
                handleStartSimulation();
              } else {
                setIsPlaying((p) => !p);
              }
            }}
            onStepForward={handleStepForward}
            onReset={handleResetSimulation}
            playbackSpeed={playbackSpeed}
            onChangeSpeed={setPlaybackSpeed}
            logs={logs}
          />
        </section>

        {/* Conceptual Breakdown of the 3 Stages & Reference Infographic */}
        <ProcessBreakdownSection
          isModalOpen={isInfographicModalOpen}
          onCloseModal={() => setIsInfographicModalOpen(false)}
          onRunScenario={handleApplyPreset}
        />
      </main>

      {/* Quiet Editorial Footer */}
      <footer className="bg-white border-t border-slate-200 py-5 px-6">
        <div className="max-w-[1440px] mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <span>
            Simulador Educativo: El Viaje de los Datos (Protocolos TCP e IP)
          </span>
          <div className="flex items-center gap-4">
            <a href="#simulador-sandbox" className="hover:text-[#0B213F]">
              Ir al Simulador
            </a>
            <span aria-hidden="true">·</span>
            <button
              type="button"
              onClick={() => setIsInfographicModalOpen(true)}
              className="hover:text-[#0B213F] cursor-pointer"
            >
              Ver Infografía Base
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}
