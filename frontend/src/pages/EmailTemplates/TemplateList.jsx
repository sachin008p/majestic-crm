import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './EmailTemplates.css';

const TemplateList = () => {
  const [templates, setTemplates] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetch('/api/templates')
      .then((res) => res.json())
      .then(setTemplates)
      .catch(console.error);
  }, []);

  const handleEdit = (id) => {
    navigate(`/templates/${id}/edit`);
  };

  const handleDuplicate = async (id) => {
    const tmpl = templates.find((t) => t.id === id);
    const duplicated = { ...tmpl, name: `${tmpl.name} (Copy)`, id: undefined };
    await fetch('/api/templates', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(duplicated),
    });
    // refresh list
    const refreshed = await fetch('/api/templates').then((r) => r.json());
    setTemplates(refreshed);
  };

  const handleDelete = async (id) => {
    await fetch(`/api/templates/${id}`, { method: 'DELETE' });
    setTemplates(templates.filter((t) => t.id !== id));
  };

  return (
    <div className="template-list container">
      <h2 className="title">📧 Email Templates</h2>
      <button className="btn-primary" onClick={() => navigate('/templates/new')}>+ New Template</button>
      <div className="grid">
        {templates.map((t) => (
          <div key={t.id} className="card glass">
            <h3>{t.name}</h3>
            <p className="subject">{t.subject}</p>
            <p className="category">{t.category || 'Uncategorized'}</p>
            <div className="actions">
              <button className="btn-small" onClick={() => handleEdit(t.id)}>✏️ Edit</button>
              <button className="btn-small" onClick={() => handleDuplicate(t.id)}>📄 Duplicate</button>
              <button className="btn-danger" onClick={() => handleDelete(t.id)}>🗑 Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TemplateList;
