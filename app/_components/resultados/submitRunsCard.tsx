'use client'

import * as z from 'zod'
import { Card, CardTitle, CardContent, CardHeader, CardFooter } from "@/components/ui/card";
import { Controller, useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Field, FieldError, FieldGroup, FieldSet } from "@/components/ui/field";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { XIcon } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export default function SubmitRunsCard() {

    const formFields = {
        'participant': undefined as unknown as number,
        'character1': undefined as unknown as number,
        'character2': undefined as unknown as number,
        'boss': undefined as unknown as number,
        'time': undefined as unknown as number,
        'result': undefined as unknown as number,
        'score': undefined as unknown as number
    }

    const formSchema = z.object({
        'runs': z.
            array(
                z.object({
                    'participant': z
                        .coerce.number<number>('Valor inválido!'),
                    'character1': z
                        .coerce.number<number>('Valor inválido!'),
                    'character2': z
                        .coerce.number<number>('Valor inválido!'),
                    'boss': z
                        .coerce.number<number>('Valor inválido!'),
                    'time': z
                        .coerce.number<number>('Valor inválido!'),
                    'result': z
                        .coerce.number<number>('Valor inválido!'),
                    'score': z
                        .coerce.number<number>('Valor inválido!')
                })
            )
    })

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            'runs': [formFields]
        }
    })

    const {fields, append, remove} = useFieldArray({
        control: form.control,
        name: 'runs'
    })

    function onSubmitDailyRuns(data: z.infer<typeof formSchema>) {
        console.log(data)
    }

    const selectTest = [
        {
            value: 1,
            label: 'Remi'
        },
        {
            value: 2,
            label: 'Amber'
        }
    ]

    return (
        <Card className="py-6">
            <CardHeader>
                <CardTitle>Resultados do Dia</CardTitle>
            </CardHeader>
            <CardContent className="px-6">
                <form id="add-runs" onSubmit={form.handleSubmit(onSubmitDailyRuns)} onChange={() => console.log(form.watch())}>
                    <FieldGroup>
                        {fields.map((field, index) => {
                            console.log(field) 
                            return(
                                <FieldSet key={field.id}>
                                    <FieldGroup>
                                        <div className="flex flex-row gap-2 justify-between">
                                            <Controller
                                                key={`runs.${index}.participant.controller`}
                                                name={`runs.${index}.participant`}
                                                control={form.control}
                                                render={({field, fieldState}) => (
                                                    <Field data-invalid={fieldState.invalid} className="min-w-32 max-w-52">
                                                        <Label>Participante</Label>
                                                        <Select
                                                            name={field.name}
                                                            value={field.value?.toString()}
                                                            onValueChange={field.onChange}
                                                        >
                                                            <SelectTrigger
                                                                id={`runs.${index}.participant`}
                                                                key={`runs.${index}.participant`}
                                                                aria-invalid={fieldState.invalid}
                                                                onBlur={field.onBlur}
                                                            ><SelectValue placeholder="Remissys"/></SelectTrigger>
                                                            <SelectContent>
                                                                {selectTest.map(username => (
                                                                    <SelectItem
                                                                        key={username.value} 
                                                                        value={username.value.toString()}
                                                                    >{username.label}</SelectItem>
                                                                ))}
                                                            </SelectContent>
                                                        </Select>
                                                        {fieldState.invalid && <FieldError errors={[fieldState.error]}/>}
                                                    </Field>
                                                )}
                                            />
                                            <Controller
                                                key={`runs.${index}.character1.controller`}
                                                name={`runs.${index}.character1`}
                                                control={form.control}
                                                render={({field, fieldState}) => (
                                                    <Field data-invalid={fieldState.invalid} className="min-w-32 max-w-52">
                                                        <Label>Persoangem 1</Label>
                                                        <Select
                                                            name={field.name}
                                                            value={field.value?.toString()}
                                                            onValueChange={field.onChange}
                                                        >
                                                            <SelectTrigger
                                                                id={`runs.${index}.character1`}
                                                                key={`runs.${index}.character1`}
                                                                aria-invalid={fieldState.invalid}
                                                                onBlur={field.onBlur}
                                                            >
                                                                <div className="flex w-full justify-between items-center overflow-hidden">
                                                                    <SelectValue placeholder="Amber"/>
                                                                    {field.value && <Badge className="h-5 w-5 tabular-nums">0</Badge>}
                                                                </div>
                                                            </SelectTrigger>
                                                            <SelectContent>
                                                                {selectTest.map(char => (
                                                                    <SelectItem
                                                                        key={char.value} 
                                                                        value={char.value.toString()}
                                                                    >{char.label}</SelectItem>
                                                                ))}
                                                            </SelectContent>
                                                        </Select>
                                                        {fieldState.invalid && <FieldError errors={[fieldState.error]}/>}
                                                    </Field>
                                                )}
                                            />
                                            <Controller
                                                key={`runs.${index}.character2.controller`}
                                                name={`runs.${index}.character2`}
                                                control={form.control}
                                                render={({field, fieldState}) => (
                                                    <Field data-invalid={fieldState.invalid} className="min-w-32 max-w-52">
                                                        <Label>Persoangem 2</Label>
                                                        <Select
                                                            name={field.name}
                                                            value={field.value?.toString()}
                                                            onValueChange={field.onChange}
                                                        >
                                                            <SelectTrigger
                                                                id={`runs.${index}.character2`}
                                                                key={`runs.${index}.character2`}
                                                                aria-invalid={fieldState.invalid}
                                                                onBlur={field.onBlur}
                                                            >
                                                                <div className="flex w-full justify-between items-center overflow-hidden">
                                                                    <SelectValue placeholder="Sangonomia Kokomi"/>
                                                                    {field.value && <Badge className="h-5 w-5 tabular-nums">0</Badge>} {/* como fazer verificação de pontuação por boneco? */}
                                                                </div>
                                                            </SelectTrigger>
                                                            <SelectContent>
                                                                {selectTest.map(char => (
                                                                    <SelectItem
                                                                        key={char.value} 
                                                                        value={char.value.toString()}
                                                                    >{char.label}</SelectItem>
                                                                ))}
                                                            </SelectContent>
                                                        </Select>
                                                        {fieldState.invalid && <FieldError errors={[fieldState.error]}/>}
                                                    </Field>
                                                )}
                                            />
                                            <Controller
                                                key={`runs.${index}.boss.controller`}
                                                name={`runs.${index}.boss`}
                                                control={form.control}
                                                render={({field, fieldState}) => (
                                                    <Field data-invalid={fieldState.invalid} className="min-w-32 max-w-52">
                                                        <Label>Boss</Label>
                                                        <Select
                                                            name={field.name}
                                                            value={field.value?.toString()}
                                                            onValueChange={field.onChange}
                                                        >
                                                            <SelectTrigger
                                                                id={`runs.${index}.boss`}
                                                                key={`runs.${index}.boss`}
                                                                aria-invalid={fieldState.invalid}
                                                                onBlur={field.onBlur}
                                                            >
                                                                <div className="flex w-full justify-between items-center overflow-hidden">
                                                                    <SelectValue placeholder="Dragarto Primordial"/>
                                                                    {field.value && <Badge className="h-5 w-5 tabular-nums">0</Badge>}
                                                                </div>
                                                            </SelectTrigger>
                                                            <SelectContent>
                                                                {selectTest.map(boss => (
                                                                    <SelectItem
                                                                        key={boss.value} 
                                                                        value={boss.value.toString()}
                                                                    >{boss.label}</SelectItem>
                                                                ))}
                                                            </SelectContent>
                                                        </Select>
                                                        {fieldState.invalid && <FieldError errors={[fieldState.error]}/>}
                                                    </Field>
                                                )}
                                            />
                                            <Controller
                                                key={`runs.${index}.time.controller`}
                                                name={`runs.${index}.time`}
                                                control={form.control}
                                                render={({field, fieldState}) => (
                                                    <Field data-invalid={fieldState.invalid} className="min-w-32 max-w-52">
                                                        <Label>Tempo</Label>
                                                        <Select
                                                            name={field.name}
                                                            value={field.value?.toString()}
                                                            onValueChange={field.onChange}
                                                        >
                                                            <SelectTrigger
                                                                id={`runs.${index}.time`}
                                                                key={`runs.${index}.time`}
                                                                aria-invalid={fieldState.invalid}
                                                                onBlur={field.onBlur}
                                                            >
                                                                <div className="flex w-full justify-between items-center overflow-hidden">
                                                                    <SelectValue placeholder="Entre 0:00 e 2:00"/>
                                                                    {field.value && <Badge className="h-5 w-5 tabular-nums">0</Badge>}
                                                                </div>
                                                            </SelectTrigger>
                                                            <SelectContent>
                                                                {selectTest.map(time => (
                                                                    <SelectItem
                                                                        key={time.value}
                                                                        value={time.value.toString()}
                                                                    >{time.label}</SelectItem>
                                                                ))}
                                                            </SelectContent>
                                                        </Select>
                                                        {fieldState.invalid && <FieldError errors={[fieldState.error]}/>}
                                                    </Field>
                                                )}
                                            />
                                            <Controller
                                                key={`runs.${index}.result.controller`}
                                                name={`runs.${index}.result`}
                                                control={form.control}
                                                render={({field, fieldState}) => (
                                                    <Field data-invalid={fieldState.invalid} className="min-w-32 max-w-52">
                                                        <Label>Resultado</Label>
                                                        <Select
                                                            name={field.name}
                                                            value={field.value?.toString()}
                                                            onValueChange={field.onChange}
                                                        >
                                                            <SelectTrigger
                                                                id={`runs.${index}.result`}
                                                                key={`runs.${index}.result`}
                                                                aria-invalid={fieldState.invalid}
                                                                onBlur={field.onBlur}
                                                            >
                                                                <div className="flex w-full justify-between overflow-hidden gap-2">
                                                                    <span className="overflow-hidden"><SelectValue placeholder="Vitória"/></span> {/*Repetir nos outros campos */}
                                                                    {field.value && <Badge className="h-5 w-5 tabular-nums">0</Badge>}
                                                                </div>
                                                            </SelectTrigger>
                                                            <SelectContent>
                                                                <SelectItem
                                                                    key={"defeat"}
                                                                    value="0"
                                                                >Derrrrrota</SelectItem>
                                                                <SelectItem
                                                                    key={"victory"}
                                                                    value="1"
                                                                >Vitória</SelectItem>
                                                            </SelectContent>
                                                        </Select>
                                                        {fieldState.invalid && <FieldError errors={[fieldState.error]}/>}
                                                    </Field>
                                                )}
                                            />
                                            <Controller
                                                key={`runs.${index}.score.controller`}
                                                name={`runs.${index}.score`}
                                                control={form.control}
                                                render={({field, fieldState}) => (
                                                    <Field data-invalid={fieldState.invalid} className="min-w-32 max-w-52">
                                                        <Label>Prontuação</Label>
                                                        <Label
                                                            {...field}
                                                            id={`runs.${index}.score`}
                                                            key={`runs.${index}.score`}
                                                            aria-invalid={fieldState.invalid}
                                                            className="border-input aria-invalid:border-destructive border h-9 text-sm rounded-md px-3 py-2"
                                                        >{field.value}0</Label>
                                                        {fieldState.invalid && <FieldError errors={[fieldState.error]}/>}
                                                    </Field>
                                                )}
                                            />
                                            <div className="h-[76px] py-6.5">
                                                <Button
                                                    variant="outline"
                                                    size="icon"
                                                    className="rounded-full mt-10"
                                                    onClick={() => remove(index)}
                                                ><XIcon/></Button>
                                            </div>
                                        </div>
                                    </FieldGroup>
                                </FieldSet>
                            )
                        })}
                    </FieldGroup>
                </form>
                <Button
                    onClick={() => append(formFields)}
                >Adicionar</Button>
            </CardContent>
            <CardFooter>
                <div className="flex w-full justify-end">
                    <Button
                        variant="ghost"
                        onClick={() => form.reset()}
                    >Cancelar</Button>
                    <Button
                        type="submit"
                        form="add-runs"
                    >Enviar</Button>
                </div>
            </CardFooter>
        </Card>
    )
}