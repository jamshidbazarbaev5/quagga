import {useMutation} from "@tanstack/react-query";
import {api} from "./api.ts";

interface UpdateUserData {
  first_name: string;
  last_name: string;
  phone: string;
}

export const useUpdateUser = () => {
  return useMutation({
    mutationFn: async (data: UpdateUserData) => {
      const response = await api.put('/user/update', data);
      return response.data;
    }
  });
};