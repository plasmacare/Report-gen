
import React, { useMemo, useState } from "react";
import { createRoot } from "react-dom/client";
import { jsPDF } from "jspdf";
import { TESTS } from "./tests";
import "./styles.css";

const CATEGORIES = ["All", ...Array.from(new Set(TESTS.map(t => t.category)))];

const emptyPatient = {
  name: "", age: "", sex: "M", regNo: "", referredBy: "",
  registeredOn: "", collectedOn: "", receivedOn: "", reportedOn: ""
};

function nowText() {
  return new Date().toLocaleString("en-IN", { hour12: true });
}

function App() {
  const [category, setCategory] = useState("All");
  const [search, setSearch] = useState("");
  const [selectedId, setSelectedId] = useState(TESTS[0]?.id || "");
  const [patient, setPatient] = useState(emptyPatient);
  const [rows, setRows] = useState(TESTS[0]?.rows || []);
  const [notes, setNotes] = useState("");
  const [lab, setLab] = useState({
    name: "PLASMA CARE",
    address: "Diagnostic Laboratory & Healthcare Services",
    phone: "",
    pathologist: "Dr. A. K. Asthana",
    designation: "MBBS, MD Pathologist",
    labIncharge: "Mr. Sachin Sharma",
  });

  const filtered = useMemo(() => TESTS.filter(t =>
    (category === "All" || t.category === category) &&
    t.name.toLowerCase().includes(search.toLowerCase())
  ), [category, search]);

  const selected = TESTS.find(t => t.id === selectedId) || TESTS[0];

  function chooseTest(id) {
    const t = TESTS.find(x => x.id === id);
    setSelectedId(id);
    setRows((t?.rows || []).map(r => [...r]));
    setNotes("");
  }

  function setP(k, v) { setPatient(p => ({...p, [k]: v})); }
  function setRow(i, col, v) {
    setRows(rs => rs.map((r, idx) => idx === i ? r.map((c, j) => j === col ? v : c) : r));
  }

  function addRow() { setRows(rs => [...rs, ["NEW TEST / PARAMETER", "", "", ""]]); }
  function removeRow(i) { setRows(rs => rs.filter((_, idx) => idx !== i)); }

  function reset() {
    setPatient(emptyPatient);
    setRows((selected?.rows || []).map(r => [...r]));
    setNotes("");
  }

  function downloadPDF() {
    const doc = new jsPDF({ unit: "mm", format: "a4" });
    const left = 15, right = 195;
    let y = 15;

    doc.setFont("helvetica", "bold");
    doc.setFontSize(16);
    doc.text(lab.name || "PLASMA CARE", left, y);
    doc.setFontSize(9);
    doc.setFont("helvetica", "normal");
    doc.text(lab.address || "", left, y + 6);
    if (lab.phone) doc.text("Phone: " + lab.phone, left, y + 11);

    doc.setDrawColor(70);
    doc.line(left, y + 15, right, y + 15);
    y += 22;

    doc.setFontSize(9);
    const info = [
      ["Patient", patient.name || "—", "Reg. No.", patient.regNo || "—"],
      ["Age / Sex", `${patient.age || "—"} / ${patient.sex || "—"}`, "Registered", patient.registeredOn || "—"],
      ["Referred by", patient.referredBy || "—", "Collected", patient.collectedOn || "—"],
      ["Received", patient.receivedOn || "—", "Reported", patient.reportedOn || "—"],
    ];
    info.forEach(r => {
      doc.setFont("helvetica", "bold"); doc.text(r[0], left, y);
      doc.setFont("helvetica", "normal"); doc.text(r[1], left + 28, y);
      doc.setFont("helvetica", "bold"); doc.text(r[2], 112, y);
      doc.setFont("helvetica", "normal"); doc.text(r[3], 142, y);
      y += 6;
    });

    y += 4;
    doc.setFont("helvetica", "bold");
    doc.setFontSize(12);
    doc.text(selected?.category?.toUpperCase() || "LABORATORY", 105, y, {align:"center"});
    y += 7;
    doc.setFontSize(11);
    doc.text(selected?.name?.toUpperCase() || "LAB REPORT", 105, y, {align:"center"});
    y += 8;

    // table header
    const cols = [left, 105, 135, 160, right];
    doc.setFontSize(8);
    doc.setFillColor(240, 240, 240);
    doc.rect(left, y-5, right-left, 7, "F");
    doc.text("TEST / PARAMETER", left+2, y);
    doc.text("VALUE", 107, y);
    doc.text("UNIT", 137, y);
    doc.text("REFERENCE", 162, y);
    y += 5;

    doc.setFont("helvetica", "normal");
    rows.forEach(r => {
      if (y > 270) { doc.addPage(); y = 18; }
      doc.line(left, y+2, right, y+2);
      doc.text(String(r[0] || ""), left+2, y);
      doc.text(String(r[1] || ""), 107, y);
      doc.text(String(r[2] || ""), 137, y);
      doc.text(String(r[3] || ""), 162, y);
      y += 7;
    });

    if (notes.trim()) {
      y += 7;
      doc.setFont("helvetica", "bold"); doc.text("Clinical Notes / Comments", left, y);
      y += 5;
      doc.setFont("helvetica", "normal");
      const lines = doc.splitTextToSize(notes, right-left);
      doc.text(lines, left, y);
      y += lines.length * 4;
    }

    if (y > 260) { doc.addPage(); y = 270; } else y = 270;
    doc.line(left, y-7, right, y-7);
    doc.setFont("helvetica", "normal");
    doc.text(lab.labIncharge || "Lab Incharge", left, y);
    doc.text(lab.pathologist || "Pathologist", 150, y);
    doc.setFontSize(8);
    doc.text(lab.designation || "", 150, y+5);
    doc.text("~~~ End of report ~~~", 105, y+12, {align:"center"});

    const safeName = (patient.name || "Patient").replace(/[^a-z0-9]+/gi, "_");
    doc.save(`${safeName}_${selected?.id || "report"}.pdf`);
  }

  return (
    <div className="app">
      <header className="topbar">
        <div>
          <div className="brand">PLASMA CARE</div>
          <div className="sub">Laboratory Report Generator</div>
        </div>
        <div className="top-actions">
          <button className="ghost" onClick={reset}>Reset</button>
          <button className="primary" onClick={downloadPDF}>Generate PDF</button>
        </div>
      </header>

      <div className="layout">
        <aside className="sidebar">
          <input className="search" placeholder="Search test..." value={search} onChange={e => setSearch(e.target.value)} />
          <div className="section-title">Categories</div>
          <div className="cats">
            {CATEGORIES.map(c => <button key={c} className={category===c ? "cat active":"cat"} onClick={()=>setCategory(c)}>{c}</button>)}
          </div>
          <div className="section-title tests-title">Tests ({filtered.length})</div>
          <div className="test-list">
            {filtered.map(t => <button key={t.id} className={selectedId===t.id ? "test active":"test"} onClick={()=>chooseTest(t.id)}>
              <span>{t.name}</span><small>{t.category}</small>
            </button>)}
          </div>
        </aside>

        <main className="main">
          <div className="page-title">
            <div><h1>{selected?.name || "Report"}</h1><p>{selected?.category} • Template-based report</p></div>
            <span className="badge">Plasma Care</span>
          </div>

          <section className="card">
            <h2>Laboratory Details</h2>
            <div className="grid four">
              <label>Lab Name<input value={lab.name} onChange={e=>setLab({...lab,name:e.target.value})}/></label>
              <label>Address / Subtitle<input value={lab.address} onChange={e=>setLab({...lab,address:e.target.value})}/></label>
              <label>Phone<input value={lab.phone} onChange={e=>setLab({...lab,phone:e.target.value})}/></label>
              <label>Lab Incharge<input value={lab.labIncharge} onChange={e=>setLab({...lab,labIncharge:e.target.value})}/></label>
              <label>Pathologist<input value={lab.pathologist} onChange={e=>setLab({...lab,pathologist:e.target.value})}/></label>
              <label>Designation<input value={lab.designation} onChange={e=>setLab({...lab,designation:e.target.value})}/></label>
            </div>
          </section>

          <section className="card">
            <h2>Patient / Registration Details</h2>
            <div className="grid four">
              <label>Patient Name<input value={patient.name} onChange={e=>setP("name",e.target.value)}/></label>
              <label>Age<input value={patient.age} onChange={e=>setP("age",e.target.value)}/></label>
              <label>Sex<select value={patient.sex} onChange={e=>setP("sex",e.target.value)}><option>M</option><option>F</option><option>Other</option></select></label>
              <label>Reg. No.<input value={patient.regNo} onChange={e=>setP("regNo",e.target.value)}/></label>
              <label>Referred By<input value={patient.referredBy} onChange={e=>setP("referredBy",e.target.value)}/></label>
              <label>Registered On<input value={patient.registeredOn} onChange={e=>setP("registeredOn",e.target.value)} placeholder={nowText()}/></label>
              <label>Collected On<input value={patient.collectedOn} onChange={e=>setP("collectedOn",e.target.value)}/></label>
              <label>Reported On<input value={patient.reportedOn} onChange={e=>setP("reportedOn",e.target.value)}/></label>
            </div>
          </section>

          <section className="card">
            <div className="card-head"><div><h2>Report Values</h2><p>Edit values and reference ranges before generating.</p></div><button className="secondary" onClick={addRow}>+ Add Parameter</button></div>
            <div className="table-wrap">
              <table><thead><tr><th>Test / Parameter</th><th>Value</th><th>Unit</th><th>Reference</th><th></th></tr></thead>
              <tbody>
                {rows.map((r,i)=><tr key={i}>
                  <td><input value={r[0]} onChange={e=>setRow(i,0,e.target.value)}/></td>
                  <td><input value={r[1]} onChange={e=>setRow(i,1,e.target.value)}/></td>
                  <td><input value={r[2]} onChange={e=>setRow(i,2,e.target.value)}/></td>
                  <td><input value={r[3]} onChange={e=>setRow(i,3,e.target.value)}/></td>
                  <td><button className="icon" onClick={()=>removeRow(i)}>×</button></td>
                </tr>)}
              </tbody></table>
            </div>
          </section>

          <section className="card">
            <h2>Clinical Notes / Comments</h2>
            <textarea rows="5" value={notes} onChange={e=>setNotes(e.target.value)} placeholder="Optional notes, interpretation, clinical comments..."></textarea>
          </section>

          <div className="footer-actions">
            <button className="ghost" onClick={reset}>Clear Form</button>
            <button className="primary large" onClick={downloadPDF}>Generate & Download Report PDF</button>
          </div>
        </main>
      </div>
    </div>
  );
}

createRoot(document.getElementById("root")).render(<App />);
