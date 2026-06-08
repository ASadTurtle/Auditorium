import { useNavigate } from 'react-router';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

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
    passwordCheck: z.string(),
  })
  .refine((value) => value.password === value.passwordCheck, {
    message: 'Passwords must match',
    path: ['passwordCheck']
  });

export default function Register() {
  const navigate = useNavigate();
  const BACKEND_PORT = Number(import.meta.env.VITE_API_PORT ?? 4000);
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      username: '',
      password: '',
      passwordCheck: '',
    },
  });

  function fetchToken(body: object) {
    return fetch('http://localhost:' + BACKEND_PORT + '/auth/register', {
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
        console.log(token)
        localStorage.setItem('Token', token);
        navigate('/dashboard');
      });
  }

  return (
    <div className='flex items-center justify-center min-h-screen bg-gray-100'>
      <div className='w-full max-w-md grid-cols-1'>
        <div>
          <h1>Register</h1>
          <p>Let's get your started</p>
        </div>
        <div>
          <form 
            onSubmit={form.handleSubmit(onSubmit)}
            className='w-2/3 space-y-5'
          >
            <input
            type="text"
            {...form.register('username')}
            />
            <input
            type="text"
            {...form.register('password')}
            />
            <input
            type="text"
            {...form.register('passwordCheck')}
            />
            <button type='submit'>Register</button>
            <button
                  onClick={(event) => {
                    event.preventDefault();
                    navigate('/login');
                  }}
                >
                  Already a member?
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}