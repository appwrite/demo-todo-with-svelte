import { update_keyed_each } from "svelte/internal";
import { get, writable } from "svelte/store";
import { sdk } from "./appwrite";

const createTodos = () => {
    const { subscribe, update, set } = writable([]);

    return {
        subscribe,
        fetch: async () => {
            const response:any = await sdk.database.listDocuments("60631b201eec4");
            return set(response.documents);
        },
        addTodo: async (content) => {
            const permissions = [`user:${get(state).account.$id}`];
            const todo = await sdk.database.createDocument("60631b201eec4", {
                content,
                isComplete: false
            }, permissions, permissions);

            return update(n => [
                todo,
                ...n
            ]);
        },
        removeTodo: async (todo) => {
            await sdk.database.deleteDocument("60631b201eec4", todo.$id);
            return update(n => n.filter(t => t.$id !== todo.$id));
        },
        updateTodo: async (todo) => {
            const permissions = [`user:${get(state).account.$id}`];
            await sdk.database.updateDocument("60631b201eec4", todo.$id, todo, permissions, permissions)
            return update(n => {
                n[n.findIndex(t => t.$id === todo.$id)] = todo;
                return n;
            })
        },
    }
}

const createState = () => {
    const { subscribe, set, update } = writable({
        account: null,
        alert: null
    });

    return {
        subscribe,
        signup: async (email, password, name) => {
            return await sdk.account.create(email, password, name);
        },
        login: async (email, password) => {
            await sdk.account.createSession(email, password);
            const user = await sdk.account.get();
            state.init(user);
        },
        logout: async () => {
            await sdk.account.deleteSession("current");
        },
        alert: async (alert) => update(n => {
            n.alert = alert
            return n;
        }),
        init: async (account = null) => {
            return set({ account, alert: null });
        }
    }
}

export const todos = createTodos();
export const state = createState();

