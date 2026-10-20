import createNewVenue from "@/api-requests/venues/createNewVenue";
import Form from "@/components/Form";
import CreateVenueForm from "@/components/forms/CreateVenueForm";
import LayoutCreate from "@/components/layouts/LayoutCreate";
import Stacker from "@/components/Stacker";
import { CreateVenueSchema, type CreateVenueFormValues } from "@/schemas/create-venue.schema";
import type { CreateVenueDto } from "@/types/dto/create-venue-dto";
import { Button } from "@chakra-ui/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQueryClient } from "@tanstack/react-query";
import { refresh } from "@/utils/queries";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";

export const Route = createFileRoute("/_authenticated/create-venue")({
  component: RouteComponent,
});

function RouteComponent() {

  const {
    control,
    handleSubmit,
    setError,
    formState: { errors, isValid, isSubmitting },
  } = useForm<CreateVenueFormValues>({
    resolver: zodResolver(CreateVenueSchema),
    mode: "onChange",
    defaultValues: {
      managers: [],
    },
  });

  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const onCreateVenue = async (data: CreateVenueFormValues) => {
    const createVenueDto: CreateVenueDto = {
      name: data.name,
      managers: data.managers,
    };

    try {
      await createNewVenue(createVenueDto);
      toast.success("Venue Created");

      refresh(queryClient, ["venues"]);

      await navigate({ to: "/", search: { tab: "venues" } });
    } catch {
      setError("root.serverError", {
        type: "server",
        message: "Something went wrong. Please try again.",
      });
    }
  };


  return (
    <LayoutCreate
      heading={"Create New Venue"}
      subheading={"Fill out the details below to create a new venue"}
      returnArrow
    >

      <Stacker direction={"column"}>
        <Form w="full" onSubmit={handleSubmit(onCreateVenue)}>
          <Stacker direction="column">
            <CreateVenueForm control={control} errors={errors} />
            <Button
              w={["full", null, null, "auto"]}
              type="submit"
              alignSelf={"flex-end"}
              disabled={!isValid}
              loading={isSubmitting}
            >
              Create Venue
            </Button>
          </Stacker>
        </Form>
      </Stacker>
    </LayoutCreate>
  );
}
