const noteEl = document.getElementById("note");
const saveEl = document.getElementById("save");
const statusEl = document.getElementById("status");

let notesApiUrl = null;

function setStatus(message, kind = "") {
  statusEl.textContent = message;
  statusEl.classList.remove("is-ok", "is-error");
  if (kind) statusEl.classList.add(kind);
}

function updateSaveEnabled() {
  const hasContent = noteEl.value.trim().length > 0;
  saveEl.disabled = !notesApiUrl || !hasContent || saveEl.dataset.busy === "1";
}

async function loadApiUrl() {
  try {
    const res = await fetch("./amplify_outputs.json", { cache: "no-store" });
    if (!res.ok) {
      throw new Error(`Could not load amplify_outputs.json (${res.status})`);
    }
    const outputs = await res.json();
    const url = outputs?.custom?.notesApiUrl;
    if (!url || typeof url !== "string") {
      throw new Error("amplify_outputs.json is missing custom.notesApiUrl");
    }
    notesApiUrl = url.replace(/\/$/, "");
    setStatus("Ready to save.");
  } catch (err) {
    notesApiUrl = null;
    setStatus(
      `API not configured. Run \`npx ampx sandbox\` (or deploy) so amplify_outputs.json includes notesApiUrl. ${err.message}`,
      "is-error"
    );
  }
  updateSaveEnabled();
}

async function saveNote() {
  const content = noteEl.value;
  if (!notesApiUrl || !content.trim()) return;

  saveEl.dataset.busy = "1";
  updateSaveEnabled();
  setStatus("Saving…");

  try {
    const res = await fetch(`${notesApiUrl}/notes`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ content }),
    });

    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      throw new Error(data.error || `Save failed (${res.status})`);
    }

    setStatus(`Saved as ${data.key}`, "is-ok");
  } catch (err) {
    setStatus(err.message || "Save failed.", "is-error");
  } finally {
    delete saveEl.dataset.busy;
    updateSaveEnabled();
  }
}

noteEl.addEventListener("input", updateSaveEnabled);
saveEl.addEventListener("click", saveNote);
loadApiUrl();
