import React, { useState, useEffect } from "react";
import studentService from "../services/studentService";

const Field = ({ label, name, type, placeholder, value, onChange, error, extra = {} }) => {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <div style={{ position: "relative" }}>
      <label style={{
        display: "block", fontSize: "14px", fontWeight: 600,
        color: error ? "#dc2626" : isFocused ? "#3b82f6" : "#374151",
        marginBottom: "6px", transition: "all 0.3s ease"
      }}>{label}</label>
      <div style={{ position: "relative" }}>
        <input
          type={type} name={name} value={value} onChange={onChange}
          placeholder={placeholder} {...extra}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          style={{
            width: "100%", padding: "12px 14px", border: `2px solid ${error ? "#fca5a5" : isFocused ? "#3b82f6" : "#e2e8f0"}`,
            borderRadius: "10px", fontSize: "14px", fontFamily: "inherit", outline: "none",
            background: error ? "#fef9f9" : "white", color: "#0f172a", boxSizing: "border-box",
            transition: "all 0.3s ease", boxShadow: isFocused ? "0 4px 12px rgba(59, 130, 246, 0.2)" : "0 2px 8px rgba(0,0,0,0.05)"
          }}
        />
        {error && (
          <div style={{
            position: "absolute", right: "12px", top: "50%", transform: "translateY(-50%)",
            color: "#dc2626", fontSize: "16px"
          }}>⚠️</div>
        )}
        {isFocused && !error && (
          <div style={{
            position: "absolute", right: "12px", top: "50%", transform: "translateY(-50%)",
            color: "#10b981", fontSize: "16px"
          }}>✓</div>
        )}
      </div>
      {error && <div style={{
        fontSize: "12px", color: "#dc2626", marginTop: "6px", fontWeight: 500,
        display: "flex", alignItems: "center", gap: "4px"
      }}>
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/>
        </svg>
        {error}
      </div>}
    </div>
  );
};

