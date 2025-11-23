'use client'

import React, { useState } from "react"

import { Button } from "@/components/ui/button"
import { Dialog, DialogTrigger, DialogContent, DialogFooter, DialogClose, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card } from "@/components/ui/card"
import { Field, FieldGroup, FieldLabel, FieldError } from "@/components/ui/field"
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select"

import Image from "next/image"

import * as z from 'zod'
import { Controller, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'

export default function AddCharacter() {

    // temp    
    const elements = [
        { 
            value: 1, 
            label: "Pyro" 
        },
        { 
            value: 2, 
            label: "Hydro" 
        },
        { 
            value: 3, 
            label: "Anemo" 
        },
        { 
            value: 4, 
            label: "Electro" 
        },
        { 
            value: 5, 
            label: "Dendro" 
        },
        { 
            value: 6, 
            label: "Cryo" 
        },
        { 
            value: 7, 
            label: "Geo" 
        }
    ] as const
    
    const [imagePreview, setImagePreview] = useState<string>('')
    const ACCEPTED_IMAGE_TYPES = ['image/png', 'image/jpg', 'image/jpeg', 'image/webp']
    
    const formSchema = z.object({
        'name': z
            .string('Valor inválido')
            .nonempty('Nome é obrigatório'),
        'element': z
            .coerce.number<number>('Valor inválido')
            .int()
            .min(1)
            .max(7)
            .refine((value) => [1,2,3,4,5,6,7].includes(value), "Elemento inválido"),
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
            element: undefined,
            score: undefined,
            image: undefined
        }
    })

    function onAddCharacter(data: z.infer<typeof formSchema>) {
        console.log(data)
    }

    return (
        <Dialog>
            <DialogTrigger className="bg-primary text-primary-foreground h-9 py-2 px-4 rounded-md font-medium hover:bg-primary/90">
                Adicionar
            </DialogTrigger>
            <DialogContent className="p-[16px] max-w-[650px] w-[650px]">
                <DialogTitle>Adicionar Personagem</DialogTitle>
                <div className="flex justify-between h-[300px]">
                    <div className="flex flex-col justify-between w-full pr-[20px]">
                        <form id="add-character" onSubmit={form.handleSubmit(onAddCharacter)} onChange={() => console.log(form.watch)}>
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
                                    name="element"
                                    control={form.control}
                                    render={({field, fieldState}) => (
                                        <Field data-invalid={fieldState.invalid}>
                                            <div className="flex justify-between">
                                                <FieldLabel className="h-[20px]">Elemento</FieldLabel>
                                                {fieldState.invalid && <FieldError errors={[fieldState.error]}/>}
                                            </div>
                                            <Select
                                                name={field.name}
                                                value={field.value?.toString()}
                                                onValueChange={field.onChange}
                                            >
                                                <SelectTrigger
                                                    id='form-element'
                                                    key='form-element'
                                                    aria-invalid={fieldState.invalid}
                                                    onBlur={field.onBlur}
                                                ><SelectValue placeholder="Pyro"/></SelectTrigger>
                                                <SelectContent>
                                                    {elements.map(element => (
                                                        <SelectItem
                                                            key={element.value} value={element.value.toString()}
                                                        >{element.label}</SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
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
                        onClick={() => console.log('adicionar')}
                    >Adicionar</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}