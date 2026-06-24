"use client";
import { useState } from "react";

export function SegGroup({ options, value, onChange }) {
  return (
    <div className="seg-group">
      {options.map(o => (
        <button key={o} className={`seg-btn ${value === o ? "active" : ""}`} onClick={() => onChange(o)} type="button">
          {o}
        </button>
      ))}
    </div>
  );
}

export function FormGroup({ label, children }) {
  return (
    <div className="mb-4">
      {label && <label className="label">{label}</label>}
      {children}
    </div>
  );
}

export function ScenarioSelect({ scenarios, onSelect }) {
  return (
    <select className="select" onChange={e => { if (e.target.value) { onSelect(e.target.value); e.target.value = ""; } }}>
      <option value="">— Load example scenario —</option>
      {scenarios.map(s => <option key={s.label} value={s.value}>{s.label}</option>)}
    </select>
  );
}