export default function StudentForm({ studentToEdit, onSuccess, onCancel }) {
  const isEditing = !!studentToEdit;
  const [form, setForm] = useState({ firstName:"", lastName:"", email:"", course:"", age:"", phone:"", address:"" });
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => { if (studentToEdit) setForm({ ...studentToEdit }); }, [studentToEdit]);

  const validate = () => {
    const e = {};
    if (!form.firstName.trim()) e.firstName = "Required";
    else if (form.firstName.length < 2) e.firstName = "Minimum 2 characters";
    if (!form.lastName.trim()) e.lastName = "Required";
    else if (form.lastName.length < 2) e.lastName = "Minimum 2 characters";
    if (!form.email.trim()) e.email = "Required";
    else if (!/\S+@\S+\.\S+/.test(form.email)) e.email = "Enter a valid email address";
    if (!form.course) e.course = "Please select a course";
    if (!form.age) e.age = "Required";
    else if (form.age < 15 || form.age > 100) e.age = "Age must be between 15 and 100";
    if (form.phone && !/^\d{10}$/.test(form.phone)) e.phone = "Enter a valid 10-digit number";
    return e;
  };

  const onChange = (e) => {
    const { name, value } = e.target;
    setForm(p => ({ ...p, [name]: value }));
    if (errors[name]) setErrors(p => ({ ...p, [name]: "" }));
  };

  const onSubmit = async (e) => {
    e.preventDefault(); setServerError("");
    const v = validate();
    if (Object.keys(v).length) { setErrors(v); return; }
    setLoading(true);
    try {
      if (isEditing) await studentService.updateStudent(studentToEdit.id, form);
      else await studentService.createStudent(form);
      onSuccess();
    } catch (err) {
      setServerError(err.response?.data?.message || "Something went wrong. Please try again.");
    } finally { setLoading(false); }
  };

  return (
    <div style={{ background: "white", borderRadius: "16px", border: "1px solid #e2e8f0", marginBottom: "20px", overflow: "hidden", boxShadow: "0 8px 32px rgba(0,0,0,0.12)", transition: "all 0.3s ease" }}>
      <div style={{ padding: "20px", borderBottom: "1px solid #f1f5f9", display: "flex", justifyContent: "space-between", alignItems: "center", background: "linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)" }}>
        <div>
          <div style={{ fontSize: "18px", fontWeight: 700, color: "#0f172a" }}>{isEditing ? "Edit Student" : "Add New Student"}</div>
          <div style={{ fontSize: "14px", color: "#64748b", marginTop: "4px" }}>{isEditing ? "Update the student information below" : "Fill in the form below to register a new student"}</div>
        </div>
        <button onClick={onCancel} style={{ background: "#f1f5f9", border: "none", borderRadius: "10px", padding: "10px", cursor: "pointer", color: "#64748b", display: "flex", alignItems: "center", transition: "all 0.3s ease" }}
          onMouseEnter={e => { e.currentTarget.style.background = "#e2e8f0"; e.currentTarget.style.transform = "rotate(90deg)"; }}
          onMouseLeave={e => { e.currentTarget.style.background = "#f1f5f9"; e.currentTarget.style.transform = "rotate(0deg)"; }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
        </button>
      </div>

      <div style={{ padding: "20px" }}>
        {serverError && (
          <div style={{ padding: "11px 14px", background: "#fef2f2", border: "1px solid #fecaca", borderRadius: "8px", color: "#b91c1c", fontSize: "13px", marginBottom: "16px" }}>{serverError}</div>
        )}

        <form onSubmit={onSubmit} noValidate>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "14px", marginBottom: "14px" }}>
            <Field label="First Name *" name="firstName" type="text" placeholder="e.g. Priyanshu" value={form.firstName} onChange={onChange} error={errors.firstName} />
            <Field label="Last Name *" name="lastName" type="text" placeholder="e.g. Shukla" value={form.lastName} onChange={onChange} error={errors.lastName} />
            <Field label="Email Address *" name="email" type="email" placeholder="e.g. student@kiit.ac.in" value={form.email} onChange={onChange} error={errors.email} />
            <div>
              <label style={{ display: "block", fontSize: "13px", fontWeight: 600, color: "#374151", marginBottom: "5px" }}>Course *</label>
              <select name="course" value={form.course} onChange={onChange}
                style={{ width: "100%", padding: "12px 14px", border: `2px solid ${errors.course ? "#fca5a5" : "#e2e8f0"}`, borderRadius: "10px", fontSize: "14px", fontFamily: "inherit", outline: "none", background: "white", color: form.course ? "#0f172a" : "#9ca3af", boxShadow: "0 2px 8px rgba(0,0,0,0.05)", transition: "all 0.3s ease" }}
                onFocus={e => { e.currentTarget.style.borderColor = "#3b82f6"; e.currentTarget.style.boxShadow = "0 4px 12px rgba(59, 130, 246, 0.2)"; }}
                onBlur={e => { e.currentTarget.style.borderColor = errors.course ? "#fca5a5" : "#e2e8f0"; e.currentTarget.style.boxShadow = "0 2px 8px rgba(0,0,0,0.05)"; }}>
                <option value="">Select a course</option>
                {["B.Tech CSE","B.Tech IT","BCA","MCA","MBA","B.Sc","M.Tech"].map(c => <option key={c} value={c}>{c}</option>)}
              </select>
              {errors.course && <div style={{ fontSize: "12px", color: "#dc2626", marginTop: "4px" }}>{errors.course}</div>}
            </div>
            <Field label="Age *" name="age" type="number" placeholder="e.g. 21" value={form.age} onChange={onChange} error={errors.age} extra={{ min: 15, max: 100 }} />
            <Field label="Phone Number" name="phone" type="text" placeholder="10-digit number" value={form.phone} onChange={onChange} error={errors.phone} extra={{ maxLength: 10 }} />
          </div>
          <Field label="Address" name="address" type="text" placeholder="e.g. Gola Bazar, Gorakhpur, UP" value={form.address} onChange={onChange} error="" />

          <div style={{ display: "flex", gap: "12px", marginTop: "24px" }}>
            <button type="submit" disabled={loading}
              style={{
                background: loading ? "linear-gradient(135deg, #9ca3af 0%, #6b7280 100%)" : "linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)",
                color: "white", border: "none", padding: "12px 28px", borderRadius: "10px", fontSize: "14px", fontWeight: 600,
                cursor: loading ? "not-allowed" : "pointer", fontFamily: "inherit", opacity: loading ? 0.7 : 1,
                boxShadow: loading ? "0 2px 8px rgba(107, 114, 128, 0.3)" : "0 4px 12px rgba(59, 130, 246, 0.3)",
                transition: "all 0.3s ease", display: "flex", alignItems: "center", gap: "8px"
              }}
              onMouseEnter={e => { if (!loading) { e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = "0 6px 20px rgba(59, 130, 246, 0.4)"; } }}
              onMouseLeave={e => { if (!loading) { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "0 4px 12px rgba(59, 130, 246, 0.3)"; } }}>
              {loading && (
                <div style={{
                  width: "16px", height: "16px", border: "2px solid rgba(255,255,255,0.3)",
                  borderTop: "2px solid white", borderRadius: "50%", animation: "spin 1s linear infinite"
                }}></div>
              )}
              {loading ? "Saving..." : isEditing ? "Save Changes" : "Add Student"}
            </button>
            <button type="button" onClick={onCancel}
              style={{ background: "white", color: "#374151", border: "2px solid #e2e8f0", padding: "12px 24px", borderRadius: "10px", fontSize: "14px", fontWeight: 600, cursor: "pointer", fontFamily: "inherit", transition: "all 0.3s ease" }}
              onMouseEnter={e => { e.currentTarget.style.background = "#f8fafc"; e.currentTarget.style.borderColor = "#cbd5e1"; e.currentTarget.style.transform = "translateY(-1px)"; }}
              onMouseLeave={e => { e.currentTarget.style.background = "white"; e.currentTarget.style.borderColor = "#e2e8f0"; e.currentTarget.style.transform = "translateY(0)"; }}>
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}