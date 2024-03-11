import {
  useCallback, useEffect, useRef, useState,
} from 'react';

import { Ui } from '@mehrzweck/ui';

type Todo = {
  userId: number;
  id: number;
  title: string;
  completed: boolean;
};

type FormState = string | null;

const useOptimistic = <T = unknown>(
  initialState: T,
): [T, boolean, (actionFunction: (data: T) => Promise<T>, input: T) => void] => {
  const [ state, setState ] = useState<T>(initialState);
  const [ isSubmitting, setIsSubmitting ] = useState<boolean>(false);

  const optimisticAction = useCallback(
    async (actionFunction: (data: T) => Promise<T>, input: T) => {
      setIsSubmitting(true);

      try {
        const result = await actionFunction(input);

        setState(result);
      } catch (error) {
        // Handle errors if needed
        window.console.error('Error occurred:', error);
      } finally {
        setIsSubmitting(false);
      }
    },
    [],
  );

  return [ state, isSubmitting, optimisticAction ];
};

function useInViewport<T extends HTMLElement>(ref: React.RefObject<T>, options?: IntersectionObserverInit) {
  const [ inViewport, setInViewport ] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(([ entry ]) => {
      setInViewport(entry.isIntersecting);
    }, options);

    const currentRef = ref.current;

    if (currentRef) {
      observer.observe(currentRef);
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
    };
  }, [ options, ref ]);

  return inViewport;
}

export function App() {
  const ref = useRef<HTMLDivElement>(null);
  const inViewport = useInViewport(ref, { threshold: 0.25, rootMargin: '0px' });
  const [ todos, setTodos ] = useState<Todo[]>([]);

  const getTodos = async () => {
    const response = await fetch('https://jsonplaceholder.typicode.com/todos');
    const data = await response.json() as Todo[];

    setTodos(data);
  };

  useEffect(() => {
    getTodos();
  }, []);

  const addTodo = () => {
    setTodos([
      ...todos,
      {
        userId: 1,
        id: Math.random(),
        title: 'New Todo',
        completed: false,
      },
    ]);
  };

  const toggleTodoStatus = (id: number) => {
    setTodos(todos.map((todo) => {
      if (todo.id === id) {
        return {
          ...todo,
          completed: !todo.completed,
        };
      }

      return todo;
    }));
  };

  const deleteTodo = (id: number) => {
    setTodos(todos.filter((todo) => todo.id !== id));
  };

  const sendFormData = async (data: FormState): Promise<FormState> => new Promise((resolve) => {
    setTimeout(() => {
      resolve(data);
    }, 2000);
  });

  const [ formData, setFormData ] = useState<FormState>('');
  const [ submittedData, isSubmitting, submitFormOptimistically ] = useOptimistic<FormState>(null);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    submitFormOptimistically(sendFormData, formData);
  };

  return (
    <>
      <h1>Store222</h1>
      <button onClick={addTodo}>Add Todo</button>
      <h1>Todos ({todos.length})</h1>

      <form onSubmit={handleSubmit}>
        <input
          onChange={(e) => setFormData(e.target.value)}
          value={String(formData)}
        />
        <button type="submit">
          {isSubmitting ? 'Sending...' : 'Send'}
        </button>
        {submittedData && <p>Submitted Data: {submittedData}</p>}
      </form>

      <section
        role="list"
        style={{
          display: 'grid',
          gap: '1rem',
          padding: '1rem',
          gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',

        }}
      >
        {todos.map((todo) => (
          <div
            key={todo.id}
            ref={ref}
            role="listitem"
            style={{
              backgroundColor: inViewport ? 'lightgreen' : 'lightcoral',
              display: 'flex',
              flexDirection: 'row',
              gap: '1rem',
              border: '1px solid #000',
              padding: '8px',
              borderRadius: '4px',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <span
              style={{
                textDecoration: todo.completed ? 'line-through' : 'none',
                textOverflow: 'ellipsis',
                overflow: 'hidden',
                whiteSpace: 'nowrap',
              }}
              title={todo.title}
            >
              {todo.title}
            </span>
            <input checked={todo.completed} onChange={() => toggleTodoStatus(todo.id)} type="checkbox" />
            <button onClick={() => deleteTodo(todo.id)}>Delete</button>
          </div>
        ))}
      </section>
      <Ui />
    </>
  );
}

export default App;
