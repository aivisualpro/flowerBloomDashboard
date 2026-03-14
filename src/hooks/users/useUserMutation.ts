// hooks/users/useUserMutation.js
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updateUser } from '../../api/users';
import { useDashboardStore } from '../../store/useDashboardStore';

interface UpdateUserPayload {
  id: string;
  formData: Record<string, any>;
}

export function useUpdateUser() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, formData }: UpdateUserPayload) => updateUser(id, formData),
    retry: 0,
    onSuccess: (_data, vars) => {
      // Invalidate both the list and this user's detail
      qc.invalidateQueries({ predicate: q => Array.isArray(q.queryKey) && q.queryKey[0] === 'users' });
      qc.invalidateQueries({ queryKey: ['user', vars?.id] });
      useDashboardStore.getState().refresh();
    },
  });
}
