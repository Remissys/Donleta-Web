'use client'

import React, { useEffect, useState } from "react"
import axios from "axios"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface Participant {
    _id: string
    name: string
}

interface MonthlyResults {
    participant: Participant
    score: number
}

export default function LatestRuns() {
    const [ isLoading, setIsLoading ] = useState<boolean>(false)
    const [ dailyResults, setDailyResults ] = useState()
    const [ weeklyResults, setWeeklyResults ] = useState()
    const [ monthlyResults, setMonthlyResults ] = useState<MonthlyResults[]>([] as MonthlyResults[])

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
                const data = response.data.data
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
                const data = response.data.data
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
                    <CardTitle className="text-2xl">Resultados Diários</CardTitle>
                </CardHeader>
                <CardContent className="flex flex-col gap-4">

                </CardContent>
            </Card>
            <Card className="accordion__card py-8 px-12">
                <CardHeader>
                    <CardTitle className="text-2xl">Resultados Semanais</CardTitle>
                </CardHeader>
                <CardContent className="flex flex-col gap-4">

                </CardContent>
            </Card>
            <Card className="accordion__card py-8 px-12">
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
        </div>
    )
}