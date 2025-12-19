import { useEffect, useState } from 'react'
import axios from 'axios'

function Todo() {
  const [todos, setTodos] = useState([])
  const [form, setForm] = useState({ title: '', description: '', priority: 'medium', status: 'pending' })
  const [editId, setEditId] = useState(null)

  const loadTodos = async () => {
    const res = await axios.get('http://3.80.221.204:5002/get')
    setTodos(res.data)
  }

  const saveTodo = async () => {
    if (editId) {
      await axios.put(`http://3.80.221.204:5002/put/${editId}`, form)
    } else {
      await axios.post('http://3.80.221.204:5002/post', form)
    }
    resetForm()
    loadTodos()
  }

  const deleteTodo = async (id) => {
    await axios.delete(`http://3.80.221.204:5002/delete/${id}`)
    loadTodos()
  }

  const markDone = async (id) => {
    await axios.patch(`http://3.80.221.204:5002/patch/${id}`, { status: 'completed' })
    loadTodos()
  }

  const editTodo = (todo) => {
    setEditId(todo.todo_id)
    setForm({ title: todo.title, description: todo.description, priority: todo.priority, status: todo.status })
  }

  const resetForm = () => {
    setForm({ title: '', description: '', priority: 'medium', status: 'pending' })
    setEditId(null)
  }

  useEffect(() => {
    loadTodos()
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-r from-purple-100 to-blue-100 flex justify-center items-center">
      <div className="bg-white w-[500px] rounded-xl shadow-lg p-6">
        <h1 className="text-2xl font-bold text-center text-purple-700 mb-4">Todo App</h1>

        <input
          className="border border-gray-300 rounded p-2 w-full mb-2 focus:outline-none focus:ring-2 focus:ring-purple-400"
          placeholder="Title"
          value={form.title}
          onChange={e => setForm({ ...form, title: e.target.value })}
        />
        <input
          className="border border-gray-300 rounded p-2 w-full mb-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
          placeholder="Description"
          value={form.description}
          onChange={e => setForm({ ...form, description: e.target.value })}
        />
        <select
          className="border border-gray-300 rounded p-2 w-full mb-2"
          value={form.priority}
          onChange={e => setForm({ ...form, priority: e.target.value })}
        >
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
        </select>
        <select
          className="border border-gray-300 rounded p-2 w-full mb-2"
          value={form.status}
          onChange={e => setForm({ ...form, status: e.target.value })}
        >
          <option value="pending">Pending</option>
          <option value="in_progress">In Progress</option>
          <option value="completed">Completed</option>
        </select>

        <button
          onClick={saveTodo}
          className={`w-full py-2 mb-3 text-white rounded ${editId ? 'bg-yellow-500 hover:bg-yellow-600' : 'bg-purple-500 hover:bg-purple-600'}`}
        >
          {editId ? 'Update Todo' : 'Add Todo'}
        </button>

        <button
          onClick={resetForm}
          className="w-full py-2 mb-4 bg-gray-400 text-white rounded"
        >
          Reset
        </button>

        <div className="max-h-[300px] overflow-y-auto">
          {todos.map(todo => (
            <div key={todo.todo_id} className="flex justify-between items-center bg-gray-50 border rounded-lg p-3 mb-2 hover:shadow">
              <div>
                <p className="font-semibold text-gray-700">{todo.title}</p>
                <p className="text-sm text-gray-500">{todo.description}</p>
                <p className="text-sm text-gray-500">Priority: {todo.priority} | Status: {todo.status}</p>
              </div>
              <div className="flex gap-2">
                <button onClick={() => editTodo(todo)} className="px-3 py-1 text-sm bg-green-500 text-white rounded hover:bg-green-600">Edit</button>
                <button onClick={() => markDone(todo.todo_id)} className="px-3 py-1 text-sm bg-blue-500 text-white rounded hover:bg-blue-600">Done</button>
                <button onClick={() => deleteTodo(todo.todo_id)} className="px-3 py-1 text-sm bg-red-500 text-white rounded hover:bg-red-600">Delete</button>
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  )
}

export default Todo;

