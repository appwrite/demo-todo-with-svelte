<script lang="ts">
    import type { Todo } from "../store";
    import { todos } from "../store";

    import IconDelete from "../assets/delete.svg";

    export let todo: Todo;

    const remove = async () => {
        await todos.removeTodo(todo);
    };

    const toggle = (e: Event) => {
        const isComplete = (<HTMLInputElement>e.target).checked;
        todos.updateTodo({
            $id: todo.$id,
            isComplete,
        });
    };
</script>

<li class="flex justify-between items-center mt-4 px-4">
    <div class="flex">
        <input
            type="checkbox"
            bind:checked={todo.isComplete}
            on:change={toggle}
            class="h-6 w-6 text-green-500 rounded-md border-4 border-green-200 focus:ring-0 transition duration-75 ease-in-out transform hover:scale-125"
        />
        <div
            class="capitalize ml-3 text-md font-medium"
            class:line-through={todo.isComplete}
        >
            {todo.content}
        </div>
    </div>
    <button
        on:click={remove}
        class="focus:outline-none transition duration-75 ease-in-out transform hover:scale-125"
    >
        <img
            class="w-6 h-6 inline stroke-current fill-current text-red-500"
            alt="Delete"
            src={IconDelete}
        />
    </button>
</li>
