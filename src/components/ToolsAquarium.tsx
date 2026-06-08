import { useEffect, useRef, useState } from "react";
import { ToolItem } from "../types";

interface ToolsAquariumProps {
  tools: ToolItem[];
}

export function ToolsAquarium({ tools }: ToolsAquariumProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const animationRef = useRef<number | null>(null);
  
  // State to force occasional rerenders if the number of tools changes or container sizes change
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const statesRef = useRef<{
    [id: string]: {
      x: number;
      y: number;
      dx: number;
      dy: number;
      width: number;
      height: number;
    };
  }>({});

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const updateDimensions = () => {
      setDimensions({
        width: container.clientWidth,
        height: container.clientHeight,
      });
    };

    updateDimensions();

    const resizeObserver = new ResizeObserver(() => {
      updateDimensions();
    });
    resizeObserver.observe(container);

    return () => {
      resizeObserver.disconnect();
    };
  }, []);

  useEffect(() => {
    const container = containerRef.current;
    if (!container || dimensions.width === 0 || dimensions.height === 0) return;

    const speed = 1.2;
    const itemSize = 55;

    // Initialize state for tools that don't have one yet
    tools.forEach((tool) => {
      if (!statesRef.current[tool.id]) {
        statesRef.current[tool.id] = {
          x: Math.random() * (dimensions.width - itemSize),
          y: Math.random() * (dimensions.height - itemSize),
          dx: (Math.random() > 0.5 ? 1 : -1) * speed,
          dy: (Math.random() > 0.5 ? 1 : -1) * speed,
          width: itemSize,
          height: itemSize,
        };
      }
    });

    // Clean up states for tools that were deleted
    const toolIds = new Set(tools.map((t) => t.id));
    Object.keys(statesRef.current).forEach((id) => {
      if (!toolIds.has(id)) {
        delete statesRef.current[id];
      }
    });

    const animate = () => {
      if (!containerRef.current) return;
      const currentWidth = containerRef.current.clientWidth;
      const currentHeight = containerRef.current.clientHeight;

      // 1. Move each item
      tools.forEach((tool) => {
        const state = statesRef.current[tool.id];
        if (!state) return;
        state.x += state.dx;
        state.y += state.dy;
      });

      // 2. Resolve pairwise circle collisions (Prevents sticking and overlapping)
      for (let i = 0; i < tools.length; i++) {
        for (let j = i + 1; j < tools.length; j++) {
          const t1 = tools[i];
          const t2 = tools[j];
          const s1 = statesRef.current[t1.id];
          const s2 = statesRef.current[t2.id];
          if (!s1 || !s2) continue;

          // Radius is itemSize / 2
          const r = itemSize / 2;
          const c1x = s1.x + r;
          const c1y = s1.y + r;
          const c2x = s2.x + r;
          const c2y = s2.y + r;

          const dx = c2x - c1x;
          const dy = c2y - c1y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          const minDist = itemSize; // Minimum distance threshold (full diameter of 55px)

          if (dist < minDist) {
            // We have overlap! Resolve overlap by pushing them apart
            const overlap = minDist - dist;
            
            let pushX = 1;
            let pushY = 0;
            if (dist > 0) {
              pushX = dx / dist;
              pushY = dy / dist;
            }

            // Distribute correction equally
            const correctionX = pushX * (overlap / 2);
            const correctionY = pushY * (overlap / 2);

            s1.x -= correctionX;
            s1.y -= correctionY;
            s2.x += correctionX;
            s2.y += correctionY;

            // 2D Elastic Collision velocity reaction
            // Relative velocity
            const rvx = s1.dx - s2.dx;
            const rvy = s1.dy - s2.dy;

            // Calculate relative velocity along the collision normal
            const velAlongNormal = rvx * pushX + rvy * pushY;

            // Only resolve if velocities are directed towards each other
            if (velAlongNormal > 0) {
              // Elastic response impulse scalar
              const impulse = velAlongNormal;

              s1.dx -= impulse * pushX;
              s1.dy -= impulse * pushY;
              s2.dx += impulse * pushX;
              s2.dy += impulse * pushY;
            }
          }
        }
      }

      // 3. Bounce off walls and update DOM elements
      tools.forEach((tool) => {
        const state = statesRef.current[tool.id];
        if (!state) return;

        const maxX = currentWidth - state.width;
        const maxY = currentHeight - state.height;

        // Bounce walls & clamp positions
        if (state.x <= 0) {
          state.dx = Math.abs(state.dx);
          state.x = 0;
        } else if (state.x >= maxX) {
          state.dx = -Math.abs(state.dx);
          state.x = maxX;
        }

        if (state.y <= 0) {
          state.dy = Math.abs(state.dy);
          state.y = 0;
        } else if (state.y >= maxY) {
          state.dy = -Math.abs(state.dy);
          state.y = maxY;
        }

        // Apply style to DOM element directly for high performance
        const el = document.getElementById(`tool-logo-${tool.id}`);
        if (el) {
          el.style.left = `${state.x}px`;
          el.style.top = `${state.y}px`;
        }
      });

      animationRef.current = requestAnimationFrame(animate);
    };

    animationRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [tools, dimensions]);

  return (
    <div
      ref={containerRef}
      id="toolsAquarium"
      className="tools-aquarium-box relative w-full h-[220px] rounded-xl overflow-hidden border border-[#00e5ff] bg-black/40 shadow-[0_0_15px_rgba(0,229,255,0.1)] mt-4 p-4"
    >
      {tools.map((tool) => (
        <img
          key={tool.id}
          id={`tool-logo-${tool.id}`}
          src={tool.logo}
          alt={tool.name}
          title={tool.name}
          className="tool-logo absolute w-[55px] h-[55px] rounded-full object-contain bg-white border-2 border-[#00e5ff] shadow-[0_0_10px_rgba(0,229,255,0.5)] cursor-pointer transition-transform duration-200 ease-out hover:scale-125 hover:z-10 select-none p-2"
          style={{
            left: `${statesRef.current[tool.id]?.x || 0}px`,
            top: `${statesRef.current[tool.id]?.y || 0}px`,
          }}
          referrerPolicy="no-referrer"
        />
      ))}
      {tools.length === 0 && (
        <div className="flex items-center justify-center h-full text-zinc-500 font-mono text-sm">
          No tools in the aquarium. Add some!
        </div>
      )}
    </div>
  );
}
