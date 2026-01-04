'use client'

import { Select, SelectContent, SelectTrigger, SelectItem, SelectValue } from "@/components/ui/select"
import React, { useEffect, useState } from "react"

interface PeriodSelector {

}

export default function RunPeriodSelector({}: PeriodSelector) {

    interface EditionOptions {
        value: Date
        label: string
    }

    const [editionOptions, setEditionOptions] = useState<EditionOptions[]>([])
    
    useEffect(() => {
        getEditionOptions()
    }, [])

    function getCurrentWeek() {
        const currentDate = new Date()

        const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1)
        const lastDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0)

        const firstFullWeekStart = new Date(firstDayOfMonth)
        firstFullWeekStart.setDate(firstDayOfMonth.getDate() + ((7 - firstDayOfMonth.getDay()) % 7))

        const lastFullWeekEnd = new Date(lastDayOfMonth)
        lastFullWeekEnd.setDate(lastDayOfMonth.getDate() - ((lastDayOfMonth.getDay() + 1) % 7))

        if (currentDate < firstFullWeekStart || currentDate > lastFullWeekEnd) return null

        const diffInDays =
            Math.floor((currentDate.getTime() - firstFullWeekStart.getTime()) / (1000 * 60 * 60 * 24))

        return Math.floor(diffInDays / 7) + 1 // 1 → 4
    }

    function getEditionOptions() {
        const currentDate = new Date()
        
        const lastMonthDate = new Date(currentDate.getFullYear(), currentDate.getMonth() - 1)
        const thisMonthDate = new Date(currentDate.getFullYear(), currentDate.getMonth())
        const nextMonthDate = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1)
        
        // Format dates as Month Name/YYYY
        const formatDate = (date: Date) => {
            const monthName = date.toLocaleString('pt-BR', {month: 'long'})
            const year = date.getFullYear()

            return `${monthName}/${year}`
        }
        
        // Create options array
        const options = [
            {value: lastMonthDate, label: formatDate(lastMonthDate)},
            {value: thisMonthDate, label: formatDate(thisMonthDate)},
            {value: nextMonthDate, label: formatDate(nextMonthDate)}
        ]
        
        setEditionOptions(options)
    }

    return (
        <div className="flex gap-4">
            <Select
                name="edition"
                value={'temp'}
                onValueChange={() => console.log('oi')}
            >
                <SelectTrigger
                ><SelectValue placeholder="Edição"/></SelectTrigger>
                <SelectContent>
                    {editionOptions.map(option => (
                        <SelectItem
                            key={option.value.toString()}
                            value={option.value.toString()}
                        >{option.label}</SelectItem>
                    ))}
                </SelectContent>
            </Select>
            <Select>
                <SelectTrigger
                ><SelectValue placeholder="Semana"/></SelectTrigger>
                <SelectContent>
                    {}
                </SelectContent>
            </Select>
        </div>
    )
}