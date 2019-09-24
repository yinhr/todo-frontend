import Repository from "@/backend/repository"

const resource = "/signin";

export default {
  get() {
    return Repository.get(`${resource}`);
  },
  post(user) {
    return Repository.post(`${resource}`, user);
  },
  delete() {
    return Repository.delete(`${resource}`);
  }
};
