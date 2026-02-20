'use client'

import React, { useEffect, useState } from "react"
import axios from "axios"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface Participant {
    _id: string
    name: string
}

interface Date {
    edition: string
    week: number
    period: string
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

interface DailyResults {
    _id: string
    participant: Participant
    characters: Char[]
    boss: Boss
    time: Time
    victory: boolean
    score: number
}

interface WeeklyResults {
    participant: Participant
    scores: number[]
}

interface MonthlyResults {
    participant: Participant
    score: number
}

export default function LatestRuns() {
    const [ isLoading, setIsLoading ] = useState<boolean>(false)
    const [ dailyResults, setDailyResults ] = useState<DailyResults[]>([])
    const [ weeklyResults, setWeeklyResults ] = useState<WeeklyResults[]>([])
    const [ monthlyResults, setMonthlyResults ] = useState<MonthlyResults[]>([])

    console.log(dailyResults)

    useEffect(() => {
        fetchDailyResults()
        fetchWeeklyResults()
        fetchMonthlyResults()
    }, [])

    const fetchDailyResults = async () => {
        try {
            setIsLoading(true)

            const response = await axios.get('/runs/daily/', {
                baseURL: process.env.NEXT_PUBLIC_DONLETA_URL
            })

            if (response.data.data) {
                setDailyResults(response.data.data.runs)
            }
        } catch(err) {
            console.error(err)
        } finally {
            setIsLoading(false)
        }
    }
    
    const fetchWeeklyResults = async () => {
        try {
            setIsLoading(true)

            const response = await axios.get('/runs/weekly/', {
                baseURL: process.env.NEXT_PUBLIC_DONLETA_URL
            })

            if (response.data.data) {
                setWeeklyResults(response.data.data)
            }
        } catch(err) {
            console.error(err)
        } finally {
            setIsLoading(false)
        }
    }

    const fetchMonthlyResults = async () => {
        try {
            setIsLoading(true)

            const response = await axios.get('/runs/monthly/', {
                baseURL: process.env.NEXT_PUBLIC_DONLETA_URL
            })

            if (response.data.data) {
                setMonthlyResults(response.data.data)
            }
        } catch(err) {
            console.error(err)
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="flex flex-col gap-4">
            <Card className="accordion__card py-8 px-12">
                <CardHeader>
                    <CardTitle className="text-2xl">Últimos Resultados</CardTitle>
                </CardHeader>
                <CardContent className="flex flex-col gap-4">
                    <Card className="accordion__card bg-(--card-light) py-8 px-12">
                        <CardHeader>
                            <CardTitle className="text-2xl">Resultados Diários</CardTitle>
                        </CardHeader>
                        <CardContent className="flex flex-col gap-4">
                            {dailyResults.map((run: DailyResults) => {
                                console.log(run)
                                return (
                                    <div className="py-4">
                                        <p className="py-4">{run.participant.name}</p>
                                        <p>{`TIME: ${run.characters[0].name} (${run.characters[0].score}) | ${run.characters[1].name} (${run.characters[1].score})`}</p>
                                        <p>{`BOSS: ${run.boss.name} (${run.boss.score})`}</p>
                                        <p>{`TEMPO: ${run.time.description} (${run.time.score})`}</p>
                                        <p className="pt-2">{`PONTOS: ${run.score}`}</p>
                                    </div>
                                )
                            })}
                        </CardContent>
                    </Card>
                    <Card className="accordion__card bg-(--card-light) py-8 px-12">
                        <CardHeader>
                            <CardTitle className="text-2xl">Resultados Semanais</CardTitle>
                        </CardHeader>
                        <CardContent className="flex flex-col gap-4">
                            <div className="text-center">
                                {weeklyResults.map((value: WeeklyResults) => {
                                    return (
                                        <p className={`text-base py-1`}>{`${value.participant.name} - ${value.scores.join("; ")}`}</p>
                                    )
                                })}
                            </div>
                        </CardContent>
                    </Card>
                    <Card className="accordion__card bg-(--card-light) py-8 px-12">
                        <CardHeader>
                            <CardTitle className="text-2xl">Resultados Mensais</CardTitle>
                        </CardHeader>
                        <CardContent className="flex flex-col gap-4">
                            <div className="text-center">
                                {monthlyResults.map((value: MonthlyResults, index) => {
                                    let sizeClass = "text-base"

                                    if (index === 0) sizeClass = "text-[28px] font-bold"
                                    else if (index === 1) sizeClass = "text-[24px] font-semibold"
                                    else if (index === 2) sizeClass = "text-[20px] font-medium"
                                    else sizeClass = "text-base"

                                    return (
                                        <p key={value.participant._id} className={`${sizeClass} py-1`}>{`${value.participant.name} - ${value.score}`}</p>
                                    )
                                })}
                            </div>
                        </CardContent>
                    </Card>
                </CardContent>
            </Card>
        </div>
    )
}