import createNewStaff from '@/api-requests/staff/createNewStaff'
import Form from '@/components/Form'
import CreateStaffForm from '@/components/forms/CreateStaffForm'
import LayoutCreate from '@/components/layouts/LayoutCreate'
import Stacker from '@/components/Stacker'
import { type CreateStaffFormValues, CreateStaffSchema } from '@/schemas/create-staff.schema'
import type { CreateStaffDto } from '@/types/dto/create-staff-dto'
import { Button } from '@chakra-ui/react'
import { zodResolver } from '@hookform/resolvers/zod'
import { useQueryClient } from '@tanstack/react-query'
import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'

export const Route = createFileRoute('/_authenticated/create-account')({
    component: RouteComponent,
})

function RouteComponent() {

    const {
        control,
        handleSubmit,
        reset,
        setError,
        formState: { errors, isValid, isSubmitting },
    } = useForm<CreateStaffFormValues>({
        resolver: zodResolver(CreateStaffSchema),
        mode: "onChange",
        defaultValues: {
            name: "",
            email: "",
            password: "",
            role: undefined,
        },
    });

    const navigate = useNavigate();
    const queryClient = useQueryClient();

    const onCreateStaff = async (
        data: CreateStaffFormValues,
        { addAnother = false }: { addAnother?: boolean } = {}
    ) => {
        const createStaffDto: CreateStaffDto = {
            name: data.name,
            email: data.email,
            password: data.password,
            role: data.role,
        };
        try {
            await createNewStaff(createStaffDto);
            toast.success("Account Created");
            queryClient.invalidateQueries({ queryKey: ["staff"] });

            if (addAnother) {
                reset();
                return;
            }

            await navigate({ to: "/" });
        } catch {
            setError("root.serverError", {
                type: "server",
                message: "Something went wrong. Please try again.",
            });
        }
    };

    return (
        <LayoutCreate
            heading={"Create New Staff"}
            subheading={"Fill out the details below to create a new staff account"}
            returnArrow
        >

            <Stacker direction={"column"}>
                <Form w="full" onSubmit={handleSubmit((data) => onCreateStaff(data))}>
                    <Stacker direction="column">
                        <CreateStaffForm control={control} errors={errors} />
                        <Stacker direction="row" justify="flex-end">
                            <Button
                                type="button"
                                onClick={handleSubmit((data) =>
                                    onCreateStaff(data, { addAnother: true })
                                )}
                                w={["full", null, null, "auto"]}
                                alignSelf="flex-end"
                                disabled={!isValid}
                                loading={isSubmitting}
                            >
                                Add Another
                            </Button>
                            <Button
                                type="submit"
                                w={["full", null, null, "auto"]}
                                alignSelf="flex-end"
                                disabled={!isValid}
                                loading={isSubmitting}
                            >
                                Create New Staff
                            </Button>
                        </Stacker>
                    </Stacker>
                </Form>
            </Stacker>
        </LayoutCreate>
    )
}
