import { get, writable } from "svelte/store";
import { sdk, server } from "./appwrite";

export type Todo = {
  $collection: string;
  $id: string;
  $permissions: {
    read: string[];
    write: string[];
  }
  content: string;
  isComplete: boolean;
}

export type Alert = {
  color: string;
  message: string;
}

const createTodos = () => {
  const { subscribe, update, set } = writable<Todo[]>([]);

  return {
    subscribe,
    fetch: async () => {
      const response: any = await sdk.database.listDocuments(server.collection);
      return set(response.documents);
    },
    addTodo: async (content: string) => {
      const permissions = [`user:${get(state).account.$id}`];
      const todo = <Todo>await sdk.database.createDocument(
        server.collection,
        {
          content,
          isComplete: false,
        },
        permissions,
        permissions
      );

      return update((n) => [todo, ...n]);
    },
    removeTodo: async (todo: Todo) => {
      await sdk.database.deleteDocument(server.collection, todo.$id);
      return update((n) => n.filter((t) => t.$id !== todo.$id));
    },
    updateTodo: async (todo: Partial<Todo>) => {
      const permissions = [`user:${get(state).account.$id}`];
      await sdk.database.updateDocument(
        server.collection,
        todo.$id,
        todo,
        permissions,
        permissions
      );
      return update((n) => {
        const index = n.findIndex((t) => t.$id === todo.$id);
        n[index] = {
          ...n[index],
          ...<Todo>todo
        };
        return n;
      });
    },
  };
};

const createState = () => {
  const { subscribe, set, update } = writable({
    account: null,
    alert: null,
  });

  return {
    subscribe,
    signup: async (email: string, password: string, name: string) => {
      return await sdk.account.create(email, password, name);
    },
    login: async (email: string, password: string) => {
      await sdk.account.createSession(email, password);
      const user = await sdk.account.get();
      state.init(user);
    },
    logout: async () => {
      await sdk.account.deleteSession("current");
    },
    alert: async (alert: Alert) =>
      update((n) => {
        n.alert = alert;
        return n;
      }),
    init: async (account = null) => {
      return set({ account, alert: null });
    },
  };
};

export const todos = createTodos();
export const state = createState();
