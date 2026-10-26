export type PacketVisualStyle = 'orange-solid' | 'navy-solid' | 'orange-dashed';

export type ContentMode = 'text' | 'image_puzzle' | 'document';

export type SimulationStage =
  | 'idle'
  | 'fragmenting'
  | 'routing'
  | 'reassembling'
  | 'completed';

export type ScenarioPreset =
  | 'independent_routes'
  | 'out_of_order_arrival'
  | 'node_failure_reroute';

export interface RouterNode {
  id: string;
  label: string;
  x: number; // Percentage 0-100 in SVG coordinate space (600x440)
  y: number;
  role: 'gateway_in' | 'core' | 'gateway_out';
  status: 'active' | 'offline';
}

export interface NetworkEdge {
  id: string;
  from: string;
  to: string;
  baseLatencyMs: number;
  status: 'active' | 'cut' | 'congested';
}

export interface TcpIpHeaderInfo {
  version: 'IPv4';
  sourceIp: string;
  destIp: string;
  sourcePort: number;
  destPort: number;
  seqNumber: number;
  ackNumber: number;
  ttl: number;
  initialTtl: number;
  flags: string[];
  windowSize: number;
  checksum: string;
  byteLength: number;
}

export interface DataPacket {
  id: number; // 1, 2, 3...
  totalPackets: number;
  label: string;
  payloadText: string;
  puzzlePieceTitle: string;
  puzzlePieceColor: string;
  style: PacketVisualStyle;
  route: string[]; // Node IDs e.g. ['N1', 'N2', 'N5', 'N9', 'N12']
  visitedEdges: string[];
  currentHopIndex: number;
  hopProgress: number; // 0 to 1 between route[currentHopIndex] and route[currentHopIndex + 1]
  speedMultiplier: number;
  status:
    | 'queued'
    | 'in_transit'
    | 'arrived_waiting'
    | 'reassembled'
    | 'unreachable';
  arrivalRank: number | null; // 1st, 2nd, 3rd to arrive at destination
  arrivalTimestampMs: number | null;
  reroutedCount: number;
  lastRerouteReason?: string;
  ackSent: boolean;
  headers: TcpIpHeaderInfo;
}

export interface SimulationLogEntry {
  id: string;
  timestamp: string;
  layer: 'APLICACIÓN' | 'TCP (Transporte)' | 'IP (Red)' | 'REENSAMBLADO';
  title: string;
  detail: string;
  type: 'info' | 'route' | 'warning' | 'success';
}
