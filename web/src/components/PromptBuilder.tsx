export default function PromptBuilder() {
  return (
    <div className="prompt-builder">
      <h1>MuseForge Studio</h1>
      <p>AI Beauty Prompt Generator</p>

      <div>
        <label>Country</label>
        <select>
          <option>China</option>
          <option>Japan</option>
          <option>France</option>
        </select>
      </div>

      <div>
        <label>Beauty Style</label>
        <select>
          <option>Eastern Classical Beauty</option>
          <option>French Elegant Beauty</option>
          <option>Fantasy Goddess</option>
        </select>
      </div>

      <button>Generate Prompt</button>
    </div>
  );
}
