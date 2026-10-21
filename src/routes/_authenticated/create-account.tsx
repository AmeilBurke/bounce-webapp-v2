import createNewStaff from '@/api-requests/staff/createNewStaff'
import Form from '@/components/Form'
import CreateStaffForm from '@/components/forms/CreateStaffForm'
import LayoutCreate from '@/components/layouts/LayoutCreate'
import Stacker from '@/components/Stacker'
import { type CreateStaffFormValues, CreateStaffSchema } from '@/schemas/create-staff.schema'
import type { CreateStaffDto } from '@/types/dto/create-staff-dto'
import { Button, Stack } from '@chakra-ui/react'
import { zodResolver } from '@hookform/resolvers/zod'
import { useQueryClient } from '@tanstack/react-query'
import { refresh } from '@/utils/queries'
import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { isAxiosError } from 'axios'
import { useState } from 'react'
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
    // Which button was pressed, so only that one shows it's loading
    const [isAddingAnother, setIsAddingAnother] = useState<boolean>(false);

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
            refresh(queryClient, ["staff"]);

            if (addAnother) {
                reset();
                return;
            }

            await navigate({ to: "/", search: { tab: "settings" } });
        } catch (err: unknown) {
            if (isAxiosError(err) && err.response?.status === 409) {
                setError("email", {
                    type: "server",
                    message: "Email is already in use",
                });
                return;
            }

            toast.error("Something went wrong. Please try again.");
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
                <Form w="full" maxW="3xl" bg="bg.panel" borderWidth="1px" rounded="xl" p={[4, null, 6]} onSubmit={handleSubmit((data) => onCreateStaff(data))}>
                    <Stacker direction="column">
                        <CreateStaffForm control={control} errors={errors} />
                        <Stack
                            direction={["column-reverse", null, null, "row"]}
                            w={["full", null, null, "auto"]}
                            alignSelf={"flex-end"}
                            gap={2}
                        >
                            <Button
                                variant="outline"
                                onClick={() => {
                                    setIsAddingAnother(true);
                                    return handleSubmit((data) =>
                                        onCreateStaff(data, { addAnother: true })
                                    )();
                                }}
                                disabled={!isValid || isSubmitting}
                                loading={isSubmitting && isAddingAnother}
                            >
                                Create & Add Another
                            </Button>
                            <Button
                                type="submit"
                                onClick={() => setIsAddingAnother(false)}
                                disabled={!isValid || isSubmitting}
                                loading={isSubmitting && !isAddingAnother}
                            >
                                Create New Staff
                            </Button>
                        </Stack>
                    </Stacker>
                </Form>
            </Stacker>
        </LayoutCreate>
    )
}
