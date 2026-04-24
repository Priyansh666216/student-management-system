import React, { useState, useEffect } from "react";
import StudentList from "./components/StudentList";
import studentService from "./services/studentService";

const COURSES = ["B.Tech CSE","B.Tech IT","BCA","MCA","MBA","B.Sc","M.Tech"];

const S = {
  sidebar: {
    width: "260px", minHeight: "100vh",
    background: "linear-gradient(145deg, rgba(15,23,42,0.95) 0%, rgba(30,41,59,0.98) 50%, rgba(51,65,85,0.95) 100%)",
    backdropFilter: "blur(20px)", borderRight: "1px solid rgba(255,255,255,0.1)",
    display: "flex", flexDirection: "column", position: "fixed",
    top: 0, left: 0, zIndex: 50, boxShadow: "4px 0 20px rgba(0,0,0,0.15)",
    WebkitBackdropFilter: "blur(20px)"
  },
  main: {
    marginLeft: "260px", minHeight: "100vh",
    background: "linear-gradient(135deg, #0f0f23 0%, #1a1a2e 25%, #16213e 50%, #0f3460 75%, #1a1a2e 100%)",
    position: "relative", overflow: "hidden"
  },
  navItem: (active) => ({
    display: "flex", alignItems: "center", gap: "14px",
    padding: "14px 22px", borderRadius: "12px", cursor: "pointer",
    fontSize: "15px", fontWeight: active ? 700 : 500,
    color: active ? "#ffffff" : "rgba(148,163,184,0.8)",
    background: active ? "linear-gradient(135deg, rgba(59,130,246,0.3) 0%, rgba(147,51,234,0.3) 100%)" : "transparent",
    border: active ? "1px solid rgba(59,130,246,0.4)" : "none",
    margin: "4px 0", transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
    position: "relative", overflow: "hidden",
    boxShadow: active ? "0 8px 25px rgba(59,130,246,0.3)" : "none"
  }),
  card: {
    background: "rgba(255,255,255,0.05)", backdropFilter: "blur(15px)",
    borderRadius: "20px", border: "1px solid rgba(255,255,255,0.1)",
    padding: "28px", boxShadow: "0 8px 32px rgba(0,0,0,0.2)",
    transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
    WebkitBackdropFilter: "blur(15px)"
  },
  glassCard: {
    background: "rgba(255,255,255,0.08)", backdropFilter: "blur(20px)",
    borderRadius: "16px", border: "1px solid rgba(255,255,255,0.15)",
    padding: "20px", boxShadow: "0 8px 32px rgba(0,0,0,0.15)",
    transition: "all 0.3s ease", WebkitBackdropFilter: "blur(20px)"
  }
};

