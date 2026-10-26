# Emulador Interactivo: El Viaje de los Datos (TCP/IP)

Un simulador educativo e interactivo que transforma la infografía *"¿Qué pasa realmente cuando envías un mensaje? — El Viaje de los Datos (TCP/IP)"* en un laboratorio visual en vivo, donde el usuario observa y manipula cómo un mensaje o imagen se divide en paquetes, viaja por rutas independientes en una red mallada y se reensambla automáticamente en el destino.

## User Review & Critical Decisions

> [!IMPORTANT]
> A continuación se resumen las decisiones confirmadas a partir de tus respuestas para guiar la construcción del emulador:

- **Profostęp / Profundidad Técnica Confirmada**: **Visual e intuitivo con detalles técnicos opcionales**. La interfaz principal priorizará la claridad visual de las tres etapas de la infografía (*1. Mensaje dividido*, *2. Rutas independientes*, *3. Reensamblado automático*), incorporando un panel/inspector desplegable para ver las cabeceras TCP/IP reales (IP origen/destino, número de secuencia `SEQ`, acuse de recibo `ACK`, `TTL` y *checksum*) al hacer clic en cualquier paquete.
- **Escenarios Interactivos Confirmados**:
  - **Corte de nodos y enlaces en tiempo real**: El usuario podrá hacer clic sobre cualquier router (nodo) o cable (enlace) de la malla central para desactivarlo o simular congestión, viendo cómo el algoritmo de enrutamiento recalcula caminos alternativos dinámicamente para cada paquete.
  - **Llegada desordenada y reordenamiento automático (TCP)**: Los paquetes viajarán por rutas de distinta longitud y latencia, llegando fuera de orden al equipo receptor (por ejemplo, llega primero el paquete `[2]`, luego el `[3]` y finalmente el `[1]`), mostrando el *buffer* de recepción TCP reordenándolos como piezas de rompecabezas antes de entregar el mensaje final.
- **Contenido de Envío Confirmado**: **Mensajes de texto personalizados y ejemplos visuales (imagen/postal y documento)**. El usuario podrá escribir cualquier texto propio o elegir plantillas visuales (como una imagen tipo rompecabezas o un sobre digital) y ajustar en cuántos paquetes desea fragmentarlo.

---

## 1. Overview & Core Concept

- **Qué Hace**: Permite experimentar en tiempo real qué sucede desde que presionas *"Enviar"* en una computadora hasta que el mensaje aparece en otra. El sistema divide visualmente el contenido en paquetes numerados, los lanza a través de una topología de red con múltiples nodos intermedios, permite sabotear o alterar la red en pleno vuelo, y demuestra cómo el protocolo IP se encarga de encontrar caminos independientes mientras el protocolo TCP garantiza el orden y la integridad en el reensamblado.
- **Audiencia Objetivo**: Estudiantes, docentes y curiosos de la tecnología que buscan comprender de forma práctica y memorable cómo funciona Internet y la pila TCP/IP sin perderse en bloques de texto abstractos.
- **Valor Principal**: Convierte un diagrama estático en una simulación viva con control de reproducción (*Play, Pausa, Paso a Paso, Velocidad*) y experimentación directa sobre fallos de red y desorden de paquetes.

---

## 2. User Experience & Visual Design

### Flujos de Usuario Principales
1. **Fase 1 — Origen y Fragmentación (Mensaje dividido)**:
   - En la estación emisora (izquierda), el usuario escribe un mensaje personalizado o selecciona un recurso visual (ej. *Mensaje de Texto*, *Imagen en Mosaico*, *Archivo Confidencial*).
   - Al ajustar el control de tamaño de fragmento (MTU simulado) o presionar **Fragmentar y Enviar**, el sobre/documento se divide animadamente en bloques numerados (`Paquete 1`, `Paquete 2`, `Paquete 3`...) codificados por color según la infografía original (naranja vibrante, azul marino profundo y naranja punteado).
2. **Fase 2 — Malla de Enrutamiento (Rutas independientes)**:
   - En el lienzo central interactivo, los paquetes ingresan a una red de nodos (routers). Cada paquete toma una ruta independiente calculada dinámicamente según el estado y latencia de los enlaces.
   - **Interacción en la Malla**: El usuario puede hacer clic en cualquier nodo o enlace para **Cortar / Restaurar** el paso o añadir latencia. Si un enlace se corta, los paquetes en tránsito recalculan su ruta instantáneamente (enrutamiento dinámico IP).
