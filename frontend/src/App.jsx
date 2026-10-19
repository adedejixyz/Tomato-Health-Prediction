import { useEffect, useRef, useState } from 'react';

const API_URL = (import.meta.env.VITE_API_URL || '').replace(/\/$/, '');

function LeafMark() {
  return <span className="leaf-mark" aria-hidden="true">✳</span>;
}

function App() {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState('');
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [dragging, setDragging] = useState(false);
  const inputRef = useRef(null);

  useEffect(() => {
    if (!file) { setPreview(''); return undefined; }
    const url = URL.createObjectURL(file);
    setPreview(url);
    return () => URL.revokeObjectURL(url);
  }, [file]);

  function chooseFile(nextFile) {
    setError('');
    setResult(null);
    if (!nextFile) return;
    if (!nextFile.type.startsWith('image/')) {
      setFile(null);
      setError('Please choose an image file, such as a JPG or PNG.');
      return;
    }
    setFile(nextFile);
  }

  async function analyse() {
    if (!file || loading) return;
    if (!API_URL) {
      setError('The prediction API URL is not configured. Set VITE_API_URL and restart the frontend.');
      return;
    }
    setLoading(true);
    setError('');
    setResult(null);
    const body = new FormData();
    body.append('file', file);
    try {
      const response = await fetch(`${API_URL}/predict`, { method: 'POST', body });
      const data = await response.json().catch(() => ({}));
      if (!response.ok) {
        const detail = typeof data.detail === 'string' ? data.detail : 'The server could not analyse this image.';
        throw new Error(detail);
      }
      if (typeof data.class !== 'string' || typeof data.confidence !== 'number') {
        throw new Error('The API response did not include a disease and confidence score.');
      }
      setResult(data);
    } catch (err) {
      setError(err instanceof TypeError
        ? 'Could not reach the prediction API. Check that the backend is running at the configured URL.'
        : err.message || 'Something went wrong while analysing the image.');
    } finally {
      setLoading(false);
    }
  }

  function reset() {
    setFile(null);
    setResult(null);
    setError('');
    if (inputRef.current) inputRef.current.value = '';
  }

  const confidence = result ? `${(result.confidence * 100).toFixed(2)}%` : '';

  return (
    <div className="page-shell">
      <header className="topbar">
        <a className="brand" href="#top" aria-label="Tomato Health home"><LeafMark /><span>tomato<span className="brand-light">health</span></span></a>
        <span className="top-note"><span className="status-dot" /> AI-powered leaf check</span>
      </header>

      <main id="top">
        <section className="hero">
          <div className="hero-copy">
            <div className="eyebrow"><span /> YOUR GARDEN, HEALTHIER</div>
            <h1>Know your leaves.<br /><em>Grow with confidence.</em></h1>
            <p className="intro">Upload a photo of a tomato leaf and get a quick health prediction from your image.</p>
            <div className="trust-row"><span className="trust-icon">⌁</span><span>Simple, clear, and made for growers</span></div>
          </div>
          <div className="hero-art" aria-hidden="true">
            <div className="art-orbit orbit-one" /><div className="art-orbit orbit-two" />
            <div className="art-card"><span className="art-spark">✳</span><span className="art-leaf">❧</span><span className="art-caption">A closer look<br />at plant health</span></div>
            <span className="art-dot dot-one" /><span className="art-dot dot-two" /><span className="art-dot dot-three" />
          </div>
        </section>

        <section className="workspace" aria-label="Tomato leaf analysis">
          <div className="section-heading"><div><span className="step-label">01 <i /> ANALYSE A LEAF</span><h2>Start with a photo</h2></div><span className="private-note"><span>✓</span> Your image is only used for this prediction</span></div>
          <div className={`upload-panel ${dragging ? 'is-dragging' : ''} ${preview ? 'has-preview' : ''}`}
            onDragOver={(event) => { event.preventDefault(); setDragging(true); }}
            onDragLeave={(event) => { if (!event.currentTarget.contains(event.relatedTarget)) setDragging(false); }}
            onDrop={(event) => { event.preventDefault(); setDragging(false); chooseFile(event.dataTransfer.files?.[0]); }}>
            <input ref={inputRef} className="visually-hidden" id="leaf-file" type="file" accept="image/*" onChange={(event) => chooseFile(event.target.files?.[0])} />
            {preview ? (
              <div className="preview-layout">
                <div className="preview-image-wrap"><img className="preview-image" src={preview} alt="Selected tomato leaf" /></div>
                <div className="preview-info"><span className="file-badge">IMAGE READY</span><h3>Your leaf is ready</h3><p className="filename">{file?.name}</p><p className="hint">When you’re ready, analyse the image to see the prediction.</p>
                  <div className="preview-actions"><button className="button button-primary" onClick={analyse} disabled={loading}>{loading ? <><span className="spinner" /> Analysing…</> : <>Analyse leaf <span>→</span></>}</button><button className="text-button" onClick={() => inputRef.current?.click()} disabled={loading}>Choose another image</button></div>
                </div>
              </div>
            ) : (
              <div className="drop-content"><div className="upload-icon"><svg viewBox="0 0 32 32" fill="none" aria-hidden="true"><path d="M16 21V7m0 0L10.5 12.5M16 7l5.5 5.5M7 20v5a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" /></svg></div>
                <h3>Drop your leaf photo here</h3><p>or <button className="browse-button" onClick={() => inputRef.current?.click()}>browse files</button> from your device</p><span className="file-types">JPG, PNG or WEBP · Image files only</span>
              </div>
            )}
          </div>

          {error && <div className="error-message" role="alert"><span className="error-icon">!</span><div><strong>We couldn’t analyse that image</strong><p>{error}</p></div><button onClick={() => setError('')} aria-label="Dismiss error">×</button></div>}

          {result && <section className="result-card" aria-live="polite"><div className="result-icon">✓</div><div className="result-copy"><span className="result-label">PREDICTION RESULT</span><h3>{result.class.replaceAll('_', ' ')}</h3><p>Predicted condition from your uploaded leaf image.</p></div><div className="confidence"><span>CONFIDENCE</span><strong>{confidence}</strong></div><button className="button button-secondary" onClick={reset}>Analyse another <span>↗</span></button></section>}

          <div className="how-row"><div className="how-item"><span className="how-number">1</span><span><strong>Upload</strong><small>Choose a clear leaf photo</small></span></div><span className="how-line" /><div className="how-item"><span className="how-number">2</span><span><strong>Analyse</strong><small>Let the model check the image</small></span></div><span className="how-line" /><div className="how-item"><span className="how-number">3</span><span><strong>Understand</strong><small>Review the prediction result</small></span></div></div>
        </section>
      </main>
      <footer><span><LeafMark /> Tomato Health Prediction</span><span>Built to help your garden thrive</span></footer>
    </div>
  );
}

export default App;
