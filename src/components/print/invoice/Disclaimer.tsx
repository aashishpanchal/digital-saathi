import React from "react";

export default function Disclaimer(props: { text: Array<string> }) {
  return (
    <div className="text-xs">
      <p>Disclaimer</p>
      <ul className="list-disc ml-10">
        {props.text.map((s, index) => (
          <li key={index.toString()}>{s}</li>
        ))}
      </ul>
    </div>
  );
}
