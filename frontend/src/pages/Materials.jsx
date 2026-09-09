import { useState, useEffect, useContext } from 'react';
import API from '../services/api';
import { AuthContext } from '../context/AuthContext';
import { FileText, Plus, ExternalLink, Trash2 } from 'lucide-react';

export default function Materials() {
  const [materials, setMaterials] = useState([]);
  const [formData, setFormData] = useState({ title: '', internshipId: '', fileUrl: '' });
  const [error, setError] = useState('');
  const { user } = useContext(AuthContext);

  useEffect(() => {
    fetchMaterials();
  }, []);

  const fetchMaterials = async () => {
    try {
      const { data } = await API.get('/materials');
      setMaterials(data);
    } catch (err) {
      setError('Failed to fetch materials');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await API.post('/materials', formData);
      setFormData({ title: '', internshipId: '', fileUrl: '' });
      fetchMaterials();
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to upload material');
    }
  };

 const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this material?")) return;
    try {
      await API.delete(`/materials/${id}`); 
      setMaterials(prev => prev.filter(item => item._id !== id));
    } catch (err) {
      console.error("Failed to delete item", err);
    }
  };

  return (
    <div className="page-container">
      <header style={{ marginBottom: '2rem' }}>
        <div>
          <h1 style={{ fontSize: '1.85rem', fontWeight: 700, color: '#274d35', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <FileText color="#3b6e51" size={32} /> Study Materials
          </h1>
          <p style={{ color: '#5a7665', fontSize: '0.95rem', marginTop: '0.25rem', fontWeight: 500 }}>
            Access lecture notes, reference documents, and study guides.
          </p>
        </div>
      </header>

      {error && <div style={{ marginBottom: '1.5rem', padding: '1rem', background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.3)', borderRadius: '0.75rem', color: '#b91c1c', fontSize: '0.9rem' }}>{error}</div>}

      {(user?.role === 'teacher' || user?.role === 'admin') && (
        <form onSubmit={handleSubmit} className="ims-card" style={{ marginBottom: '2.5rem' }}>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '1.25rem', color: '#234731', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Plus size={20} /> Upload Study Material
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem' }}>
            <input type="text" placeholder="Material Title" value={formData.title} onChange={(e) => setFormData({...formData, title: e.target.value})} required className="ims-input" />
            <input type="text" placeholder="Internship ID" value={formData.internshipId} onChange={(e) => setFormData({...formData, internshipId: e.target.value})} required className="ims-input" />
            <input type="text" placeholder="Document File URL" value={formData.fileUrl} onChange={(e) => setFormData({...formData, fileUrl: e.target.value})} required className="ims-input" />
          </div>
          <button type="submit" className="ims-btn-primary" style={{ marginTop: '1.25rem', width: 'auto', padding: '0.75rem 1.5rem' }}>
            Upload Document
          </button>
        </form>
      )}

      <div className="dashboard-grid">
        {materials.map((mat) => (
          <div key={mat._id} className="ims-card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#1b3826', marginBottom: '0.25rem' }}>{mat.title}</h3>
              <p style={{ fontSize: '0.8rem', color: '#7a9a85' }}>Internship: {mat.internshipId?.title || mat.internshipId || 'General Coursework'}</p>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <a href={mat.fileUrl} target="_blank" rel="noreferrer" style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', background: '#e4efe7', color: '#274d35', border: '1px solid #c2d5c5', padding: '0.5rem 1rem', borderRadius: '0.75rem', fontSize: '0.8rem', fontWeight: 600, textDecoration: 'none', whiteSpace: 'nowrap' }}>
                <ExternalLink size={14} /> Open File
              </a>
              {user?.role === 'admin' && (
                <button onClick={() => handleDelete(mat._id)} style={{ background: 'transparent', border: 'none', color: '#b91c1c', cursor: 'pointer', display: 'flex', alignItems: 'center' }} title="Delete Material">
                  <Trash2 size={18} />
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}