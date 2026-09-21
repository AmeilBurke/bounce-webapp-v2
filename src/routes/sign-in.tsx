import LayoutCreate from '@/components/layouts/LayoutCreate'
import { SignInSchema, type SignInFormValues } from '@/schemas/sign-in.schema'
import { zodResolver } from '@hookform/resolvers/zod'
import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useForm } from 'react-hook-form';
import signInImage from '../assets/sign-in.jpg'
import Stacker from '@/components/Stacker';
import { Button } from '@chakra-ui/react';
import Form from '@/components/Form';
import SignInForm from '@/components/forms/SignInForm';
import toast from 'react-hot-toast';
import getJwt from '@/api-requests/auth/getJwt';

export const Route = createFileRoute('/sign-in')({
  component: RouteComponent,
})

function RouteComponent() {
  const {
    control,
    handleSubmit,
    setError,
    formState: { errors, isValid, isSubmitting },
  } = useForm<SignInFormValues>({
    resolver: zodResolver(SignInSchema),
    mode: "onChange",
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const navigate = useNavigate();

  const onSignIn = async (data: SignInFormValues) => {
    try {

      const jwt = (await getJwt(data.email, data.password)).access_token;

      localStorage.setItem("jwt", jwt);
      toast.success("Sign in successful");


      await navigate({ to: "/" });
    } catch {
      setError("root.serverError", {
        type: "server",
        message: "Something went wrong. Please try again.",
      });
    }
  }

  return (

    <LayoutCreate
      heading='Sign In'
      subheading='Enter your details below to sign in & use the app'
      imagePath={signInImage}
    >
      <Form w="full" onSubmit={handleSubmit(onSignIn)}>
        <Stacker direction="column">
          <SignInForm control={control} errors={errors} />
          <Button
            w={["full", null, null, "auto"]}
            type="submit"
            alignSelf={"flex-end"}
            disabled={!isValid}
            loading={isSubmitting}
          >
            Sign in
          </Button>
        </Stacker>
      </Form>
    </LayoutCreate >
  )
}
