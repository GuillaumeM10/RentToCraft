import axios from "axios";
import { toast } from "react-toastify";

import AppService from "./app.service";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  withCredentials: true,
});

api.interceptors.request.use(
  (config) => {
    const authToken = AppService.getCookie();
    if (authToken) {
      config.headers["Authorization"] = `Bearer ${authToken}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

api.interceptors.response.use(
  (response) => {
    const method = response.config.method?.toUpperCase();
    if (method === "POST" || method === "PUT" || method === "DELETE") {
      let message = "";

      switch (method) {
        case "DELETE": {
          message = "Élément supprimé avec succès";
          break;
        }
        case "POST": {
          message = "Élément créé avec succès";
          break;
        }
        case "PUT": {
          message = "Élément modifié avec succès";
          break;
        }
      }

      toast.success(message, {
        position: "top-left",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
      });
    }

    return response;
  },
  (error) => {
    console.error("API error:", error);
    if (error.response?.status === 401 && typeof window !== "undefined") {
      window.location.href = "/auth";
    }

    if (error.response) {
      const status = error.response.status;
      const message =
        error.response.data?.message ??
        error.response.data?.error ??
        "Une erreur est survenue";
      let messageVariable: string | null = null;
      switch (status) {
        case 400: {
          messageVariable = `Erreur de validation: ${message}`;
          break;
        }
        case 401: {
          messageVariable =
            "Vous n'êtes pas autorisé à accéder à cette ressource";
          break;
        }
        case 403: {
          messageVariable = "Accès refusé";
          break;
        }
        case 404: {
          messageVariable = null;
          break;
        }
        case 422: {
          messageVariable = `Erreur de données: ${message}`;
          break;
        }
        case 429: {
          messageVariable = "Trop de requêtes. Veuillez patienter.";
          break;
        }
        case 500: {
          messageVariable = "Erreur serveur. Veuillez réessayer plus tard.";
          break;
        }
        case 502: {
          messageVariable = "Erreur de serveur. Veuillez réessayer plus tard.";
          break;
        }
        case 503: {
          messageVariable = "Service temporairement indisponible";
          break;
        }
        case 504: {
          messageVariable = "Service temporairement indisponible";
          break;
        }
        default: {
          messageVariable = message;
        }
      }
      if (messageVariable) {
        toast.error(messageVariable, {
          position: "top-left",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
        });
      }
    } else if (error.request) {
      toast.error("Erreur de connexion. Vérifiez votre connexion internet.", {
        position: "top-left",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
      });
    } else {
      toast.error("Une erreur inattendue s'est produite", {
        position: "top-left",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
      });
    }
    return Promise.reject(error);
  },
);

export default api;
