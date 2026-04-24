import React, { useState, useEffect, useCallback } from "react";
import studentService from "../services/studentService";
import StudentForm from "./StudentForm";

const courseColors = {
  "B.Tech CSE": { bg: "#eff6ff", color: "#1d4ed8" },
  "B.Tech IT":  { bg: "#f0fdf4", color: "#15803d" },
  "BCA":        { bg: "#fff7ed", color: "#c2410c" },
  "MCA":        { bg: "#faf5ff", color: "#7e22ce" },
  "MBA":        { bg: "#fdf2f8", color: "#be185d" },
  "B.Sc":       { bg: "#ecfdf5", color: "#065f46" },
  "M.Tech":     { bg: "#fefce8", color: "#a16207" },
};

// Toast Notification Component
const Toast = ({ message, type, onClose }) => (
  <div style={{
    position: "fixed", top: "24px", right: "24px", zIndex: 1000,
    background: type === "success" ? "linear-gradient(135deg, rgba(16,185,129,0.95) 0%, rgba(5,150,105,0.95) 100%)" :
              type === "error" ? "linear-gradient(135deg, rgba(239,68,68,0.95) 0%, rgba(220,38,38,0.95) 100%)" :
              "linear-gradient(135deg, rgba(59,130,246,0.95) 0%, rgba(37,99,235,0.95) 100%)",
    backdropFilter: "blur(20px)", border: "1px solid rgba(255,255,255,0.2)",
    color: "white", padding: "16px 24px", borderRadius: "16px",
    boxShadow: "0 12px 40px rgba(0,0,0,0.3)", display: "flex", alignItems: "center", gap: "12px",
    animation: "slideIn 0.4s cubic-bezier(0.4, 0, 0.2, 1)", fontWeight: 600, fontSize: "15px",
    WebkitBackdropFilter: "blur(20px)"
  }}>
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
      {type === "success" ? (
        <>
          <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
          <polyline points="22 4 12 14.01 9 11.01"/>
        </>
      ) : type === "error" ? (
        <>
          <circle cx="12" cy="12" r="10"/>
          <line x1="15" y1="9" x2="9" y2="15"/>
          <line x1="9" y1="9" x2="15" y2="15"/>
        </>
      ) : (
        <>
          <circle cx="12" cy="12" r="10"/>
          <line x1="12" y1="8" x2="12" y2="12"/>
          <line x1="12" y1="16" x2="12.01" y2="16"/>
        </>
      )}
    </svg>
    {message}
    <button onClick={onClose} style={{
      background: "none", border: "none", color: "white", cursor: "pointer",
      marginLeft: "12px", opacity: 0.8, fontSize: "20px", lineHeight: 1,
      transition: "all 0.2s ease"
    }}
    onMouseEnter={e => e.currentTarget.style.opacity = "1"}
    onMouseLeave={e => e.currentTarget.style.opacity = "0.8"}>×</button>
  </div>
);

// Skeleton Loading Component
const SkeletonRow = () => (
  <tr>
    {Array(7).fill(0).map((_, i) => (
      <td key={i} style={{ padding: "14px 16px" }}>
        <div style={{
          height: i === 0 ? "38px" : "16px", background: "linear-gradient(90deg, #f1f5f9 25%, #e2e8f0 50%, #f1f5f9 75%)",
          backgroundSize: "200% 100%", animation: "shimmer 1.5s infinite", borderRadius: i === 0 ? "50%" : "4px"
        }} />
      </td>
    ))}
  </tr>
);

