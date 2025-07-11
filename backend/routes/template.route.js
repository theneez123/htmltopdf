import express from "express";
import puppeteer from "puppeteer";
import fs from "fs";
import { fileURLToPath } from "url";
import path from "path";

export const router = express.Router();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

router.post("/generatepdf", async (req, res) => {
  try {
    const { name, date, message } = req.body;

    const templatePath = path.join(__dirname, "../templates/template.html");
    let template = fs.readFileSync(templatePath, "utf8");

    template = template.replace("{{name}}", name || "Unknown");
    template = template.replace("{{date}}", date || new Date().toISOString());
    template = template.replace("{{message}}", message || "");

    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.setContent(template, { waitUntil: "networkidle0" });

    const pdfBuffer = await page.pdf({ format: "A4", printBackground: true });
    await browser.close();

    res.set({
      "Content-Type": "application/pdf",
      "Content-Disposition": "attachment; filename=generated.pdf",
    });
    res.send(pdfBuffer);
  } catch (err) {
    console.error("PDF generation error:", err);
    res.status(500).send("Error generating PDF");
  }
});

router.post("/preview", async (req, res) => {
  try {
    const { name, date, message } = req.body;

    const templatePath = path.join(__dirname, "../templates/template.html");
    let template = fs.readFileSync(templatePath, "utf8");

    template = template.replace("{{name}}", name || "Unknown");
    template = template.replace("{{date}}", date || new Date().toISOString());
    template = template.replace("{{message}}", message || "");

    template += `
      <form method="POST" action="http://localhost:5000/api/generatepdf" style="text-align:center; margin-top:40px;" target="_blank">
        <input type="hidden" name="name" value="${(name || "Unknown").replace(
          /"/g,
          "&quot;"
        )}" />
        <input type="hidden" name="date" value="${(
          date || new Date().toISOString()
        ).replace(/"/g, "&quot;")}" />
        <input type="hidden" name="message" value="${(message || "").replace(
          /"/g,
          "&quot;"
        )}" />
        <button type="submit" style="
          padding: 12px 24px;
          background-color: #28a745;
          color: white;
          border: none;
          border-radius: 6px;
          font-size: 16px;
          cursor: pointer;
        ">
          Download PDF
        </button>
      </form>
    `;

    res.set("Content-Type", "text/html");
    res.send(template);
  } catch (err) {
    console.error(err);
    res.status(500).send("Error generating preview");
  }
});

export default router;
