import Repository from "@/backend/repository"

const resourceTodo = "/todo";
const resourceTask = "/task";
const resourceEdit = "/todo/edit";

export default {
  get(todoid) {
    return Repository.get(`${resourceEdit}`, {
      params: {
        id: todoid
      }
    });
  },
  fetch(cursor, orderBy, direction) {
    return Repository.get(`${resourceTodo}`, {
      params: {
        cursor: cursor,
        orderBy: orderBy,
        direction: direction
      }
    });
  },
  post(todo) {
    return Repository.post(`${resourceTodo}`, todo);
  },
  patchTodo(todo) {
    return Repository.patch(`${resourceTodo}`, todo);
  },
  patchTask(task) {
    return Repository.patch(`${resourceTask}`, task);
  },
  put(todo) {
    return Repository.put(`${resourceTodo}`, todo);
  },
  delete(todoid) {
    return Repository.delete(`${resourceTodo}`, {
      params: {
        id: todoid
      }
    });
  }
};
