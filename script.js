async function generate() {
  const promptBox = document.getElementById("prompt");
  const outputBox = document.getElementById("output");

  const userPrompt = promptBox.value.trim();

  if (!userPrompt) {
    outputBox.innerText = "⚠️ Please type a prompt first.";
    return;
  }

  outputBox.innerText = "⏳ Generating, please wait...";

  try {
    const response = await fetch("/api/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ prompt: userPrompt })
    });

    if (!response.ok) {
      outputBox.innerText = "❌ Server Error: " + response.status;
      return;
    }

    const data = await response.json();
    outputBox.innerText = data.code || "⚠️ No response received.";
  } catch (error) {
    outputBox.innerText = "❌ Error: " + error.message;
  }
}
