import { ReactElement } from "react";
import { BaseEdge, EdgeLabelRenderer, getBezierPath } from "reactflow";

export default function ProbabilityTransition({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  label,
  markerEnd,
}: any): ReactElement {
  const [edgePath, labelX, labelY] = getBezierPath({
    sourceX,
    sourceY,
    targetX,
    targetY,
  });

  const computeLabel = (label: string): ReactElement => {
    let buffer: string[] = [];
    const body = JSON.parse(label);
    buffer.push(`type = ${body.type}`);
    const params = body.params;
    for (const key in params) {
      buffer.push(`${key} = ${params[key]}`);
    }
    return (
      <>
        {buffer.map((b, index) => (
          <p key={index}>{b}</p>
        ))}
      </>
    );
  };

  return (
    <>
      <BaseEdge id={id} path={edgePath} markerEnd={markerEnd} />
      <EdgeLabelRenderer>
        <div
          style={{
            position: "absolute",
            transform: `translate(-50%, -50%) translate(${labelX}px,${labelY}px)`,
            pointerEvents: "all",
            backgroundColor: "white",
            padding: "1px",
            fontSize: "14px",
            fontWeight: 500
          }}
          className="nodrag nopan"
        >
          {computeLabel(label)}
        </div>
      </EdgeLabelRenderer>
    </>
  );
}