// src/components/FieldImage.tsx
import { Field, FileUpload, Icon } from "@chakra-ui/react";
import { LuUpload, LuX } from "react-icons/lu";

type FieldImageProps = {
  label: string;
  error?: string;
  isRequired?: boolean;
  value: File[];
  onChange: (files: File[]) => void;
  accept?: string;
};

const FieldImage = ({
  label,
  error,
  isRequired,
  value,
  onChange,
  accept,
}: FieldImageProps) => {
  return (
    <Field.Root required={isRequired} invalid={!!error}>
      <Field.Label>
        {label} <Field.RequiredIndicator />
      </Field.Label>

      <FileUpload.Root
        maxFiles={1}
        accept={accept}
        acceptedFiles={value}
        onFileChange={(details) => onChange(details.acceptedFiles)}
      >
        <FileUpload.HiddenInput />
        <FileUpload.Dropzone w="full">
          <Icon fontSize="xl" color="fg.muted">
            <LuUpload />
          </Icon>
          <FileUpload.DropzoneContent w="full" >
            <div>Upload image here</div>
            <div>.jpg, .png, .webp up to 5MB</div>
          </FileUpload.DropzoneContent>
        </FileUpload.Dropzone>

        <FileUpload.ItemGroup>
          <FileUpload.Context>
            {({ acceptedFiles }) =>
              acceptedFiles.map((file) => (
                <FileUpload.Item key={file.name} file={file}>
                  <FileUpload.ItemPreview />
                  <FileUpload.ItemName />
                  <FileUpload.ItemSizeText />
                  <FileUpload.ItemDeleteTrigger>
                    <LuX />
                  </FileUpload.ItemDeleteTrigger>
                </FileUpload.Item>
              ))
            }
          </FileUpload.Context>
        </FileUpload.ItemGroup>
      </FileUpload.Root>

      {error && <Field.ErrorText>{error}</Field.ErrorText>}
    </Field.Root>
  );
};

export default FieldImage;