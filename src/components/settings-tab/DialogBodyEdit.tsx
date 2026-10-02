import Form from "../Form";
import Stacker from "../Stacker";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import type { Staff } from "@/types/Staff";
import { Button, HStack } from "@chakra-ui/react";
import editStaff from "@/api-requests/staff/updateStaff";
import toast from "react-hot-toast";
import {
  UpdateStaffSchema,
  type UpdateStaffFormValues,
} from "@/schemas/update-staff.schema";
import UpdateStaffForm from "../forms/UpdateStaffForm";
import type { UpdateStaffDto } from "@/types/dto/update-staff-dto";
import { useQueryClient } from "@tanstack/react-query";

type DialogBodyEditProps = {
  chosenStaff: Staff | undefined;
};

const DialogBodyEdit = ({ chosenStaff }: DialogBodyEditProps) => {
  const {
    control,
    handleSubmit,
    setError,
    formState: { errors, isValid, isSubmitting },
  } = useForm<UpdateStaffFormValues>({
    resolver: zodResolver(UpdateStaffSchema),
    mode: "onChange",
    defaultValues: {
      name: chosenStaff?.name,
      email: chosenStaff?.email,
      role: chosenStaff?.role,
    },
  });

  const queryClient = useQueryClient();

  const onEditStaff = async (data: UpdateStaffFormValues) => {
    if (chosenStaff === undefined) return;

    const updateStaffDto: UpdateStaffDto = {
      name: data.name,
      email: data.email,
      password: data.password,
      role: data.role,
    };

    console.log(updateStaffDto);
    //editstaffdto

    try {
      await editStaff(updateStaffDto, chosenStaff.id);
      toast.success("Details Updated");
      await queryClient.invalidateQueries({ queryKey: ["staff"] });


      // closeDialog();
    } catch (err) {
      toast.error(String(err));
      toast.error("Couldn't update details");
    }
  };

  return (
    <Form w="full" onSubmit={handleSubmit(onEditStaff)}>
      <Stacker direction="column">
        <UpdateStaffForm control={control} errors={errors} />

        <HStack w="full" justify="flex-end">
          <Button variant="outline">Close</Button>
          <Button onClick={handleSubmit(onEditStaff)} >
            Update Details
          </Button>
        </HStack>
        {/* <Button
          w={["full", null, null, "auto"]}
          type="submit"
          alignSelf={"flex-end"}
          disabled={!isValid}
          loading={isSubmitting}
        >
          Create Alert
        </Button> */}
      </Stacker>
    </Form>
  );
};

export default DialogBodyEdit;
