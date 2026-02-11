'use client'

import React, { useEffect, useState } from "react"

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

import AddBoss from "./addBoss"
import axios from "axios"
import Image from "next/image"

export default function BossListings() {

    interface Boss {
        _id: number
        name: string
        score: number
        image_key: string
    }

    type BossData = {
        name: string
        score: number
        image: File
    }

    const [ bossJson, setBossJson ] = useState<Boss[]>([])
    const [ bossJsonClone, setBossJsonClone] = useState<Boss[]>([])
    const [ modifiedBoss ] = useState<Set<string>>(new Set())
    const [ open, setOpen ] = useState<boolean>(false)

    useEffect(() => {
        fetchBosses()
        console.log(process.env.NEXT_PUBLIC_DONLETA_URL)
    }, [])

    useEffect(() => {
        defineClone()
    }, [bossJson])

    const fetchBosses = async () => {
        try {
            console.log(process.env.NEXT_PUBLIC_DONLETA_URL)
            const bosses = await axios.get('/bosses/', {
                baseURL: process.env.NEXT_PUBLIC_DONLETA_URL
            })

            setBossJson(bosses.data.data)

            console.log('bosses: ', bosses.data.data)
        } catch(err) {
            console.error(err)
        }
    }

    async function addBoss(data: BossData) {
        try {
            console.log(data)

            if (!data.image || !(data.image instanceof File)) return
    
            const formData = new FormData()
            formData.append('origin', 'boss')
            formData.append('image', data.image)

            // console.log(formData)
            for (const [key, value] of formData.entries()) {
                console.log(key, value)
            }
            
            /*
    
                Upload image first
                Transform in helper later
    
            */
            const image = await axios.post('/image/', formData, {
                    baseURL: process.env.NEXT_PUBLIC_DONLETA_URL,
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    }
            })
    
            console.log(image)

            const payload = {
                'name': data.name,
                'score': data.score,
                'image_key': image.data.file_id
            }
    
            const newBoss = await axios.post('/bosses/', payload, {
                baseURL: process.env.NEXT_PUBLIC_DONLETA_URL
            })
    
            console.log(newBoss)

            setBossJson([
                ...bossJson,
                {
                    _id: newBoss.data.data._id,
                    name: newBoss.data.data.name,
                    score: newBoss.data.data.score,
                    image_key: newBoss.data.data.image_key,
                }
            ])
        } catch(err) {
            console.error(err)
        } finally {
            setOpen(false)
        }
    }

    const defineClone = () => {
        setBossJsonClone(structuredClone(bossJson))
    }

    const setBossScore = (action:string|number, bossId:number, inputValue:string|null=null) => {
        setBossJsonClone((prevState) => {
            const updatedBossJson = [...prevState]
            const boss = updatedBossJson.find(boss => boss._id === bossId)
            const bossOriginal = bossJson.find(boss => boss._id === bossId)

            if (!boss || !bossOriginal) return prevState

            let hasAlteration = false

            // console.log('boss: ', boss, bossOriginal)
            // console.log('action: ', action)

            if (action === 'sub' && boss.score > 0) {
                boss.score -= 1 //boss score cannot be less than 0
                hasAlteration = true
            } else if (action === 'add') {
                boss.score += 1
                hasAlteration = true
            } else if (action === 'input' && typeof inputValue === "string" && !isNaN(+inputValue)) {
                boss.score = +inputValue //input has to be a number
                hasAlteration = true
            }

            if (hasAlteration) {
                // console.log('entrou')
                // console.log(boss.score, bossOriginal.score, boss.score !== bossOriginal.score)
                if (boss.score !== bossOriginal.score) modifiedBoss.add(boss.name)
                else if (boss.score === bossOriginal.score) modifiedBoss.delete(boss.name)

                // console.log(modifiedBoss, modifiedBoss.size)
            }

            return updatedBossJson
        })
    }

    const handleCloseDialog = () => {setOpen(false)}

    return (
        <>
            <div className="flex justify-end">
                <div className="actions">
                    {modifiedBoss.size > 0 ?
                        <div className="flex gap-4">
                            <Label className="h-9 text-sm items-center">Você tem alterações não salvas!</Label>
                            <Button
                                onClick={() => console.log('salvar')}
                            >Salvar</Button>
                        </div>
                    :<></>}
                    <AddBoss
                        open={open}
                        setOpen={setOpen}
                        onClose={handleCloseDialog}
                        onSubmit={addBoss}
                    />
                </div>
            </div>
            <Accordion type="single" collapsible defaultValue="bossess" className="accordion">
                <Card className="accordion__card">
                    <AccordionItem key={'bossess'} value="bossess" className="border-0">
                        <AccordionTrigger
                            className="accordion__trigger"
                        >Bosses</AccordionTrigger>
                        <AccordionContent className="accordion__content">
                            <div className="flex flex-wrap justify-start space-x-2">
                                {bossJsonClone.map(boss => {
                                    return (
                                        <Card className="card drop-shadow-(--drop-shadow)" key={`boss ${boss._id}`}>
                                            <CardTitle className="card__title">{boss.name}</CardTitle>
                                            <CardContent className="card__content">
                                                <Card className="w-[130px] h-[130px] overflow-hidden border-0 drop-shadow-(--drop-shadow)">
                                                    <Image src={`${process.env.NEXT_PUBLIC_DONLETA_URL}/image/${boss.image_key}?origin=boss`} alt='' width={130} height={130}/>
                                                </Card>
                                            </CardContent>
                                            <CardFooter className="card__footer">
                                                <Button 
                                                    variant="outline" 
                                                    size="icon" 
                                                    className="card__footer--button"
                                                    onClick={() => setBossScore('sub', boss._id)}
                                                >-</Button>
                                                <Input type="text" placeholder="0" className="card__footer--input" value={boss.score} onChange={(e) => {setBossScore('input', boss._id, e.target.value)}}/>
                                                <Button 
                                                    variant="outline" 
                                                    size="icon" 
                                                    className="card__footer--button"
                                                    onClick={() => setBossScore('add', boss._id)}
                                                >+</Button>
                                            </CardFooter>
                                        </Card>
                                    )
                                })}
                            </div>
                        </AccordionContent>
                    </AccordionItem>
                </Card>
            </Accordion>
        </>
    )
}