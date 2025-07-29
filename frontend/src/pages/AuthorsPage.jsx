// src/pages/AuthorsPage.jsx
import { useEffect, useState } from 'react';
import {
  fetchAuthors,
  createAuthor,
  updateAuthor,
  deleteAuthor
} from '../api/authors';

export default function AuthorsPage() {
  const [authors, setAuthors] = useState([]);
  const [form, setForm] = useState({ firstName: '', lastName: '', biography: '' });
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    loadAuthors();
  }, []);

  const loadAuthors = async () => {
    const res = await fetchAuthors();
    setAuthors(res.data);
  };

  const handleChange = e => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async e => {
    e.preventDefault();
    if (editingId) {
      await updateAuthor(editingId, form);
    } else {
      await createAuthor(form);
    }
    setForm({ firstName: '', lastName: '', biography: '' });
    setEditingId(null);
    loadAuthors();
  };

  const handleEdit = author => {
    setForm({ 
      firstName: author.firstName, 
      lastName: author.lastName, 
      biography: author.biography || '' 
    });
    setEditingId(author.id);
  };

  const handleDelete = async id => {
    if (window.confirm('Supprimer cet auteur ?')) {
      await deleteAuthor(id);
      loadAuthors();
    }
  };

  return (
    <div className="p-4">
      <h1>Auteurs</h1>

      <form onSubmit={handleSubmit} className="mb-6 space-y-2">
        <input
          name="firstName"
          value={form.firstName}
          onChange={handleChange}
          placeholder="Prénom"
          required
        />
        <input
          name="lastName"
          value={form.lastName}
          onChange={handleChange}
          placeholder="Nom"
          required
        />
        <textarea
          name="biography"
          value={form.biography}
          onChange={handleChange}
          placeholder="Biographie (optionnelle)"
        />
        <button type="submit">
          {editingId ? 'Mettre à jour' : 'Ajouter'}
        </button>
        {editingId && (
          <button type="button" onClick={() => { setEditingId(null); setForm({ firstName:'', lastName:'', biography:'' }); }}>
            Annuler
          </button>
        )}
      </form>

      <ul className="space-y-2">
        {authors.map(a => (
          <li key={a.id} className="border p-2 rounded">
            {a.firstName} {a.lastName}
            <button onClick={() => handleEdit(a)} style={{ marginLeft: 8 }}>✏️</button>
            <button onClick={() => handleDelete(a.id)} style={{ marginLeft: 8 }}>🗑️</button>
          </li>
        ))}
      </ul>
    </div>
  );
}