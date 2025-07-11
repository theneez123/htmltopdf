import { useState } from "react";

function Homepage() {
  const [progress, setProgress] = useState(0);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    date: "",
    message: "",
  });

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleDownloadPDF = async () => {
    setLoading(true);
    const interval = handleProgress();
    try {
      const response = await fetch(
        "https://htmltopdf-b7ag.onrender.com/api/generatepdf",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        }
      );

      if (!response.ok) throw new Error("Failed to generate PDF");

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "generated.pdf");
      document.body.appendChild(link);
      link.click();
      link.remove();

      setProgress(100);
    } catch (err) {
      console.error(err);
    } finally {
      clearInterval(interval);
      setLoading(false);
      setProgress(0);
    }
  };

  const handlePreview = async () => {
    setLoading(true);
    const interval = handleProgress();
    try {
      const response = await fetch(
        "https://htmltopdf-b7ag.onrender.com/api/preview",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        }
      );

      if (!response.ok) throw new Error("Failed to generate preview");

      const html = await response.text();
      const blob = new Blob([html], { type: "text/html" });
      const url = URL.createObjectURL(blob);

      window.open(url, "_blank");
      setProgress(100);
    } catch (err) {
      console.error(err);
    } finally {
      clearInterval(interval);
      setLoading(false);
      setProgress(0);
    }
  };

  const handleProgress = () => {
    setProgress(0);
    const interval = setInterval(() => {
      setProgress((oldProgress) => {
        if (oldProgress >= 90) {
          clearInterval(interval);
          return oldProgress;
        }
        return oldProgress + 10;
      });
    }, 200);
    return interval;
  };

  return (
    <div
      style={{
        padding: "2rem",
        backgroundColor: "#f9fdf9",
        minHeight: "100vh",
      }}
    >
      <div
        style={{
          maxWidth: "600px",
          margin: "0 auto",
          backgroundColor: "#fff",
          padding: "30px",
          borderRadius: "10px",
          boxShadow: "0 4px 10px rgba(0,0,0,0.05)",
        }}
      >
        <h2
          style={{
            textAlign: "center",
            color: "#28a745",
            marginBottom: "20px",
          }}
        >
          PDF Generator
        </h2>

        <label>Name</label>
        <input
          name="name"
          type="text"
          placeholder="Enter full name"
          onChange={handleChange}
          style={{
            width: "100%",
            padding: "10px",
            marginBottom: "15px",
            borderRadius: "6px",
            border: "1px solid #ccc",
          }}
          disabled={loading}
        />

        <label>Date of Birth</label>
        <input
          name="date"
          type="date"
          onChange={handleChange}
          style={{
            width: "100%",
            padding: "10px",
            marginBottom: "15px",
            borderRadius: "6px",
            border: "1px solid #ccc",
          }}
          disabled={loading}
        />

        <label>Message</label>
        <textarea
          name="message"
          placeholder="Enter personalized message..."
          onChange={handleChange}
          style={{
            width: "100%",
            padding: "10px",
            height: "120px",
            borderRadius: "6px",
            border: "1px solid #ccc",
            whiteSpace: "pre-wrap",
          }}
          disabled={loading}
        />

        {/* Progress Bar */}
        {loading && (
          <div
            style={{
              height: "6px",
              width: "100%",
              backgroundColor: "#e0e0e0",
              borderRadius: "3px",
              marginBottom: "20px",
              overflow: "hidden",
            }}
          >
            <div
              style={{
                height: "100%",
                width: `${progress}%`,
                backgroundColor: "#28a745",
                borderRadius: "3px",
                transition: "width 0.2s ease-in-out",
              }}
            />
          </div>
        )}

        <div style={{ marginTop: "20px", display: "flex", gap: "10px" }}>
          <button
            onClick={handlePreview}
            disabled={loading}
            style={{
              flex: 1,
              padding: "12px",
              backgroundColor: "#007bff",
              borderRadius: "6px",
              color: "white",
              border: "none",
              cursor: loading ? "not-allowed" : "pointer",
              opacity: loading ? 0.7 : 1,
            }}
          >
            Preview
          </button>

          <button
            onClick={handleDownloadPDF}
            disabled={loading}
            style={{
              flex: 1,
              padding: "12px",
              backgroundColor: "#28a745",
              borderRadius: "6px",
              color: "white",
              border: "none",
              cursor: loading ? "not-allowed" : "pointer",
              opacity: loading ? 0.7 : 1,
            }}
          >
            Download PDF
          </button>
        </div>
      </div>
    </div>
  );
}

export default Homepage;
