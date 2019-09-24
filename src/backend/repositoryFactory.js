import SignupRepository from "@/backend/signupRepository";
import SigninRepository from "@/backend/signinRepository";
import TodoRepository from "@/backend/todoRepository";

const repositories = {
  signup: SignupRepository,
  signin: SigninRepository,
  todo: TodoRepository,
};

export const RepositoryFactory = {
  get: name => repositories[name]
}
