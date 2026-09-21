import createNewAlert from "@/api-requests/alerts/createNewAlert";
import Form from "@/components/Form";
import CreateAlertForm from "@/components/forms/CreateAlertForm";
import LayoutCreate from "@/components/layouts/LayoutCreate";
import Stacker from "@/components/Stacker";
import { CreateAlertSchema, type CreateAlertFormValues } from "@/schemas/create-alert.schema";
import type { CreateAlertDto } from "@/types/dto/create-alert-dto";
import { Button } from "@chakra-ui/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQueryClient } from "@tanstack/react-query";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { io } from "socket.io-client";

export const Route = createFileRoute("/_authenticated/create-alert")({
  component: RouteComponent,
});

function RouteComponent() {

  const {
    control,
    handleSubmit,
    setError,
    formState: { errors, isValid, isSubmitting },
  } = useForm<CreateAlertFormValues>({
    resolver: zodResolver(CreateAlertSchema),
    mode: "onChange",
    defaultValues: {

    },
  });

  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const onCreateAlert = async (data: CreateAlertFormValues) => {
    const createAlertDto: CreateAlertDto = {
      image: data.image[0],
      reason: data.reason,
    };

    try {
      await createNewAlert(createAlertDto);
      toast.success("Alert Issued");

      queryClient.invalidateQueries({ queryKey: ["alerts"] });

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
      heading={"Create New Alert"}
      subheading={"Fill out the details below to create a new alert"}
      returnArrow
    >

      <Stacker direction={"column"}>
        <Form w="full" onSubmit={handleSubmit(onCreateAlert)}>
          <Stacker direction="column">
            <CreateAlertForm control={control} errors={errors} />
            <Button
              w={["full", null, null, "auto"]}
              type="submit"
              alignSelf={"flex-end"}
              disabled={!isValid}
              loading={isSubmitting}
            >
              Create Alert
            </Button>
          </Stacker>
        </Form>
      </Stacker>
    </LayoutCreate>
  );
}
