import {
  ContentMode,
  DataPacket,
  NetworkEdge,
  PacketVisualStyle,
  RouterNode,
  ScenarioPreset,
} from '../types/network';

export const INITIAL_NODES: RouterNode[] = [
  // Left Entry Gateway
  { id: 'N1', label: 'GW-Origen', x: 7, y: 52, role: 'gateway_in', status: 'active' },

  // Upper Ring & Core
  { id: 'N2', label: 'R-Norte 1', x: 22, y: 22, role: 'core', status: 'active' },
  { id: 'N3', label: 'R-Cumbre', x: 43, y: 11, role: 'core', status: 'active' },
  { id: 'N4', label: 'R-Norte 2', x: 68, y: 15, role: 'core', status: 'active' },
  { id: 'N5', label: 'R-Noreste', x: 84, y: 28, role: 'core', status: 'active' },

  // Central Mesh Routers
  { id: 'N6', label: 'R-Oeste', x: 26, y: 44, role: 'core', status: 'active' },
  { id: 'N7', label: 'R-Centro 1', x: 48, y: 34, role: 'core', status: 'active' },
  { id: 'N8', label: 'R-Centro 2', x: 47, y: 55, role: 'core', status: 'active' },
  { id: 'N9', label: 'R-Este', x: 71, y: 46, role: 'core', status: 'active' },

  // Lower Ring & Core
  { id: 'N10', label: 'R-Suroeste', x: 22, y: 76, role: 'core', status: 'active' },
  { id: 'N11', label: 'R-Sur 1', x: 46, y: 84, role: 'core', status: 'active' },
  { id: 'N12', label: 'R-Sureste', x: 73, y: 78, role: 'core', status: 'active' },

  // Right Exit Gateway
  { id: 'N13', label: 'GW-Destino', x: 93, y: 52, role: 'gateway_out', status: 'active' },
];

export const INITIAL_EDGES: NetworkEdge[] = [
  // Connections from Entry Gateway N1
  { id: 'E1-2', from: 'N1', to: 'N2', baseLatencyMs: 18, status: 'active' },
  { id: 'E1-6', from: 'N1', to: 'N6', baseLatencyMs: 14, status: 'active' },
  { id: 'E1-10', from: 'N1', to: 'N10', baseLatencyMs: 20, status: 'active' },

  // Upper mesh links
  { id: 'E2-3', from: 'N2', to: 'N3', baseLatencyMs: 16, status: 'active' },
  { id: 'E2-6', from: 'N2', to: 'N6', baseLatencyMs: 12, status: 'active' },
  { id: 'E2-7', from: 'N2', to: 'N7', baseLatencyMs: 19, status: 'active' },
  { id: 'E3-4', from: 'N3', to: 'N4', baseLatencyMs: 15, status: 'active' },
  { id: 'E3-7', from: 'N3', to: 'N7', baseLatencyMs: 14, status: 'active' },
  { id: 'E4-5', from: 'N4', to: 'N5', baseLatencyMs: 16, status: 'active' },
  { id: 'E4-7', from: 'N4', to: 'N7', baseLatencyMs: 18, status: 'active' },
  { id: 'E4-9', from: 'N4', to: 'N9', baseLatencyMs: 17, status: 'active' },

  // Central mesh cross-links
  { id: 'E6-7', from: 'N6', to: 'N7', baseLatencyMs: 15, status: 'active' },
  { id: 'E6-8', from: 'N6', to: 'N8', baseLatencyMs: 14, status: 'active' },
  { id: 'E6-10', from: 'N6', to: 'N10', baseLatencyMs: 16, status: 'active' },
  { id: 'E7-8', from: 'N7', to: 'N8', baseLatencyMs: 11, status: 'active' },
  { id: 'E7-9', from: 'N7', to: 'N9', baseLatencyMs: 16, status: 'active' },
  { id: 'E8-9', from: 'N8', to: 'N9', baseLatencyMs: 15, status: 'active' },
  { id: 'E8-10', from: 'N8', to: 'N10', baseLatencyMs: 19, status: 'active' },
  { id: 'E8-11', from: 'N8', to: 'N11', baseLatencyMs: 15, status: 'active' },
  { id: 'E8-12', from: 'N8', to: 'N12', baseLatencyMs: 22, status: 'active' },
  { id: 'E9-5', from: 'N9', to: 'N5', baseLatencyMs: 14, status: 'active' },
  { id: 'E9-12', from: 'N9', to: 'N12', baseLatencyMs: 18, status: 'active' },

  // Lower mesh links
  { id: 'E10-11', from: 'N10', to: 'N11', baseLatencyMs: 18, status: 'active' },
  { id: 'E11-12', from: 'N11', to: 'N12', baseLatencyMs: 17, status: 'active' },

  // Connections to Exit Gateway N13
  { id: 'E5-13', from: 'N5', to: 'N13', baseLatencyMs: 15, status: 'active' },
  { id: 'E9-13', from: 'N9', to: 'N13', baseLatencyMs: 14, status: 'active' },
  { id: 'E12-13', from: 'N12', to: 'N13', baseLatencyMs: 19, status: 'active' },
];

