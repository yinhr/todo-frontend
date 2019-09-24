import Repository from "@/backend/repository"

const resource = "/signup";

export default {
  get() {
    return Repository.get(`${resource}`);
  },
  post(user) {
    return Repository.post(`${resource}`, user);
  }
};
