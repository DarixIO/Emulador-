import React, { useState } from 'react';
import {
  Scissors,
  Zap,
  RotateCcw,
  Shuffle,
  CheckCircle2,
  AlertTriangle,
} from 'lucide-react';
import {
  DataPacket,
  NetworkEdge,
  RouterNode,
  ScenarioPreset,
  SimulationStage,
} from '../types/network';
import { getEdgeBetween } from '../utils/networkEngine';

interface NetworkMeshCanvasProps {
  nodes: RouterNode[];
  edges: NetworkEdge[];
  packets: DataPacket[];
  selectedPacketId: number | null;
  onSelectPacket: (id: number) => void;
  onToggleNodeStatus: (nodeId: string) => void;
  onToggleEdgeStatus: (edgeId: string, mode: 'cut' | 'congest') => void;
  onApplyPreset: (preset: ScenarioPreset) => void;
  onRestoreTopology: () => void;
  activePreset: ScenarioPreset;
  stage: SimulationStage;
}

export const NetworkMeshCanvas: React.FC<NetworkMeshCanvasProps> = ({
  nodes,
  edges,
  packets,
  selectedPacketId,
  onSelectPacket,
  onToggleNodeStatus,
  onToggleEdgeStatus,
  onApplyPreset,
  onRestoreTopology,
  activePreset,
  stage,
}) => {
  const [interactionTool, setInteractionTool] = useState<'cut' | 'congest'>('cut');

  const nodeMap = React.useMemo(() => {
    const map: Record<string, RouterNode> = {};
    for (const n of nodes) map[n.id] = n;
    return map;
  }, [nodes]);

  // Convert 0-100 percentage coordinates into SVG viewBox (640 x 430)
  const toSvgX = (pct: number) => 24 + (pct / 100) * 592;
  const toSvgY = (pct: number) => 22 + (pct / 100) * 386;

  const cutCount =
    nodes.filter((n) => n.status === 'offline').length +
    edges.filter((e) => e.status !== 'active').length;

  return (
    <div className="bg-white border border-slate-200 rounded-xl p-5 flex flex-col justify-between h-full">
      {/* Stage Header & Interactive Tools */}
      <div>
        <div className="flex flex-wrap items-center justify-between gap-3 pb-3 mb-3 border-b border-slate-100">
          <div>
            <div className="text-xs font-medium text-slate-500">
              02. Red Conmutada de Paquetes · Protocolo IP (Capa 3)
            </div>
            <h2 className="text-lg font-bold text-[#0B213F] mt-0.5">
              Rutas independientes
            </h2>
          </div>

          {/* Interactive Tool Mode Switcher */}
          <div className="flex items-center gap-1.5">
            <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-lg">
              <button
                type="button"
                onClick={() => setInteractionTool('cut')}
                className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold rounded-md transition-colors cursor-pointer whitespace-nowrap shrink-0 ${
                  interactionTool === 'cut'
                    ? 'bg-red-600 text-white shadow-xs'
                    : 'text-slate-600 hover:text-[#0B213F]'
                }`}
              >
                <Scissors className="w-3.5 h-3.5" />
                Clic para Cortar Nodo/Cable
              </button>
              <button
                type="button"
                onClick={() => setInteractionTool('congest')}
                className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold rounded-md transition-colors cursor-pointer whitespace-nowrap shrink-0 ${
                  interactionTool === 'congest'
                    ? 'bg-amber-600 text-white shadow-xs'
                    : 'text-slate-600 hover:text-[#0B213F]'
                }`}
              >
                <Zap className="w-3.5 h-3.5" />
                Simular Latencia
              </button>
            </div>

            {cutCount > 0 && (
              <button
                type="button"
                onClick={onRestoreTopology}
                title="Restaurar todos los routers y enlaces cortados"
                className="inline-flex items-center gap-1 px-2.5 py-1.5 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors cursor-pointer whitespace-nowrap shrink-0"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                Sanar ({cutCount})
              </button>
            )}
          </div>
        </div>

        {/* Scenario Quick Presets Bar */}
        <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="text-xs font-medium text-slate-500 mr-1">
              Escenarios:
            </span>
            <button
              type="button"
              onClick={() => onApplyPreset('independent_routes')}
              className={`px-2.5 py-1 text-xs font-semibold rounded-md border transition-colors cursor-pointer whitespace-nowrap shrink-0 ${
                activePreset === 'independent_routes'
                  ? 'bg-[#0B213F] text-white border-[#0B213F]'
                  : 'bg-white text-slate-600 border-slate-200 hover:border-slate-300'
              }`}
            >
              Rutas Independientes
            </button>
            <button
              type="button"
              onClick={() => onApplyPreset('out_of_order_arrival')}
              className={`inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold rounded-md border transition-colors cursor-pointer whitespace-nowrap shrink-0 ${
                activePreset === 'out_of_order_arrival'
                  ? 'bg-[#F97316] text-white border-[#F97316]'
                  : 'bg-white text-slate-600 border-slate-200 hover:border-slate-300'
              }`}
            >
              <Shuffle className="w-3 h-3" />
              Llegada Desordenada (2 → 3 → 1)
            </button>
            <button
              type="button"
              onClick={() => onApplyPreset('node_failure_reroute')}
              className={`inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold rounded-md border transition-colors cursor-pointer whitespace-nowrap shrink-0 ${
                activePreset === 'node_failure_reroute'
                  ? 'bg-red-600 text-white border-red-600'
                  : 'bg-white text-slate-600 border-slate-200 hover:border-slate-300'
              }`}
            >
              <AlertTriangle className="w-3 h-3" />
              Corte de Routers Centrales
            </button>
          </div>
        </div>
      </div>

      {/* Main Interactive Mesh SVG */}
      <div className="relative bg-[#F8FAFC] bg-technical-grid border border-slate-200/90 rounded-xl overflow-hidden flex-1 flex flex-col justify-center">
        <svg
          viewBox="0 0 640 430"
          className="w-full h-auto max-h-[410px] select-none"
          role="img"
          aria-label="Malla interactiva de routers donde los paquetes viajan por rutas independientes"
        >
          {/* Decorative circular outer network boundary like the infographic */}
          <ellipse
            cx="320"
            cy="215"
            rx="270"
            ry="185"
            fill="none"
            stroke="#E2E8F0"
            strokeWidth="1.5"
            strokeDasharray="6 6"
          />

          {/* 1. Base Network Edges (Cables between Routers) */}
          {edges.map((edge) => {
            const nA = nodeMap[edge.from];
            const nB = nodeMap[edge.to];
            if (!nA || !nB) return null;

            const x1 = toSvgX(nA.x);
            const y1 = toSvgY(nA.y);
            const x2 = toSvgX(nB.x);
            const y2 = toSvgY(nB.y);
            const midX = (x1 + x2) / 2;
            const midY = (y1 + y2) / 2;

            const isCut =
              edge.status === 'cut' ||
              nA.status === 'offline' ||
              nB.status === 'offline';
            const isCongested = edge.status === 'congested' && !isCut;

            return (
              <g
                key={edge.id}
                onClick={() => onToggleEdgeStatus(edge.id, interactionTool)}
                className="cursor-pointer group"
              >
                {/* Invisible wider hit target for easy clicking */}
                <line
                  x1={x1}
                  y1={y1}
                  x2={x2}
                  y2={y2}
                  stroke="transparent"
                  strokeWidth="16"
                />

                {/* Visible Base Cable */}
                <line
                  x1={x1}
                  y1={y1}
                  x2={x2}
                  y2={y2}
                  stroke={
                    isCut
                      ? '#FCA5A5'
                      : isCongested
                      ? '#F59E0B'
                      : '#94A3B8'
                  }
                  strokeWidth={isCongested ? '3' : '2.2'}
                  strokeDasharray={isCut ? '4 4' : isCongested ? '6 3' : undefined}
                  className="transition-colors group-hover:stroke-[#0B213F]"
                />

                {/* Latency / Status pill on cable midpoint */}
                {isCut ? (
                  <g transform={`translate(${midX}, ${midY})`}>
                    <circle r="8" fill="#DC2626" />
                    <path
                      d="M -3 -3 L 3 3 M 3 -3 L -3 3"
                      stroke="#FFFFFF"
                      strokeWidth="1.8"
                      strokeLinecap="round"
                    />
                  </g>
                ) : isCongested ? (
                  <g transform={`translate(${midX}, ${midY})`}>
                    <rect
                      x="-18"
                      y="-7"
                      width="36"
                      height="14"
                      rx="3"
                      fill="#FEF3C7"
                      stroke="#D97706"
                      strokeWidth="1"
                    />
                    <text
                      x="0"
                      y="3"
                      textAnchor="middle"
                      className="font-mono text-[8px] font-bold fill-amber-900"
                    >
                      +{edge.baseLatencyMs * 3}ms
                    </text>
                  </g>
                ) : (
                  <text
                    x={midX}
                    y={midY - 4}
                    textAnchor="middle"
                    className="font-mono text-[8px] fill-slate-400 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"
                  >
                    {edge.baseLatencyMs}ms
                  </text>
                )}
              </g>
            );
          })}

          {/* 2. Highlighted Independent Packet Routes (Matching Infographic: Orange Solid, Navy Solid, Orange Dashed) */}
          {packets.map((pkt) => {
            if (pkt.route.length < 2) return null;
            const isSelected = selectedPacketId === pkt.id;

            // Build SVG polyline points for the packet's assigned route
            const points = pkt.route
              .map((nodeId) => {
                const n = nodeMap[nodeId];
                if (!n) return null;
                // Slight offset per packet ID so overlapping segments remain visible side by side
                const offset = (pkt.id - 2) * 3.5;
                return `${toSvgX(n.x)},${toSvgY(n.y) + offset}`;
              })
              .filter(Boolean)
              .join(' ');

            const strokeColor =
              pkt.style === 'navy-solid' ? '#0B213F' : '#F97316';
            const strokeDash =
              pkt.style === 'orange-dashed' ? '8 5' : undefined;

            return (
              <g key={`route-${pkt.id}`} className="pointer-events-none">
                <polyline
                  points={points}
                  fill="none"
                  stroke={strokeColor}
                  strokeWidth={isSelected ? '5' : '3.8'}
                  strokeDasharray={strokeDash}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  opacity={
                    selectedPacketId === null || isSelected ? 0.92 : 0.35
                  }
                />
              </g>
            );
          })}

          {/* 3. Router Nodes (Circles like the Infographic, clickable to toggle online/offline) */}
          {nodes.map((node) => {
            const cx = toSvgX(node.x);
            const cy = toSvgY(node.y);
            const isGateway = node.role !== 'core';
            const isOffline = node.status === 'offline';

            // Check if any packet is currently passing through this node
            const isActiveHop = packets.some(
              (p) =>
                p.status === 'in_transit' &&
                (p.route[p.currentHopIndex] === node.id ||
                  p.route[p.currentHopIndex + 1] === node.id)
            );

            return (
              <g
                key={node.id}
                transform={`translate(${cx}, ${cy})`}
                onClick={() => {
                  if (!isGateway) onToggleNodeStatus(node.id);
                }}
                className={isGateway ? 'cursor-default' : 'cursor-pointer group'}
              >
                {/* Outer ring when active hop */}
                {isActiveHop && !isOffline && (
                  <circle
                    r="20"
                    fill="none"
                    stroke="#F97316"
                    strokeWidth="2"
                    opacity="0.45"
                  />
                )}

                <circle
                  r={isGateway ? 15 : 13.5}
                  fill={
                    isOffline
                      ? '#FEE2E2'
                      : isGateway
                      ? '#0B213F'
                      : '#FFFFFF'
                  }
                  stroke={
                    isOffline
                      ? '#DC2626'
                      : isActiveHop
                      ? '#F97316'
                      : '#0B213F'
                  }
                  strokeWidth={isGateway ? '3' : '2.6'}
                  className="transition-transform group-hover:scale-110"
                />

                {isOffline ? (
                  <path
                    d="M -4 -4 L 4 4 M 4 -4 L -4 4"
                    stroke="#DC2626"
                    strokeWidth="2.2"
                    strokeLinecap="round"
                  />
                ) : (
                  <text
                    x="0"
                    y="3.5"
                    textAnchor="middle"
                    className={`font-mono text-[9px] font-bold ${
                      isGateway ? 'fill-white' : 'fill-[#0B213F]'
                    }`}
                  >
                    {node.id.replace('N', 'R')}
                  </text>
                )}

                {/* Router label below node */}
                <text
                  x="0"
                  y="25"
                  textAnchor="middle"
                  className={`text-[9px] font-medium ${
                    isOffline
                      ? 'fill-red-600 font-semibold'
                      : 'fill-slate-600'
                  }`}
                >
                  {isOffline ? '✕ CORTADO' : node.label}
                </text>
              </g>
            );
          })}

          {/* 4. Animated Data Packets [1], [2], [3]... traveling across the mesh */}
          {packets.map((pkt) => {
            if (pkt.route.length === 0) return null;

            const fromNodeId =
              pkt.route[Math.min(pkt.currentHopIndex, pkt.route.length - 1)];
            const toNodeId =
              pkt.route[Math.min(pkt.currentHopIndex + 1, pkt.route.length - 1)];

            const fromNode = nodeMap[fromNodeId];
            const toNode = nodeMap[toNodeId];
            if (!fromNode || !toNode) return null;

            const progress =
              pkt.status === 'queued'
                ? 0
                : pkt.status === 'arrived_waiting' || pkt.status === 'reassembled'
                ? 1
                : pkt.hopProgress;

            const rawX =
              toSvgX(fromNode.x) +
              (toSvgX(toNode.x) - toSvgX(fromNode.x)) * progress;
            const rawY =
              toSvgY(fromNode.y) +
              (toSvgY(toNode.y) - toSvgY(fromNode.y)) * progress;

            // Slight vertical separation when waiting at start/end gateways
            const yOffset =
              pkt.status === 'queued' ||
              pkt.status === 'arrived_waiting' ||
              pkt.status === 'reassembled'
                ? (pkt.id - (pkt.totalPackets + 1) / 2) * 28
                : (pkt.id - 2) * 4;

            const x = rawX;
            const y = rawY + yOffset;
            const isSelected = selectedPacketId === pkt.id;

            const boxFill =
              pkt.style === 'navy-solid' ? '#FFFFFF' : '#FFEDD5';
            const boxStroke =
              pkt.style === 'navy-solid' ? '#0B213F' : '#F97316';
            const badgeFill = '#0B213F';

            return (
              <g
                key={`pkt-node-${pkt.id}`}
                transform={`translate(${x}, ${y})`}
                onClick={(e) => {
                  e.stopPropagation();
                  onSelectPacket(pkt.id);
                }}
                className="cursor-pointer"
              >
                {/* Selection Halo */}
                {isSelected && (
                  <rect
                    x="-20"
                    y="-20"
                    width="40"
                    height="40"
                    rx="8"
                    fill="none"
                    stroke="#F97316"
                    strokeWidth="2.5"
                  />
                )}

                {/* Packet Square Box (Identical to Infographic [1] [2] [3] blocks) */}
                <rect
                  x="-15"
                  y="-15"
                  width="30"
                  height="30"
                  rx="5"
                  fill={boxFill}
                  stroke={boxStroke}
                  strokeWidth="2.6"
                  strokeDasharray={
                    pkt.style === 'orange-dashed' ? '4 2' : undefined
                  }
                />

                {/* Dark Navy Number Circle inside Packet */}
                <circle cx="0" cy="0" r="9.5" fill={badgeFill} />
                <text
                  x="0"
                  y="3.5"
                  textAnchor="middle"
                  className="font-mono text-[11px] font-bold fill-white"
                >
                  {pkt.id}
                </text>

                {/* Live TTL & Status Tag above Packet while in transit */}
                {pkt.status === 'in_transit' && (
                  <g transform="translate(0, -23)">
                    <rect
                      x="-24"
                      y="-9"
                      width="48"
                      height="13"
                      rx="3"
                      fill="#0B213F"
                    />
                    <text
                      x="0"
                      y="0"
                      textAnchor="middle"
                      className="font-mono text-[8px] font-semibold fill-white"
                    >
                      TTL:{pkt.headers.ttl}
                    </text>
                  </g>
                )}

                {/* Dynamic Reroute Indicator Badge */}
                {pkt.reroutedCount > 0 && pkt.status === 'in_transit' && (
                  <g transform="translate(0, 24)">
                    <rect
                      x="-32"
                      y="-7"
                      width="64"
                      height="13"
                      rx="3"
                      fill="#FEF3C7"
                      stroke="#D97706"
                      strokeWidth="1"
                    />
                    <text
                      x="0"
                      y="2"
                      textAnchor="middle"
                      className="font-mono text-[8px] font-bold fill-amber-900"
                    >
                      ⚡ REENRUTADO
                    </text>
                  </g>
                )}
              </g>
            );
          })}
        </svg>

        {/* Legend Overlay at Bottom of Mesh */}
        <div className="px-4 py-2.5 bg-white/95 border-t border-slate-200/80 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex flex-wrap items-center gap-4">
            <span className="inline-flex items-center gap-1.5 font-medium text-[#0B213F]">
              <span className="w-5 h-1 bg-[#F97316] rounded-full inline-block" />
              Ruta Paquete 1
            </span>
            <span className="inline-flex items-center gap-1.5 font-medium text-[#0B213F]">
              <span className="w-5 h-1 bg-[#0B213F] rounded-full inline-block" />
              Ruta Paquete 2
            </span>
            <span className="inline-flex items-center gap-1.5 font-medium text-[#0B213F]">
              <span className="w-5 h-0 border-t-2 border-dashed border-[#F97316] inline-block" />
              Ruta Paquete 3
            </span>
          </div>

          <div className="text-slate-500 flex items-center gap-1.5">
            {stage === 'completed' ? (
              <span className="text-emerald-700 font-semibold flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" />● COMPLETADO: Todos los paquetes llegaron
              </span>
            ) : (
              <span>
                Haz clic en cualquier router <strong className="text-[#0B213F]">(R2–R12)</strong> o
                enlace para cortarlo en vivo
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