export function getEdgeBetween(
  edges: NetworkEdge[],
  nodeA: string,
  nodeB: string
): NetworkEdge | undefined {
  return edges.find(
    (e) =>
      (e.from === nodeA && e.to === nodeB) ||
      (e.from === nodeB && e.to === nodeA)
  );
}

/**
 * Shortest path search (Dijkstra) with optional penalty on edges/nodes already used
 * by earlier packets so each packet naturally discovers an independent route.
 */
export function findBestRoute(
  startNodeId: string,
  endNodeId: string,
  nodes: RouterNode[],
  edges: NetworkEdge[],
  penalizedEdges: Set<string> = new Set(),
  penalizedNodes: Set<string> = new Set(),
  forbiddenNodes: Set<string> = new Set()
): string[] | null {
  const activeNodeIds = new Set(
    nodes
      .filter((n) => n.status === 'active' && !forbiddenNodes.has(n.id))
      .map((n) => n.id)
  );
  // Start node must be allowed even if we're rerouting from it
  activeNodeIds.add(startNodeId);

  if (!activeNodeIds.has(endNodeId)) return null;

  const distances: Record<string, number> = {};
  const previous: Record<string, string | null> = {};
  const unvisited = new Set<string>();

  for (const id of activeNodeIds) {
    distances[id] = Infinity;
    previous[id] = null;
    unvisited.add(id);
  }
  distances[startNodeId] = 0;

  while (unvisited.size > 0) {
    let current: string | null = null;
    let smallestDist = Infinity;
    for (const id of unvisited) {
      if (distances[id] < smallestDist) {
        smallestDist = distances[id];
        current = id;
      }
    }

    if (current === null || smallestDist === Infinity) break;
    if (current === endNodeId) break;

    unvisited.delete(current);

    // Find neighbors
    for (const edge of edges) {
      if (edge.status === 'cut') continue;
      let neighbor: string | null = null;
      if (edge.from === current) neighbor = edge.to;
      else if (edge.to === current) neighbor = edge.from;

      if (!neighbor || !unvisited.has(neighbor)) continue;

      let weight = edge.baseLatencyMs;
      if (edge.status === 'congested') weight *= 3.2;
      if (penalizedEdges.has(edge.id)) weight += 45;
      if (penalizedNodes.has(neighbor) && neighbor !== endNodeId) weight += 28;

      const alt = distances[current] + weight;
      if (alt < distances[neighbor]) {
        distances[neighbor] = alt;
        previous[neighbor] = current;
      }
    }
  }

  if (distances[endNodeId] === Infinity) return null;

  const path: string[] = [];
  let curr: string | null = endNodeId;
  while (curr !== null) {
    path.unshift(curr);
    curr = previous[curr];
  }
  return path.length > 1 ? path : null;
}

const PACKET_STYLES: PacketVisualStyle[] = [
  'orange-solid',
  'navy-solid',
  'orange-dashed',
];

const PUZZLE_COLORS = [
  '#FDE68A', // Warm amber tint
  '#DBEAFE', // Crisp sky blue tint
  '#FFEDD5', // Vibrant orange tint
  '#D1FAE5', // Emerald tint
  '#E0E7FF', // Indigo tint
  '#FCE7F3', // Rose tint
];

export function calculateRouteLatency(
  route: string[],
  edges: NetworkEdge[]
): number {
  let sum = 0;
  for (let i = 0; i < route.length - 1; i++) {
    const edge = getEdgeBetween(edges, route[i], route[i + 1]);
    if (edge) {
      sum +=
        edge.status === 'congested'
          ? Math.round(edge.baseLatencyMs * 2.8)
          : edge.baseLatencyMs;
    }
  }
  return sum;
}

function generateChecksum(text: string, index: number): string {
  let hash = 0x4a10 + index * 313;
  for (let i = 0; i < text.length; i++) {
    hash = (hash << 5) - hash + text.charCodeAt(i);
    hash |= 0;
  }
  return '0x' + Math.abs(hash & 0xffff).toString(16).toUpperCase().padStart(4, '0');
}

export function splitMessageIntoChunks(text: string, count: number): string[] {
  const clean = text.trim() || '¡Hola! Así viajan tus datos en Internet con TCP/IP.';
  const chunks: string[] = [];
  const step = Math.ceil(clean.length / count);

  for (let i = 0; i < count; i++) {
    const slice = clean.slice(i * step, (i + 1) * step);
    chunks.push(slice || `[Fin #${i + 1}]`);
  }
  return chunks;
}

