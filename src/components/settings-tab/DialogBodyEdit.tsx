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
import { refresh } from "@/utils/queries";
import Dialog from "../Dialog";
import { useState } from "react";
import deleteStaff from "@/api-requests/staff/deleteStaff";
import { userDetailsQueryOptions } from "@/api-requests/auth/user.queries";
import { Role } from "@/types/Role";

type DialogBodyEditProps = {
  chosenStaff: Staff | undefined;
  closeDialog?: () => void;
  closeFinishDialog?: () => void;
};

const DialogBodyEdit = ({
  chosenStaff,
  closeDialog,
  closeFinishDialog,
}: DialogBodyEditProps) => {
  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
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

  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const staffName = chosenStaff?.name ?? "";

  const finish = () => {
    closeDialog?.();
    closeFinishDialog?.();
  };

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
      await refresh(queryClient, ["staff"]);
      finish();
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Couldn't update details",
      );
    }
  };

  const onDeleteStaff = async () => {
    if (chosenStaff === undefined) return;

    setIsDeleting(true);
    try {
      const result = await deleteStaff(chosenStaff.id);
      toast.success(result);
      await refresh(queryClient, ["staff"]);
      setIsDeleteDialogOpen(false);
      finish();
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Couldn't delete account",
      );
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <>
      <Form w="full" onSubmit={handleSubmit(onEditStaff)}>
        <Stacker direction="column">
          <UpdateStaffForm control={control} errors={errors} />

          <HStack w="full" justify="flex-end">
            {user?.role === Role.ADMIN && (
              <Button
                onClick={() => setIsDeleteDialogOpen(true)}
                colorPalette="red"
                mr="auto"
              >
                Delete
              </Button>
            )}
            <Button onClick={handleSubmit(onEditStaff)} loading={isSubmitting}>
              Update Details
            </Button>
          </HStack>
        </Stacker>
      </Form>

      <Dialog
        isOpen={isDeleteDialogOpen}
        setIsOpen={setIsDeleteDialogOpen}
        title={`Delete ${staffName}'s Account?`}
        body={
          <Text>
            This will permanently delete this account. This action cannot be
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
            <Button
              onClick={onDeleteStaff}
              colorPalette="red"
              loading={isDeleting}
            >
              Delete
            </Button>
          </>
        }
      />
    </>
  );
};

export default DialogBodyEdit;