// Delete Confirmation Modal
const DeleteModal = ({ student, onConfirm, onCancel }) => (
  <div style={{
    position: "fixed", top: 0, left: 0, right: 0, bottom: 0,
    background: "rgba(0,0,0,0.5)", display: "flex", alignItems: "center", justifyContent: "center",
    zIndex: 1000, animation: "fadeIn 0.2s ease-out"
  }}>
    <div style={{
      background: "white", borderRadius: "16px", padding: "24px", maxWidth: "400px", width: "90%",
      boxShadow: "0 20px 60px rgba(0,0,0,0.3)", animation: "scaleIn 0.2s ease-out"
    }}>
      <div style={{ textAlign: "center", marginBottom: "20px" }}>
        <div style={{
          width: "60px", height: "60px", background: "linear-gradient(135deg, #fef2f2 0%, #fecaca 100%)",
          borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px"
        }}>
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#dc2626" strokeWidth="2">
            <path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/>
          </svg>
        </div>
        <h3 style={{ color: "#0f172a", fontSize: "18px", fontWeight: 700, margin: 0 }}>Delete Student</h3>
        <p style={{ color: "#64748b", fontSize: "14px", margin: "8px 0 0" }}>
          Are you sure you want to delete <strong>{student?.firstName} {student?.lastName}</strong>?
          This action cannot be undone.
        </p>
      </div>
      <div style={{ display: "flex", gap: "12px" }}>
        <button onClick={onCancel} style={{
          flex: 1, background: "white", color: "#374151", border: "2px solid #e2e8f0",
          padding: "12px", borderRadius: "10px", fontSize: "14px", fontWeight: 600,
          cursor: "pointer", transition: "all 0.3s ease"
        }} onMouseEnter={e => { e.currentTarget.style.background = "#f8fafc"; e.currentTarget.style.borderColor = "#cbd5e1"; }}
          onMouseLeave={e => { e.currentTarget.style.background = "white"; e.currentTarget.style.borderColor = "#e2e8f0"; }}>
          Cancel
        </button>
        <button onClick={onConfirm} style={{
          flex: 1, background: "linear-gradient(135deg, #ef4444 0%, #dc2626 100%)", color: "white",
          border: "none", padding: "12px", borderRadius: "10px", fontSize: "14px", fontWeight: 600,
          cursor: "pointer", boxShadow: "0 4px 12px rgba(239, 68, 68, 0.3)", transition: "all 0.3s ease"
        }} onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-1px)"; e.currentTarget.style.boxShadow = "0 6px 20px rgba(239, 68, 68, 0.4)"; }}
          onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "0 4px 12px rgba(239, 68, 68, 0.3)"; }}>
          Delete
        </button>
      </div>
    </div>
  </div>
);

