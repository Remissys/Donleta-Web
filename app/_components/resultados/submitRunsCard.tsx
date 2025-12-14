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

import { useState, useCallback } from 'react';

export default function SubmitRunsCard() {

    const formFields = {
        'participant': undefined as unknown as number,
        'character1': undefined as unknown as number,
        'character2': undefined as unknown as number,
        'boss': undefined as unknown as number,
        'time': undefined as unknown as number,
        'result': undefined as unknown as number,
    }

    const defaultScores = {
        'character1': '',
        'character2': '',
        'boss': '',
        'time': '',
        'result': ''
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
            label: 'Remi',
            score: '3'
        },
        {
            value: 2,
            label: 'Amber',
            score: 'F'
        }
    ]

    interface Scores {
        character1: string
        character2: string
        boss: string
        time: string
        result: string
    }

    const [scores, setScores] = useState<Map<string, Scores>>(new Map())

    const getOptionScore = useCallback((index:number, id:number, field:string) => {
        let fieldOptions = []

        if (field === 'boss') fieldOptions = selectTest
        else if (field === 'time') fieldOptions = selectTest
        else fieldOptions = selectTest

        const data = fieldOptions.find(option => option.value === Number(id))
        if (!data) return null
        return data.score
    }, [])

    const setFieldScore = useCallback((index:number, id:number, field:string) => {
        let fieldOptions = []

        if (field === 'boss') fieldOptions = selectTest
        else if (field === 'time') fieldOptions = selectTest
        else fieldOptions = selectTest

        const data = fieldOptions.find(option => option.value === Number(id))
        if (!data) return null

        setScores(prevState => {
            const newState = new Map(prevState)
            const scoreValues = newState.get(`runs.${index}`)
            const scoreObj: Scores = scoreValues ? {...scoreValues} : defaultScores
            
            scoreObj[field as keyof Scores] = field === 'result' ? String(id) : data.score
            newState.set(`runs.${index}`, scoreObj)

            return newState
        })

        return data.score
    }, [])

    const updateScore = useCallback((index:number) => {
        let fieldScores = scores.get(`runs.${index}`)

        if (!fieldScores) return '0'

        let score = 0

        for (const [key, value] of Object.entries(fieldScores)) {
            if (key === 'result' && value === '1') {
                score = 0
                break
            }

            if (!isNaN(Number(value))) {
                score += Number(value)
            } else {
                score = 0 
                break
            }
        }

        return score
    }, [scores])

    return (
        <Card className="py-6">
            <CardHeader>
                <CardTitle>Resultados do Dia</CardTitle>
            </CardHeader>
            <CardContent className="px-6">
                <form id="add-runs" onSubmit={form.handleSubmit(onSubmitDailyRuns)}>
                    <FieldGroup>
                        {fields.map((field, index) => {
                            return(
                                <FieldSet key={field.id}>
                                    <FieldGroup>
                                        <div className="inline-flex flex-wrap gap-5">
                                            <Controller
                                                key={`runs.${index}.participant.controller`}
                                                name={`runs.${index}.participant`}
                                                control={form.control}
                                                render={({field, fieldState}) => (
                                                    <Field data-invalid={fieldState.invalid} className="min-w-32 max-w-48">
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
                                                    <Field data-invalid={fieldState.invalid} className="min-w-32 max-w-48">
                                                        <Label>Persoangem 1</Label>
                                                        <Select
                                                            name={field.name}
                                                            value={field.value?.toString()}
                                                            onValueChange={val => {field.onChange(val), setFieldScore(index, Number(val), 'character1')}}
                                                        >
                                                            <SelectTrigger
                                                                id={`runs.${index}.character1`}
                                                                key={`runs.${index}.character1`}
                                                                aria-invalid={fieldState.invalid}
                                                                onBlur={field.onBlur}
                                                            >
                                                                <div className="flex w-full justify-between overflow-hidden gap-2">
                                                                    <span className="overflow-hidden"><SelectValue placeholder="Amber"/></span>
                                                                    {field.value && <Badge className="h-5 w-5 tabular-nums">{getOptionScore(index, field.value, 'character1')}</Badge>}
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
                                                    <Field data-invalid={fieldState.invalid} className="min-w-32 max-w-48">
                                                        <Label>Persoangem 2</Label>
                                                        <Select
                                                            name={field.name}
                                                            value={field.value?.toString()}
                                                            onValueChange={val => {field.onChange(val), setFieldScore(index, Number(val), 'character2')}}
                                                        >
                                                            <SelectTrigger
                                                                id={`runs.${index}.character2`}
                                                                key={`runs.${index}.character2`}
                                                                aria-invalid={fieldState.invalid}
                                                                onBlur={field.onBlur}
                                                            >
                                                                <div className="flex w-full justify-between overflow-hidden gap-2">
                                                                    <span className="overflow-hidden"><SelectValue placeholder="Sangonomia Kokomi"/></span>
                                                                    {field.value && <Badge className="h-5 w-5 tabular-nums">{getOptionScore(index, field.value, 'character2')}</Badge>}
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
                                                    <Field data-invalid={fieldState.invalid} className="min-w-32 max-w-48">
                                                        <Label>Boss</Label>
                                                        <Select
                                                            name={field.name}
                                                            value={field.value?.toString()}
                                                            onValueChange={val => {field.onChange(val), setFieldScore(index, Number(val), 'boss')}}
                                                        >
                                                            <SelectTrigger
                                                                id={`runs.${index}.boss`}
                                                                key={`runs.${index}.boss`}
                                                                aria-invalid={fieldState.invalid}
                                                                onBlur={field.onBlur}
                                                            >
                                                                <div className="flex w-full justify-between overflow-hidden gap-2">
                                                                    <span className="overflow-hidden"><SelectValue placeholder="Dragarto Primordial"/></span>
                                                                    {field.value && <Badge className="h-5 w-5 tabular-nums">{getOptionScore(index, field.value, 'boss')}</Badge>}
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
                                                    <Field data-invalid={fieldState.invalid} className="min-w-32 max-w-48">
                                                        <Label>Tempo</Label>
                                                        <Select
                                                            name={field.name}
                                                            value={field.value?.toString()}
                                                            onValueChange={val => {field.onChange(val), setFieldScore(index, Number(val), 'time')}}
                                                        >
                                                            <SelectTrigger
                                                                id={`runs.${index}.time`}
                                                                key={`runs.${index}.time`}
                                                                aria-invalid={fieldState.invalid}
                                                                onBlur={field.onBlur}
                                                            >
                                                                <div className="flex w-full justify-between overflow-hidden gap-2">
                                                                    <span className="overflow-hidden"><SelectValue placeholder="Entre 0:00 e 2:00"/></span>
                                                                    {field.value && <Badge className="h-5 w-5 tabular-nums">{getOptionScore(index, field.value, 'time')}</Badge>}
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
                                                    <Field data-invalid={fieldState.invalid} className="min-w-32 max-w-48">
                                                        <Label>Resultado</Label>
                                                        <Select
                                                            name={field.name}
                                                            value={field.value?.toString()}
                                                            onValueChange={val => {field.onChange(val), setFieldScore(index, Number(val), 'result')}}
                                                        >
                                                            <SelectTrigger
                                                                id={`runs.${index}.result`}
                                                                key={`runs.${index}.result`}
                                                                aria-invalid={fieldState.invalid}
                                                                onBlur={field.onBlur}
                                                            ><SelectValue placeholder="Vitória"/></SelectTrigger>
                                                            <SelectContent>
                                                                <SelectItem
                                                                    key={1}
                                                                    value="1"
                                                                >Derrota</SelectItem>
                                                                <SelectItem
                                                                    key={2}
                                                                    value="2"
                                                                >Vitória</SelectItem>
                                                            </SelectContent>
                                                        </Select>
                                                        {fieldState.invalid && <FieldError errors={[fieldState.error]}/>}
                                                    </Field>
                                                )}
                                            />
                                            <div className="flex flex-col gap-3 w-full min-w-32 max-w-48">
                                                <Label>Prontuação</Label>
                                                <Label 
                                                    className="border-input aria-invalid:border-destructive border h-9 text-sm rounded-md px-3 py-2 text-center"
                                                >{updateScore(index)}</Label>
                                            </div>
                                            <div className="h-[76px] py-6.5">
                                                <Button
                                                    variant="outline"
                                                    size="icon"
                                                    className="rounded-full mt-10"
                                                    onClick={() => {remove(index), scores.delete(`runs.${index}`)}}
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
                        onClick={() => {form.reset(), scores.clear()}}
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