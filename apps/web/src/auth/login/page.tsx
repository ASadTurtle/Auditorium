import { useNavigate } from 'react-router';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel } from '@/components/ui/form';

const FormSchema = z.
  object({
    username: z
      .string({
        message: 'Name must be type string'
      })
      .nonempty(),
    password: z.string().min(6, {
      message: 'Password must be at least 6 characters'
    }),
  });

export default function Login() {
  const navigate = useNavigate();
  const BACKEND_PORT = Number(import.meta.env.VITE_API_PORT ?? 4000);
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      username: '',
      password: '',
    },
  });

  function fetchToken(body: object) {
    return fetch('http://localhost:' + BACKEND_PORT + '/auth/login', {
      method: 'POST',
      headers: {
        'Content-type': 'application/json',
      },
      body: JSON.stringify(body),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.error) {
          return Promise.reject(data.error)
        } else {
          return Promise.resolve(data.token)
        }
    });
  }

  function onSubmit(data: z.infer<typeof FormSchema>) {
    fetchToken({username: data.username, password: data.password})
      .then((token) => {
        localStorage.setItem('Token', token);
        navigate('/dashboard');
      });
  }

  return (
    <div className='flex items-center justify-center min-h-screen bg-gray-100'>
      <Card aria-label='Login-Card' className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-xl">Login</CardTitle>
          <CardDescription>Welcome back to Auditorium</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form 
              onSubmit={form.handleSubmit(onSubmit)}
              className='w-2/3 space-y-5'
            >
              <FormField 
                control={form.control}
                name='username'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Username</FormLabel>
                    <FormControl>
                      <Input 
                        {...field}
                        ref={null}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField 
                control={form.control}
                name='password'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input 
                        type='password'
                        {...field}
                        ref={null}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              <div className="flex items-center gap-1">
                <Button type="submit">Submit</Button>
                <Button
                  variant="ghost"
                  onClick={(event) => {
                    event.preventDefault();
                    navigate('/register');
                  }}
                >
                  Not a member yet?
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  )
}