"use client"

import { useEffect, useRef, useState } from "react"
import {
  Command,
  CommandInput,
  CommandItem,
  CommandList,
  CommandEmpty,
} from "@/components/ui/command"
import { Input } from "@/components/ui/input"

interface CompanyAutocompleteProps {
  field: {
    value: string
    onChange: (value: string) => void
    onBlur: () => void
    name: string
    ref: React.Ref<any>
  }
}

export default function CompanyAutocomplete({
  field,
}: CompanyAutocompleteProps) {
  const [input, setInput] = useState(field.value || "")
  const [showCommand, setShowCommand] = useState(false)
  const [options, setOptions] = useState<string[]>([])
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handler = (event: MouseEvent) => {
      if (!containerRef.current?.contains(event.target as Node)) {
        setShowCommand(false)
      }
    }

    document.addEventListener("mousedown", handler)
    return () => document.removeEventListener("mousedown", handler)
  }, [])

  useEffect(() => {
    const fetchCompanies = async () => {
      if (input.length < 2) return
      const res = await fetch(`/api/company-search?q=${input}`)
      const data = await res.json()
      setOptions(data)
    }

    const timeout = setTimeout(fetchCompanies, 200)
    return () => clearTimeout(timeout)
  }, [input])

  useEffect(() => {
    setInput(field.value || "")
  }, [field.value])

  return (
    <div className="relative" ref={containerRef}>
      <Input
        {...field}
        value={input}
        onChange={(e) => {
          setInput(e.target.value)
          field.onChange(e.target.value)
          setShowCommand(true)
        }}
        placeholder="Type company name..."
        autoComplete="off"
      />

      {showCommand && options.length > 0 && (
        <div className="absolute z-10 mt-1 w-full bg-white border rounded-md shadow-md">
          <Command className="[&_div[data-slot='command-input-wrapper']]:hidden">
            <CommandInput className="hidden" />
            <CommandList>
              <CommandEmpty>No results found.</CommandEmpty>
              {options.map((company) => (
                <CommandItem
                  key={company}
                  value={company}
                  onSelect={() => {
                    setInput(company)
                    field.onChange(company)
                    setShowCommand(false)
                  }}
                >
                  {company}
                </CommandItem>
              ))}
            </CommandList>
          </Command>
        </div>
      )}
    </div>
  )
}
