'use client'
import { useState, useEffect } from 'react'
import { createClient } from '@supabase/supabase-js'
import Input from './components/Input'

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export default function Home() {
    const [age, setAge] = useState(0)

    const handleChange = (e) => {
        const value = e.target.value.replace(/\D/g, '')
        setAge(value)
    }

    useEffect(() => {
        const init = async () => {
            const { data, error } = await supabase
                .from('sudoku_puzzles')
                .select()
            console.log(data)
        }

        init()
    }, [])
    return (
        <div className="grid h-screen place-items-center">
            <Input />
        </div>
    )
}