3. **Fase 3 — Destino y Buffer TCP (Reensamblado automático)**:
   - En la estación receptora (derecha), los paquetes llegan en el orden en que completan sus rutas (frecuentemente desordenados, ej. `2 → 3 → 1`).
   - El **Buffer de Secuencia TCP** muestra los casilleros numerados esperando cada pieza, envía confirmaciones (`ACK`) de regreso y, una vez completos, encaja visualmente las piezas del rompecabezas para reconstruir el mensaje o imagen original.
4. **Modo Explicación Guiada e Inspector Técnico**:
   - Un narrador contextual en la parte inferior explica en lenguaje claro qué está ocurriendo en el instante actual de la simulación, acompañado de una vista comparativa con la infografía original y un **Inspector de Paquete TCP/IP** al seleccionar cualquier paquete en tránsito.

### Identidad Visual y Tema
- **Dirección Estética**: *Laboratorio Educativo Editorial* inspirado directamente en la paleta y el lenguaje gráfico de la infografía adjunta, siguiendo la arquitectura de **Sandbox de Dos Zonas** (Escenario Interactivo Principal + Panel de Control y Conceptos).
- **Paleta de Colores (Regla 60-30-10)**:
  - **60% Lienzo Dominante**: Fondo claro de papel técnico limpio (`#F8FAFC`) con cuadrícula sutil para el mapa de red y superficies blancas (`#FFFFFF`) para las estaciones de cómputo.
  - **30% Estructura y Tipografía**: Azul Marino Profundo (`#0B213F` / `#0F172A`, idéntico a los títulos e ilustraciones de la infografía) para textos principales, bordes de dispositivos y rutas secundarias; gris pizarra (`#64748B`) para enlaces de red en reposo.
  - **10% Acentos Semánticos**:
    - **Naranja Paquete / Ruta Activa (`#F97316` / `#EA580C`)**: Fiel al efecto de fragmentación del sobre y a las rutas destacadas de la imagen original.
    - **Verde Confirmación (`#059669`)**: Estado de reensamblado completo y recepción de `ACK` (acompañado siempre de etiqueta explícita `● COMPLETADO`).
    - **Rojo Corte de Red (`#DC2626`)**: Nodos o enlaces cortados manualmente por el usuario (con ícono `✕ CORTADO`).
- **Tipografía y Jerarquía**:
  - *Display / Títulos*: `Plus Jakarta Sans` (700/800) para encabezados contundentes y numeración de etapas.
  - *Cuerpo y Explicaciones*: `DM Sans` (400/500) para lecturas claras y fluidas.
  - *Telemetría y Cabeceras TCP/IP*: `JetBrains Mono` con números tabulares (`tabular-nums`) para direcciones IP, números de secuencia (`SEQ #001`), tiempos en milisegundos (`ms`) y conteo de saltos (`TTL`).
- **Estructura de Navegación (Top Bar Contract)**:
  - Barra superior limpia en una sola fila con tres zonas: marca a la izquierda (`TCP/IP Visual Lab`), enlaces de navegación rápidos al centro (`Simulador`, `Etapas del Proceso`, `Inspector TCP/IP`, `Infografía Base`) y botón de acción principal a la derecha (`Iniciar Simulación`).

---

## 3. Key Product Decisions & Trade-Offs

- **Decisión 1: Simulación Basada en Grafo Real con Enrutamiento Dinámico vs. Animación Fija**
  - *Enfoque Elegido*: Motor de grafo real en el cliente donde cada nodo y enlace tiene peso (latencia) y estado (activo/cortado), calculando caminos óptimos multipaso (variante de Dijkstra con balanceo por paquete para forzar rutas independientes).
  - *Por Qué*: Permite que el usuario corte cualquier nodo o enlace libremente y observe cómo los paquetes cambian de ruta de verdad, o cómo las diferencias de saltos provocan que el Paquete 3 llegue antes que el Paquete 1.
- **Decisión 2: Modos de Reproducción (Tiempo Real + Paso a Paso)**
  - *Enfoque Elegido*: Controles de reproducción completos (*Reproducir/Pausar*, *Avanzar 1 Paso*, *Velocidad 0.5x / 1x / 2x* y botón rápido *"Forzar Desorden"* o *"Cortar Ruta Central"*).
  - *Por Qué*: En el modo *Paso a Paso*, un estudiante o profesor puede detener los paquetes a mitad de la malla de routers, hacer clic en el Paquete 2 para abrir su cabecera TCP/IP, explicar por qué tomó la ruta superior y luego reanudar el viaje.

---

