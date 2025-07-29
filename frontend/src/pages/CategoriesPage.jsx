// src/pages/CategoriesPage.jsx
import { useEffect, useState } from 'react';
import { fetchCategories, createCategory } from '../api/categories';

export default function CategoriesPage() {
  const [categories, setCategories] = useState([]);
  const [name, setName] = useState('');

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    const res = await fetchCategories();
    setCategories(res.data);
  };

  const handleSubmit = async e => {
    e.preventDefault();
    if (!name) return;
    await createCategory({ name });
    setName('');
    loadCategories();
  };

  return (
    <div className="p-4">
      <h1>Catégories</h1>

      <form onSubmit={handleSubmit} className="mb-6 space-x-2">
        <input
          value={name}
          onChange={e => setName(e.target.value)}
          placeholder="Nom de la catégorie"
          required
        />
        <button type="submit">Ajouter</button>
      </form>

      <ul className="space-y-2">
        {categories.map(c => (
          <li key={c.id} className="border p-2 rounded">{c.name}</li>
        ))}
      </ul>
    </div>
  );
}