import { tokenManager } from "@/services/api";
import { authService } from "@/services/auth";
import { useMutation, useQueryClient } from "@tanstack/react-query";

const useAuth = () => {
  const queryClient = useQueryClient();

  const loginMutation = useMutation({
    mutationFn: authService.login,
    onSuccess: async (data) => {
      // store tokens
      await tokenManager.setTokens(
        data.tokens.accessToken,
        data.tokens.refreshToken,
        data.tokens.expiresIn
      );

      // invalidate the old data in cache and refetch user data
      queryClient.invalidateQueries({ queryKey: ["user"] });

      // set user as authenticated in the cache
      queryClient.setQueryData(["auth"], {
        user: data.user,
        isAuthenticated: true,
      });
    },
  });

  return {
    login: loginMutation.mutate,
  };
};

export default useAuth;
