import LayoutCreate from "@/components/layouts/LayoutCreate";
import Stacker from "@/components/Stacker";
import { SetupSchema, type SetupFormValues } from "@/schemas/setup.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@chakra-ui/react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useForm } from "react-hook-form";
import SetupForm from "@/components/forms/SetupForm";
import createNewStaff from "@/api-requests/staff/createNewStaff";
import type { CreateStaffDto } from "@/types/dto/create-staff-dto";
import toast from "react-hot-toast";
import getJwt from "@/api-requests/auth/getJwt";
import Form from "@/components/Form";
import { useQueryClient } from "@tanstack/react-query";

export const Route = createFileRoute("/setup")({
  component: RouteComponent,
});

function RouteComponent() {
  const {
    control,
    handleSubmit,
    setError,
    formState: { errors, isValid, isSubmitting },
  } = useForm<SetupFormValues>({
    resolver: zodResolver(SetupSchema),
    mode: "onChange",
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const onCreateAdmin = async (data: SetupFormValues) => {
    const createStaffDto: CreateStaffDto = {
      name: data.name,
      email: data.email,
      password: data.password,
      role: "ADMIN",
    };

    try {
      await createNewStaff(createStaffDto);
      toast.success("Account Created");

      const jwt = (await getJwt(data.email, data.password)).access_token;
      console.log("jwt");
      console.log(jwt);

      localStorage.setItem("jwt", jwt);

      queryClient.invalidateQueries({ queryKey: ["setup-status"] });

      await navigate({ to: "/" });
    } catch (err) {
      // const error = err as AxiosError<{ message?: string; field?: string }>;

      setError("root.serverError", {
        type: "server",
        message: "Something went wrong. Please try again.",
      });
    }
  };

  return (
    <LayoutCreate
      heading="Let's Get Started"
      subheading="Create an admin account"
    >
      <Form w="full" onSubmit={handleSubmit(onCreateAdmin)}>
        <Stacker direction="column" >
          <SetupForm control={control} errors={errors} />
          <Button w="full" type="submit" disabled={!isValid} loading={isSubmitting}>
            Create Account
          </Button>
        </Stacker>
      </Form>
    </LayoutCreate>
  );
}
