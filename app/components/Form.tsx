'use client';

import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { usePathname, useRouter } from 'next/navigation';
import { AvatarGenerator } from 'random-avatar-generator';
import Link from 'next/link';
import { auth, firestore } from '@/lib/firebase';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import Spinner from './Spinner';

type FormData = {
  name: string;
  email: string;
  password: string;
  confirmedPassword: string;
};

const Form = () => {
  const {
    handleSubmit,
    register,
    formState: { errors },
    watch,
    reset,
  } = useForm<FormData>();

  const [avatarUrl, setAvatarUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const password = watch('password');
  const router = useRouter();
  const path = usePathname();
  const isLoginPage = path.includes('/login');
  const textBtn = isLoginPage ? 'Login' : 'Register';

  const generateAvatar = () => {
    const generator = new AvatarGenerator();

    return generator.generateRandomAvatar();
  };

  const handleRefreshAvatart = () => {
    setAvatarUrl(generateAvatar());
  };

  useEffect(() => {
    setAvatarUrl(generateAvatar());
  }, []);

  const onSubmit = async (data: FormData) => {
    setIsLoading(true);

    const { name, email, password } = data;

    try {
      if (!isLoginPage) {
        const { user } = await createUserWithEmailAndPassword(
          auth,
          email,
          password,
        );

        const docRef = doc(firestore, 'users', user.uid);

        await setDoc(docRef, { name, email, avatarUrl });
        router.push('/');
      } else {
        const { user } = await signInWithEmailAndPassword(
          auth,
          email,
          password,
        );

        if (user) {
          router.push('/');
        }
      }

      reset();
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="w-full max-w-2xl space-y-4 p-10 shadow-lg"
    >
      <h1 className="text-center text-xl font-semibold text-[#0b3a65ff]">
        Chat
        <span className="text-[#eeab63ff]">2</span>
        Chat
      </h1>

      {!isLoginPage && (
        <div
          className="flex items-center justify-between
            space-y-2 border border-gray-200 p-2"
        >
          <img src={avatarUrl} alt="avatar" className="h-20 w-20" />

          <button
            onClick={handleRefreshAvatart}
            type="button"
            className="btn btn-outline"
          >
            New Avatar
          </button>
        </div>
      )}

      {!isLoginPage && (
        <div>
          <label htmlFor="name" className="label">
            <span className="label-text text-base">Name</span>
          </label>

          <input
            id="name"
            type="text"
            placeholder="Enter your name"
            className="input input-bordered w-full"
            {...register('name', {
              required: 'Name is required',
              minLength: {
                value: 2,
                message: 'Name must be at least 2 characters',
              },
            })}
          />

          {errors.name?.message && (
            <span className="text-sm text-red-500">{errors.name.message}</span>
          )}
        </div>
      )}

      <div>
        <label htmlFor="email" className="label">
          <span className="label-text text-base">Email</span>
        </label>

        <input
          id="email"
          type="text"
          placeholder="Enter your name"
          className="input input-bordered w-full"
          {...register('email', {
            required: 'Email is required',
            pattern: {
              value: /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/,
              message: 'Inavlid email address',
            },
          })}
        />

        {errors.email?.message && (
          <span className="text-sm text-red-500">{errors.email.message}</span>
        )}
      </div>

      <div>
        <label htmlFor="password" className="label">
          <span className="label-text text-base">Password</span>
        </label>

        <input
          id="password"
          type="password"
          placeholder="Enter your password"
          className="input input-bordered w-full"
          {...register('password', {
            required: 'Password is required',
            minLength: {
              value: 6,
              message: 'Password must be at least 2 characters',
            },
          })}
        />

        {errors.password?.message && (
          <span className="text-sm text-red-500">
            {errors.password.message}
          </span>
        )}
      </div>

      {!isLoginPage && (
        <div>
          <label htmlFor="confirmed_password" className="label">
            <span className="label-text text-base">Confirm password</span>
          </label>

          <input
            id="confirmed_password"
            type="password"
            placeholder="Confirm your password"
            className="input input-bordered w-full"
            {...register('confirmedPassword', {
              required: 'Please confirm your password',
              validate: (value: string) => password === value
              || 'The passwords do not match',
            })}
          />

          {errors.confirmedPassword?.message && (
            <span className="text-sm text-red-500">
              {errors.confirmedPassword.message}
            </span>
          )}
        </div>
      )}

      <button
        type="submit"
        className="btn btn-block bg-[#0b3a65ff] text-white"
        disabled={isLoading}
      >
        {isLoading ? <Spinner /> : textBtn}
      </button>

      <span>
        {isLoginPage ? 'Do not have an account? ' : 'Alredy have an account? '}

        <Link
          href={isLoginPage ? '/register' : '/login'}
          className="text-blue-600 hover:text-blue-800 hover:underline"
        >
          {isLoginPage ? 'Register' : 'Login'}
        </Link>
      </span>
    </form>
  );
};

export default Form;
