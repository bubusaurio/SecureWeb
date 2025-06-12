import React, { useEffect, useState } from 'react';

export default function TodoList({ userEmail, userRole }) {
  const [todos, setTodos] = useState([]);
  const [newTodo, setNewTodo] = useState('');
  const [msg, setMsg] = useState('');

  useEffect(() => {
    fetchTodos();
  }, []);

  const fetchTodos = async () => {
    const res = await fetch('http://localhost:3005/todos');
    const data = await res.json();
    setTodos(data);
  };

  const handleAdd = async (e) => {
    e.preventDefault();
    setMsg('');
    if (!newTodo.trim()) return;
    const res = await fetch('http://localhost:3005/todos', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text: newTodo, email: userEmail })
    });
    if (res.ok) {
      setNewTodo('');
      fetchTodos();
    } else {
      const data = await res.json();
      setMsg(data.error || 'Error adding todo');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this todo?')) return;
    const res = await fetch(`http://localhost:3005/todos/${id}`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: userEmail })
    });
    if (res.ok) fetchTodos();
    else setMsg('Error deleting');
  };

  const handleUpdate = async (id, text) => {
    const newText = prompt('Edit todo:', text);
    if (!newText || newText === text) return;
    const res = await fetch(`http://localhost:3005/todos/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text: newText, email: userEmail })
    });
    if (res.ok) fetchTodos();
    else setMsg('Error updating');
  };

  return (
    <div className="max-w-xl mx-auto mt-10 bg-white p-6 rounded shadow">
      <h2 className="text-2xl font-bold mb-4 text-blue-700">To-Do List</h2>
      {userRole === 'admin' && (
        <form onSubmit={handleAdd} className="flex mb-4">
          <input
            className="flex-1 border rounded-l px-3 py-2"
            value={newTodo}
            onChange={e => setNewTodo(e.target.value)}
            placeholder="Nueva tarea"
          />
          <button className="bg-blue-600 text-white px-4 py-2 rounded-r hover:bg-blue-700" type="submit">
            Agregar
          </button>
        </form>
      )}
      {msg && <div className="text-red-500 mb-2">{msg}</div>}
      <ul>
        {todos.map(todo => (
          <li key={todo.id} className="flex items-center justify-between border-b py-2">
            <span>{todo.text}</span>
            <div className="flex gap-2">
              {userRole === 'admin' && (
                <>
                  <button className="text-yellow-600" onClick={() => handleUpdate(todo.id, todo.text)}>Editar</button>
                  <button className="text-red-600" onClick={() => handleDelete(todo.id)}>Eliminar</button>
                </>
              )}
              {userRole === 'user' && (
                <button className="text-yellow-600" onClick={() => handleUpdate(todo.id, todo.text)}>Editar</button>
              )}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
