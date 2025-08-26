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

  const registerMutation = useMutation({
    mutationFn: authService.register,
    onSuccess: async (data) => {
      // store tokens
      await tokenManager.setTokens(
        data.tokens.accessToken,
        data.tokens.refreshToken,
        data.tokens.expiresIn
      );

      // invalidate the cache and refetch the user
      queryClient.invalidateQueries({ queryKey: ["user"] });

      // set user as authenticated in cache
      queryClient.setQueryData(["auth"], {
        user: data.user,
        isAuthenticated: true,
      });
    },
  });

  const logoutMutation = useMutation({
    mutationFn: authService.logout,
    onSuccess: async () => {
      // clear tokens
      await tokenManager.clearTokens();

      // clear cache
      queryClient.clear();

      // set user as null and unauthenticated in cache
      queryClient.setQueryData(["auth"], {
        user: null,
        isAuthenticated: false,
      });
    },
  });

  return {
    login: loginMutation.mutate,
    register: registerMutation.mutate,
    logout: logoutMutation.mutate,
    isLoading:
      loginMutation.isPending ||
      registerMutation.isPending ||
      loginMutation.isPending,
    error:
      loginMutation.error || registerMutation.error || logoutMutation.error,
  };
};

export default useAuth;
