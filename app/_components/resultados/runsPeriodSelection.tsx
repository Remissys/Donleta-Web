'use client'

import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Field } from "@/components/ui/field"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Select, SelectContent, SelectTrigger, SelectItem, SelectValue } from "@/components/ui/select"
import { ChevronDownIcon } from "lucide-react"
import React, { useEffect, useState } from "react"
import { ControllerRenderProps, UseFormGetValues, UseFormSetValue } from "react-hook-form"

interface RunPeriodSelectorProps {
  field: ControllerRenderProps<any, "date">
  fieldState: any
  getValues: UseFormGetValues<any>
}

export default function RunPeriodSelector({
    field,
    fieldState,
    getValues
}: RunPeriodSelectorProps) {

    const [editionOptions, setEditionOptions] = useState<string[]>([])

    console.log(getValues('date'))
    
    useEffect(() => {
        const edition = getEditionOptions()
        const period = getCurrentDate()
        const week = getCurrentWeek()

        if (!field.value?.edition || !field.value?.week || !field.value?.period) {
            field.onChange({
                edition: field.value?.edition || edition,
                week: field.value?.week || week,
                period: field.value?.period || period
            })
        }
    }, [])

    function getCurrentWeek() {
        const currentDate = new Date()

        const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1)
        const lastDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0)

        const firstFullWeekStart = new Date(firstDayOfMonth)
        firstFullWeekStart.setDate(firstDayOfMonth.getDate() + ((7 - firstDayOfMonth.getDay()) % 7))

        const lastFullWeekEnd = new Date(lastDayOfMonth)
        lastFullWeekEnd.setDate(lastDayOfMonth.getDate() - ((lastDayOfMonth.getDay() + 1) % 7))

        if (currentDate < firstFullWeekStart || currentDate > lastFullWeekEnd) return ""

        const diffInDays = Math.floor((currentDate.getTime() - firstFullWeekStart.getTime()) / (1000 * 60 * 60 * 24))

        return String(Math.floor(diffInDays / 7) + 1) // 1 → 4
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
            formatDate(lastMonthDate), 
            formatDate(thisMonthDate), 
            formatDate(nextMonthDate)
        ]
        
        setEditionOptions(options)

        return formatDate(thisMonthDate)
    }

    function getCurrentDate() {
        const currentDate = new Date()

        return formatDateToDDMMYYYY(currentDate)
    }

    function formatDateToDDMMYYYY(date: Date) {
        const day = String(date.getDate()).padStart(2, "0")
        const month = String(date.getMonth() + 1).padStart(2, "0")
        const year = date.getFullYear()

        return `${day}/${month}/${year}`
    }

    function parseDDMMYYYYToDate(value?: string) {
        if (!value) return undefined

        const [day, month, year] = value.split("/").map(Number)
        return new Date(year, month - 1, day)
    }

    return (
        <div className="grid 2xl:grid-cols-8 md:grid-cols-4 sm:grid-cols-3 gap-5 pb-20">
            <Field data-invalid={fieldState.invalid?.edition}>
                <Select
                    name="edition"
                    value={field.value?.edition ?? ""}
                    onValueChange={(value) => (
                        field.onChange({
                            ...field.value,
                            edition: value
                        })
                    )}
                >
                    <SelectTrigger
                        aria-invalid={fieldState.invalid?.edition}
                    ><SelectValue placeholder="Edição"/></SelectTrigger>
                    <SelectContent>
                        {editionOptions.map(option => (
                            <SelectItem
                                key={option.toString()}
                                value={option.toString()}
                            >{option}</SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </Field>
            <Field data-invalid={fieldState.invalid?.week}>
                <Select
                    name="week"
                    value={field.value?.week ?? ""}
                    onValueChange={(value) => (
                        field.onChange({
                            ...field.value,
                            week: value
                        })
                    )}
                >
                    <SelectTrigger
                        aria-invalid={fieldState.invalid?.week}
                    ><SelectValue placeholder="Semana"/></SelectTrigger>
                    <SelectContent>
                        {['1', '2', '3', '4'].map(option => (
                            <SelectItem
                                key={option.toString()}
                                value={option.toString()}
                            >{`Semana ${option}`}</SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </Field>
            <Field data-invalid={fieldState.invalid?.period}>
                <Popover>
                    <PopoverTrigger
                        asChild
                        aria-invalid={fieldState.invalid?.period}
                    >
                        <Button
                            variant="ghost"
                            data-empty={!field.value?.period}
                            // Same class as used in SelectTrigger
                            className="
                                border-input data-[empty=true]:text-muted-foreground 
                                focus-visible:border-ring focus-visible:ring-ring/50 
                                aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 
                                aria-invalid:border-destructive dark:bg-input/30 dark:hover:bg-input/50 
                                flex w-fit items-center justify-between gap-2 rounded-md border bg-transparent 
                                px-3 py-2 text-sm whitespace-nowrap shadow-xs outline-none focus-visible:ring-[3px]
                            "
                        >
                            {field.value?.period ?? <span>Data</span>}
                            <ChevronDownIcon />
                        </Button>
                    </PopoverTrigger>
                    <PopoverContent>
                        <Calendar
                            mode="single"
                            selected={parseDDMMYYYYToDate(field.value?.period)}
                            onSelect={(selectedDate) => {
                                if (!selectedDate) return

                                field.onChange({
                                    ...field.value,
                                    period: formatDateToDDMMYYYY(selectedDate)
                                })
                            }}
                        />
                    </PopoverContent>
                </Popover>
            </Field>
        </div>
    )
}