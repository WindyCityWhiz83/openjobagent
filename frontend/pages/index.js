import { useState } from 'react';
import axios from 'axios';

export default function Home() {
  const [jobs, setJobs] = useState([]);
  const [keywords, setKeywords] = useState('');
  const [resume, setResume] = useState('');
  const [generatedResume, setGeneratedResume] = useState('');

  const fetchJobs = async () => {
    try {
      const params = new URLSearchParams();
      if (keywords) params.append('query', keywords);
      const res = await axios.get('https://openjobagent.vercel.app/api/jobs?' + params.toString());
      setJobs(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const generateResume = async () => {
    try {
      const res = await axios.post('https://openjobagent.vercel.app/api/resume/generate', {
        resume_text: resume,
        job_description: keywords
      });
      setGeneratedResume(res.data.personalized_resume);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'sans-serif' }}>
      <h1>OpenJobAgent Demo</h1>
      <div style={{ marginBottom: '20px' }}>
        <input
          type="text"
          value={keywords}
          onChange={(e) => setKeywords(e.target.value)}
          placeholder="Job keywords"
          style={{ padding: '8px', width: '80%' }}
        />
        <button onClick={fetchJobs} style={{ padding: '8px', marginLeft: '8px' }}>Fetch Jobs</button>
      </div>
      <ul>
        {jobs && jobs.map((job) => (
          <li key={job.id || job.title} style={{ marginBottom: '10px', borderBottom: '1px solid #ccc' }}>
            <strong>{job.title}</strong>
            <p>{job.description}</p>
          </li>
        ))}
      </ul>
      <div style={{ marginTop: '40px' }}>
        <textarea
          value={resume}
          onChange={(e) => setResume(e.target.value)}
          placeholder="Paste your resume here"
          style={{ width: '100%', height: '150px', padding: '8px' }}
        ></textarea>
        <button onClick={generateResume} style={{ padding: '8px', marginTop: '8px' }}>Generate Personalized Resume</button>
        {generatedResume && (
          <div style={{ marginTop: '20px' }}>
            <h3>Personalized Resume</h3>
            <pre>{generatedResume}</pre>
          </div>
        )}
      </div>
    </div>
  );
}