function Sidebar({ active, onNavigate, studentCount }) {
  const items = [
    { id: "dashboard", label: "Dashboard", svg: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg> },
    { id: "students", label: "Students", svg: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>, badge: studentCount },
    { id: "reports", label: "Reports", svg: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg> },
  ];

  return (
    <div style={S.sidebar}>
      {/* Animated Background */}
      <div style={{
        position: "absolute", top: 0, left: 0, right: 0, bottom: 0,
        background: "radial-gradient(circle at 20% 80%, rgba(120,119,198,0.3) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(255,119,198,0.2) 0%, transparent 50%)",
        animation: "float 6s ease-in-out infinite"
      }} />

      {/* Logo */}
      <div style={{ padding: "28px 22px 24px", borderBottom: "1px solid rgba(255,255,255,0.1)", position: "relative", zIndex: 2 }}>
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <div style={{
            width: "40px", height: "40px",
            background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
            borderRadius: "12px", display: "flex", alignItems: "center", justifyContent: "center",
            boxShadow: "0 8px 25px rgba(102,126,234,0.4)", position: "relative", overflow: "hidden"
          }}>
            <div style={{
              position: "absolute", top: "-50%", left: "-50%", width: "200%", height: "200%",
              background: "linear-gradient(45deg, transparent 30%, rgba(255,255,255,0.2) 50%, transparent 70%)",
              animation: "shine 3s ease-in-out infinite"
            }} />
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5">
              <path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c3 3 9 3 12 0v-5"/>
            </svg>
          </div>
          <div>
            <div style={{ color: "white", fontWeight: 800, fontSize: "16px", lineHeight: 1, letterSpacing: "-0.02em" }}>EduManage</div>
            <div style={{ color: "rgba(148,163,184,0.7)", fontSize: "12px", marginTop: "4px", fontWeight: 500 }}>Student Portal</div>
          </div>
        </div>
      </div>

      {/* Nav */}
      <div style={{ padding: "20px 14px", flex: 1, position: "relative", zIndex: 2 }}>
        <div style={{ fontSize: "11px", color: "rgba(148,163,184,0.6)", fontWeight: 700, letterSpacing: "1px", textTransform: "uppercase", padding: "0 8px", marginBottom: "12px" }}>Main Menu</div>
        {items.map(item => (
          <button key={item.id} style={S.navItem(active === item.id)} onClick={() => onNavigate(item.id)}
            onMouseEnter={e => {
              if (active !== item.id) {
                e.currentTarget.style.background = "rgba(255,255,255,0.1)";
                e.currentTarget.style.color = "rgba(255,255,255,0.9)";
                e.currentTarget.style.transform = "translateX(6px) scale(1.02)";
                e.currentTarget.style.boxShadow = "0 6px 20px rgba(255,255,255,0.1)";
              }
            }}
            onMouseLeave={e => {
              if (active !== item.id) {
                e.currentTarget.style.background = "transparent";
                e.currentTarget.style.color = "rgba(148,163,184,0.8)";
                e.currentTarget.style.transform = "translateX(0) scale(1)";
                e.currentTarget.style.boxShadow = "none";
              }
            }}>
            <div style={{
              color: active === item.id ? "#60a5fa" : "rgba(148,163,184,0.7)",
              transition: "all 0.3s ease"
            }}>{item.svg}</div>
            <span>{item.label}</span>
            {item.badge !== undefined && (
              <span style={{
                marginLeft: "auto",
                background: "linear-gradient(135deg, #10b981 0%, #059669 100%)",
                color: "white", fontSize: "11px", fontWeight: 700, padding: "3px 8px",
                borderRadius: "12px", boxShadow: "0 2px 8px rgba(16,185,129,0.3)",
                animation: "pulse 2s ease-in-out infinite"
              }}>{item.badge}</span>
            )}
          </button>
        ))}
      </div>

      {/* User */}
      <div style={{ padding: "20px 22px", borderTop: "1px solid rgba(255,255,255,0.1)", position: "relative", zIndex: 2 }}>
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <div style={{
            width: "38px", height: "38px", borderRadius: "50%",
            background: "linear-gradient(135deg, #f59e0b 0%, #d97706 100%)",
            display: "flex", alignItems: "center", justifyContent: "center",
            color: "white", fontSize: "14px", fontWeight: 700, flexShrink: 0,
            boxShadow: "0 4px 12px rgba(245,158,11,0.4)",
            border: "2px solid rgba(255,255,255,0.2)"
          }}>PS</div>
          <div style={{ overflow: "hidden" }}>
            <div style={{ color: "white", fontSize: "14px", fontWeight: 600, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>Priyanshu Shukla</div>
            <div style={{ color: "rgba(148,163,184,0.7)", fontSize: "12px", fontWeight: 500 }}>Administrator</div>
          </div>
        </div>
      </div>
    </div>
  );
}

function DashboardPage({ students, onNavigate }) {
  const recentStudents = [...students].slice(-3).reverse();

  return (
    <div style={{ padding: "40px", position: "relative", minHeight: "100vh" }}>
      {/* Animated Background Elements */}
      <div style={{
        position: "absolute", top: 0, left: 0, right: 0, bottom: 0,
        overflow: "hidden", zIndex: 0
      }}>
        <div style={{
          position: "absolute", top: "10%", left: "10%", width: "200px", height: "200px",
          background: "radial-gradient(circle, rgba(59,130,246,0.1) 0%, transparent 70%)",
          borderRadius: "50%", animation: "float 8s ease-in-out infinite"
        }} />
        <div style={{
          position: "absolute", top: "60%", right: "15%", width: "150px", height: "150px",
          background: "radial-gradient(circle, rgba(147,51,234,0.1) 0%, transparent 70%)",
          borderRadius: "50%", animation: "float 6s ease-in-out infinite reverse"
        }} />
        <div style={{
          position: "absolute", bottom: "20%", left: "20%", width: "100px", height: "100px",
          background: "radial-gradient(circle, rgba(16,185,129,0.1) 0%, transparent 70%)",
          borderRadius: "50%", animation: "float 7s ease-in-out infinite"
        }} />
      </div>

      {/* Hero with enhanced styling */}
      <div style={{
        borderRadius: "24px", overflow: "hidden", position: "relative",
        height: "240px", marginBottom: "40px", boxShadow: "0 12px 40px rgba(0,0,0,0.2)",
        background: "linear-gradient(135deg, rgba(15,23,42,0.9) 0%, rgba(30,41,59,0.95) 100%)",
        backdropFilter: "blur(20px)", border: "1px solid rgba(255,255,255,0.1)"
      }}>
        <img
          src="https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=1200&auto=format&fit=crop&q=80"
          alt="University campus"
          style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "center 40%" }}
        />
        <div style={{
          position: "absolute", inset: 0,
          background: "linear-gradient(135deg, rgba(15,23,42,0.9) 0%, rgba(15,23,42,0.7) 50%, rgba(59,130,246,0.3) 100%)",
          display: "flex", alignItems: "center", padding: "48px", backdropFilter: "blur(4px)"
        }}>
          <div style={{ position: "relative", zIndex: 2 }}>
            <div style={{
              color: "#60a5fa", fontSize: "16px", fontWeight: 600, letterSpacing: "1px",
              textTransform: "uppercase", marginBottom: "16px", textShadow: "0 2px 4px rgba(0,0,0,0.5)",
              display: "flex", alignItems: "center", gap: "8px"
            }}>
              <div style={{
                width: "4px", height: "16px",
                background: "linear-gradient(135deg, #60a5fa 0%, #3b82f6 100%)",
                borderRadius: "2px"
              }} />
              KIIT University — Student Portal
            </div>
            <h1 style={{
              color: "white", fontSize: "36px", fontWeight: 900, margin: 0, lineHeight: 1.1,
              textShadow: "0 4px 8px rgba(0,0,0,0.5)", letterSpacing: "-0.02em"
            }}>Good morning, Priyanshu</h1>
            <p style={{
              color: "rgba(255,255,255,0.9)", fontSize: "18px", marginTop: "16px", marginBottom: 0,
              textShadow: "0 2px 4px rgba(0,0,0,0.3)", fontWeight: 500
            }}>
              You have <span style={{ color: "#60a5fa", fontWeight: 700 }}>{students.length}</span> student{students.length !== 1 ? "s" : ""} registered across <span style={{ color: "#a78bfa", fontWeight: 700 }}>{COURSES.length}</span> courses.
            </p>
          </div>
        </div>
      </div>

      {/* Stats row with enhanced cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "20px", marginBottom: "36px", position: "relative", zIndex: 1 }}>
        {[
          { label: "Total Students", value: students.length, icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#3b82f6" strokeWidth="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>, accent: "linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%)", border: "#60a5fa", glow: "rgba(59,130,246,0.2)" },
          { label: "Courses Offered", value: COURSES.length, icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#8b5cf6" strokeWidth="2"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>, accent: "linear-gradient(135deg, #ede9fe 0%, #ddd6fe 100%)", border: "#a78bfa", glow: "rgba(139,92,246,0.2)" },
          { label: "Avg Age", value: students.length ? Math.round(students.reduce((a, s) => a + (s.age || 0), 0) / students.length) : "—", icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#f59e0b" strokeWidth="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>, accent: "linear-gradient(135deg, #fef3c7 0%, #fde68a 100%)", border: "#fbbf24", glow: "rgba(245,158,11,0.2)" },
          { label: "System", value: "Online", icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>, accent: "linear-gradient(135deg, #d1fae5 0%, #a7f3d0 100%)", border: "#34d399", glow: "rgba(16,185,129,0.2)" },
        ].map((s, i) => (
          <div key={i} style={{
            ...S.card, display: "flex", alignItems: "center", gap: "16px", cursor: "pointer",
            transform: "translateY(0)", transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
            border: `1px solid ${s.border}20`, position: "relative", overflow: "hidden"
          }}
            onMouseEnter={e => {
              e.currentTarget.style.transform = "translateY(-8px) scale(1.02)";
              e.currentTarget.style.boxShadow = `0 12px 40px ${s.glow}`;
              e.currentTarget.style.borderColor = `${s.border}40`;
            }}
            onMouseLeave={e => {
              e.currentTarget.style.transform = "translateY(0) scale(1)";
              e.currentTarget.style.boxShadow = "0 8px 32px rgba(0,0,0,0.2)";
              e.currentTarget.style.borderColor = `${s.border}20`;
            }}>
            {/* Animated background gradient */}
            <div style={{
              position: "absolute", top: 0, left: 0, right: 0, bottom: 0,
              background: `linear-gradient(135deg, ${s.accent} 0%, rgba(255,255,255,0.1) 100%)`,
              opacity: 0.1, zIndex: 0
            }} />

            <div style={{
              width: "56px", height: "56px", background: s.accent,
              borderRadius: "16px", display: "flex", alignItems: "center", justifyContent: "center",
              flexShrink: 0, boxShadow: `0 8px 24px ${s.glow}`, position: "relative", zIndex: 1,
              border: `2px solid ${s.border}30`
            }}>{s.icon}</div>
            <div style={{ position: "relative", zIndex: 1 }}>
              <div style={{ fontSize: "28px", fontWeight: 900, color: "white", lineHeight: 1, marginBottom: "6px", textShadow: "0 2px 4px rgba(0,0,0,0.3)" }}>{s.value}</div>
              <div style={{ fontSize: "14px", color: "rgba(255,255,255,0.8)", fontWeight: 600, textShadow: "0 1px 2px rgba(0,0,0,0.3)" }}>{s.label}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Bottom grid */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }}>
        {/* Recent students */}
        <div style={S.card}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
            <div style={{ fontSize: "18px", fontWeight: 700, color: "#0f172a" }}>Recent Students</div>
            <button onClick={() => onNavigate("students")} style={{ background: "linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)", color: "white", border: "none", padding: "8px 16px", borderRadius: "8px", fontSize: "13px", cursor: "pointer", fontWeight: 600, fontFamily: "inherit", boxShadow: "0 4px 12px rgba(59, 130, 246, 0.3)", transition: "all 0.3s ease" }}
              onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = "0 6px 20px rgba(59, 130, 246, 0.4)"; }}
              onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "0 4px 12px rgba(59, 130, 246, 0.3)"; }}>View all →</button>
          </div>
          {recentStudents.length === 0 ? (
            <div style={{ textAlign: "center", padding: "40px 0", color: "#94a3b8", fontSize: "16px" }}>No students yet. Add your first student!</div>
          ) : recentStudents.map((s, i) => (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: "14px", padding: "14px 0", borderBottom: i < recentStudents.length - 1 ? "1px solid #f1f5f9" : "none", transition: "all 0.2s ease", cursor: "pointer" }}
              onMouseEnter={e => { e.currentTarget.style.background = "#f8fafc"; e.currentTarget.style.borderRadius = "8px"; e.currentTarget.style.padding = "14px"; e.currentTarget.style.margin = "0 -6px"; }}
              onMouseLeave={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.borderRadius = "0"; e.currentTarget.style.padding = "14px 0"; e.currentTarget.style.margin = "0"; }}>
              <div style={{ width: "40px", height: "40px", borderRadius: "50%", background: ["linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%)","linear-gradient(135deg, #ede9fe 0%, #ddd6fe 100%)","linear-gradient(135deg, #fef3c7 0%, #fde68a 100%)"][i % 3], display: "flex", alignItems: "center", justifyContent: "center", fontSize: "14px", fontWeight: 700, color: ["#1d4ed8","#6d28d9","#b45309"][i % 3], flexShrink: 0, boxShadow: "0 2px 8px rgba(0,0,0,0.1)" }}>
                {(s.firstName?.[0] || "") + (s.lastName?.[0] || "")}
              </div>
              <div style={{ flex: 1, overflow: "hidden" }}>
                <div style={{ fontSize: "15px", fontWeight: 600, color: "#0f172a", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{s.firstName} {s.lastName}</div>
                <div style={{ fontSize: "13px", color: "#64748b", marginTop: "2px" }}>{s.course}</div>
              </div>
              <div style={{ fontSize: "12px", background: "linear-gradient(135deg, #f1f5f9 0%, #e2e8f0 100%)", color: "#475569", padding: "4px 10px", borderRadius: "8px", whiteSpace: "nowrap", fontWeight: 500 }}>{s.email?.split("@")[1] || ""}</div>
            </div>
          ))}
        </div>

        {/* Course breakdown */}
        <div style={S.card}>
          <div style={{ fontSize: "18px", fontWeight: 700, color: "#0f172a", marginBottom: "20px" }}>Course Breakdown</div>
          {COURSES.slice(0, 5).map((course, i) => {
            const count = students.filter(s => s.course === course).length;
            const pct = students.length ? Math.round((count / students.length) * 100) : 0;
            const colors = ["#3b82f6","#8b5cf6","#f59e0b","#10b981","#ef4444"];
            return (
              <div key={i} style={{ marginBottom: "16px", padding: "12px", borderRadius: "10px", background: "linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)", transition: "all 0.3s ease" }}
                onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = "0 4px 12px rgba(0,0,0,0.1)"; }}
                onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "none"; }}>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: "14px", marginBottom: "8px" }}>
                  <span style={{ color: "#374151", fontWeight: 600 }}>{course}</span>
                  <span style={{ color: "#6b7280", fontWeight: 500 }}>{count} student{count !== 1 ? "s" : ""}</span>
                </div>
                <div style={{ height: "8px", background: "#e5e7eb", borderRadius: "4px", overflow: "hidden", boxShadow: "inset 0 1px 2px rgba(0,0,0,0.1)" }}>
                  <div style={{ height: "100%", width: `${pct}%`, background: `linear-gradient(90deg, ${colors[i % colors.length]} 0%, ${colors[i % colors.length]}dd 100%)`, borderRadius: "4px", transition: "width 0.8s ease", boxShadow: "0 0 8px rgba(0,0,0,0.2)" }} />
                </div>
                <div style={{ fontSize: "12px", color: "#9ca3af", marginTop: "6px", textAlign: "right" }}>{pct}% of total</div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function ReportsPage({ students }) {
  const colors = ["#3b82f6","#8b5cf6","#f59e0b","#10b981","#ef4444","#ec4899","#06b6d4"];
  return (
    <div style={{ padding: "32px" }}>
      <div style={{ marginBottom: "24px" }}>
        <h2 style={{ fontSize: "22px", fontWeight: 700, color: "#0f172a", margin: 0 }}>Reports</h2>
        <p style={{ color: "#64748b", fontSize: "14px", marginTop: "4px" }}>Live course-wise enrollment based on your student data</p>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: "16px" }}>
        {COURSES.map((course, i) => {
          const count = students.filter(s => s.course === course).length;
          const pct = students.length ? Math.round((count / students.length) * 100) : 0;
          return (
            <div key={i} style={{ ...S.card, borderTop: `4px solid ${colors[i % colors.length]}`, cursor: "pointer", transform: "translateY(0)", transition: "all 0.3s ease" }}
              onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-4px)"; e.currentTarget.style.boxShadow = "0 8px 25px rgba(0,0,0,0.15)"; }}
              onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "0 4px 20px rgba(0,0,0,0.08)"; }}>
              <div style={{ fontSize: "14px", color: "#64748b", marginBottom: "10px", fontWeight: 500 }}>{course}</div>
              <div style={{ fontSize: "36px", fontWeight: 800, color: "#0f172a", lineHeight: 1, marginBottom: "8px" }}>{count}</div>
              <div style={{ fontSize: "13px", color: "#94a3b8", marginBottom: "16px", fontWeight: 500 }}>{pct}% of total</div>
              <div style={{ height: "6px", background: "#f1f5f9", borderRadius: "3px", overflow: "hidden" }}>
                <div style={{ height: "100%", width: `${pct}%`, background: `linear-gradient(90deg, ${colors[i % colors.length]} 0%, ${colors[i % colors.length]}dd 100%)`, borderRadius: "3px", transition: "width 0.8s ease" }} />
              </div>
            </div>
          );
        })}
        <div style={{ ...S.card, background: "linear-gradient(135deg, #0f172a 0%, #1e293b 100%)", border: "none", color: "white", cursor: "pointer", transform: "translateY(0)", transition: "all 0.3s ease" }}
          onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-4px)"; e.currentTarget.style.boxShadow = "0 8px 25px rgba(0,0,0,0.2)"; }}
          onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "0 4px 20px rgba(0,0,0,0.08)"; }}>
          <div style={{ fontSize: "14px", color: "#94a3b8", marginBottom: "10px", fontWeight: 500 }}>All Courses</div>
          <div style={{ fontSize: "36px", fontWeight: 800, color: "white", lineHeight: 1, marginBottom: "8px" }}>{students.length}</div>
          <div style={{ fontSize: "13px", color: "#64748b", marginBottom: "16px" }}>Total students</div>
        </div>
      </div>
    </div>
  );
}

export default function App() {
  const [page, setPage] = useState("dashboard");
  const [students, setStudents] = useState([]);

  const fetchStudents = () => {
    studentService.getAllStudents().then(setStudents).catch(() => setStudents([]));
  };

  useEffect(() => { fetchStudents(); }, [page]);

  return (
    <div style={{ fontFamily: "'Inter', 'Segoe UI', sans-serif", display: "flex" }}>
      <Sidebar active={page} onNavigate={setPage} studentCount={students.length} />
      <div style={S.main}>
        {page === "dashboard" && <DashboardPage students={students} onNavigate={setPage} />}
        {page === "students" && (
          <div style={{ padding: "32px" }}>
            <div style={{ marginBottom: "20px" }}>
              <h2 style={{ fontSize: "22px", fontWeight: 700, color: "#0f172a", margin: 0 }}>Students</h2>
              <p style={{ color: "#64748b", fontSize: "14px", marginTop: "4px" }}>Add, edit, search and manage student records</p>
            </div>
            <StudentList onDataChange={fetchStudents} />
          </div>
        )}
        {page === "reports" && <ReportsPage students={students} />}
      </div>
    </div>
  );
}