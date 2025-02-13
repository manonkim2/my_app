'use client'

import { createContext, useContext, useState } from 'react'

interface SelectedKeywordContextType {
  selectedKeyword: string
  setSelectedKeyword: (keyword: string) => void
}

const SelectedKeywordContext = createContext<SelectedKeywordContextType | null>(
  null,
)

export const SelectedKeywordProvider = ({
  children,
}: {
  children: React.ReactNode
}) => {
  const [selectedKeyword, setSelectedKeyword] = useState('')

  return (
    <SelectedKeywordContext.Provider
      value={{ selectedKeyword, setSelectedKeyword }}
    >
      {children}
    </SelectedKeywordContext.Provider>
  )
}

export const useSelectedKeyword = () => {
  const context = useContext(SelectedKeywordContext)
  if (!context)
    throw new Error(
      'useSelectedKeyword must be used within a SelectedKeywordProvider',
    )
  return context
}
