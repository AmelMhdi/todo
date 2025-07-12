import { Trash } from "lucide-react";


type Priority = "Low" | "Medium" | "High";

type Todo = {
  id: number;
  text: string;
  priority: Priority
}

type TodoItemProps = {
	todo: Todo
	onDelete: () => void
	isSelected?: boolean
	onSelect?: (id: number) => void
}

export default function TodoItem({ todo, onDelete, isSelected, onSelect }: TodoItemProps) {
	return (
		<li className="p-3">
			<div className="flex justify-between items-center">
				<div className="flex items-center gap-2">
					<input 
						type="checkbox"
						className="checkbox checkbox-sm"
						checked={isSelected}
						onChange={() => onSelect?.(todo.id)}
						aria-label={`Select task: ${todo.text}`}
					/>
					<span className="text-md font-semibold">
						<span>
							{todo.text}
						</span>
						<span>
							<span 
								className={`badge badge-sm badge-soft p-2 ml-2
									${todo.priority === "High" 
										? "badge-error" 
										: todo.priority === "Medium" 
											? "badge-warning" 
											: "badge-success"
									}
								`}>
								{todo.priority}
							</span>
						</span>
					</span>
				</div>
					<button 
						className="btn btn-sm btn-error btn-soft"
						onClick={onDelete}
						aria-label="Delete task"
					>
						<Trash 
							className="w-4 h-4" 
							aria-label={`Delete task: ${todo.text}`}
						/>
					</button>
			</div>
		</li>
	);
}