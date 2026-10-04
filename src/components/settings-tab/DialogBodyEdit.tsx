import Form from "../Form";
import Stacker from "../Stacker";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import type { Staff } from "@/types/Staff";
import { Button, HStack, Text } from "@chakra-ui/react";
import editStaff from "@/api-requests/staff/updateStaff";
import toast from "react-hot-toast";
import {
  UpdateStaffSchema,
  type UpdateStaffFormValues,
} from "@/schemas/update-staff.schema";
import UpdateStaffForm from "../forms/UpdateStaffForm";
import type { UpdateStaffDto } from "@/types/dto/update-staff-dto";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import Dialog from "../Dialog";
import { useState } from "react";
import deleteStaff from "@/api-requests/staff/deleteStaff";
import { userDetailsQueryOptions } from "@/api-requests/auth/user.queries";
import { Role } from "@/types/Role";

type DialogBodyEditProps = {
  chosenStaff: Staff | undefined;
  closeDialog: () => void;
};

const DialogBodyEdit = ({ chosenStaff, closeDialog }: DialogBodyEditProps) => {
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
  const { data: user } = useQuery(userDetailsQueryOptions);

  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState<boolean>(false);

  const onEditStaff = async (data: UpdateStaffFormValues) => {
    if (chosenStaff === undefined) return;

    const updateStaffDto: UpdateStaffDto = {
      name: data.name,
      email: data.email,
      password: data.password,
      role: data.role,
    };

    try {
      await editStaff(updateStaffDto, chosenStaff.id);
      toast.success("Details Updated");
      await queryClient.invalidateQueries({ queryKey: ["staff"] });

      closeDialog();
    } catch (err) {
      toast.error(String(err));
      toast.error("Couldn't update details");
    }
  };

  const onDeleteStaff = async () => {
    if (chosenStaff === undefined) return;

    try {
      const result = await deleteStaff(chosenStaff.id);
      toast.success(result);
      await queryClient.invalidateQueries({ queryKey: ["staff"] });
      setIsDeleteDialogOpen(false);
      closeDialog();
    } catch (err) {
      toast.error(String(err));
      toast.error("Couldn't update details");
    }
  };

  return (
    <>
      <Form w="full" onSubmit={handleSubmit(onEditStaff)}>
        <Stacker direction="column">
          <UpdateStaffForm control={control} errors={errors} />

          <HStack w="full" justify="flex-end">
            {
              user?.role === Role.ADMIN && (
                <Button
                  onClick={() => setIsDeleteDialogOpen(true)}
                  colorPalette={"red"}
                  mr="auto"
                >
                  Delete
                </Button>
              )
            }
            <Button onClick={handleSubmit(onEditStaff)}>Update Details</Button>
          </HStack>
        </Stacker>
      </Form>

      <Dialog
        isOpen={isDeleteDialogOpen}
        setIsOpen={(open) => {
          if (!open) setIsDeleteDialogOpen(false);
        }}
        title={`Delete ${chosenStaff?.name}'s Account?`}
        body={
          <Text>
            This will permanently delete the alert. This action cannot be
            undone.
          </Text>
        }
        footer={
          <>
            <Button
              onClick={() => setIsDeleteDialogOpen(false)}
              variant="outline"
            >
              Cancel
            </Button>
            <Button onClick={onDeleteStaff} colorPalette="red">
              Delete
            </Button>
          </>
        }
      />
    </>
  );
};

export default DialogBodyEdit;
