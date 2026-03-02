'use client'

import React from "react"

import { Button } from "@/components/ui/button"
import { Dialog, DialogTrigger, DialogContent, DialogFooter, DialogClose, DialogTitle } from "@/components/ui/dialog"
import { Field, FieldGroup, FieldLabel, FieldError } from "@/components/ui/field"
import { Input } from "@/components/ui/input"

import * as z from 'zod'
import { Controller, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'

import Image from "next/image"
import Logo from "../../public/logo-donleta.png"

interface LoginData {
    email: string
    password: string
}

interface LoginParams {
    open: boolean
    setOpen: (open: boolean) => void
    onClose: () => void
}

export default function Login({
    open,
    setOpen,
    onClose,
}: LoginParams) {

    const formSchema = z.object({
        'email': z
            .email('Email inválido')
            .nonempty('Email é obrigatório'),
        'password': z
            .string()
            .nonempty("Senha é obrigatório"),
    })

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            email: '',
            password: ''
        }
    })

    const onLogin = async (data: LoginData) => {
        console.log(data)

        form.reset()
        onClose()
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger className="bg-primary text-primary-foreground h-9 py-2 px-4 rounded-md font-medium hover:bg-primary/90">
                Login
            </DialogTrigger>
            <DialogContent showCloseButton={false} className="max-w-[450px] w-[450px] flex flex-col text-center py-8 px-4">
                <DialogTitle className="flex justify-center">
                    <Image src={Logo} alt="Donleta" unoptimized width={200} height={200} className="nav__logo--img"/>
                </DialogTitle>
                <div className="flex justify-between h-[150px]">
                    <div className="flex flex-col justify-between w-full">
                        <form id="login" onSubmit={form.handleSubmit(onLogin)}>
                            <FieldGroup>
                                <Controller
                                    name="email"
                                    control={form.control}
                                    render={({field, fieldState}) => (
                                        <Field data-invalid={fieldState.invalid}>
                                            <div className="flex justify-between">
                                                <FieldLabel className="h-[20px]">Email</FieldLabel>
                                                {fieldState.invalid && <FieldError errors={[fieldState.error]}/>}
                                            </div>
                                            <Input
                                                {...field}
                                                id='form-email'
                                                key='form-email'
                                                aria-invalid={fieldState.invalid}
                                                placeholder='Digite seu email'
                                                autoComplete="off"
                                                autoSave="off"
                                            />
                                        </Field>
                                    )}
                                />
                                <Controller
                                    name="password"
                                    control={form.control}
                                    render={({field, fieldState}) => (
                                        <Field data-invalid={fieldState.invalid}>
                                            <div className="flex justify-between">
                                                <FieldLabel className="h-[20px]">Senha</FieldLabel>
                                                {fieldState.invalid && <FieldError errors={[fieldState.error]}/>}
                                            </div>
                                            <Input
                                                {...field}
                                                type="password"
                                                id="form-password"
                                                key='form-password'
                                                aria-invalid={fieldState.invalid}
                                                placeholder="Digite sua senha"
                                                autoComplete="off"
                                                autoSave="off"
                                            />
                                        </Field>
                                    )}
                                />
                            </FieldGroup>
                        </form>
                    </div>
                </div>
                <DialogFooter className="align-bottom">
                    <DialogClose asChild>
                        <Button
                            variant="outline"
                            onClick={() => form.reset()}
                        >Cancelar</Button>
                    </DialogClose>
                    <Button
                        type="submit"
                        form="login"
                    >Entrar</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}