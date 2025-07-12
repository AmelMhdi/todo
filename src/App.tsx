import { useEffect, useState } from "react";
import TodoItem from "./TodoItem";
import { Construction } from "lucide-react";

type Priority = "Low" | "Medium" | "High";

type Todo = {
  id: number;
  text: string;
  priority: Priority
}

function App() {
  const [input, setInput] = useState<string>("");
  const [priority, setPriority] = useState<Priority | null>(null);

  const savedTodos = localStorage.getItem("todos");
  const initialTodos: Todo[] = savedTodos ? JSON.parse(savedTodos) : [];
  const [todos, setTodos] = useState<Todo[]>(initialTodos);
  const [filter, setFilter] = useState<Priority | "All">("All");

  useEffect(() => {
    localStorage.setItem("todos", JSON.stringify(todos));
  }, [todos])

  function addTodo() {
    if (input.trim() == "") {
      return
    }

    const newTodo: Todo = {
      id: Date.now(),
      text: input.trim(),
      priority: priority ?? "Low"
    }

    const newTodos = [newTodo, ...todos]
    setTodos(newTodos);
    setInput("");
    setPriority(null);
    console.log(newTodos);
  }

  let filteredTodos: Todo[] = []
  if (filter === "All") {
    filteredTodos = todos;
  } else {
    filteredTodos = todos.filter(todo => todo.priority === filter);
  }

  const highCount = todos.filter((todo) => todo.priority === "High").length
  const mediumCount = todos.filter((todo) => todo.priority === "Medium").length
  const lowCount = todos.filter((todo) => todo.priority === "Low").length
  const totalCount = todos.length

  function deleteTodo(id: number) {
    const newTodos = todos.filter(todo => todo.id !== id)
    setTodos(newTodos);
  }

  const [selectedTodos, setSelectedTodos] = useState<Set<number>>(new Set());

  function toggleSelectTodo(id: number) {
    const newSelectedTodos = new Set(selectedTodos)
    if (newSelectedTodos.has(id)) {
      newSelectedTodos.delete(id)
    } else {
      newSelectedTodos.add(id)
    }
    setSelectedTodos(newSelectedTodos)
  }

  function clearSelectedTodos() {
    const newTodos = todos.filter((todo) => {
      if (selectedTodos.has(todo.id)) {
        return false
      } else {
        return true
      }
    })
    setTodos(newTodos)
    setSelectedTodos(new Set());
  }
  
  return (
    <>
      <div className="flex justify-center">
        <div className="w-2/3 flex flex-col gap-4 my-15 bg-base-300 p-5 rounded-xl">
          <div className="flex gap-4">
            <input 
              type="text" 
              className="input w-full"
              placeholder="Add a new task"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              aria-label="New task input"
            />
            <select 
              className="select w-full"
              value={priority ?? ""}
              onChange={(e) => setPriority(e.target.value as Priority)}
              aria-label="Select task priority"
            >
              <option value="" disabled>
              Select priority
              </option>
              <option value="High">High</option>
              <option value="Medium">Medium</option>
              <option value="Low">Low</option>
            </select>
            <button 
              className="btn btn-primary"
              onClick={addTodo}
              aria-label="Add new task"
            >
              Add Task
            </button>
          </div>

          <div className="space-y-2 flex-1 h-fit">
            <div className="flex items-center justify-between gap-2">
              <div className="flex flex-wrap gap-4">
                <button
                  className={`btn btn-soft ${filter === "All" ? "btn-primary" : ""}`}
                  onClick={() => setFilter("All")}
                  aria-label="Show all tasks"
                >
                  All ({totalCount})
                </button>
                <button
                  className={`btn btn-soft ${filter === "High" ? "btn-primary" : ""}`}
                  onClick={() => setFilter("High")}
                  aria-label="Show high priority tasks"
                >
                  High ({highCount})
                </button>
                <button
                  className={`btn btn-soft ${filter === "Medium" ? "btn-primary" : ""}`}
                  onClick={() => setFilter("Medium")}
                  aria-label="Show medium priority tasks"
                >
                  Medium ({mediumCount})
                </button>
                <button
                  className={`btn btn-soft ${filter === "Low" ? "btn-primary" : ""}`}
                  onClick={() => setFilter("Low")}
                  aria-label="Show low priority tasks"
                >
                  Low ({lowCount})
                </button>
              </div>

              <button 
                className="btn btn-primary"
                disabled={selectedTodos.size === 0}
                onClick={clearSelectedTodos}
                aria-label="Clear selected tasks"
              >
                Clear selection ({selectedTodos.size})
              </button>
            </div>

            {filteredTodos.length > 0 ? (
              <ul className="divide-y divide-primary/20">
                {filteredTodos.map((todo) => (
                  <li key={todo.id} className="py-2">
                    <TodoItem 
                      todo={todo} 
                      onDelete={() => deleteTodo(todo.id)} 
                      isSelected={selectedTodos.has(todo.id)}
                      onSelect={() => toggleSelectTodo(todo.id)}
                      aria-label={`Select task ${todo.text} with priority ${todo.priority}`}
                    />
                  </li>
                ))}
              </ul>
            ) : (
              <div className="flex justify-center items-center flex-col p-5 bg-base-200 rounded-lg">
                <div>
                  <Construction 
                    className="w-30 h-30 text-primary mx-auto" 
                    aria-label="No tasks available"
                  />
                  <p className="text-center">No tasks available for the selected filter.</p>
                  <p className="text-center">Add a task to get started.</p>
                </div>
              </div>
            )}

          </div>
        </div>

      </div>
    </>
  )
}

export default App
