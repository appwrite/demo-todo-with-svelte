import { ID, Models, Permission, Role } from 'appwrite';
import { get, writable } from 'svelte/store';
import { sdk, server } from './appwrite';

export type Todo = {
  content: string;
  isComplete: boolean;
} & Models.Document;

export type Alert = {
  color: string;
  message: string;
};

const createTodos = () => {
  const { subscribe, update, set } = writable<Todo[]>([]);

  return {
    subscribe,
    fetch: async () => {
      const response: any = await sdk.database.listDocuments(server.database, server.collection);
      console.log(response);
      return set(response.documents);
    },
    addTodo: async (content: string) => {
      const user = Role.user(get(state).account.$id);
      const todo = await sdk.database.createDocument<Todo>(
        server.database,
        server.collection,
        ID.unique(),
        {
          content,
          isComplete: false,
        },
        [
          Permission.read(user),
          Permission.update(user),
          Permission.delete(user),
        ]
      );

      return update((n) => [todo, ...n]);
    },
    removeTodo: async (todo: Todo) => {
      await sdk.database.deleteDocument(server.database, server.collection, todo.$id);
      return update((n) => n.filter((t) => t.$id !== todo.$id));
    },
    updateTodo: async (todo: Partial<Todo>) => {
      const user = Role.user(get(state).account.$id);
      await sdk.database.updateDocument(
        server.database,
        server.collection,
        todo.$id,
        todo,
        [
          Permission.read(user),
          Permission.update(user),
          Permission.delete(user),
        ]
      );
      return update((n) => {
        const index = n.findIndex((t) => t.$id === todo.$id);
        n[index] = {
          ...n[index],
          ...(<Todo>todo),
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
      return await sdk.account.create('unique()', email, password, name);
    },
    login: async (email: string, password: string) => {
      await sdk.account.createEmailSession(email, password);
      const user = await sdk.account.get();
      state.init(user);
    },
    logout: async () => {
      await sdk.account.deleteSession('current');
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
