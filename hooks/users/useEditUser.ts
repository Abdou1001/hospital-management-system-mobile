import {useMutation, useQueryClient} from "@tanstack/react-query";
import {toast} from "sonner";

import {changeRoleUsers, changeStatusUsers} from "@/api/user.api";
import {RoleProps} from "@/types/data";

export const useChangeStatusUsers = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({id}: {id: number}) => changeStatusUsers(id),

        onSuccess(data) {
            toast.success(data.message);

            queryClient.invalidateQueries({
                queryKey: ["users"],
            });
        },

        onError: (error: any) => {
            const errors = error.response?.data?.errors;

            if (errors?.length) {
                errors.forEach((err: any) => {
                    toast.error(err.message);
                });
            } else {
                toast.error("حدث خطأ أثناء تعديل حالة المستخدم");
            }
        },
    });
};

export const useChangeRoleUsers = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({id, role}: {id: number; role: RoleProps["role"]}) =>
            changeRoleUsers(id, role),

        onSuccess(data) {
            toast.success(data.message);

            queryClient.invalidateQueries({
                queryKey: ["users"],
            });
        },

        onError: (error: any) => {
            const errors = error.response?.data?.errors;

            if (errors?.length) {
                errors.forEach((err: any) => {
                    toast.error(err.message);
                });
            } else {
                toast.error("حدث خطأ أثناء تعديل صلاحية المستخدم");
            }
        },
    });
};
