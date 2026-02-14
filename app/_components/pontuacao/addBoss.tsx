'use client'

import React, { useState } from "react"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Dialog, DialogTrigger, DialogContent, DialogFooter, DialogClose, DialogTitle } from "@/components/ui/dialog"
import { Field, FieldGroup, FieldLabel, FieldError } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

import Image from "next/image"

import * as z from 'zod'
import { Controller, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'

type BossData = {
    name: string
    score: number
    image: File
}

interface AddBossParams {
    open: boolean
    setOpen: (open: boolean) => void
    onClose: () => void
    onSubmit: (data: BossData) => void
}

export default function AddBoss({
    open,
    setOpen,
    onClose,
    onSubmit
}: AddBossParams) {
    
    const [imagePreview, setImagePreview] = useState<string>('')
    const ACCEPTED_IMAGE_TYPES = ['image/png', 'image/jpg', 'image/jpeg', 'image/webp']
    
    const formSchema = z.object({
        'name': z
            .string('Valor inválido')
            .nonempty('Nome é obrigatório'),
        'score': z
            .coerce.number<number>('Valor inválido')
            .nonnegative('Pontuação não pode ser negativa'),
        'image': z
            .file('Valor inválido')
            .refine((file) => ACCEPTED_IMAGE_TYPES.includes(file?.type), "Formato de imagem não suportado")
    })

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: undefined,
            score: undefined,
            image: undefined
        }
    })

    const addBoss = async(data: BossData) => {
        await onSubmit(data)

        form.reset()
        onClose()
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button
                    className="bg-primary text-primary-foreground h-9 py-2 px-4 rounded-md font-medium hover:bg-primary/90"
                >Adicionar</Button>
            </DialogTrigger>
            <DialogContent className="p-[16px] max-w-[650px] w-[650px]">
                <DialogTitle>Adicionar Boss</DialogTitle>
                <div className="flex justify-between h-[250px]">
                    <div className="flex flex-col justify-between w-full pr-[20px]">
                        <form id="add-character" onSubmit={form.handleSubmit(addBoss)}>
                            <FieldGroup>
                                <Controller
                                    name="name"
                                    control={form.control}
                                    render={({field, fieldState}) => (
                                        <Field data-invalid={fieldState.invalid}>
                                            <div className="flex justify-between">
                                                <FieldLabel className="h-[20px]">Name</FieldLabel>
                                                {fieldState.invalid && <FieldError errors={[fieldState.error]}/>}
                                            </div>
                                            <Input
                                                {...field}
                                                id='form-name'
                                                key='form-name'
                                                aria-invalid={fieldState.invalid}
                                                placeholder='Amber'
                                                autoComplete="off"
                                            />
                                        </Field>
                                    )}
                                />
                                <Controller
                                    name="score"
                                    control={form.control}
                                    render={({field, fieldState}) => (
                                        <Field data-invalid={fieldState.invalid}>
                                            <div className="flex justify-between">
                                                <FieldLabel className="h-[20px]">Pontuação</FieldLabel>
                                                {fieldState.invalid && <FieldError errors={[fieldState.error]}/>}
                                            </div>
                                            <Input
                                                {...field}
                                                
                                                type="number"
                                                id="form-score"
                                                key='form-score'
                                                aria-invalid={fieldState.invalid}
                                                placeholder="3"
                                            />
                                        </Field>
                                    )}
                                />
                                <Controller
                                    name="image"
                                    control={form.control}
                                    render={({field, fieldState}) => (
                                        <Field data-invalid={fieldState.invalid}>
                                            <div className="flex justify-between">
                                                <FieldLabel className="h-[20px]">Imagem</FieldLabel>
                                                {fieldState.invalid && <FieldError errors={[fieldState.error]}/>}
                                            </div>
                                            <Input
                                                type="file"
                                                id='form-image'
                                                key='form-image'
                                                name={field.name}
                                                aria-invalid={fieldState.invalid}
                                                onBlur={field.onBlur}
                                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                                                    const file = e.target.files?.[0] ?? undefined
                                                    field.onChange(file)

                                                    if (file) {
                                                        const reader = new FileReader()

                                                        reader.onloadend = () => setImagePreview(reader.result as string)         
                                                        reader.readAsDataURL(file)
                                                    }
                                                }}
                                                ref={field.ref}
                                            />
                                        </Field>
                                    )}
                                />
                            </FieldGroup>
                        </form>
                    </div>
                    <div className="flex flex-col gap-4">
                        <Label className="h-[20px]">Preview</Label>
                        <Card className="w-[200px] h-[200px] overflow-hidden border-0 drop-shadow-(--drop-shadow)">
                            <Image src={imagePreview} alt='image' height={200} width={200}/>
                        </Card>
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
                        form="add-character"
                    >Adicionar</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}