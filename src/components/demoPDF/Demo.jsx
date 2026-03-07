import axios from 'axios';
import React, { useState } from 'react';

function App() {
  const [file, setFile] = useState(null);
  const [text, setText] = useState('');
  const [error, setError] = useState('');

  const handleChange = (event) => {
    setFile(event.target.files[0]);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!file) {
      setError('Please select a file.');
      return;
    }
    // Helper to ensure URL has protocol
    const ensureProtocol = (url) => {
        if (!url) return '';
        if (!url.startsWith('http://') && !url.startsWith('https://')) {
            return `https://${url}`;
        }
        return url;
    };

    const pythonBaseUrl = ensureProtocol(import.meta.env.VITE_PYTHON_API_BASE_URL);
    const nodeBaseUrl = ensureProtocol(import.meta.env.VITE_API_BASE_URL);

    console.log(file);
    const formData = new FormData();
    formData.append('file', file);
    console.log(formData);
    try {
      const response = await fetch(`${pythonBaseUrl}/api/extract-text`, {
        method: 'POST',
        body: formData,
      });
      console.log(response.ok);
      if (!response.ok) {
        throw new Error('Error extracting text.');
      }

      const data = await response.json();
      console.log(data.text);
      setText(data.text);
      const res = await axios.post(
          `${nodeBaseUrl}/ai/getSkills`, 
          {text: data.text},
          { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
      );
    //   let tmp = await res.json();
      console.log(res.data.text);
      setError('');
    } catch (error) {
      console.error('Error:', error);
      setError('Error extracting text.');
    }
  };

  return (
    <div>
      <h1>PDF Text Extractor</h1>
      <form onSubmit={handleSubmit}>
        <input type="file" onChange={handleChange} />
        <button type="submit">Extract Text</button>
      </form>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {text && (
        <div>
          <h2>Extracted Text:</h2>
          <p>{text}</p>
        </div>
      )}
    </div>
  );
}

export default App;
