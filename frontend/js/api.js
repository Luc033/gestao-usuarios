import showToast from "./util/toast";
import { hideLoading, showLoading } from "./util/loading";

const API_URL = "http://localhost:3001";

async function request(endpoint, options = {}) {
  showLoading();

  try {
    const response = await fetch(`${API_URL}${endpoint}`, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
      },
    });

    if (response.status === 204) return true;

    const data = await response.json().catch(() => null);

    if (!response.ok) {
      const errorsList = data?.errors
        ?.filter((el) => el.message)
        .map((el) => el.message)
        .join("\n");

      showToast(
        errorsList || data?.message || "Ocorreu um erro na requisição.",
        "error",
      );

      return null;
    }
    return data;
  } catch (error) {
    showToast("Não foi possível conectar ao servidor.", "error");
    return null;
  } finally {
    hideLoading();
  }
}

export const userApi = {
  findAll() {
    return request("/users");
  },
  findById(id) {
    return request(`/users/${id}`);
  },
  create(user) {
    return request("/users", { method: "POST", body: JSON.stringify(user) });
  },
  update(id, user) {
    return request(`/users/${id}`, {
      method: "PUT",
      body: JSON.stringify(user),
    });
  },
  updatePassword(id, password) {
    return request(`/users/${id}/password`, {
      method: "PATCH",
      body: JSON.stringify({ password }),
    });
  },
  remove(id) {
    return request(`/users/${id}`, { method: "DELETE" });
  },
};