## 4. Technical Architecture & Data Strategy *(Technical Reference)*

### Diagrama de Arquitectura y Componentes

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                             TCP/IP VISUAL LAB                               │
│  [Header: Brand Wordmark] ── [Nav: Simulador · Etapas · Inspector · Guía]   │
├─────────────────────────────────────────────────────────────────────────────┤
│  BARRA DE ESCENARIOS Y CONTROLES DE SIMULACIÓN                              │
│  [Play/Pausa] [Paso a Paso] [Velocidad] [Preset: Rutas Normales / Desorden] │
├───────────────────┬─────────────────────────────────────┬───────────────────┤
│ 1. EMISOR (Host A)│     2. MALLA DE RED IP (Routers)    │3. RECEPTOR(Host B)│
│                   │                                     │                   │
│ ┌───────────────┐ │        (R1)───────────(R4)          │ ┌───────────────┐ │
│ │ Entrada Texto │ │       /    \         /    \         │ │ Buffer de     │ │
│ │ o Imagen      │ │   (In)──(R2)───[X]──(R5)──(Out)     │ │ Reordenamiento│ │
│ └───────┬───────┘ │       \    /         \    /         │ │ [1] [2] [3]   │ │
│         ▼         │        (R3)───────────(R6)          │ └───────┬───────┘ │
│ ┌───────────────┐ │                                     │         ▼         │
│ │ Fragmentador  │ │  • Clic en Nodo/Enlace: Cortar/Act  │ ┌───────────────┐ │
│ │ TCP [1][2][3] │ │  • Clic en Paquete: Inspeccionar    │ │ Puzzle/Mensaje│ │
│ └───────────────┘ │                                     │ │ Reensamblado  │ │
├───────────────────┴─────────────────────────────────────┴───────────────────┤
│  PANEL INFERIOR: NARRADOR DEL PROCESO + INSPECTOR DE CABECERA TCP/IP        │
│  [Explicación de Etapa Actual]  │  [IP Orig/Dest · SEQ · ACK · TTL · Datos] │
└─────────────────────────────────┴───────────────────────────────────────────┘
```

### Modelo de Datos y Estado
- **Topología de Red (`NetworkGraph`)**:
  - `nodes`: Lista de routers intermedios (`id`, `label`, coordenadas `x/y`, `status: 'active' | 'offline'`).
  - `edges`: Enlaces entre routers (`id`, `from`, `to`, `latencyMs`, `status: 'active' | 'cut'`).
- **Paquetes de Datos (`DataPacket`)**:
  - `id` y `sequenceNumber` (`1..N`): Orden lógico de fragmentación en el origen.
  - `payload`: Fragmento de texto o porción visual de la imagen/documento.
  - `colorTheme`: Estilo visual fiel a la infografía (`orange-solid`, `navy-solid`, `orange-dashed`).
  - `route`: Lista de nodos calculada de forma independiente para cada paquete.
  - `state`: `'queued' | 'in_transit' | 'arrived_out_of_order' | 'reassembled' | 'rerouting'`.
  - `headers`: Metadatos técnicos (`sourceIp: '192.168.1.10'`, `destIp: '203.0.113.50'`, `seq`, `ack`, `ttl`, `checksum`).

### Mapeo de Interacciones y Transiciones de Estado
- **Edición de Mensaje / Selección de Plantilla**: Actualiza instantáneamente la vista previa del documento/sobre en la laptop de origen y pre-calcula los fragmentos según la cantidad de paquetes elegida (de 3 a 6 paquetes).
- **Clic en Nodo o Enlace de la Malla**: Alterna el estado entre activo y cortado (`cut`/`offline`). Si hay paquetes en vuelo cuya ruta pasa por el elemento cortado, el motor ejecuta el recálculo de ruta desde el nodo actual del paquete y muestra una notificación visual de *Reenrutamiento IP Dinámico*.
- **Simulación de Llegada Desordenada**: Asigna rutas con diferente número de saltos o latencia a cada paquete (ej. el Paquete 1 toma una ruta larga de 4 saltos mientras el Paquete 2 toma una ruta directa de 2 saltos). Al llegar el Paquete 2 primero al Host B, el *Buffer TCP* lo coloca en la ranura `#2` en estado *"Esperando Paquete #1"* antes de ejecutar la animación final de ensamblaje tipo rompecabezas.
- **Inspección de Paquete**: Hacer clic sobre cualquier paquete (en el origen, en la malla o en el destino) abre sus detalles de cabecera TCP y cabecera IP sin perder el estado de la simulación.
