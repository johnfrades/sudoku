'use client'
import { useState, useEffect, ReactNode } from 'react'
import { createClient } from '@supabase/supabase-js'
import Input from './components/Input'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

const nineItems = Array.from(Array(9).keys())
const TableRow: React.FC<{ row: number; children: ReactNode }> = ({
  row,
  children,
}) => (
  <tr
    className={
      (row + 1) % 3 === 0 ? 'border-gray-400 border-b-4 border-solid' : ''
    }
  >
    {' '}
    {children}{' '}
  </tr>
)

const TableData: React.FC<{
  col: number
  children: ReactNode
}> = ({ col, children }) => (
  <td
    className={
      (col + 1) % 3 === 0 ? 'border-gray-400 border-r-4 border-solid' : ''
    }
  >
    {children}
  </td>
)

export default function Home() {
  // const [age, setAge] = useState(0)
  //
  // const handleChange = (e) => {
  //   const value = e.target.value.replace(/\D/g, '')
  //   setAge(value)
  // }

  useEffect(() => {
    const init = async () => {
      const { data, error } = await supabase.from('sudoku_puzzles').select()
      console.log(data)
    }

    init()
  }, [])

  return (
    <div className="grid h-screen place-items-center">
      <div>
        <h1 className="text-4xl font-semibold text-white text-center">
          Sudoku-Mobbin
        </h1>
        <table className="mt-10 border-collapse border-4 border-solid border-gray-400">
          <tbody>
            {nineItems.map((row, rowIndex) => {
              return (
                <TableRow key={rowIndex} row={row}>
                  {nineItems.map((col, colIndex) => (
                    <TableData key={rowIndex + colIndex} col={col}>
                      <Input />
                    </TableData>
                  ))}
                </TableRow>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}