export default function StudentList({ onDataChange }) {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editStudent, setEditStudent] = useState(null);
  const [search, setSearch] = useState("");
  const [deleting, setDeleting] = useState(null);
  const [toast, setToast] = useState(null);
  const [deleteModal, setDeleteModal] = useState(null);
  const [selectedStudents, setSelectedStudents] = useState(new Set());

  const showToast = (message, type = "success") => {
    setToast({ message, type, id: Date.now() });
    setTimeout(() => setToast(null), 4000);
  };

  const fetchStudents = useCallback(async () => {
    setLoading(true); setError("");
    try {
      const data = await studentService.getAllStudents();
      setStudents(data);
      showToast(`Loaded ${data.length} student${data.length !== 1 ? 's' : ''}`, "success");
    } catch {
      setError("Cannot reach backend. Is Spring Boot running on port 8080?");
      showToast("Failed to load students", "error");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchStudents(); }, [fetchStudents]);

  const handleSearch = async (e) => {
    const kw = e.target.value;
    setSearch(kw);
    if (!kw.trim()) {
      fetchStudents();
      return;
    }
    try {
      const results = await studentService.searchStudents(kw);
      setStudents(results);
      showToast(`Found ${results.length} result${results.length !== 1 ? 's' : ''} for "${kw}"`, "info");
    } catch {
      setError("Search failed.");
      showToast("Search failed", "error");
    }
  };

  const handleDelete = (student) => {
    setDeleteModal(student);
  };

  const confirmDelete = async () => {
    const student = deleteModal;
    setDeleteModal(null);
    setDeleting(student.id);
    try {
      await studentService.deleteStudent(student.id);
      setStudents(prev => prev.filter(s => s.id !== student.id));
      if (onDataChange) onDataChange();
      showToast(`Deleted ${student.firstName} ${student.lastName}`, "success");
    } catch {
      showToast("Failed to delete student", "error");
    } finally {
      setDeleting(null);
    }
  };

  const handleSuccess = () => {
    setShowForm(false);
    setEditStudent(null);
    fetchStudents();
    if (onDataChange) onDataChange();
    showToast(editStudent ? "Student updated successfully" : "Student added successfully", "success");
  };

  const toggleStudentSelection = (id) => {
    setSelectedStudents(prev => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  };

  const selectAll = () => {
    if (selectedStudents.size === students.length) {
      setSelectedStudents(new Set());
    } else {
      setSelectedStudents(new Set(students.map(s => s.id)));
    }
  };

  const deleteSelected = () => {
    if (selectedStudents.size === 0) return;
    setDeleteModal({ firstName: `${selectedStudents.size} selected`, lastName: "students", bulk: true });
  };

  const initials = (f, l) => `${f?.[0]||""}${l?.[0]||""}`.toUpperCase();
  const avatarBg = ["#dbeafe","#ede9fe","#fef3c7","#d1fae5","#fce7f3","#cffafe","#ffedd5"];
  const avatarTx = ["#1d4ed8","#6d28d9","#b45309","#065f46","#be185d","#0e7490","#c2410c"];

  return (
    <div>
      {showForm && (
        <StudentForm
          studentToEdit={editStudent}
          onSuccess={handleSuccess}
          onCancel={() => setShowForm(false)}
        />
      )}

      <div style={{
        background: "rgba(255, 255, 255, 0.95)",
        backdropFilter: "blur(20px)",
        border: "1px solid rgba(255, 255, 255, 0.2)",
        borderRadius: "20px",
        overflow: "hidden",
        boxShadow: "0 8px 40px rgba(0, 0, 0, 0.15)",
        WebkitBackdropFilter: "blur(20px)",
        transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
        position: "relative"
      }}>
        {/* Shimmer effect overlay */}
        <div style={{
          position: "absolute", top: 0, left: "-100%", width: "100%", height: "100%",
          background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent)",
          animation: "shine 3s infinite", zIndex: 1, pointerEvents: "none"
        }}></div>
        {/* Toolbar */}
        <div style={{
          padding: "24px",
          borderBottom: "1px solid rgba(255, 255, 255, 0.2)",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          gap: "20px",
          background: "rgba(248, 250, 252, 0.8)",
          backdropFilter: "blur(10px)",
          WebkitBackdropFilter: "blur(10px)",
          position: "relative",
          zIndex: 2
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: "16px", flex: 1 }}>
            <div style={{ position: "relative", flex: 1, maxWidth: "400px" }}>
              <svg style={{ position: "absolute", left: "14px", top: "50%", transform: "translateY(-50%)", color: "#94a3b8" }} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
              <input
                type="text" placeholder="Search students..." value={search} onChange={handleSearch}
                style={{
                  width: "100%",
                  padding: "14px 18px 14px 48px",
                  border: "1px solid rgba(255, 255, 255, 0.3)",
                  borderRadius: "12px",
                  fontSize: "15px",
                  outline: "none",
                  color: "#0f172a",
                  fontFamily: "inherit",
                  background: "rgba(255, 255, 255, 0.8)",
                  backdropFilter: "blur(10px)",
                  WebkitBackdropFilter: "blur(10px)",
                  boxShadow: "0 4px 16px rgba(0, 0, 0, 0.1)",
                  transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)"
                }}
                onFocus={e => {
                  e.currentTarget.style.boxShadow = "0 8px 24px rgba(59, 130, 246, 0.25)";
                  e.currentTarget.style.borderColor = "rgba(59, 130, 246, 0.5)";
                  e.currentTarget.style.transform = "translateY(-1px)";
                }}
                onBlur={e => {
                  e.currentTarget.style.boxShadow = "0 4px 16px rgba(0, 0, 0, 0.1)";
                  e.currentTarget.style.borderColor = "rgba(255, 255, 255, 0.3)";
                  e.currentTarget.style.transform = "translateY(0)";
                }}
              />
            </div>
            {selectedStudents.size > 0 && (
              <div style={{ display: "flex", alignItems: "center", gap: "8px", background: "linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%)", padding: "8px 12px", borderRadius: "8px", color: "#1d4ed8", fontSize: "13px", fontWeight: 600 }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                {selectedStudents.size} selected
                <button onClick={() => setSelectedStudents(new Set())} style={{ background: "none", border: "none", color: "#1d4ed8", cursor: "pointer", fontSize: "12px", marginLeft: "4px" }}>×</button>
              </div>
            )}
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            {selectedStudents.size > 0 && (
              <button onClick={deleteSelected} style={{
                display: "flex", alignItems: "center", gap: "6px", background: "linear-gradient(135deg, #ef4444 0%, #dc2626 100%)",
                color: "white", border: "none", padding: "10px 16px", borderRadius: "8px", fontSize: "13px", fontWeight: 600,
                cursor: "pointer", fontFamily: "inherit", boxShadow: "0 4px 12px rgba(239, 68, 68, 0.3)", transition: "all 0.3s ease"
              }} onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-1px)"; e.currentTarget.style.boxShadow = "0 6px 20px rgba(239, 68, 68, 0.4)"; }}
                onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "0 4px 12px rgba(239, 68, 68, 0.3)"; }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/></svg>
                Delete Selected
              </button>
            )}
            <span style={{ fontSize: "14px", color: "#64748b", fontWeight: 500 }}>{students.length} student{students.length !== 1 ? "s" : ""}</span>
            <button onClick={() => { setEditStudent(null); setShowForm(true); }}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "10px",
                background: "linear-gradient(135deg, rgba(59, 130, 246, 0.9) 0%, rgba(29, 78, 216, 0.9) 100%)",
                backdropFilter: "blur(10px)",
                WebkitBackdropFilter: "blur(10px)",
                color: "white",
                border: "1px solid rgba(255, 255, 255, 0.2)",
                padding: "14px 24px",
                borderRadius: "12px",
                fontSize: "15px",
                fontWeight: 600,
                cursor: "pointer",
                fontFamily: "inherit",
                boxShadow: "0 6px 20px rgba(59, 130, 246, 0.3)",
                transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                position: "relative",
                overflow: "hidden"
              }}
              onMouseEnter={e => {
                e.currentTarget.style.transform = "translateY(-2px) scale(1.02)";
                e.currentTarget.style.boxShadow = "0 12px 32px rgba(59, 130, 246, 0.4)";
              }}
              onMouseLeave={e => {
                e.currentTarget.style.transform = "translateY(0) scale(1)";
                e.currentTarget.style.boxShadow = "0 6px 20px rgba(59, 130, 246, 0.3)";
              }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5">
                <line x1="12" y1="5" x2="12" y2="19"/>
                <line x1="5" y1="12" x2="19" y2="12"/>
              </svg>
              Add Student
            </button>
          </div>
        </div>

        {error && (
          <div style={{ margin: "16px 20px", padding: "12px 16px", background: "#fef2f2", border: "1px solid #fecaca", borderRadius: "8px", color: "#b91c1c", fontSize: "14px" }}>
            {error}
          </div>
        )}

        {loading ? (
          <div style={{ padding: "40px 20px" }}>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ background: "#f8fafc" }}>
                  {["Student","Email","Course","Age","Phone","Address",""].map((h, i) => (
                    <th key={i} style={{ padding: "11px 16px", textAlign: "left", fontSize: "11px", fontWeight: 700, color: "#64748b", textTransform: "uppercase", letterSpacing: "0.6px", borderBottom: "1px solid #f1f5f9" }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {Array(5).fill(0).map((_, i) => <SkeletonRow key={i} />)}
              </tbody>
            </table>
          </div>
        ) : students.length === 0 ? (
          <div style={{ textAlign: "center", padding: "80px 20px" }}>
            <div style={{
              width: "120px", height: "120px", background: "linear-gradient(135deg, #f1f5f9 0%, #e2e8f0 100%)",
              borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 24px",
              boxShadow: "0 8px 32px rgba(0,0,0,0.1)"
            }}>
              <svg style={{ color: "#cbd5e1" }} width="60" height="60" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
            </div>
            <div style={{ fontSize: "20px", fontWeight: 700, color: "#374151", marginBottom: "8px" }}>No students found</div>
            <div style={{ fontSize: "16px", color: "#9ca3af", marginBottom: "24px" }}>
              {search ? `No results for "${search}"` : "Click 'Add Student' to register your first student"}
            </div>
            {!search && (
              <button onClick={() => { setEditStudent(null); setShowForm(true); }}
                style={{ display: "inline-flex", alignItems: "center", gap: "8px", background: "linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)", color: "white", border: "none", padding: "14px 24px", borderRadius: "12px", fontSize: "16px", fontWeight: 600, cursor: "pointer", fontFamily: "inherit", boxShadow: "0 4px 16px rgba(59, 130, 246, 0.3)", transition: "all 0.3s ease" }}
                onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = "0 8px 24px rgba(59, 130, 246, 0.4)"; }}
                onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "0 4px 16px rgba(59, 130, 246, 0.3)"; }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
                Add Your First Student
              </button>
            )}
          </div>
        ) : (
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{
                background: "rgba(248, 250, 252, 0.8)",
                backdropFilter: "blur(10px)",
                WebkitBackdropFilter: "blur(10px)",
                borderBottom: "1px solid rgba(255, 255, 255, 0.3)"
              }}>
                <th style={{
                  padding: "16px 20px",
                  textAlign: "left",
                  fontSize: "12px",
                  fontWeight: 700,
                  color: "#475569",
                  textTransform: "uppercase",
                  letterSpacing: "0.8px",
                  borderBottom: "1px solid rgba(255, 255, 255, 0.2)"
                }}>
                  <input type="checkbox" checked={selectedStudents.size === students.length && students.length > 0} onChange={selectAll} style={{ marginRight: "10px" }} />
                  Student
                </th>
                {["Email","Course","Age","Phone","Address",""].map((h, i) => (
                  <th key={i} style={{
                    padding: "16px 20px",
                    textAlign: "left",
                    fontSize: "12px",
                    fontWeight: 700,
                    color: "#475569",
                    textTransform: "uppercase",
                    letterSpacing: "0.8px",
                    borderBottom: "1px solid rgba(255, 255, 255, 0.2)"
                  }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {students.map((s, idx) => {
                const cs = courseColors[s.course] || { bg: "#f8fafc", color: "#475569" };
                const ai = idx % avatarBg.length;
                const isSelected = selectedStudents.has(s.id);
                return (
                  <tr key={s.id} style={{
                    borderBottom: "1px solid rgba(255, 255, 255, 0.1)",
                    transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                    background: isSelected ? "rgba(239, 246, 255, 0.8)" : "rgba(255, 255, 255, 0.6)",
                    backdropFilter: "blur(5px)",
                    WebkitBackdropFilter: "blur(5px)",
                    cursor: "pointer",
                    position: "relative"
                  }}
                    onMouseEnter={e => {
                      if (!isSelected) {
                        e.currentTarget.style.background = "rgba(248, 250, 252, 0.9)";
                        e.currentTarget.style.backdropFilter = "blur(10px)";
                        e.currentTarget.style.WebkitBackdropFilter = "blur(10px)";
                      }
                      e.currentTarget.style.transform = "translateY(-1px) scale(1.01)";
                      e.currentTarget.style.boxShadow = "0 4px 16px rgba(0, 0, 0, 0.1)";
                    }}
                    onMouseLeave={e => {
                      if (!isSelected) {
                        e.currentTarget.style.background = "rgba(255, 255, 255, 0.6)";
                        e.currentTarget.style.backdropFilter = "blur(5px)";
                        e.currentTarget.style.WebkitBackdropFilter = "blur(5px)";
                      }
                      e.currentTarget.style.transform = "translateY(0) scale(1)";
                      e.currentTarget.style.boxShadow = "none";
                    }}>
                    <td style={{ padding: "14px 16px" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                        <input type="checkbox" checked={isSelected} onChange={() => toggleStudentSelection(s.id)} style={{ marginRight: "8px" }} />
                        <div style={{ width: "38px", height: "38px", borderRadius: "50%", background: `linear-gradient(135deg, ${avatarBg[ai]} 0%, ${avatarBg[ai]}dd 100%)`, color: avatarTx[ai], display: "flex", alignItems: "center", justifyContent: "center", fontSize: "13px", fontWeight: 700, flexShrink: 0, boxShadow: "0 2px 8px rgba(0,0,0,0.1)" }}>
                          {initials(s.firstName, s.lastName)}
                        </div>
                        <div>
                          <div style={{ fontSize: "14px", fontWeight: 600, color: "#0f172a" }}>{s.firstName} {s.lastName}</div>
                          <div style={{ fontSize: "11px", color: "#94a3b8" }}>ID #{s.id}</div>
                        </div>
                      </div>
                    </td>
                    <td style={{ padding: "14px 16px", fontSize: "13px", color: "#475569" }}>{s.email}</td>
                    <td style={{ padding: "14px 16px" }}>
                      <span style={{ background: cs.bg, color: cs.color, padding: "4px 12px", borderRadius: "6px", fontSize: "12px", fontWeight: 600, boxShadow: "0 1px 3px rgba(0,0,0,0.1)" }}>{s.course}</span>
                    </td>
                    <td style={{ padding: "14px 16px", fontSize: "13px", color: "#475569" }}>{s.age} yrs</td>
                    <td style={{ padding: "14px 16px", fontSize: "13px", color: "#475569" }}>{s.phone || "—"}</td>
                    <td style={{ padding: "14px 16px", fontSize: "13px", color: "#475569", maxWidth: "150px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{s.address || "—"}</td>
                    <td style={{ padding: "14px 16px" }}>
                      <div style={{ display: "flex", gap: "6px" }}>
                        <button onClick={() => { setEditStudent(s); setShowForm(true); }}
                          style={{ padding: "8px 14px", background: "linear-gradient(135deg, #f1f5f9 0%, #e2e8f0 100%)", color: "#374151", border: "none", borderRadius: "8px", fontSize: "12px", fontWeight: 600, cursor: "pointer", fontFamily: "inherit", transition: "all 0.3s ease" }}
                          onMouseEnter={e => { e.currentTarget.style.background = "linear-gradient(135deg, #e2e8f0 0%, #cbd5e1 100%)"; e.currentTarget.style.transform = "translateY(-1px)"; }}
                          onMouseLeave={e => { e.currentTarget.style.background = "linear-gradient(135deg, #f1f5f9 0%, #e2e8f0 100%)"; e.currentTarget.style.transform = "translateY(0)"; }}>
                          Edit
                        </button>
                        <button onClick={() => handleDelete(s)}
                          disabled={deleting === s.id}
                          style={{ padding: "8px 14px", background: "linear-gradient(135deg, #fef2f2 0%, #fecaca 100%)", color: "#dc2626", border: "none", borderRadius: "8px", fontSize: "12px", fontWeight: 600, cursor: "pointer", fontFamily: "inherit", opacity: deleting === s.id ? 0.5 : 1, transition: "all 0.3s ease" }}
                          onMouseEnter={e => { if (deleting !== s.id) { e.currentTarget.style.background = "linear-gradient(135deg, #fecaca 0%, #fca5a5 100%)"; e.currentTarget.style.transform = "translateY(-1px)"; } }}
                          onMouseLeave={e => { if (deleting !== s.id) { e.currentTarget.style.background = "linear-gradient(135deg, #fef2f2 0%, #fecaca 100%)"; e.currentTarget.style.transform = "translateY(0)"; } }}>
                          {deleting === s.id ? "..." : "Delete"}
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>

      {/* Toast Notifications */}
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

      {/* Delete Confirmation Modal */}
      {deleteModal && (
        <DeleteModal
          student={deleteModal}
          onConfirm={deleteModal.bulk ? async () => {
            const ids = Array.from(selectedStudents);
            setDeleteModal(null);
            setDeleting("bulk");
            try {
              for (const id of ids) {
                await studentService.deleteStudent(id);
              }
              setStudents(prev => prev.filter(s => !selectedStudents.has(s.id)));
              setSelectedStudents(new Set());
              if (onDataChange) onDataChange();
              showToast(`Deleted ${ids.length} student${ids.length !== 1 ? 's' : ''}`, "success");
            } catch {
              showToast("Failed to delete selected students", "error");
            } finally {
              setDeleting(null);
            }
          } : confirmDelete}
          onCancel={() => setDeleteModal(null)}
        />
      )}
    </div>
  );
}