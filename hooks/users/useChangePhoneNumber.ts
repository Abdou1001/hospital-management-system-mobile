import {useMutation} from "@tanstack/react-query";
import {toast} from "sonner";

import {changePhoneNumber} from "@/api/user.api";

import {ChangePhoneNumberSchema} from "@/validation/users/schemas/change-phone-number.schema";

export const useChangePhoneNumber = () => {
    return useMutation({
        mutationFn: (value: ChangePhoneNumberSchema) =>
            changePhoneNumber(value),

        onSuccess: (data) => {
            toast.success(data.message);
        },

        onError: (error: any) => {
            const errors = error.response?.data?.errors;

            if (errors?.length) {
                errors.forEach((err: any) => toast.error(err.message));
            } else {
                toast.error(
                    error.response?.data?.message ??
                        "حدث خطأ أثناء تغيير رقم الهاتف",
                );
            }
        },
    });
};
