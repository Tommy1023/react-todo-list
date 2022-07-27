import { useState, useCallback, useMemo, memo } from 'react';
import RenderTip from '../RenderTip';
import TodoForm from '../TodoForm';
import TodoItem from '../TodoItem';
import TodoFilter from '../TodoFilter';

const TodoFormMemo = memo(TodoForm);
const TodoFilterMemo = memo(TodoFilter);
const TodoItemMemo = memo(TodoItem);

type TodoType = {
  id: string,
  text: string,
  done: boolean,
};

const initialList: TodoType[] = [
  { id: 'id1', text: '學會React', done: true },
  { id: 'id2', text: '年薪百萬', done: false },
];

const TodoList = () => {
  const [list, setList] = useState(initialList);
  const [filterType, setFilterType] = useState('all');

  const atAddItem = useCallback((text: string) => {
    const item: TodoType = {
      id: new Date().getTime().toString(),
      text,
      done: false,
    };
    return setList(list.concat(item));
  }, []);

  const atToggleItem = useCallback(
    (id: string) => {
      const newList = list.map((item: TodoType) => {
        if (item.id === id) {
          return {
            id: item.id,
            text: item.text,
            done: !item.done,
          };
        }
        return item;
      });
      return setList(newList);
    },
    [list],
  );

  const atFilterChange = useCallback((type: string) => {
    setFilterType(type);
  }, []);

  const filtersList = useMemo(() => {
    return list.filter((todo: TodoType) => {
      if (filterType === 'completed') {
        return todo.done;
      }
      if (filterType === 'active') {
        return !todo.done;
      }
      return true;
    });
  }, [filterType, list]);

  const atDeleteTodo = useCallback((id: string) => {
    const newList = list.filter((item) => item.id !== id); // 利用 filter 把要刪除的 item filter 掉建立一個新的instance 重新 render
    return setList(newList);
  }, []);

  return (
    <section className="todo-list" data-name="TodoList">
      <RenderTip />
      <TodoFormMemo onAddItem={atAddItem} />
      <TodoFilterMemo filterType={filterType} onFilterChange={atFilterChange} />
      <div>
        {filtersList.map((item) => (
          <TodoItemMemo
            key={item.id}
            id={item.id}
            done={item.done}
            text={item.text}
            onToggleItem={atToggleItem}
            onDeleteTodo={atDeleteTodo}
          />
        ))}
      </div>
    </section>
  );
};

export default TodoList;
