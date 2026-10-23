import createNewAlert from "@/api-requests/alerts/createNewAlert";
import Form from "@/components/Form";
import CreateAlertForm from "@/components/forms/CreateAlertForm";
import LayoutCreate from "@/components/layouts/LayoutCreate";
import Stacker from "@/components/Stacker";
import { CreateAlertSchema, NEW_PERSON, type CreateAlertFormValues } from "@/schemas/create-alert.schema";
import type { CreateAlertDto } from "@/types/dto/create-alert-dto";
import { Button } from "@chakra-ui/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQueryClient } from "@tanstack/react-query";
import { refresh } from "@/utils/queries";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { apiErrorMessage } from "@/utils/errors";

export const Route = createFileRoute("/_authenticated/create-alert")({
  component: RouteComponent,
});

function RouteComponent() {

  const {
    control,
    handleSubmit,
    formState: { errors, isValid, isSubmitting },
  } = useForm<CreateAlertFormValues>({
    resolver: zodResolver(CreateAlertSchema),
    mode: "onChange",
    defaultValues: {
      personId: NEW_PERSON,
    },
  });

  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const onCreateAlert = async (data: CreateAlertFormValues) => {
    const createAlertDto: CreateAlertDto =
      data.personId === NEW_PERSON
        ? { image: data.image![0], reason: data.reason }
        : { bannedPersonId: data.personId, reason: data.reason };

    try {
      await createNewAlert(createAlertDto);
      toast.success("Alert Issued");

      refresh(queryClient, ["alerts"]);

      await navigate({ to: "/" });
    } catch (err) {
      toast.error(apiErrorMessage(err, "Couldn't create alert"));
    }
  };


  return (
    <LayoutCreate
      heading={"Create New Alert"}
      subheading={"Fill out the details below to create a new alert"}
      returnArrow
    >

      <Stacker direction={"column"}>
        <Form w="full" maxW="3xl" bg="bg.panel" borderWidth="1px" rounded="xl" p={[4, null, 6]} onSubmit={handleSubmit(onCreateAlert)}>
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
