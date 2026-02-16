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

import { useState, useCallback, useEffect } from 'react';
import RunPeriodSelector from './runsPeriodSelection';
import axios from 'axios';

interface Scores {
    character1: string
    character2: string
    boss: string
    time: string
    victory: string
}

interface Options {
    value: string
    label: string
    score?: number
}

interface Participant {
    _id: string
    name: string
}

interface Char {
    _id: string
    name: string
    element: number
    score: number
    image_key: string
}

interface Boss {
    _id: string
    name: string
    score: number
    image_key: string
}

interface Time {
    _id: string
    description: string
    score: number
}

export default function SubmitRunsCard() {
    const [ isLoading, setIsLoading ] = useState<boolean>(false)
    const [ participantOptions, setParticipantOptions ] = useState<Options[]>([] as Options[])
    const [ charOptions, setCharOptions ] = useState<Options[]>([] as Options[])
    const [ bossOptions, setBossOptions ] = useState<Options[]>([] as Options[])
    const [ timeOptions, setTimeOptions ] = useState<Options[]>([] as Options[])
    const [ scores, setScores ] = useState<Map<string, Scores>>(new Map())

    const victoryOptions: Options[] = [
        { value: 'true', label: 'Vitória' },
        { value: 'false', label: 'Derrota' }
    ]

    useEffect(() => {
        fetchParticipants()
        fetchCharacters()
        fetchBosses()
        fetchTimes()
    }, [])

    const fetchParticipants = async () => {
        try {
            setIsLoading(true)
            
            const response = await axios.get('/participants/', {
                baseURL: process.env.NEXT_PUBLIC_DONLETA_URL
            })

            if (response.data.data) {
                const data = response.data.data

                const options: Options[] = data.map((participant: Participant) => ({
                    value: participant._id,
                    label: participant.name
                }))

                setParticipantOptions(options)
            }
        } catch(err) {
            console.error(err)
        } finally {
            setIsLoading(false)
        }
    }

    const fetchCharacters = async () => {
        try {
            setIsLoading(true)
            
            const response = await axios.get('/characters/', {
                baseURL: process.env.NEXT_PUBLIC_DONLETA_URL
            })

            if (response.data.data) {
                const data = response.data.data

                const options: Options[] = data.map((char: Char) => ({
                    value: char._id,
                    label: char.name,
                    score: char.score
                }))

                setCharOptions(options)
            }
        } catch(err) {
            console.error(err)
        } finally {
            setIsLoading(false)
        }
    }

    const fetchBosses = async () => {
        try {
            setIsLoading(true)
            
            const response = await axios.get('/bosses/', {
                baseURL: process.env.NEXT_PUBLIC_DONLETA_URL
            })

            if (response.data.data) {
                const data = response.data.data

                const options: Options[] = data.map((boss: Boss) => ({
                    value: boss._id,
                    label: boss.name,
                    score: boss.score
                }))

                setBossOptions(options)
            }
        } catch(err) {
            console.error(err)
        } finally {
            setIsLoading(false)
        }
    }

    const fetchTimes = async () => {
        try {
            setIsLoading(true)
            
            const response = await axios.get('/times/', {
                baseURL: process.env.NEXT_PUBLIC_DONLETA_URL
            })

            if (response.data.data) {
                const data = response.data.data

                const options: Options[] = data.map((time: Time) => ({
                    value: time._id,
                    label: time.description,
                    score: time.score
                }))

                setTimeOptions(options)
            }
        } catch(err) {
            console.error(err)
        } finally {
            setIsLoading(false)
        }
    }

    const onSubmitDailyRuns = async (data: z.infer<typeof formSchema>) => {
        try {
            setIsLoading(true)

            const response = await axios.post('/runs/', data, {
                baseURL: process.env.NEXT_PUBLIC_DONLETA_URL
            })
        } catch(err) {
            console.error(err)
        } finally {
            setIsLoading(false)
            form.resetField('runs')
            setScores(new Map())
        }
    }

    const formFields = {
        'participant': undefined as unknown as string,
        'character1': undefined as unknown as string,
        'character2': undefined as unknown as string,
        'boss': undefined as unknown as string,
        'time': undefined as unknown as string,
        'victory': undefined as unknown as string,
    }

    const defaultScores = {
        'character1': '',
        'character2': '',
        'boss': '',
        'time': '',
        'victory': ''
    }

    const formSchema = z.object({
        'date': z.
            object({
                'edition': z.string('Valor inválido!'),
                'week': z.string('Valor inválido!'),
                'period': z.string('Valor inválido!'),
            }),
        'runs': z.
            array(
                z.object({
                    'participant': z.string('Valor inválido!'),
                    'character1': z.string('Valor inválido!'),
                    'character2': z.string('Valor inválido!'),
                    'boss': z.string('Valor inválido!'),
                    'time': z.string('Valor inválido!'),
                    'victory': z.string('Valor inválido!'),
                })
            )
    })

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            'date': {
                'edition': "",
                'week': "",
                'period': ""
            },
            'runs': [formFields]
        }
    })

    const {fields, append, remove} = useFieldArray({
        control: form.control,
        name: 'runs'
    })

    const getOptionScore = (id:string, field:string) => {
        let fieldOptions = []

        if (field === 'boss') fieldOptions = bossOptions
        else if (field === 'time') fieldOptions = timeOptions
        else fieldOptions = charOptions

        const data = fieldOptions.find(option => option.value === id)
        if (!data) return null
        return data.score
    }

    const setFieldScore = useCallback((index:number, id:string, field: 'character1' | 'character2' | 'boss' | 'time' | 'victory') => {
        let fieldOptions = []

        if (field === 'boss') fieldOptions = bossOptions
        else if (field === 'time') fieldOptions = timeOptions
        else if (field === 'victory') fieldOptions = victoryOptions
        else fieldOptions = charOptions

        const data = fieldOptions.find(option => option.value === id)

        if (!data && field) return null

        setScores(prevState => {
            const newState = new Map(prevState)
            const scoreValues = newState.get(`runs.${index}`)
            const scoreObj: Scores = scoreValues ? {...scoreValues} : {...defaultScores}
            
            scoreObj[field as keyof Scores] = field === 'victory' ? id : String(data?.score)
            newState.set(`runs.${index}`, scoreObj)

            return newState
        })

        return data?.score
    }, [])

    const updateScore = useCallback((index:number) => {
        const fieldScores = scores.get(`runs.${index}`)

        if (!fieldScores) return '0'

        let score = 0

        for (const [key, value] of Object.entries(fieldScores)) {
            if (key === 'victory') {
                if (value === 'false') {
                    score = 0
                    break
                }
            } else {
                if (!isNaN(Number(value))) {
                    score += Number(value)
                } else {
                    score = 0 
                    break
                }
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
                    <Controller
                        control={form.control}
                        name='date'
                        render={({field, fieldState}) => (
                            <RunPeriodSelector
                                field={field}
                                fieldState={fieldState}
                                getValues={form.getValues}
                            />
                        )}
                    />
                    <FieldGroup>
                        {fields.map((field, index) => {
                            return(
                                <FieldSet key={field.id}>
                                    <FieldGroup>
                                        <div className="grid 2xl:grid-cols-8 md:grid-cols-4 sm:grid-cols-3 gap-5">
                                            <Controller
                                                key={`runs.${index}.participant.controller`}
                                                name={`runs.${index}.participant`}
                                                control={form.control}
                                                render={({field, fieldState}) => (
                                                    <Field data-invalid={fieldState.invalid} >
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
                                                                {participantOptions.map(participant => (
                                                                    <SelectItem
                                                                        key={participant.value} 
                                                                        value={participant.value}
                                                                    >{participant.label}</SelectItem>
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
                                                    <Field data-invalid={fieldState.invalid} >
                                                        <Label>Persoangem 1</Label>
                                                        <Select
                                                            name={field.name}
                                                            value={field.value?.toString()}
                                                            onValueChange={val => {field.onChange(val), setFieldScore(index, val, 'character1')}}
                                                        >
                                                            <SelectTrigger
                                                                id={`runs.${index}.character1`}
                                                                key={`runs.${index}.character1`}
                                                                aria-invalid={fieldState.invalid}
                                                                onBlur={field.onBlur}
                                                            >
                                                                <div className="flex w-full justify-between overflow-hidden gap-2">
                                                                    <span className="overflow-hidden"><SelectValue placeholder="Amber"/></span>
                                                                    {field.value && <Badge className="h-5 w-5 tabular-nums">{getOptionScore(field.value, 'character1')}</Badge>}
                                                                </div>
                                                            </SelectTrigger>
                                                            <SelectContent>
                                                                {charOptions.map(char => (
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
                                                    <Field data-invalid={fieldState.invalid} >
                                                        <Label>Persoangem 2</Label>
                                                        <Select
                                                            name={field.name}
                                                            value={field.value?.toString()}
                                                            onValueChange={val => {field.onChange(val), setFieldScore(index, val, 'character2')}}
                                                        >
                                                            <SelectTrigger
                                                                id={`runs.${index}.character2`}
                                                                key={`runs.${index}.character2`}
                                                                aria-invalid={fieldState.invalid}
                                                                onBlur={field.onBlur}
                                                            >
                                                                <div className="flex w-full justify-between overflow-hidden gap-2">
                                                                    <span className="overflow-hidden"><SelectValue placeholder="Sangonomia Kokomi"/></span>
                                                                    {field.value && <Badge className="h-5 w-5 tabular-nums">{getOptionScore(field.value, 'character2')}</Badge>}
                                                                </div>
                                                            </SelectTrigger>
                                                            <SelectContent>
                                                                {charOptions.map(char => (
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
                                                    <Field data-invalid={fieldState.invalid} >
                                                        <Label>Boss</Label>
                                                        <Select
                                                            name={field.name}
                                                            value={field.value?.toString()}
                                                            onValueChange={val => {field.onChange(val), setFieldScore(index, val, 'boss')}}
                                                        >
                                                            <SelectTrigger
                                                                id={`runs.${index}.boss`}
                                                                key={`runs.${index}.boss`}
                                                                aria-invalid={fieldState.invalid}
                                                                onBlur={field.onBlur}
                                                            >
                                                                <div className="flex w-full justify-between overflow-hidden gap-2">
                                                                    <span className="overflow-hidden"><SelectValue placeholder="Dragarto Primordial"/></span>
                                                                    {field.value && <Badge className="h-5 w-5 tabular-nums">{getOptionScore(field.value, 'boss')}</Badge>}
                                                                </div>
                                                            </SelectTrigger>
                                                            <SelectContent>
                                                                {bossOptions.map(boss => (
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
                                                    <Field data-invalid={fieldState.invalid} >
                                                        <Label>Tempo</Label>
                                                        <Select
                                                            name={field.name}
                                                            value={field.value?.toString()}
                                                            onValueChange={val => {field.onChange(val), setFieldScore(index, val, 'time')}}
                                                        >
                                                            <SelectTrigger
                                                                id={`runs.${index}.time`}
                                                                key={`runs.${index}.time`}
                                                                aria-invalid={fieldState.invalid}
                                                                onBlur={field.onBlur}
                                                            >
                                                                <div className="flex w-full justify-between overflow-hidden gap-2">
                                                                    <span className="overflow-hidden"><SelectValue placeholder="Entre 0:00 e 2:00"/></span>
                                                                    {field.value && <Badge className="h-5 w-5 tabular-nums">{getOptionScore(field.value, 'time')}</Badge>}
                                                                </div>
                                                            </SelectTrigger>
                                                            <SelectContent>
                                                                {timeOptions.map(time => (
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
                                                key={`runs.${index}.victory.controller`}
                                                name={`runs.${index}.victory`}
                                                control={form.control}
                                                render={({field, fieldState}) => (
                                                    <Field data-invalid={fieldState.invalid} >
                                                        <Label>Resultado</Label>
                                                        <Select
                                                            name={field.name}
                                                            value={field.value?.toString()}
                                                            onValueChange={val => {field.onChange(val), setFieldScore(index, val, 'victory')}}
                                                        >
                                                            <SelectTrigger
                                                                id={`runs.${index}.victory`}
                                                                key={`runs.${index}.victory`}
                                                                aria-invalid={fieldState.invalid}
                                                                onBlur={field.onBlur}
                                                            ><SelectValue placeholder="Vitória"/></SelectTrigger>
                                                            <SelectContent>
                                                                {victoryOptions.map(time => (
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
                                            <div className="flex flex-col gap-3 w-full">
                                                <Label>Prontuação</Label>
                                                <Label 
                                                    className="border-input aria-invalid:border-destructive border h-9 text-sm rounded-md px-3 py-2 text-center"
                                                >{updateScore(index)}</Label>
                                            </div>
                                            <div className='self-end'>
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
                <div className='pt-6'>
                    <Button
                        onClick={() => append(formFields)}
                    >Adicionar</Button>
                </div>
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