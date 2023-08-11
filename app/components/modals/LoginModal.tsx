'use client';

import axios from 'axios';
import { AiFillFacebook } from 'react-icons/ai';
import { FcGoogle } from 'react-icons/fc';
import { useCallback, useState } from 'react';
import { Field, FieldValues, SubmitHandler, useForm } from 'react-hook-form';

import useLoginModal from '@/app/hooks/useLoginModal';
import Modal from './Modal';
import Heading from '../Heading';
import Input from '../Inputs/Input';
import { toast } from 'react-hot-toast';
import Button from '../Button';

const LoginModal = () => {
    const LoginModal = useLoginModal();
    const [isLoading, setIsLoading] = useState(false);

    const {
        register,
        handleSubmit,
        formState: { errors }
    } = useForm<FieldValues>({
        defaultValues: {
            username: '',
            password: '',
        }
    });

    const onSubmit: SubmitHandler<FieldValues> = (data) => {
        setIsLoading(true);

        axios.post('/api/register', data)
            .then((res) => {
                LoginModal.onClose();
            })
            .catch((error) => {
                toast.error("Something went wrong");
            })
            .finally(() => {
                setIsLoading(false);
            })
    }

    const bodyContent = (
        <div className=" flex flex-col gap-4">
            <Heading 
                title="Welcome back!"
                subtitle="Login to your account"
            />
            <Input
                id="username"
                label="Username or Email"
                disabled={isLoading}
                register={register}
                errors={errors}
                required
            />
            <Input
                id="password"
                type="password"
                label="Password"
                disabled={isLoading}
                register={register}
                errors={errors}
                required
            />
        </div>
    );

    const footerContent = (
        <div className="flex flex-col gap-4 mt-3">
            <hr />
            <Button 
                outline
                label="Continue with Google"
                icon={FcGoogle}
                onClick={() => {}}
            />
            <Button 
                outline
                label="Continue with Facebook"
                icon={AiFillFacebook}
                onClick={() => {}}
            />
        </div>
    )
        
    return(
        <div>
            <Modal 
                disabled={isLoading}
                isOpen={LoginModal.isOpen}
                title="Login"
                actionLabel="Continue"
                onClose={LoginModal.onClose}
                onSubmit={handleSubmit(onSubmit)}
                body={bodyContent}
                footer={footerContent}
            />
        </div>
    )
}

export default LoginModal