const IMAGE_PUZZLE_LABELS: Record<number, string[]> = {
  3: [
    'Cielo y Cumbre Solar (1/3)',
    'Cordillera y Red Central (2/3)',
    'Puerto Digital y Horizonte (3/3)',
  ],
  4: [
    'Cuadrante NO: Satélite (1/4)',
    'Cuadrante NE: Antena (2/4)',
    'Cuadrante SO: Fibra Óptica (3/4)',
    'Cuadrante SE: Ciudad Red (4/4)',
  ],
  6: [
    'Bloque 1: Encabezado SVG',
    'Bloque 2: Cielo Vectorial',
    'Bloque 3: Montañas Izq.',
    'Bloque 4: Montañas Der.',
    'Bloque 5: Red Costera',
    'Bloque 6: Firma CRC',
  ],
};

const DOCUMENT_LABELS: Record<number, string[]> = {
  3: [
    'Cabecera: De/Para y Asunto',
    'Cuerpo: Contenido del Informe',
    'Pie: Firma Digital y Adjunto',
  ],
  4: [
    '1. Metadatos del Correo',
    '2. Párrafo Principal',
    '3. Tabla de Presupuesto',
    '4. Firma Criptográfica',
  ],
  6: [
    'Sec. 1: Destinatarios MIME',
    'Sec. 2: Saludo Formal',
    'Sec. 3: Resumen Ejecutivo',
    'Sec. 4: Diagrama Financiero',
    'Sec. 5: Conclusiones',
    'Sec. 6: Sello SHA-256',
  ],
};

export function createPacketsForSimulation(
  message: string,
  packetCount: number,
  contentMode: ContentMode,
  nodes: RouterNode[],
  edges: NetworkEdge[],
  scenario: ScenarioPreset
): DataPacket[] {
  const textChunks = splitMessageIntoChunks(message, packetCount);
  const usedEdges = new Set<string>();
  const usedNodes = new Set<string>();

  const packets: DataPacket[] = [];
  let currentByteSeq = 1000;

  for (let i = 0; i < packetCount; i++) {
    const packetNum = i + 1;
    const style = PACKET_STYLES[i % PACKET_STYLES.length];

    // Calculate independent route
    let route = findBestRoute(
      'N1',
      'N13',
      nodes,
      edges,
      usedEdges,
      usedNodes
    );

    // Fallback to any available route if all independent edges are saturated
    if (!route) {
      route = findBestRoute('N1', 'N13', nodes, edges);
    }

    const finalRoute = route || ['N1', 'N6', 'N8', 'N9', 'N13'];

    // Mark edges and intermediate nodes so the next packet prefers an independent route
    for (let r = 0; r < finalRoute.length - 1; r++) {
      const edge = getEdgeBetween(edges, finalRoute[r], finalRoute[r + 1]);
      if (edge) usedEdges.add(edge.id);
      if (r > 0) usedNodes.add(finalRoute[r]);
    }

    const payload =
      contentMode === 'text'
        ? textChunks[i]
        : contentMode === 'image_puzzle'
        ? IMAGE_PUZZLE_LABELS[packetCount]?.[i] || `Fragmento Visual #${packetNum}`
        : DOCUMENT_LABELS[packetCount]?.[i] || `Sección Documento #${packetNum}`;

    const byteLen = Math.max(64, payload.length * 16);

    // Adjust speed multiplier per packet to demonstrate out-of-order arrival naturally
    let speedMultiplier = 1;
    if (scenario === 'out_of_order_arrival') {
      // Make Packet 2 fastest, Packet 3 medium, Packet 1 slowest so arrival is 2 -> 3 -> 1
      if (packetNum === 1) speedMultiplier = 0.62;
      else if (packetNum === 2) speedMultiplier = 1.38;
      else if (packetNum === 3) speedMultiplier = 1.05;
      else speedMultiplier = 0.8 + (i % 3) * 0.25;
    } else {
      // Slight natural variance based on path hops
      speedMultiplier = 1.08 - (i % 3) * 0.1;
    }

    packets.push({
      id: packetNum,
      totalPackets: packetCount,
      label: `Paquete ${packetNum}`,
      payloadText: payload,
      puzzlePieceTitle:
        contentMode === 'image_puzzle'
          ? `Pieza #${packetNum}`
          : contentMode === 'document'
          ? `Bloque #${packetNum}`
          : `Frag. #${packetNum}`,
      puzzlePieceColor: PUZZLE_COLORS[i % PUZZLE_COLORS.length],
      style,
      route: finalRoute,
      visitedEdges: [],
      currentHopIndex: 0,
      hopProgress: 0,
      speedMultiplier,
      status: 'queued',
      arrivalRank: null,
      arrivalTimestampMs: null,
      reroutedCount: 0,
      ackSent: false,
      headers: {
        version: 'IPv4',
        sourceIp: '192.168.1.10',
        destIp: '203.0.113.50',
        sourcePort: 54320 + packetNum,
        destPort: 443,
        seqNumber: currentByteSeq,
        ackNumber: 1,
        ttl: 64,
        initialTtl: 64,
        flags: packetNum === packetCount ? ['PSH', 'ACK', 'FIN'] : ['PSH', 'ACK'],
        windowSize: 65535,
        checksum: generateChecksum(payload, packetNum),
        byteLength: byteLen,
      },
    });

    currentByteSeq += byteLen;
  }

  return packets;
}
