import { DataList } from "@chakra-ui/react"
import type { Staff } from "@/types/Staff";

type DialogBodyViewProps = {
  chosenStaff: Staff | undefined;
}

const DialogBodyView = ({ chosenStaff }: DialogBodyViewProps) => {
  return (
    <DataList.Root orientation="vertical">
      <DataList.Item>
        <DataList.ItemLabel>Email</DataList.ItemLabel>
        <DataList.ItemValue>{chosenStaff?.email}</DataList.ItemValue>
      </DataList.Item>
    </DataList.Root>
  )
}

export default DialogBodyView